// Fit Monk Edge API: /api/orders/:id
// GET: Fetch order details + items + tracking
// PATCH: Order lifecycle state transitions (Prepaid only, no COD)

import { getAuthenticatedAdmin } from '../_auth';

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ request, params, env }: { request: Request; params: { id: string }; env: Env }) => {
  try {
    const admin = await getAuthenticatedAdmin(request, env);
    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Admin login required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const orderId = params.id;
    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Database not connected' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch Order Record
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
        JSON.stringify({ success: false, message: 'Order not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch Order Line Items
    const { results: items } = await env.DB.prepare(`
      SELECT oi.*, p.slug as product_slug
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.created_at ASC
    `).bind(order.id).all();

    // 3. Fetch Audit Logs for this order
    const { results: logs } = await env.DB.prepare(`
      SELECT id, action, metadata, created_at
      FROM audit_logs
      WHERE entity_type = 'order' AND entity_id = ?
      ORDER BY created_at ASC
    `).bind(order.id).all();

    return new Response(
      JSON.stringify({
        success: true,
        order,
        items: items || [],
        logs: logs || []
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Error fetching order details' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPatch = async ({ request, params, env }: { request: Request; params: { id: string }; env: Env }) => {
  try {
    const admin = await getAuthenticatedAdmin(request, env);
    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Admin login required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const orderId = params.id;
    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Database not connected' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existing = await env.DB.prepare(`
      SELECT * FROM orders WHERE id = ? OR order_number = ? LIMIT 1
    `).bind(orderId, orderId).first();

    if (!existing) {
      return new Response(
        JSON.stringify({ success: false, message: 'Order not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json().catch(() => null) as any;
    if (!body) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid JSON request body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Allowed transition states (Fit Monk is strictly prepaid only - NO COD)
    const validOrderStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    const validFulfillmentStatuses = ['unfulfilled', 'packed', 'shipped', 'delivered', 'rto', 'returned'];

    const newOrderStatus = body.order_status !== undefined
      ? (validOrderStatuses.includes(body.order_status) ? body.order_status : existing.order_status)
      : existing.order_status;

    const newPaymentStatus = body.payment_status !== undefined
      ? (validPaymentStatuses.includes(body.payment_status) ? body.payment_status : existing.payment_status)
      : existing.payment_status;

    const newFulfillmentStatus = body.fulfillment_status !== undefined
      ? (validFulfillmentStatuses.includes(body.fulfillment_status) ? body.fulfillment_status : existing.fulfillment_status)
      : existing.fulfillment_status;

    const shipmentAwb = body.shipment_awb !== undefined ? (body.shipment_awb ? String(body.shipment_awb).trim() : null) : existing.shipment_awb;
    const shipmentTrackingNumber = body.shipment_tracking_number !== undefined ? (body.shipment_tracking_number ? String(body.shipment_tracking_number).trim() : null) : existing.shipment_tracking_number;
    const courierName = body.courier_name !== undefined ? (body.courier_name ? String(body.courier_name).trim() : null) : existing.courier_name;
    const adminNote = body.admin_note !== undefined ? (body.admin_note ? String(body.admin_note).trim() : null) : existing.admin_note;

    const now = Math.floor(Date.now() / 1000);

    // Update Order
    await env.DB.prepare(`
      UPDATE orders SET
        order_status = ?,
        payment_status = ?,
        fulfillment_status = ?,
        shipment_awb = ?,
        shipment_tracking_number = ?,
        courier_name = ?,
        admin_note = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      newOrderStatus,
      newPaymentStatus,
      newFulfillmentStatus,
      shipmentAwb,
      shipmentTrackingNumber,
      courierName,
      adminNote,
      now,
      existing.id
    ).run();

    // Record Audit Log Event
    const changes: Record<string, any> = {};
    if (newOrderStatus !== existing.order_status) changes.order_status = { from: existing.order_status, to: newOrderStatus };
    if (newPaymentStatus !== existing.payment_status) changes.payment_status = { from: existing.payment_status, to: newPaymentStatus };
    if (newFulfillmentStatus !== existing.fulfillment_status) changes.fulfillment_status = { from: existing.fulfillment_status, to: newFulfillmentStatus };
    if (shipmentAwb !== existing.shipment_awb) changes.shipment_awb = shipmentAwb;

    await env.DB.prepare(`
      INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, ?, 'order.update', 'order', ?, ?, ?)
    `).bind(
      'aud_' + Math.random().toString(36).substring(2, 10),
      admin.id,
      existing.id,
      JSON.stringify({ changes, note: adminNote }),
      now
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Order updated successfully.',
        order: {
          id: existing.id,
          order_number: existing.order_number,
          order_status: newOrderStatus,
          payment_status: newPaymentStatus,
          fulfillment_status: newFulfillmentStatus,
          shipment_awb: shipmentAwb,
          courier_name: courierName
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Error updating order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
