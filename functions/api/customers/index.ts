// Fit Monk Edge API: /api/customers
// GET: Customer directory derived authoritatively from D1 orders
// Strict 100% PREPAID model - unpaid drafts are NOT counted as revenue

import { getAuthenticatedAdmin } from '../_auth';

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
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
        JSON.stringify({
          success: true,
          customers: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
          summary: { totalCustomers: 0, repeatCustomers: 0, totalRevenuePaise: 0 }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() || '';
    const sort = url.searchParams.get('sort')?.trim() || 'last_order_desc';
    const filter = url.searchParams.get('filter')?.trim() || 'all';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    // CTE to rank orders per customer and aggregate metrics
    const baseCte = `
      WITH customer_orders AS (
        SELECT
          o.id as order_id,
          o.order_number,
          o.customer_id,
          o.customer_name,
          o.customer_phone,
          o.customer_email,
          o.delivery_address,
          o.apartment,
          o.city,
          o.state,
          o.pin_code,
          o.grand_total_paise,
          o.discount_paise,
          o.coupon_code,
          o.order_status,
          o.payment_status,
          o.fulfillment_status,
          o.created_at,
          ROW_NUMBER() OVER (
            PARTITION BY o.customer_phone
            ORDER BY o.created_at DESC
          ) as rn
        FROM orders o
        WHERE o.customer_phone IS NOT NULL
          AND o.customer_phone != ''
          AND o.customer_phone != 'Pending on WhatsApp'
          AND o.customer_phone NOT LIKE '%Pending%'
      ),
      customer_summary AS (
        SELECT
          o.customer_phone as phone,
          COALESCE(
            MAX(CASE WHEN o.rn = 1 AND o.customer_name != 'WhatsApp Buyer' AND o.customer_name != '' THEN o.customer_name END),
            MAX(CASE WHEN o.customer_name != 'WhatsApp Buyer' AND o.customer_name != '' THEN o.customer_name END),
            MAX(o.customer_name),
            'Customer'
          ) as name,
          COALESCE(
            MAX(CASE WHEN o.rn = 1 AND o.customer_email IS NOT NULL AND o.customer_email != '' THEN o.customer_email END),
            MAX(CASE WHEN o.customer_email IS NOT NULL AND o.customer_email != '' THEN o.customer_email END)
          ) as email,
          MAX(CASE WHEN o.rn = 1 THEN o.customer_id END) as customer_id,
          MAX(CASE WHEN o.rn = 1 THEN o.delivery_address END) as latest_address,
          MAX(CASE WHEN o.rn = 1 THEN o.apartment END) as latest_apartment,
          MAX(CASE WHEN o.rn = 1 THEN o.city END) as latest_city,
          MAX(CASE WHEN o.rn = 1 THEN o.state END) as latest_state,
          MAX(CASE WHEN o.rn = 1 THEN o.pin_code END) as latest_pincode,
          MAX(CASE WHEN o.rn = 1 THEN o.order_status END) as latest_order_status,
          MAX(CASE WHEN o.rn = 1 THEN o.payment_status END) as latest_payment_status,
          MAX(CASE WHEN o.rn = 1 THEN o.fulfillment_status END) as latest_fulfillment_status,
          COUNT(*) as total_orders,
          SUM(CASE WHEN o.payment_status = 'paid' AND o.order_status NOT IN ('cancelled', 'refunded') THEN 1 ELSE 0 END) as qualifying_orders,
          SUM(CASE WHEN o.payment_status = 'paid' AND o.order_status NOT IN ('cancelled', 'refunded') THEN o.grand_total_paise ELSE 0 END) as total_spent_paise,
          MIN(o.created_at) as first_order_at,
          MAX(o.created_at) as last_order_at
        FROM customer_orders o
        GROUP BY o.customer_phone
      )
    `;

    // Filter conditions
    const whereClauses: string[] = ['1=1'];
    const params: any[] = [];

    if (search) {
      whereClauses.push(`(name LIKE ? OR phone LIKE ? OR (email IS NOT NULL AND email LIKE ?))`);
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (filter === 'repeat') {
      whereClauses.push(`qualifying_orders > 1`);
    } else if (filter === 'single') {
      whereClauses.push(`qualifying_orders = 1`);
    } else if (filter === 'unpaid') {
      whereClauses.push(`qualifying_orders = 0`);
    }

    const whereSql = whereClauses.join(' AND ');

    // Sorting
    let orderBy = 'last_order_at DESC';
    if (sort === 'total_spent_desc') {
      orderBy = 'total_spent_paise DESC, last_order_at DESC';
    } else if (sort === 'total_orders_desc') {
      orderBy = 'total_orders DESC, last_order_at DESC';
    } else if (sort === 'first_order_desc') {
      orderBy = 'first_order_at DESC';
    } else if (sort === 'name_asc') {
      orderBy = 'name ASC';
    }

    // 1. Total counts and summary
    const summaryQuery = `
      ${baseCte}
      SELECT
        COUNT(*) as total_count,
        SUM(CASE WHEN qualifying_orders > 1 THEN 1 ELSE 0 END) as repeat_count,
        SUM(total_spent_paise) as total_revenue_paise
      FROM customer_summary
      WHERE ${whereSql}
    `;

    const summaryStmt = env.DB.prepare(summaryQuery);
    const summaryRow = await (params.length > 0 ? summaryStmt.bind(...params) : summaryStmt).first();

    const totalCount = Number(summaryRow?.total_count) || 0;
    const repeatCount = Number(summaryRow?.repeat_count) || 0;
    const totalRevenuePaise = Number(summaryRow?.total_revenue_paise) || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // 2. Paginated rows
    const dataQuery = `
      ${baseCte}
      SELECT *
      FROM customer_summary
      WHERE ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limit, offset];
    const dataStmt = env.DB.prepare(dataQuery);
    const { results } = await dataStmt.bind(...dataParams).all();

    const customers = (results || []).map((row: any) => {
      const qualifyingOrders = Number(row.qualifying_orders) || 0;
      const totalSpentPaise = Number(row.total_spent_paise) || 0;
      const aovPaise = qualifyingOrders > 0 ? Math.round(totalSpentPaise / qualifyingOrders) : 0;
      const isRepeat = qualifyingOrders > 1;

      return {
        phone: row.phone,
        name: row.name,
        email: row.email || null,
        customerId: row.customer_id || null,
        totalOrders: Number(row.total_orders) || 0,
        qualifyingOrders,
        totalSpentPaise,
        aovPaise,
        isRepeat,
        firstOrderAt: row.first_order_at,
        lastOrderAt: row.last_order_at,
        latestOrderStatus: row.latest_order_status,
        latestPaymentStatus: row.latest_payment_status,
        latestFulfillmentStatus: row.latest_fulfillment_status,
        latestAddress: {
          address: row.latest_address,
          apartment: row.latest_apartment,
          city: row.latest_city,
          state: row.latest_state,
          pinCode: row.latest_pincode
        }
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        customers,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages
        },
        summary: {
          totalCustomers: totalCount,
          repeatCustomers: repeatCount,
          totalRevenuePaise
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error fetching customers' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
