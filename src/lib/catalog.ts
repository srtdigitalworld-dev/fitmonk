import { getCollection } from 'astro:content';
import { site } from '../data/site';
export async function getProducts() {
  const entries = await getCollection('products');
  const ids = new Set<string>(); const slugs = new Set<string>();
  for (const { data: p } of entries) {
    if (ids.has(p.id) || slugs.has(p.slug)) throw new Error(`Duplicate product ID or slug: ${p.id}`);
    ids.add(p.id); slugs.add(p.slug);
  }
  for (const { data: p } of entries) for (const id of p.relatedProducts) {
    if (!ids.has(id) || id === p.id) throw new Error(`Invalid related product ${id} on ${p.id}`);
  }
  return entries.filter(e => e.data.status === 'published' || (!site.indexable && e.data.status === 'review')).sort((a,b) => (a.data.catalogNumber ?? 0) - (b.data.catalogNumber ?? 0));
}
