// Fit Monk Edge API: POST /api/orders/draft
// Connects storefront WhatsApp purchase flow to canonical D1 Orders.
// 100% PREPAID ONLY - NO COD. All pricing is recalculated authoritatively server-side.

import { site } from '../../../src/data/site';

interface Env {
  DB?: any;
}

interface DraftItemInput {
  productId: string;
  variantId?: string | null;
  quantity?: number;
}

interface DraftCustomerInput {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  note?: string;
}

interface DraftRequestInput {
  // Single-product direct purchase
  productId?: string;
  variantId?: string | null;
  quantity?: number;

  // Or multi-item cart purchase
  items?: DraftItemInput[];

  // Optional customer details
  customer?: DraftCustomerInput;

  // Optional coupon
  couponCode?: string | null;
}

function formatMoneyPaise(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const body = await request.json().catch(() => null) as DraftRequestInput | null;
    if (!body) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid request body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Normalize items list from single-product or multi-item payload
    const rawItems: DraftItemInput[] = [];
    if (Array.isArray(body.items) && body.items.length > 0) {
      rawItems.push(...body.items);
    } else if (body.productId) {
      rawItems.push({
        productId: body.productId,
        variantId: body.variantId,
        quantity: body.quantity ?? 1
      });
    }

    if (rawItems.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'At least one product item is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Authoritative Product & Pricing Resolution against D1
    const evaluatedItems: Array<{
      productId: string;
      variantId: string | null;
      productName: string;
      packSize: string;
      sku: string | null;
      unitPricePaise: number;
      quantity: number;
      lineTotalPaise: number;
      weightGrams: number;
    }> = [];

    let subtotalPaise = 0;

    for (const item of rawItems) {
      const pId = String(item.productId || '').trim();
      const qty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));

      if (!pId) {
        return new Response(
          JSON.stringify({ success: false, message: 'Product ID is missing.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      let productRow: any = null;
      let variantRow: any = null;

      if (env.DB) {
        // Query product by id or slug
        productRow = await env.DB.prepare(`
          SELECT * FROM products
          WHERE id = ? OR slug = ?
          LIMIT 1
        `).bind(pId, pId).first();

        if (!productRow) {
          return new Response(
            JSON.stringify({ success: false, message: `Product '${pId}' not found in catalog.` }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (productRow.is_available === 0 || productRow.is_orderable === 0) {
          return new Response(
            JSON.stringify({ success: false, message: `${productRow.name} is currently unavailable for order.` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Resolve Variant if specified
        if (item.variantId) {
          const vKey = String(item.variantId).trim();
          variantRow = await env.DB.prepare(`
            SELECT * FROM product_variants
            WHERE product_id = ? AND (id = ? OR variant_key = ? OR pack_size = ?)
            LIMIT 1
          `).bind(productRow.id, vKey, vKey, vKey).first();
        }
      } else {
        // Fallback for mock/local development without D1
        productRow = {
          id: pId,
          name: 'Fit Monk Pantry Item',
          pack_size: 'Standard',
          price_paise: 29900,
          sku: 'FM-ITEM',
          weight_grams: 500,
          is_available: 1,
          is_orderable: 1
        };
      }

      // Determine authoritative price, pack size, and sku
      const unitPricePaise = variantRow ? Number(variantRow.price_paise) : Number(productRow.price_paise);
      const packSize = variantRow ? variantRow.pack_size : (productRow.pack_size || 'Standard');
      const sku = variantRow?.sku || productRow.sku || null;
      const weightGrams = variantRow?.weight_grams || productRow.weight_grams || 250;
      const lineTotalPaise = unitPricePaise * qty;

      subtotalPaise += lineTotalPaise;

      evaluatedItems.push({
        productId: productRow.id,
        variantId: variantRow ? variantRow.id : null,
        productName: productRow.name,
        packSize,
        sku,
        unitPricePaise,
        quantity: qty,
        lineTotalPaise,
        weightGrams
      });
    }

    // 3. Server-Side Coupon Validation
    let discountPaise = 0;
    let couponCode: string | null = null;
    let couponId: string | null = null;

    if (body.couponCode && typeof body.couponCode === 'string' && env.DB) {
      const code = body.couponCode.trim().toUpperCase();
      const cpnRow = await env.DB.prepare(`
        SELECT * FROM coupons
        WHERE UPPER(code) = ? AND is_active = 1
        LIMIT 1
      `).bind(code).first();

      if (cpnRow) {
        const minOrder = Number(cpnRow.min_order_value_paise) || 0;
        if (subtotalPaise >= minOrder) {
          if (cpnRow.discount_type === 'percentage') {
            const rawDiscount = Math.round((subtotalPaise * Number(cpnRow.discount_value)) / 100);
            const maxCap = cpnRow.max_discount_paise ? Number(cpnRow.max_discount_paise) : rawDiscount;
            discountPaise = Math.min(rawDiscount, maxCap, subtotalPaise);
          } else {
            discountPaise = Math.min(Number(cpnRow.discount_value) || 0, subtotalPaise);
          }
          couponCode = cpnRow.code;
          couponId = cpnRow.id;
        }
      }
    }

    // 4. Server-Side Shipping Calculation (Fit Monk Rule: Free above ₹499, else ₹49)
    const discountedSubtotal = Math.max(0, subtotalPaise - discountPaise);
    const shippingPaise = discountedSubtotal >= 49900 ? 0 : 4900;
    const grandTotalPaise = discountedSubtotal + shippingPaise;

    // 5. Generate Collision-Safe Unique Order ID (FM-YYYYMM-XXXX)
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const orderNumberPrefix = `FM-${yearMonth}-`;
    const epochNow = Math.floor(Date.now() / 1000);

    // 6. Customer & Address Handling
    const cust = body.customer;
    let customerId: string | null = null;
    let customerName = 'WhatsApp Buyer';
    let customerPhone = 'Pending on WhatsApp';
    let customerEmail: string | null = null;
    let deliveryAddress = 'Address to be confirmed on WhatsApp';
    let apartment: string | null = null;
    let city = 'Pending';
    let state = 'Pending';
    let pinCode = '000000';
    let customerNote = cust?.note?.trim() || null;

    if (cust && cust.phone && /^[+\d\s()-]{10,15}$/.test(cust.phone)) {
      const cleanPhone = cust.phone.replace(/\D/g, '');
      const normalizedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;
      customerPhone = normalizedPhone;
      customerName = cust.name?.trim() || 'Customer';
      customerEmail = cust.email?.trim() || null;
      deliveryAddress = cust.address?.trim() || deliveryAddress;
      apartment = cust.apartment?.trim() || null;
      city = cust.city?.trim() || city;
      state = cust.state?.trim() || state;
      pinCode = cust.pinCode?.trim() || pinCode;

      if (env.DB) {
        // Upsert customer if valid phone provided
        const existingCustomer = await env.DB.prepare(`
          SELECT id FROM customers WHERE phone = ? LIMIT 1
        `).bind(customerPhone).first();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          customerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          try {
            await env.DB.prepare(`
              INSERT INTO customers (id, phone, name, email, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(customerId, customerPhone, customerName, customerEmail, epochNow, epochNow).run();
          } catch (custErr) {
            console.warn('Customer upsert non-critical warning:', custErr);
          }
        }
      }
    }

    // 7. Insert Order into D1 (Strictly pending/unfulfilled, 100% Prepaid)
    let orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    let orderNumber = `${orderNumberPrefix}0001`;

    if (env.DB) {
      let inserted = false;
      let attempts = 0;

      while (!inserted && attempts < 3) {
        attempts++;
        let sequenceNumber = attempts;

        const latestOrder = await env.DB.prepare(`
          SELECT order_number FROM orders
          WHERE order_number LIKE ?
          ORDER BY LENGTH(order_number) DESC, order_number DESC
          LIMIT 1
        `).bind(`${orderNumberPrefix}%`).first();

        if (latestOrder && latestOrder.order_number) {
          const parts = latestOrder.order_number.split('-');
          const lastSeq = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(lastSeq) && lastSeq > 0) {
            sequenceNumber = lastSeq + 1;
          }
        }

        orderNumber = `${orderNumberPrefix}${String(sequenceNumber).padStart(4, '0')}`;
        orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        try {
          await env.DB.prepare(`
            INSERT INTO orders (
              id, order_number, customer_id, customer_name, customer_phone, customer_email,
              delivery_address, apartment, city, state, pin_code, country,
              subtotal_paise, discount_paise, coupon_code, shipping_paise, tax_paise, grand_total_paise,
              currency, order_status, payment_status, fulfillment_status,
              payment_method_code, delivery_method_code, order_source, customer_note,
              created_at, updated_at
            ) VALUES (
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, 'India',
              ?, ?, ?, ?, 0, ?,
              'INR', 'pending', 'pending', 'unfulfilled',
              'upi_qr', 'standard', 'whatsapp', ?,
              ?, ?
            )
          `).bind(
            orderId,
            orderNumber,
            customerId,
            customerName,
            customerPhone,
            customerEmail,
            deliveryAddress,
            apartment,
            city,
            state,
            pinCode,
            subtotalPaise,
            discountPaise,
            couponCode,
            shippingPaise,
            grandTotalPaise,
            customerNote,
            epochNow,
            epochNow
          ).run();
          inserted = true;
        } catch (insertErr: any) {
          if (attempts >= 3) throw insertErr;
        }
      }

      // Insert Order Items
      for (const item of evaluatedItems) {
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await env.DB.prepare(`
          INSERT INTO order_items (
            id, order_id, product_id, variant_id, product_name, pack_size, sku,
            unit_price_paise, quantity, line_total_paise, discount_paise, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        `).bind(
          itemId,
          orderId,
          item.productId,
          item.variantId,
          item.productName,
          item.packSize,
          item.sku,
          item.unitPricePaise,
          item.quantity,
          item.lineTotalPaise,
          epochNow
        ).run();
      }

      // Record Audit Log
      try {
        await env.DB.prepare(`
          INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, metadata, created_at)
          VALUES (?, NULL, 'order_draft_created', 'order', ?, ?, ?)
        `).bind(
          `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          orderId,
          JSON.stringify({
            order_number: orderNumber,
            channel: 'whatsapp',
            items_count: evaluatedItems.length,
            grand_total_paise: grandTotalPaise
          }),
          epochNow
        ).run();
      } catch (logErr) {
        console.warn('Could not write draft audit log:', logErr);
      }
    }

    // 8. Generate WhatsApp Message & wa.me URL
    const targetPhone = site.whatsappOrderNumber || '919871316958';
    let waMessage = '';

    if (evaluatedItems.length === 1 && (!cust || !cust.address)) {
      // Single product direct message format (per Phase 3A specs)
      const single = evaluatedItems[0];
      waMessage = [
        'Hi Fit Monk,',
        'I want to place an order.',
        '',
        `Order ID: ${orderNumber}`,
        '',
        'Product:',
        single.productName,
        `Pack: ${single.packSize}`,
        `Qty: ${single.quantity}`,
        '',
        `Order Total: ${formatMoneyPaise(grandTotalPaise)}`,
        '',
        'I will complete the prepaid payment and share the payment confirmation here.'
      ].join('\n');
    } else {
      // Multi-item or customer-detailed message format
      const itemLines = evaluatedItems.map(i => `• ${i.productName} (${i.packSize}) × ${i.quantity} — ${formatMoneyPaise(i.lineTotalPaise)}`);
      waMessage = [
        '🛍️ FIT MONK ORDER',
        `Order ID: ${orderNumber}`,
        '',
        'Customer:',
        customerName,
        customerPhone,
        '',
        'Delivery:',
        deliveryAddress,
        ...(apartment ? [apartment] : []),
        `${city}, ${state} - ${pinCode}`,
        '',
        'Order Items:',
        ...itemLines,
        '',
        `Subtotal: ${formatMoneyPaise(subtotalPaise)}`,
        discountPaise > 0 ? `Coupon Discount: -${formatMoneyPaise(discountPaise)}` : '',
        `Shipping: ${shippingPaise === 0 ? 'FREE' : formatMoneyPaise(shippingPaise)}`,
        `Grand Total: ${formatMoneyPaise(grandTotalPaise)}`,
        '',
        'I will complete the prepaid payment and share the payment confirmation here.'
      ].filter(Boolean).join('\n');
    }

    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        orderNumber,
        pricing: {
          subtotalPaise,
          discountPaise,
          shippingPaise,
          grandTotalPaise,
          formattedTotal: formatMoneyPaise(grandTotalPaise)
        },
        whatsappMessage: waMessage,
        whatsappUrl
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || 'Error creating order draft.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
