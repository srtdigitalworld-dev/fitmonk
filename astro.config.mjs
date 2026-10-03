import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/data/site.ts';

export default defineConfig({
  site: site.siteUrl,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (url) => site.indexable && !['/404/', '/cart/', '/checkout/'].some(path=>url.endsWith(path)) })],
  vite: { plugins: [tailwindcss()] },
});
