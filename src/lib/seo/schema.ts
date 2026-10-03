import { site } from '../../data/site';
import type { Product } from '../product-schema';
export const absoluteUrl = (path: string) => new URL(path, site.siteUrl).href;
export const organizationSchema = () => ({ '@context': 'https://schema.org', '@type': 'Organization', name: site.brandName, url: site.siteUrl,
  ...(site.business.legalName && { legalName: site.business.legalName }), ...(site.business.logo && { logo: absoluteUrl(site.business.logo) }),
  ...(site.business.email && { email: site.business.email }), ...(site.business.telephone && { telephone: site.business.telephone }),
});
export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path) })) });
export function productJsonLd(p: Product) {
  return { '@context': 'https://schema.org', '@type': 'Product', name: p.name, url: absoluteUrl(`/product/${p.slug}/`),
    ...(p.description && { description: p.description }), ...(p.sku && { sku: p.sku }),
    ...(p.images.length && { image: p.images.map(i => absoluteUrl(i.src)) }),
    ...(p.price !== null && !p.variants.length && p.available !== null && { offers: { '@type': 'Offer', price: p.price / 100, priceCurrency: p.currency, url: absoluteUrl(`/product/${p.slug}/`), availability: `https://schema.org/${p.available ? 'InStock' : 'OutOfStock'}` } }),
  };
}
export const articleSchema = (article: { title: string; description: string; slug: string; author: string | null; publishedAt: Date | null; updatedAt: Date | null }) => ({
  '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description, mainEntityOfPage: absoluteUrl(`/learn/${article.slug}/`),
  ...(article.author && { author: { '@type': 'Person', name: article.author } }), ...(article.publishedAt && { datePublished: article.publishedAt.toISOString() }), ...(article.updatedAt && { dateModified: article.updatedAt.toISOString() }),
});
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

