// Fit Monk Edge API: /api/products/:id
// GET: Fetch product details by ID
// PUT / PATCH: Update product or toggle active/disable
// DELETE: Soft-archive product (preserves order history)

import { getAuthenticatedAdmin } from '../_auth';
import { triggerStorefrontDeploy } from '../_deploy';

interface Env {
  DB?: any;
  CF_DEPLOY_HOOK_URL?: string;
  CLOUDFLARE_DEPLOY_HOOK_URL?: string;
}

export const onRequestGet = async ({ params, env }: { params: { id: string }; env: Env }) => {
  try {
    const id = params.id;
    if (!env.DB) {
      return new Response(JSON.stringify({ error: 'Database not connected' }), { status: 500 });
    }

    const product = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? OR p.slug = ?
      LIMIT 1
    `).bind(id, id).first();

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    const variants = await env.DB.prepare(`
      SELECT * FROM product_variants WHERE product_id = ? ORDER BY price_paise ASC
    `).bind(product.id).all();

    return new Response(
      JSON.stringify({
        product: {
          ...product,
          price: (product.price_paise / 100).toFixed(2),
          compare_at_price: product.compare_at_price_paise ? (product.compare_at_price_paise / 100).toFixed(2) : null,
          is_available: Boolean(product.is_available),
          is_featured: Boolean(product.is_featured),
          is_orderable: Boolean(product.is_orderable),
          variants: variants.results || []
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const onRequestPut = async (context: { request: Request; params: { id: string }; env: Env }) => {
  return handleUpdate(context);
};

export const onRequestPatch = async (context: { request: Request; params: { id: string }; env: Env }) => {
  return handleUpdate(context);
};

async function handleUpdate({ request, params, env }: { request: Request; params: { id: string }; env: Env }) {
  try {
    // 1. Authenticate Admin
    const admin = await getAuthenticatedAdmin(request, env);
    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized. Admin login required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = params.id;
    if (!env.DB) {
      return new Response(JSON.stringify({ success: true, message: 'Mock update' }), { status: 200 });
    }

    // 2. Fetch existing product
    const existing = await env.DB.prepare(`SELECT * FROM products WHERE id = ? LIMIT 1`).bind(id).first();
    if (!existing) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse update payload
    const body = await request.json().catch(() => null) as any;
    if (!body) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid JSON body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check slug conflict if slug is being updated
    let slug = existing.slug;
    if (body.slug && body.slug !== existing.slug) {
      slug = String(body.slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
      const slugConflict = await env.DB.prepare(`SELECT id FROM products WHERE slug = ? AND id != ? LIMIT 1`).bind(slug, id).first();
      if (slugConflict) {
        return new Response(
          JSON.stringify({ success: false, message: `Slug '${slug}' is already used by another product.` }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Pricing parsing
    let pricePaise = existing.price_paise;
    if (body.price_paise !== undefined) {
      pricePaise = Math.max(Math.round(Number(body.price_paise)), 0);
    } else if (body.price !== undefined) {
      pricePaise = Math.max(Math.round(Number(body.price) * 100), 0);
    }

    let compareAtPricePaise = existing.compare_at_price_paise;
    if (body.compare_at_price_paise !== undefined) {
      compareAtPricePaise = body.compare_at_price_paise === null || body.compare_at_price_paise === '' ? null : Math.max(Math.round(Number(body.compare_at_price_paise)), 0);
    } else if (body.compare_at_price !== undefined) {
      compareAtPricePaise = body.compare_at_price === null || body.compare_at_price === '' ? null : Math.max(Math.round(Number(body.compare_at_price) * 100), 0);
    }

    const name = body.name !== undefined ? String(body.name).trim() : existing.name;
    const categoryId = body.category_id !== undefined ? (body.category_id ? String(body.category_id).trim() : null) : existing.category_id;
    const packSize = body.pack_size !== undefined ? (body.pack_size ? String(body.pack_size).trim() : null) : existing.pack_size;
    const sku = body.sku !== undefined ? (body.sku ? String(body.sku).trim() : null) : existing.sku;
    const weightGrams = body.weight_grams !== undefined ? (body.weight_grams ? Math.max(Math.round(Number(body.weight_grams)), 0) : null) : existing.weight_grams;
    const description = body.description !== undefined ? String(body.description).trim() : existing.description;
    const ingredients = body.ingredients !== undefined ? (typeof body.ingredients === 'string' ? body.ingredients : JSON.stringify(body.ingredients)) : existing.ingredients;
    const storage = body.storage !== undefined ? (body.storage ? String(body.storage).trim() : null) : existing.storage;
    const shippingText = body.shipping_text !== undefined ? (body.shipping_text ? String(body.shipping_text).trim() : null) : existing.shipping_text;
    const status = body.status !== undefined ? (['published', 'draft', 'review', 'archived'].includes(body.status) ? body.status : existing.status) : existing.status;
    const isAvailable = body.is_available !== undefined ? (body.is_available ? 1 : 0) : existing.is_available;
    const isFeatured = body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : existing.is_featured;
    const isOrderable = body.is_orderable !== undefined ? (body.is_orderable ? 1 : 0) : existing.is_orderable;
    const seoTitle = body.seo_title !== undefined ? String(body.seo_title).trim() : existing.seo_title;
    const seoDescription = body.seo_description !== undefined ? String(body.seo_description).trim() : existing.seo_description;

    const now = Math.floor(Date.now() / 1000);

    await env.DB.prepare(`
      UPDATE products SET
        slug = ?,
        name = ?,
        display_name = ?,
        short_name = ?,
        category_id = ?,
        description = ?,
        price_paise = ?,
        compare_at_price_paise = ?,
        pack_size = ?,
        sku = ?,
        weight_grams = ?,
        ingredients = ?,
        storage = ?,
        shipping_text = ?,
        status = ?,
        is_available = ?,
        is_featured = ?,
        is_orderable = ?,
        seo_title = ?,
        seo_description = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      slug,
      name,
      name,
      name,
      categoryId,
      description,
      pricePaise,
      compareAtPricePaise,
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
      seoTitle,
      seoDescription,
      now,
      id
    ).run();

    // Audit log
    await env.DB.prepare(`
      INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, ?, 'product.update', 'product', ?, ?, ?)
    `).bind(
      'aud_' + Math.random().toString(36).substring(2, 10),
      admin.id,
      id,
      JSON.stringify({ name, slug, is_available: isAvailable, status }),
      now
    ).run();

    // Trigger static storefront build
    await triggerStorefrontDeploy(env, `Product updated: ${id} (${name}, active=${isAvailable})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Product updated successfully.',
        product: {
          id,
          slug,
          name,
          price_paise: pricePaise,
          price: (pricePaise / 100).toFixed(2),
          is_available: Boolean(isAvailable),
          status
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Error updating product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const onRequestDelete = async ({ request, params, env }: { request: Request; params: { id: string }; env: Env }) => {
  try {
    const admin = await getAuthenticatedAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const id = params.id;
    if (!env.DB) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const now = Math.floor(Date.now() / 1000);

    // Soft delete / archive to preserve order history
    await env.DB.prepare(`
      UPDATE products SET status = 'archived', is_available = 0, updated_at = ? WHERE id = ?
    `).bind(now, id).run();

    await env.DB.prepare(`
      INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, ?, 'product.archive', 'product', ?, ?, ?)
    `).bind(
      'aud_' + Math.random().toString(36).substring(2, 10),
      admin.id,
      id,
      JSON.stringify({ action: 'archive' }),
      now
    ).run();

    // Trigger static storefront build
    await triggerStorefrontDeploy(env, `Product archived: ${id}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Product archived successfully (preserved in historical records).' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
};
