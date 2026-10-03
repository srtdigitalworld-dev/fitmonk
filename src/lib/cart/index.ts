import type { Product } from '../product-schema';
import type { ShippingRule } from '../../data/shipping';
import { shippingConfig } from '../../data/shipping';

export interface CartItem { productId: string; variantId: string | null; quantity: number }
export type CommerceProduct = Pick<Product, 'id' | 'name' | 'slug' | 'status' | 'available' | 'orderable' | 'price' | 'compareAtPrice' | 'packSize' | 'weightGrams' | 'shipping' | 'variants' | 'promotions'> & {thumbnail?: {src:string;alt:string}|null};
export interface CartLine extends CartItem { name: string; pack: string | null; unitPrice: number; lineTotal: number; discount: number; weightGrams: number | null; shipping: ShippingRule | null }
export interface CartQuote { lines: CartLine[]; subtotal: number; shipping: number | null; grandTotal: number | null; issues: string[]; shippingIssues: string[] }
const KEY = 'fitmonk.cart.v1';
const validQuantity = (n: number) => Number.isInteger(n) && n >= 1 && n <= 99;
const same = (a: CartItem, b: CartItem) => a.productId === b.productId && a.variantId === b.variantId;
export function addItem(items: CartItem[], item: CartItem): CartItem[] {
  if (!validQuantity(item.quantity)) throw new Error('Quantity must be between 1 and 99.');
  const existing = items.find(i => same(i, item));
  const quantity = (existing?.quantity ?? 0) + item.quantity;
  if (!validQuantity(quantity)) throw new Error('Maximum quantity is 99.');
  return existing ? items.map(i => same(i, item) ? { ...i, quantity } : i) : [...items, { ...item }];
}
export function setQuantity(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
  if (quantity === 0) return items.filter(i => !same(i, item));
  if (!validQuantity(quantity)) throw new Error('Quantity must be between 1 and 99.');
  return items.map(i => same(i, item) ? { ...i, quantity } : i);
}
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
export function loadCart(storage: StoragePort): { items: CartItem[]; error: string | null } {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return { items: [], error: null };
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.items) || data.items.length > 200) throw new Error();
    const items: CartItem[] = [];
    for (const i of data.items) {
      if (typeof i.productId !== 'string' || !i.productId || !(i.variantId === null || typeof i.variantId === 'string') || !validQuantity(i.quantity)) throw new Error();
      const item = { productId: i.productId, variantId: i.variantId, quantity: i.quantity };
      if (items.some(existing => same(existing, item))) throw new Error();
      items.push(item);
    }
    return { items, error: null };
  } catch { return { items: [], error: 'Saved cart could not be read. Please add your items again.' }; }
}
export function saveCart(storage: StoragePort, items: CartItem[]): string | null {
  try { storage.setItem(KEY, JSON.stringify({ version: 1, items })); return null; }
  catch { return 'Cart cannot be saved in this browser.'; }
}
export function quoteCart(items: CartItem[], products: CommerceProduct[], combination = shippingConfig.combination): CartQuote {
  const issues: string[] = []; const shippingIssues: string[] = []; const lines: CartLine[] = [];
  for (const item of items) {
    const p = products.find(p => p.id === item.productId && p.status !== 'draft');
    const variant = p?.variants.find(v => v.id === item.variantId);
    if (!p || !validQuantity(item.quantity) || (p.variants.length > 0 && !variant) || (item.variantId !== null && !variant)) { issues.push(`Invalid cart selection: ${item.productId}`); continue; }
    const selected = variant ?? p;
    if (p.available === false || selected.available === false || selected.price === null || !p.orderable) { issues.push(`Price, availability or contents need confirmation: ${p.name}`); continue; }
    const offer = p.promotions.find(o => o.variantId === item.variantId && o.quantity === item.quantity);
    const total = offer?.total ?? selected.price * item.quantity;
    const shipping = offer?.freeShipping ? { amount: 0, freeShipping: true, freeShippingThreshold: null, chargeBasis: null, thresholdBasis: null, weightBands: null, reviewNotes: [], catalogMode: null } satisfies ShippingRule : variant?.shipping ?? p.shipping;
    lines.push({ ...item, name: p.name, pack: selected.packSize, unitPrice: selected.price, discount: selected.price * item.quantity - total, lineTotal: total, weightGrams: selected.weightGrams, shipping });
  }
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  let shipping: number | null = 0;
  const sharedRate = lines[0]?.shipping?.amount;
  const sharedUnderKg = lines.length > 0 && sharedRate !== null && sharedRate !== undefined && lines.every(l => l.shipping?.catalogMode === 'order-under-1kg' && l.weightGrams !== null && l.shipping.amount === sharedRate);
  const orderWeight = lines.reduce((n,l) => n + (l.weightGrams ?? 0) * l.quantity, 0);
  for (const line of lines) {
    const rule = line.shipping;
    let amount: number | null = null;
    if (rule && !rule.reviewNotes.length && (rule.freeShipping === true || rule.freeShippingThreshold === null || rule.thresholdBasis !== null)) {
      const thresholdTotal = rule.thresholdBasis === 'order' ? subtotal : rule.thresholdBasis === 'line' ? line.lineTotal : null;
      if (rule.catalogMode === 'order-under-1kg') amount = sharedUnderKg && orderWeight < 1000 ? 0 : null;
      else if (rule.catalogMode === 'single-pack' && line.quantity !== 1) amount = null;
      else if (rule.freeShipping === true || (rule.freeShippingThreshold !== null && thresholdTotal !== null && thresholdTotal >= rule.freeShippingThreshold)) amount = 0;
      else if (rule.weightBands?.length) {
        if (line.weightGrams !== null) amount = [...rule.weightBands].sort((a,b) => a.maxGrams-b.maxGrams).find(b => line.weightGrams! * line.quantity <= b.maxGrams)?.amount ?? null;
      } else if (rule.amount !== null && rule.chargeBasis !== null) amount = rule.amount * (rule.chargeBasis === 'per-unit' ? line.quantity : 1);
    }
    if (amount === null) { shippingIssues.push(`Shipping to be confirmed: ${line.name}`); shipping = null; }
    else if (shipping !== null) shipping += amount;
  }
  if (sharedUnderKg && orderWeight < 1000) shipping = sharedRate!;
  if (lines.length > 1 && combination === null && shipping !== 0 && !sharedUnderKg) { shippingIssues.push('Combined shipping to be confirmed.'); shipping = null; }
  if (issues.length) shipping = null;
  return { lines, subtotal, shipping, grandTotal: shipping === null ? null : subtotal + shipping, issues, shippingIssues };
}
