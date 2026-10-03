import { getCollection } from 'astro:content';
import { site } from '../data/site';
import type { Product } from './product-schema';

let cachedProductsPromise: Promise<Array<{ id: string; data: Product }>> | null = null;

async function fetchCanonicalProducts(): Promise<Array<{ id: string; data: Product }>> {
  // 1. Load static fallback entries
  const staticEntries = await getCollection('products');
  const staticMap = new Map<string, { id: string; data: Product }>();
  for (const entry of staticEntries) {
    staticMap.set(entry.data.id, entry);
    staticMap.set(entry.data.slug, entry);
  }

  // 2. Fetch canonical catalog from D1 via Edge API
  let d1Products: any[] | null = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const apiUrl = process.env.PUBLIC_API_URL || 'https://fitmonk.co.in/api/products?limit=200';
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const json = await res.json() as any;
      if (Array.isArray(json?.products) && json.products.length > 0) {
        d1Products = json.products;
      }
    }
  } catch (err) {
    // Network unavailable or offline build: fall back gracefully
    d1Products = null;
  }

  const finalEntries: Array<{ id: string; data: Product }> = [];

  if (d1Products && d1Products.length > 0) {
    // Canonical D1 path
    for (const d1 of d1Products) {
      // Exclude archived products or disabled products
      if (d1.status === 'archived') continue;
      if (d1.is_available === false || d1.is_available === 0) continue;
      if (d1.status === 'draft') continue;

      const existing = staticMap.get(d1.id) || staticMap.get(d1.slug);
      if (existing) {
        // Overlay updated attributes from canonical D1 record
        const updatedData: Product = {
          ...existing.data,
          name: d1.name || existing.data.name,
          slug: d1.slug || existing.data.slug,
          price: d1.price_paise !== undefined ? d1.price_paise : existing.data.price,
          compareAtPrice: d1.compare_at_price_paise !== undefined ? d1.compare_at_price_paise : existing.data.compareAtPrice,
          packSize: d1.pack_size !== undefined ? d1.pack_size : existing.data.packSize,
          sku: d1.sku !== undefined ? d1.sku : existing.data.sku,
          weightGrams: d1.weight_grams !== undefined ? d1.weight_grams : existing.data.weightGrams,
          description: d1.description !== undefined ? d1.description : existing.data.description,
          status: d1.status || existing.data.status,
          available: Boolean(d1.is_available),
          featured: Boolean(d1.is_featured),
          orderable: Boolean(d1.is_orderable),
          seoTitle: d1.seo_title || existing.data.seoTitle,
          seoDescription: d1.seo_description || existing.data.seoDescription
        };

        // If D1 provides images, use them; otherwise preserve high-res static images
        if (Array.isArray(d1.images) && d1.images.length > 0) {
          updatedData.images = d1.images;
        }

        finalEntries.push({ id: existing.id, data: updatedData });
      } else {
        // Synthesize new product created via Admin in D1
        const newProduct: Product = {
          id: d1.id,
          catalogNumber: d1.catalog_number || 99,
          slug: d1.slug,
          name: d1.name,
          sourceName: d1.name,
          displayName: d1.name,
          shortName: d1.short_name || null,
          category: d1.category_slug || d1.category_id || 'seeds-nuts-snack-mixes',
          subcategory: null,
          additionalCategories: [],
          description: d1.description || '',
          images: Array.isArray(d1.images) && d1.images.length > 0 ? d1.images : [{
            src: '/Fit Monk listing photos/01-roasted-dryfruits-seeds-mix.jpg',
            alt: d1.name,
            width: 1200,
            height: 1200
          }],
          price: d1.price_paise || 0,
          compareAtPrice: d1.compare_at_price_paise || null,
          currency: 'INR',
          packSize: d1.pack_size || null,
          sku: d1.sku || null,
          ingredients: d1.ingredients ? (typeof d1.ingredients === 'string' ? JSON.parse(d1.ingredients) : d1.ingredients) : null,
          allergens: null,
          nutrition: null,
          storage: d1.storage || null,
          shipping: null,
          shippingText: d1.shipping_text || null,
          weightGrams: d1.weight_grams || null,
          available: Boolean(d1.is_available),
          featured: Boolean(d1.is_featured),
          variants: [],
          relatedProducts: [],
          seoTitle: d1.seo_title || `${d1.name} | Fit Monk`,
          seoDescription: d1.seo_description || d1.description?.substring(0, 160) || null,
          faqs: [],
          status: d1.status === 'review' ? 'review' : 'published',
          reviewRequired: false,
          reviewNotes: [],
          orderable: Boolean(d1.is_orderable),
          kind: 'product',
          learnHub: 'labels-allergens-and-storage',
          promotions: [],
          source: { reference: 'D1 Catalog', raw: {}, conflicts: [] }
        };
        finalEntries.push({ id: d1.id, data: newProduct });
      }
    }
  } else {
    // Offline / fallback to static entries
    for (const entry of staticEntries) {
      finalEntries.push(entry);
    }
  }

  // Deduplicate and validate
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const validEntries: Array<{ id: string; data: Product }> = [];

  for (const entry of finalEntries) {
    const p = entry.data;
    if (ids.has(p.id) || slugs.has(p.slug)) continue;
    ids.add(p.id);
    slugs.add(p.slug);
    validEntries.push(entry);
  }

  // Filter publishable
  return validEntries
    .filter(e => e.data.status === 'published' || (!site.indexable && e.data.status === 'review'))
    .sort((a, b) => {
      const getPriority = (num?: number) => {
        if (num === 25) return -100;
        if (num === 26) return -99;
        return num ?? 0;
      };
      return getPriority(a.data.catalogNumber) - getPriority(b.data.catalogNumber);
    });
}

export async function getProducts(): Promise<Array<{ id: string; data: Product }>> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = fetchCanonicalProducts();
  }
  return cachedProductsPromise;
}
