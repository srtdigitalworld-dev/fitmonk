// Fit Monk Edge API: /api/shipping/rapidshyp
// RapidShyp modular shipping endpoint (Serviceability check, Courier estimate, AWB generation)

import { RapidShypProvider } from '../../../src/backend/providers/shipping/rapidshyp-provider';
import { getAuthenticatedAdmin } from '../_auth';

interface Env {
  DB?: any;
  RAPIDSHYP_API_TOKEN?: string;
  RAPIDSHYP_BASE_URL?: string;
  RAPIDSHYP_PICKUP_PINCODE?: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'serviceability';
    const body = await request.json().catch(() => null) as any;

    const provider = new RapidShypProvider({
      apiToken: env.RAPIDSHYP_API_TOKEN || undefined,
      baseUrl: env.RAPIDSHYP_BASE_URL,
      pickupPincode: env.RAPIDSHYP_PICKUP_PINCODE || '110001'
    });

    if (action === 'serviceability') {
      const deliveryPincode = body?.deliveryPincode ? String(body.deliveryPincode).trim() : '';
      if (!/^\d{6}$/.test(deliveryPincode)) {
        return new Response(
          JSON.stringify({
            isServiceable: false,
            message: 'Please provide a valid 6-digit Indian PIN code.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const weightGrams = Number(body?.weightGrams) || 500;
      const orderValuePaise = Number(body?.orderValuePaise) || 50000;

      const result = await provider.checkServiceability({
        pickupPincode: env.RAPIDSHYP_PICKUP_PINCODE || '110001',
        deliveryPincode,
        weightGrams,
        cod: false, // Fit Monk is strictly prepaid only
        orderValuePaise
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'track') {
      const awb = body?.awb ? String(body.awb).trim() : '';
      if (!awb) {
        return new Response(
          JSON.stringify({ error: 'AWB number is required.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const tracking = await provider.getTracking(awb);
      return new Response(JSON.stringify(tracking), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'create_shipment') {
      // Must be authenticated admin
      const admin = await getAuthenticatedAdmin(request, env);
      if (!admin) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized. Admin login required.' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const orderId = body?.orderId;
      if (!orderId) {
        return new Response(
          JSON.stringify({ error: 'Order ID is required to create a shipment.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (!env.DB) {
        return new Response(
          JSON.stringify({ error: 'Database not connected' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Fetch order from D1
      const order = await env.DB.prepare(`
        SELECT o.*,
          COALESCE(o.customer_name, c.name, 'Customer') as customer_name,
          COALESCE(o.customer_email, c.email) as customer_email,
          COALESCE(o.customer_phone, c.phone) as customer_phone
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ? OR o.order_number = ?
        LIMIT 1
      `).bind(orderId, orderId).first();

      if (!order) {
        return new Response(
          JSON.stringify({ error: 'Order not found.' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (order.fulfillment_status === 'shipped' || order.fulfillment_status === 'delivered') {
        return new Response(
          JSON.stringify({ error: `Cannot recreate shipment. Order is already ${order.fulfillment_status}.` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Fetch line items
      const { results: items } = await env.DB.prepare(`
        SELECT oi.*
        FROM order_items oi
        WHERE oi.order_id = ?
      `).bind(order.id).all();

      const shipmentResult = await provider.createShipment({
        orderId: order.id,
        orderNumber: order.order_number || order.id,
        customerName: order.customer_name || 'Customer',
        customerPhone: order.customer_phone || '',
        deliveryAddress: order.delivery_address || 'Address not provided',
        city: order.city || 'City',
        state: order.state || 'State',
        pinCode: order.pin_code || '110001',
        items: (items || []).map((i: any) => ({
          name: i.product_name,
          sku: i.sku || 'FM-ITEM',
          quantity: i.quantity || 1,
          pricePaise: i.unit_price_paise || 0
        })),
        totalAmountPaise: order.grand_total_paise || 0,
        totalWeightGrams: 500 * Math.max(1, (items || []).length),
        isCod: false // Fit Monk is STRICTLY PREPAID ONLY
      });

      if (!shipmentResult.success) {
        return new Response(
          JSON.stringify({
            success: false,
            message: shipmentResult.errorMessage || 'RapidShyp failed to create shipment'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const awb = shipmentResult.awbNumber || `AWB-${Date.now().toString(36).toUpperCase()}`;
      const courier = shipmentResult.courierName || 'RapidShyp Express';
      const now = new Date().toISOString();

      // Update order in D1
      await env.DB.prepare(`
        UPDATE orders
        SET shipment_awb = ?,
            shipment_tracking_number = ?,
            courier_name = ?,
            shipping_provider_code = 'rapidshyp',
            fulfillment_status = CASE WHEN fulfillment_status IN ('unfulfilled', 'new') THEN 'packed' ELSE fulfillment_status END,
            order_status = CASE WHEN order_status = 'pending' THEN 'processing' ELSE order_status END,
            updated_at = ?
        WHERE id = ?
      `).bind(awb, awb, courier, now, order.id).run();

      // Log in audit_logs
      try {
        await env.DB.prepare(`
          INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, metadata, created_at)
          VALUES (?, ?, 'shipment_created', 'order', ?, ?, ?)
        `).bind(
          `aud_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          admin.id || 'admin',
          order.id,
          JSON.stringify({ awb, courier, provider: 'rapidshyp' }),
          now
        ).run();
      } catch (logErr) {
        console.warn('Could not write shipment audit log:', logErr);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Shipment created and AWB generated successfully.',
          awb,
          courier,
          labelUrl: shipmentResult.labelUrl || null
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown shipping action: ${action}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Error processing shipping request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

