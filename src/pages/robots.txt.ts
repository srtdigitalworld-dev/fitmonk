import { site } from '../data/site';
export function GET() {
  const body = `User-agent: *\nDisallow: /admin/\nDisallow: /api/\nAllow: /\nSitemap: ${site.siteUrl}/sitemap.xml\nSitemap: ${site.siteUrl}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
