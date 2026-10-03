export type { ShippingRule } from '../lib/shipping-schema';
// Multi-product charging must be confirmed against the catalog before enabling.
export const shippingConfig: { combination: 'sum-lines' | null } = { combination: null };
