import { z } from 'zod';
import { categories } from '../data/categories';
import { shippingSchema } from './shipping-schema';

const money = z.number().int().nonnegative().nullable();
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const category = z.enum(categories.map((item) => item.slug) as [string, ...string[]]);
export const productSchema = z.object({
  id: z.string().min(1), slug, name: z.string().min(1), shortName: z.string().nullable(),
  sourceName: z.string().optional(), displayName: z.string().optional(), catalogNumber: z.number().int().optional(),
  reviewRequired: z.boolean().default(false), reviewNotes: z.array(z.string()).default([]),
  orderable: z.boolean().default(true), kind: z.enum(['product', 'bundle']).default('product'),
  additionalCategories: z.array(category).default([]), shippingText: z.string().nullable().default(null),
  learnHub: z.string().default('labels-allergens-and-storage'),
  promotions: z.array(z.object({ variantId: z.string().nullable(), quantity: z.number().int().positive(), total: z.number().int().nonnegative(), freeShipping: z.boolean() })).default([]),
  category: category.nullable(), subcategory: category.nullable(),
  description: z.string().nullable(),
  images: z.array(z.object({ src: z.string().min(1), alt: z.string(), width: z.number().int().positive(), height: z.number().int().positive(), sources: z.array(z.object({ src: z.string().min(1), width: z.number().int().positive() })).optional() })),
  price: money, compareAtPrice: money, currency: z.literal('INR'),
  packSize: z.string().nullable(), sku: z.string().nullable(),
  ingredients: z.array(z.string()).nullable(), allergens: z.array(z.string()).nullable(),
  nutrition: z.object({ basis: z.string(), values: z.array(z.object({ name: z.string(), value: z.number(), unit: z.string() })) }).nullable(),
  storage: z.string().nullable(), shipping: shippingSchema.nullable(),
  weightGrams: z.number().positive().nullable(), available: z.boolean().nullable(), featured: z.boolean(),
  variants: z.array(z.object({ id: z.string().min(1), packSize: z.string().nullable(), sku: z.string().nullable(), price: money, compareAtPrice: money, available: z.boolean().nullable(), weightGrams: z.number().positive().nullable(), shipping: shippingSchema.nullable() })),
  relatedProducts: z.array(z.string()), seoTitle: z.string().nullable(), seoDescription: z.string().nullable(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  status: z.enum(['draft', 'review', 'published']),
  source: z.object({ reference: z.string(), raw: z.record(z.string(), z.unknown()), conflicts: z.array(z.object({ field: z.string(), values: z.array(z.string()), note: z.string() })) }),
}).superRefine((p, ctx) => {
  if (p.status === 'published' && p.source.conflicts.length) ctx.addIssue({ code: 'custom', message: 'Resolve source conflicts before publishing.' });
  if (new Set(p.variants.map(v => v.id)).size !== p.variants.length) ctx.addIssue({ code: 'custom', message: 'Variant IDs must be unique.' });
  if (p.subcategory && !categories.some(c => c.slug === p.subcategory && c.parent === p.category)) ctx.addIssue({ code: 'custom', message: 'Subcategory must belong to category.' });
});
export type Product = z.infer<typeof productSchema>;
