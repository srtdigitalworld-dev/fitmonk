// Fit Monk Edge API: /api/products
// GET: Catalog search / list
// POST: Product creation (admin only)

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 50, 1), 100);
    const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0);

    if (!env.DB) {
      // In local mode without D1, return an empty set or fallback message
      return new Response(
        JSON.stringify({
          source: 'local_preview',
          total: 26,
          products: [],
          message: 'D1 binding not detected in local runtime; using static collection fallback.'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status != 'archived'
    `;
    const params: any[] = [];

    if (category) {
      query += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.short_name LIKE ? OR p.sku LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ` ORDER BY p.sort_order ASC, p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const stmt = env.DB.prepare(query);
    const { results } = await stmt.bind(...params).all();

    // Fetch variants for returned products
    const productIds = results.map((r: any) => r.id);
    let variants: any[] = [];
    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const varStmt = env.DB.prepare(
        `SELECT * FROM product_variants WHERE product_id IN (${placeholders}) ORDER BY sort_order ASC`
      );
      const varRes = await varStmt.bind(...productIds).all();
      variants = varRes.results;
    }

    // Attach variants to products
    const productsWithVariants = results.map((p: any) => ({
      ...p,
      is_active: Boolean(p.is_active),
      is_featured: Boolean(p.is_featured),
      nutrition_facts: p.nutrition_facts ? JSON.parse(p.nutrition_facts) : null,
      variants: variants.filter((v: any) => v.product_id === p.id)
    }));

    return new Response(
      JSON.stringify({
        total: productsWithVariants.length,
        products: productsWithVariants
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Error fetching products' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    // Admin authentication check
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/fitmonk_admin_session=([^;]+)/);
    const rawToken = match ? match[1] : null;

    if (!rawToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json().catch(() => null) as any;
    if (!body || !body.name || !body.slug) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product name and slug are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: true, message: 'Product created (mock mode)', id: 'prod_mock_' + Date.now() }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = body.id || 'prod_' + Math.random().toString(36).substring(2, 10);
    const now = Math.floor(Date.now() / 1000);

    await env.DB.prepare(`
      INSERT INTO products (
        id, slug, name, short_name, description, category_id, sku,
        base_price_paise, compare_at_price_paise, currency, primary_image_url,
        is_featured, is_active, status, sort_order, ingredients, storage_instructions,
        shipping_info, seo_title, seo_description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.slug,
      body.name,
      body.short_name || null,
      body.description || '',
      body.category_id || null,
      body.sku || null,
      body.base_price_paise || 0,
      body.compare_at_price_paise || null,
      body.currency || 'INR',
      body.primary_image_url || null,
      body.is_featured ? 1 : 0,
      body.is_active ? 1 : 0,
      body.status || 'published',
      body.sort_order || 0,
      body.ingredients || null,
      body.storage_instructions || null,
      body.shipping_info || null,
      body.seo_title || null,
      body.seo_description || null,
      now,
      now
    ).run();

    return new Response(
      JSON.stringify({ success: true, id }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Error creating product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
