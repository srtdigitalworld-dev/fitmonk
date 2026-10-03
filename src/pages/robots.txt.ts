import { site } from '../data/site';
export function GET() { return new Response(`User-agent: *\n${site.indexable ? `Allow: /\nSitemap: ${site.siteUrl}/sitemap-index.xml` : 'Disallow: /'}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }); }
