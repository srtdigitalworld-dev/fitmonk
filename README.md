# Fit Monk storefront

Static Astro + TypeScript + Tailwind CSS storefront with the source-backed 24-product catalog and premium brand redesign. Orders are prepared locally and opened in WhatsApp for the customer to send. No payment gateway, accounts or order database. **Not deployed. Indexing remains disabled.**

## Development

Use Node 24 and `npm ci`. Run `npm run dev` for development. Validate with `npm run check`, `npm test`, `npm run build`, and `npm run verify:build`. Production preview: `npm run preview -- --host 127.0.0.1 --port 4322`. Set `PREVIEW_URL=http://127.0.0.1:4322` to include HTTP route checks in the verifier.

## Architecture

- `src/content/products/*.json`: 24 records, integer-paise prices, variants, provenance and unresolved facts.
- `src/data/categories.ts` and `src/lib/taxonomy.ts`: commercial taxonomy, Breakfast children Muesli/Talbina and cross-listing.
- `src/lib/catalog.ts`: source validation and publication filtering. Review records appear only while indexing is disabled.
- `src/components/product/` and `src/components/ui/`: reusable cards, responsive images, purchase controls, official logo, decorative artwork, collection cards, icons and headings.
- `src/components/cart/` and `src/lib/cart/`: shared drawer, cart and checkout state. localStorage stores only product/variant IDs and quantities. Current catalog prices are always resolved afresh. Customer details are not persisted.
- `src/lib/whatsapp/order.ts`: validation, message formatting and URL encoding. Unknown shipping remains explicitly unconfirmed.
- `src/layouts/` and `src/components/seo/`: metadata, canonical URLs, breadcrumbs and conditional JSON-LD. No unverified in-stock Offers.
- `src/styles/global.css`: locked palette, self-hosted Manrope Variable and DM Serif Display, spacing, controls and responsive layouts.
- `src/data/site.ts`: brand, seller number, optional announcement and noindex switch.
- `scripts/import-catalog.py`: source importer; do not rerun merely to change presentation.
- `scripts/verify-build.mjs`: 40-route SEO, link, anchor, asset and image-dimension checks.
- `.github/workflows/ci.yml`: verification only, no deployment job.

## Sources and remaining review

The source PDFs are `source-assets/Fit Monk Catalog PDF (1).pdf` (6 pages, 24 products) and `source-assets/Fit-Monk-SEO-Blueprint.pdf` (25 pages). Seller: **+91 98713 16958**. Some rightmost blueprint table columns are clipped; its taxonomy and narrative mapping are readable. The exact requested catalog filename was absent; the available catalog PDF was read directly.

Four products have usable catalog photographs; the rest use labeled placeholders. Three extracted image sets with unverified printed health claims are withheld. The supplied logo is unchanged. See `docs/REDESIGN-REPORT.md` for implementation, validation and unresolved details.

Sitemap integration remains configured but produces no output while `site.indexable` is false. All pages have `noindex,follow`; robots disallows crawling. Empty article and sitemap warnings are expected. Deployment and publication await a later user instruction.
