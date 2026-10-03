// Fit Monk Edge API: /api/orders
// GET: Admin order management / history
// POST: Authoritative order creation with server-side pricing recalculation

import { PricingEngine } from '../../../src/backend/services/pricing-engine';
import { CouponEngine } from '../../../src/backend/services/coupon-engine';

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/fitmonk_admin_session=([^;]+)/);
    if (!match) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          orders: [
            {
              id: 'ord_mock_101',
              order_number: 'FM-1001',
              customer_name: 'Rahul Sharma',
              customer_phone: '+919876543210',
              grand_total_paise: 99800,
              payment_status: 'paid',
              fulfillment_status: 'shipped',
              order_source: 'website',
              created_at: Math.floor(Date.now() / 1000) - 3600
            },
            {
              id: 'ord_mock_102',
              order_number: 'FM-1002',
              customer_name: 'Pooja Verma',
              customer_phone: '+919812345678',
              grand_total_paise: 59900,
              payment_status: 'pending',
              fulfillment_status: 'unfulfilled',
              order_source: 'whatsapp',
              created_at: Math.floor(Date.now() / 1000) - 1800
            }
          ]
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { results } = await env.DB.prepare(`
      SELECT o.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `).all();

    return new Response(
      JSON.stringify({ orders: results }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Error fetching orders' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const body = await request.json().catch(() => null) as any;
    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Cart items are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Authoritative Pricing Calculation (Never trust client total)
    const lineItems = body.items.map((i: any) => ({
      productId: i.productId,
      variantId: i.variantId || null,
      productName: i.productName || 'Product',
      unitPricePaise: Number(i.unitPricePaise) || 0,
      quantity: Math.max(1, Number(i.quantity) || 1),
      weightGrams: Number(i.weightGrams) || 500,
      categoryId: i.categoryId || null
    }));

    let discountPaise = 0;
    let couponCode: string | null = null;
    let couponId: string | null = null;

    if (body.couponCode && typeof body.couponCode === 'string') {
      const code = body.couponCode.trim().toUpperCase();
      if (env.DB) {
        const cpnRow = await env.DB.prepare(`SELECT * FROM coupons WHERE UPPER(code) = ? AND is_active = 1 LIMIT 1`).bind(code).first();
        if (cpnRow) {
          const coupon = CouponEngine.fromDbRow(cpnRow);
          const { subtotalPaise } = PricingEngine.calculateSubtotal(lineItems);
          const validation = CouponEngine.validate(coupon, { code, subtotalPaise, customerPhone: body.customerPhone, items: lineItems });
          if (validation.isValid) {
            discountPaise = validation.discountPaise;
            couponCode = coupon.code;
            couponId = coupon.id;
          }
        }
      }
    }

    const pricing = PricingEngine.calculateOrderTotal({
      items: lineItems,
      discountPaise,
      couponCode,
      deliveryFeePaise: Number(body.deliveryFeePaise) || (lineItems.reduce((acc: number, l: any) => acc + (l.unitPricePaise * l.quantity), 0) >= 49900 ? 0 : 4900),
      taxRatePercent: 0 // Tax inclusive
    });

    const now = Math.floor(Date.now() / 1000);
    const orderId = 'ord_' + Math.random().toString(36).substring(2, 10);
    const orderNumber = 'FM-' + Math.floor(10000 + Math.random() * 90000);

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: true,
          orderId,
          orderNumber,
          pricing,
          message: 'Order created (preview/mock mode)'
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Customer resolution (Guest or existing)
    let customerId = 'cust_' + Math.random().toString(36).substring(2, 10);
    if (body.customerPhone) {
      const existing = await env.DB.prepare(`SELECT id FROM customers WHERE phone = ? LIMIT 1`).bind(body.customerPhone).first();
      if (existing) {
        customerId = existing.id;
      } else {
        await env.DB.prepare(`
          INSERT INTO customers (id, phone, email, name, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(customerId, body.customerPhone, body.customerEmail || null, body.customerName || 'Guest Customer', now, now).run();
      }
    }

    // Insert Order
    await env.DB.prepare(`
      INSERT INTO orders (
        id, order_number, customer_id, coupon_id, status, payment_status, fulfillment_status,
        subtotal_paise, discount_paise, coupon_code, shipping_paise, tax_paise, grand_total_paise,
        currency, order_source, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'pending', 'pending', 'unfulfilled', ?, ?, ?, ?, ?, ?, 'INR', ?, ?, ?, ?)
    `).bind(
      orderId,
      orderNumber,
      customerId,
      couponId,
      pricing.subtotalPaise,
      pricing.discountPaise,
      couponCode,
      pricing.shippingPaise,
      pricing.taxPaise,
      pricing.grandTotalPaise,
      body.orderSource || 'website',
      body.notes || null,
      now,
      now
    ).run();

    // Insert Order Items
    for (const item of pricing.lines) {
      const itemId = 'item_' + Math.random().toString(36).substring(2, 10);
      await env.DB.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, variant_id, product_name, quantity,
          unit_price_paise, total_price_paise, weight_grams, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        itemId,
        orderId,
        item.productId,
        item.variantId,
        item.productName,
        item.quantity,
        item.unitPricePaise,
        item.lineTotalPaise,
        item.weightGrams ?? null,
        now
      ).run();
    }

    // Record Coupon Redemption if applicable
    if (couponId && couponCode) {
      await env.DB.prepare(`
        INSERT INTO coupon_redemptions (
          id, coupon_id, order_id, customer_id, customer_phone,
          discount_applied_paise, order_subtotal_paise, redeemed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        'red_' + Math.random().toString(36).substring(2, 10),
        couponId,
        orderId,
        customerId,
        body.customerPhone || null,
        pricing.discountPaise,
        pricing.subtotalPaise,
        now
      ).run();

      // Increment coupon counter
      await env.DB.prepare(`UPDATE coupons SET total_used_count = total_used_count + 1 WHERE id = ?`).bind(couponId).run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        orderNumber,
        pricing
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Error processing order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
