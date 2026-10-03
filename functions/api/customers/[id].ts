// Fit Monk Edge API: /api/customers/:id
// GET: Customer profile + complete order history + coupon redemption history
// Derived directly from D1 orders and order_items

import { getAuthenticatedAdmin } from '../_auth';
import { CustomerEngine } from '../../../src/backend/services/customer-engine';

interface Env {
  DB?: any;
}

export const onRequestGet = async ({
  request,
  params,
  env
}: {
  request: Request;
  params: { id: string };
  env: Env;
}) => {
  try {
    const admin = await getAuthenticatedAdmin(request, env);
    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Admin login required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Database not connected' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rawId = decodeURIComponent(params.id || '').trim();
    if (!rawId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Customer identifier is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare matching variations for phone (with/without +91, stripped)
    const digitsOnly = rawId.replace(/\D/g, '');
    const phoneWithPlus = digitsOnly.length === 10 ? `+91${digitsOnly}` : (rawId.startsWith('+') ? rawId : `+${digitsOnly}`);
    const phoneWithoutPlus = digitsOnly.length === 12 && digitsOnly.startsWith('91') ? digitsOnly.substring(2) : digitsOnly;

    // 1. Fetch all orders for this customer
    const orderQuery = `
      SELECT o.*
      FROM orders o
      WHERE (
        o.customer_phone = ? 
        OR o.customer_phone = ? 
        OR o.customer_phone = ?
        OR o.customer_id = ?
        OR o.customer_phone LIKE ?
      )
      ORDER BY o.created_at DESC
    `;

    const { results: ordersRaw } = await env.DB.prepare(orderQuery)
      .bind(rawId, phoneWithPlus, phoneWithoutPlus, rawId, `%${digitsOnly || rawId}%`)
      .all();

    const orders = ordersRaw || [];

    if (orders.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Customer not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch order items for all these orders
    const orderIds = orders.map((o: any) => o.id);
    let itemsByOrderId: Record<string, any[]> = {};

    if (orderIds.length > 0) {
      const placeholders = orderIds.map(() => '?').join(',');
      const itemsQuery = `
        SELECT oi.*, p.slug as product_slug
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${placeholders})
        ORDER BY oi.created_at ASC
      `;
      const { results: itemsRaw } = await env.DB.prepare(itemsQuery).bind(...orderIds).all();
      for (const item of (itemsRaw || [])) {
        const orderId = item.order_id;
        if (!itemsByOrderId[orderId]) {
          itemsByOrderId[orderId] = [];
        }
        itemsByOrderId[orderId]!.push(item);
      }
    }

    // 3. Derive customer profile & metrics using CustomerEngine
    const customerPhone = orders.find((o: any) => o.customer_phone && !o.customer_phone.toLowerCase().includes('pending'))?.customer_phone || rawId;
    const summary = CustomerEngine.deriveCustomer(customerPhone, orders);

    // 4. Structure order history
    const orderHistory = orders.map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number || o.id,
      createdAt: o.created_at,
      grandTotalPaise: Number(o.grand_total_paise) || 0,
      discountPaise: Number(o.discount_paise) || 0,
      couponCode: o.coupon_code || null,
      paymentStatus: o.payment_status,
      fulfillmentStatus: o.fulfillment_status,
      orderStatus: o.order_status,
      itemCount: itemsByOrderId[o.id]?.length || 0,
      items: (itemsByOrderId[o.id] || []).map((it: any) => ({
        id: it.id,
        productId: it.product_id,
        productName: it.product_name,
        packSize: it.pack_size,
        quantity: it.quantity,
        unitPricePaise: it.unit_price_paise,
        lineTotalPaise: it.line_total_paise
      }))
    }));

    return new Response(
      JSON.stringify({
        success: true,
        customer: summary,
        orders: orderHistory
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Error fetching customer profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
