import { z } from 'zod';

// All monetary amounts are integer paise. No default shipping rate is assumed.
export const shippingSchema = z.object({
  amount: z.number().int().nonnegative().nullable(),
  freeShippingThreshold: z.number().int().nonnegative().nullable(),
  freeShipping: z.boolean().nullable(),
  chargeBasis: z.enum(['per-unit', 'per-line']).nullable(),
  thresholdBasis: z.enum(['line', 'order']).nullable(),
  weightBands: z.array(z.object({ maxGrams: z.number().positive(), amount: z.number().int().nonnegative() })).nullable(),
  reviewNotes: z.array(z.string()),
  catalogMode: z.enum(['single-pack', 'order-under-1kg']).nullable().default(null),
});
export type ShippingRule = z.infer<typeof shippingSchema>;
