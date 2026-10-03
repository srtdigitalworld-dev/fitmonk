import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { getProducts } from '../lib/catalog';
import { categories } from '../data/categories';

export const GET: APIRoute = async () => {
  const staticPaths = [
    '/',
    '/about/',
    '/contact/',
    '/learn/',
    '/shop/',
  ];

  const categoryPaths = categories.map(c => `/shop/${c.slug}/`);
  const products = await getProducts();
  const productPaths = products.map(p => `/product/${p.data.slug}/`);

  const allPaths = [...staticPaths, ...categoryPaths, ...productPaths];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map(path => `  <url>\n    <loc>${new URL(path, site.siteUrl).href}</loc>\n  </url>`)
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
