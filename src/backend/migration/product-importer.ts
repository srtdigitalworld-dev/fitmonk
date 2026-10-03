// Fit Monk Product Migration Importer
// Safely transforms all 26 existing JSON catalog files into relational D1 SQL insert statements.
// Preserves all slugs, prices (in integer paise), variants, images, SEO, FAQs, and categories.

import fs from 'node:fs';
import path from 'node:path';
import { categories } from '../../data/categories.ts';

export interface MigrationSqlResult {
  categoryStatements: string[];
  productStatements: string[];
  variantStatements: string[];
  mediaStatements: string[];
  totalProductsMigrated: number;
}

export function generateMigrationSql(productsDir: string): MigrationSqlResult {
  const categoryStatements: string[] = [];
  const productStatements: string[] = [];
  const variantStatements: string[] = [];
  const mediaStatements: string[] = [];

  // 1. Categories
  for (const cat of categories) {
    const parentVal = cat.parent ? `'${cat.parent}'` : 'NULL';
    const escapedName = cat.name.replace(/'/g, "''");
    categoryStatements.push(
      `INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('${cat.slug}', '${cat.slug}', '${escapedName}', ${parentVal}, 0);`
    );
  }

  // 2. Read all product JSON files
  const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
  let totalMigrated = 0;

  for (const file of files) {
    const rawContent = fs.readFileSync(path.join(productsDir, file), 'utf8');
    const p = JSON.parse(rawContent);
    totalMigrated++;

    const escapeSql = (str: string | null | undefined): string => {
      if (str === null || str === undefined) return 'NULL';
      return `'${String(str).replace(/'/g, "''")}'`;
    };

    const ingredientsJson = p.ingredients ? escapeSql(JSON.stringify(p.ingredients)) : 'NULL';
    const allergensJson = p.allergens ? escapeSql(JSON.stringify(p.allergens)) : 'NULL';
    const nutritionJson = p.nutrition ? escapeSql(JSON.stringify(p.nutrition)) : 'NULL';
    const faqsJson = p.faqs ? escapeSql(JSON.stringify(p.faqs)) : "'[]'";
    const promotionsJson = p.promotions ? escapeSql(JSON.stringify(p.promotions)) : "'[]'";
    const sourceRawJson = p.source ? escapeSql(JSON.stringify(p.source)) : 'NULL';

    // Insert Product
    productStatements.push(`
INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  ${escapeSql(p.id)},
  ${p.catalogNumber ?? 'NULL'},
  ${escapeSql(p.slug)},
  ${escapeSql(p.name)},
  ${escapeSql(p.sourceName)},
  ${escapeSql(p.displayName)},
  ${escapeSql(p.shortName)},
  ${escapeSql(p.category)},
  ${escapeSql(p.subcategory)},
  ${escapeSql(p.description)},
  ${p.price ?? 0},
  ${p.compareAtPrice ?? 'NULL'},
  'INR',
  ${escapeSql(p.packSize)},
  ${escapeSql(p.sku)},
  ${p.weightGrams ?? 'NULL'},
  ${ingredientsJson},
  ${allergensJson},
  ${nutritionJson},
  ${escapeSql(p.storage)},
  ${escapeSql(p.shippingText)},
  ${escapeSql(p.status ?? 'published')},
  ${p.available === false ? 0 : 1},
  ${p.featured ? 1 : 0},
  ${p.orderable === false ? 0 : 1},
  ${escapeSql(p.kind ?? 'product')},
  ${escapeSql(p.learnHub)},
  ${escapeSql(p.seoTitle)},
  ${escapeSql(p.seoDescription)},
  ${sourceRawJson},
  ${faqsJson},
  ${promotionsJson}
);`.trim());

    // Insert Variants
    if (Array.isArray(p.variants) && p.variants.length > 0) {
      for (const v of p.variants) {
        const variantId = `${p.id}-${v.id}`;
        variantStatements.push(`
INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  ${escapeSql(variantId)},
  ${escapeSql(p.id)},
  ${escapeSql(v.id)},
  ${escapeSql(v.packSize || v.id)},
  ${escapeSql(v.sku)},
  ${v.price ?? 0},
  ${v.compareAtPrice ?? 'NULL'},
  ${v.weightGrams ?? 'NULL'},
  ${v.available === false ? 0 : 1},
  ${v.shipping?.amount ?? 'NULL'},
  ${v.shipping?.freeShipping ? 1 : 0}
);`.trim());
      }
    }

    // Insert Images / Media
    if (Array.isArray(p.images) && p.images.length > 0) {
      p.images.forEach((img: any, idx: number) => {
        const mediaId = `media-${p.id}-${idx}`;
        mediaStatements.push(`
INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  ${escapeSql(mediaId)},
  ${escapeSql(path.basename(img.src))},
  ${escapeSql(img.src)},
  ${escapeSql(img.src)},
  'image/jpeg',
  0,
  ${img.width ?? 'NULL'},
  ${img.height ?? 'NULL'},
  ${escapeSql(img.alt)}
);`.trim());

        mediaStatements.push(`
INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  ${escapeSql(p.id)},
  ${escapeSql(mediaId)},
  ${escapeSql(idx === 0 ? 'primary' : 'gallery')},
  ${idx}
);`.trim());
      });
    }
  }

  return {
    categoryStatements,
    productStatements,
    variantStatements,
    mediaStatements,
    totalProductsMigrated: totalMigrated
  };
}
