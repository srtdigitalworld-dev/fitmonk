import { test } from 'node:test';
import assert from 'node:assert/strict';
import { productSchema } from '../src/lib/product-schema';
import { addItem, setQuantity, loadCart, saveCart, quoteCart } from '../src/lib/cart';
import { buildWhatsAppUrl } from '../src/lib/whatsapp/order';

// Synthetic fixture only; never included in the public catalog.
const product = productSchema.parse({ id: 'test', slug: 'test', name: 'Test & item', shortName: null, category: null, subcategory: null, description: null, images: [], price: 10001, compareAtPrice: null, currency: 'INR', packSize: 'Test pack', sku: null, ingredients: null, allergens: null, nutrition: null, storage: null, shipping: { amount: 5000, freeShippingThreshold: null, freeShipping: false, chargeBasis: 'per-line', thresholdBasis: null, weightBands: null, reviewNotes: [] }, weightGrams: 100, available: true, featured: false, variants: [], relatedProducts: [], seoTitle: null, seoDescription: null, status: 'published', source: { reference: 'test only', raw: {}, conflicts: [] } });
const item = { productId: 'test', variantId: null, quantity: 2 };
const customer = { name: 'Test & name', phone: '9999999999', address: 'Line 1\nLine 2', city: 'Test city', state: 'Test state', pinCode: '123456', note: 'A + B & C' };
test('integer pricing and quantity controls', () => {
  const items = addItem(addItem([], item), { ...item, quantity: 1 });
  assert.equal(items[0]?.quantity, 3);
  assert.equal(quoteCart(items, [product]).grandTotal, 35003);
  assert.deepEqual(setQuantity(items, item, 0), []);
  assert.throws(() => addItem(items, { ...item, quantity: 99 }));
  assert.throws(() => setQuantity(items, item, 1.5));
});
test('cart survives serialization; corrupt and denied storage are handled', () => {
  let value: string | null = null;
  const storage = { getItem: () => value, setItem: (_key: string, v: string) => { value = v; } };
  assert.equal(saveCart(storage, [item]), null);
  assert.deepEqual(loadCart(storage).items, [item]);
  value = '{broken'; assert.ok(loadCart(storage).error);
  assert.ok(saveCart({ ...storage, setItem: () => { throw new Error(); } }, [item]));
});
test('saved cart prices are not trusted and missing selections block orders', () => {
  assert.equal(quoteCart([item], [{ ...product, price: 20000 }]).subtotal, 40000);
  assert.equal(quoteCart([item], [{ ...product, available: false }]).grandTotal, null);
  assert.equal(quoteCart([{ ...item, variantId: 'missing' }], [product]).grandTotal, null);
});
test('unknown and conflicting shipping stays unknown', () => {
  assert.equal(quoteCart([item], [{ ...product, shipping: null }]).shipping, null);
  assert.equal(quoteCart([item], [{ ...product, shipping: { ...product.shipping!, freeShippingThreshold: 10000, thresholdBasis: null } }]).shipping, null);
  assert.equal(quoteCart([item], [{ ...product, shipping: { ...product.shipping!, reviewNotes: ['Conflicting rates'] } }]).grandTotal, null);
  assert.equal(quoteCart([item, { ...item, productId: 'other' }], [product, { ...product, id: 'other' }]).shipping, null);
});
test('shipping thresholds, per-unit charges and weight bands', () => {
  assert.equal(quoteCart([item], [{ ...product, shipping: { ...product.shipping!, chargeBasis: 'per-unit' } }]).shipping, 10000);
  assert.equal(quoteCart([item], [{ ...product, shipping: { ...product.shipping!, freeShippingThreshold: 20002, thresholdBasis: 'line' } }]).shipping, 0);
  const weighted = { ...product, shipping: { ...product.shipping!, weightBands: [{ maxGrams: 200, amount: 6000 }] } };
  assert.equal(quoteCart([item], [weighted]).shipping, 6000);
  assert.equal(quoteCart([{ ...item, quantity: 3 }], [weighted]).shipping, null);
});
test('variants resolve current price and override shipping', () => {
  const p = { ...product, variants: [{ id: 'large', packSize: 'Test large', sku: null, price: 30000, compareAtPrice: null, available: true, weightGrams: null, shipping: { ...product.shipping!, freeShipping: true } }] };
  assert.equal(quoteCart([item], [p]).grandTotal, null);
  assert.equal(quoteCart([{ ...item, variantId: 'large' }], [p]).grandTotal, 60000);
});
test('WhatsApp encoding preserves multiline text and symbols', () => {
  const quote = quoteCart([item], [product]);
  const url = new URL(buildWhatsAppUrl(customer, quote, '919999999999'));
  assert.equal(url.hostname, 'wa.me');
  assert.match(url.searchParams.get('text')!, /A \+ B & C/);
  assert.match(url.searchParams.get('text')!, /Line 1\nLine 2/);
  assert.throws(() => buildWhatsAppUrl(customer, quote, null));
  const pending = new URL(buildWhatsAppUrl(customer, quoteCart([item], [{ ...product, shipping: null }]), '919999999999')).searchParams.get('text')!;
  assert.match(pending, /Shipping\s+To be confirmed/);
  assert.doesNotMatch(pending, /Grand Total:/);
});
test('source conflicts prevent publishing and unknown facts remain null', () => {
  assert.equal(product.allergens, null);
  assert.equal(productSchema.safeParse({ ...product, source: { ...product.source, conflicts: [{ field: 'price', values: ['10', '20'], note: 'Review' }] } }).success, false);
});
