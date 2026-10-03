import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { productSchema } from './lib/product-schema';

export const collections = {
  products: defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/products' }), schema: productSchema }),
  articles: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/articles' }), schema: z.object({
    title: z.string(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string(),
    author: z.string().nullable(), publishedAt: z.coerce.date().nullable(), updatedAt: z.coerce.date().nullable(), draft: z.boolean().default(true),
  }) }),
};
