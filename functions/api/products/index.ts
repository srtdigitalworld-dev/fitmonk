// Fit Monk Edge API: /api/products
// GET: Catalog search / list from Cloudflare D1
// POST: Product creation (Admin authenticated)

import { getAuthenticatedAdmin } from '../_auth';

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 100, 1), 200);
    const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0);

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          source: 'local_preview',
          total: 0,
          products: [],
          message: 'D1 binding not detected in local runtime.'
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

    if (status && status !== 'all') {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.short_name LIKE ? OR p.sku LIKE ? OR p.slug LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ` ORDER BY p.catalog_number ASC, p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const stmt = env.DB.prepare(query);
    const { results } = await stmt.bind(...params).all();

    // Fetch variants for returned products
    const productIds = results.map((r: any) => r.id);
    let variants: any[] = [];
    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const varStmt = env.DB.prepare(
        `SELECT * FROM product_variants WHERE product_id IN (${placeholders}) ORDER BY price_paise ASC`
      );
      const varRes = await varStmt.bind(...productIds).all();
      variants = varRes.results;
    }

    // Attach formatted fields and variants
    const productsWithVariants = results.map((p: any) => ({
      ...p,
      price: (p.price_paise / 100).toFixed(2),
      compare_at_price: p.compare_at_price_paise ? (p.compare_at_price_paise / 100).toFixed(2) : null,
      is_available: Boolean(p.is_available),
      is_featured: Boolean(p.is_featured),
      is_orderable: Boolean(p.is_orderable),
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
    // 1. Authenticate Admin
    const admin = await getAuthenticatedAdmin(request, env);
    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized. Admin login required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse & Validate input
    const body = await request.json().catch(() => null) as any;
    if (!body) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid JSON request body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const name = String(body.name || '').trim();
    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product name is required (min 2 characters).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Slug generation or validation
    let slug = String(body.slug || '').trim().toLowerCase();
    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    } else {
      slug = slug.replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    }

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid product slug.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check slug uniqueness
    if (env.DB) {
      const existing = await env.DB.prepare(`SELECT id FROM products WHERE slug = ? LIMIT 1`).bind(slug).first();
      if (existing) {
        return new Response(
          JSON.stringify({ success: false, message: `Product slug '${slug}' is already taken.` }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Pricing parsing (accepts price in rupees float or price_paise integer)
    let pricePaise = 0;
    if (body.price_paise !== undefined) {
      pricePaise = Math.max(Math.round(Number(body.price_paise)), 0);
    } else if (body.price !== undefined) {
      pricePaise = Math.max(Math.round(Number(body.price) * 100), 0);
    }

    let compareAtPricePaise: number | null = null;
    if (body.compare_at_price_paise !== undefined && body.compare_at_price_paise !== null && body.compare_at_price_paise !== '') {
      compareAtPricePaise = Math.max(Math.round(Number(body.compare_at_price_paise)), 0);
    } else if (body.compare_at_price !== undefined && body.compare_at_price !== null && body.compare_at_price !== '') {
      compareAtPricePaise = Math.max(Math.round(Number(body.compare_at_price) * 100), 0);
    }

    const categoryId = body.category_id ? String(body.category_id).trim() : null;
    const packSize = body.pack_size ? String(body.pack_size).trim() : null;
    const sku = body.sku ? String(body.sku).trim() : null;
    const weightGrams = body.weight_grams ? Math.max(Math.round(Number(body.weight_grams)), 0) : null;
    const description = body.description ? String(body.description).trim() : '';
    const ingredients = body.ingredients ? (typeof body.ingredients === 'string' ? body.ingredients : JSON.stringify(body.ingredients)) : null;
    const storage = body.storage ? String(body.storage).trim() : null;
    const shippingText = body.shipping_text ? String(body.shipping_text).trim() : null;
    const status = ['published', 'draft', 'review'].includes(body.status) ? body.status : 'published';
    const isAvailable = body.is_available === false || body.is_available === 0 ? 0 : 1;
    const isFeatured = body.is_featured ? 1 : 0;
    const isOrderable = body.is_orderable === false || body.is_orderable === 0 ? 0 : 1;
    const kind = body.kind === 'bundle' ? 'bundle' : 'product';
    const seoTitle = body.seo_title ? String(body.seo_title).trim() : name;
    const seoDescription = body.seo_description ? String(body.seo_description).trim() : (description.substring(0, 160) || null);

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: true, message: 'Product created (mock mode)', id: 'prod_mock_' + Date.now() }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine catalog number
    const maxRow = await env.DB.prepare(`SELECT COALESCE(MAX(catalog_number), 0) as max_num FROM products`).first();
    const catalogNumber = (maxRow?.max_num || 26) + 1;
    const id = body.id || `fm-${String(catalogNumber).padStart(2, '0')}`;
    const now = Math.floor(Date.now() / 1000);

    await env.DB.prepare(`
      INSERT INTO products (
        id, catalog_number, slug, name, display_name, short_name, category_id,
        description, price_paise, compare_at_price_paise, currency, pack_size, sku,
        weight_grams, ingredients, storage, shipping_text, status, is_available,
        is_featured, is_orderable, kind, seo_title, seo_description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      catalogNumber,
      slug,
      name,
      name,
      name,
      categoryId,
      description,
      pricePaise,
      compareAtPricePaise,
      'INR',
      packSize,
      sku,
      weightGrams,
      ingredients,
      storage,
      shippingText,
      status,
      isAvailable,
      isFeatured,
      isOrderable,
      kind,
      seoTitle,
      seoDescription,
      now,
      now
    ).run();

    // Audit log
    await env.DB.prepare(`
      INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, ?, 'product.create', 'product', ?, ?, ?)
    `).bind(
      'aud_' + Math.random().toString(36).substring(2, 10),
      admin.id,
      id,
      JSON.stringify({ name, slug, price_paise: pricePaise }),
      now
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Product successfully created in D1.',
        product: {
          id,
          catalog_number: catalogNumber,
          slug,
          name,
          price_paise: pricePaise,
          price: (pricePaise / 100).toFixed(2),
          is_available: Boolean(isAvailable),
          status
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Error creating product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
