import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync,readFileSync } from 'node:fs';
import { productSchema } from '../src/lib/product-schema';
import { quoteCart } from '../src/lib/cart';
import { buildOrderMessage,validIndianPhone } from '../src/lib/whatsapp/order';
import { inCategory } from '../src/lib/taxonomy';
const products=readdirSync('src/content/products').filter(f=>f.endsWith('.json')).map(f=>productSchema.parse(JSON.parse(readFileSync(`src/content/products/${f}`,'utf8'))));
const item=(n:number,variantId:string|null=null,quantity=1)=>({productId:`fm-${String(n).padStart(2,'0')}`,variantId,quantity});
test('all 24 source entries have unique canonical pages and retained raw facts',()=>{
 assert.equal(products.length,24); assert.equal(new Set(products.map(p=>p.slug)).size,24);
 assert.deepEqual(products.map(p=>p.catalogNumber),Array.from({length:24},(_,i)=>i+1));
 const expected=[299,749,299,375,449,549,499,449,1075,499,799,599,699,375,249,649,649,999,949,1773,375,649,399,449];
 products.forEach((p,i)=>{assert.equal(p.source.raw.cardPricePaise,expected[i]!*100);assert.ok(p.sourceName);assert.ok(p.source.raw.description);assert.equal(p.available,null);assert.equal(p.allergens,null);assert.equal(p.nutrition,null);});
 assert.equal(products.reduce((n,p)=>n+p.variants.length,0),20);
 assert.deepEqual(products.filter(p=>p.sku).map(p=>p.sku),['DFMIX250','MED250','TAL1K','ECTAL1K']);
});
test('blueprint commercial mapping includes cross-listed bundles',()=>{
 const mapping:Record<string,number[]>={'seeds-nuts-snack-mixes':[1,2,3],breakfast:[4,14,16,17,18,19,21,22,23],muesli:[4,23],talbina:[14,16,17,21],'dates-date-sweets':[6,7,8,15],'dried-fruits-fruit-sweets':[5,10,12,13],'honey-dryfruits':[11,24],'combos-bundles':[2,9,18,19,20,22]};
 for(const [slug,numbers] of Object.entries(mapping)) assert.deepEqual(products.filter(p=>inCategory(p,slug)).map(p=>p.catalogNumber),numbers);
});
test('unresolved prices and incomplete bundles cannot become priced orders',()=>{
 assert.equal(quoteCart([item(7,'250g')],products).lines.length,0);
 assert.equal(quoteCart([item(7,'500g')],products).subtotal,84900);
 for(const n of [9,18,19,20]) assert.equal(quoteCart([item(n)],products).lines.length,0);
 assert.equal(quoteCart([item(4,'1000g')],products).lines.length,0);
});
test('source-supported shipping and ambiguous mixed-cart shipping',()=>{
 assert.equal(quoteCart([item(1),item(3,'250g')],products).shipping,4900);
 assert.equal(quoteCart([item(1,null,4)],products).shipping,null);
 assert.equal(quoteCart([item(5,'250g')],products).shipping,6000);
 assert.equal(quoteCart([item(5,'250g',2)],products).shipping,null);
 assert.equal(quoteCart([item(5,'1000g')],products).shipping,0);
 assert.equal(quoteCart([item(8,'250g')],products).shipping,null);
 assert.equal(quoteCart([item(15,'250g')],products).shipping,null);
 assert.equal(quoteCart([item(1),item(5,'250g')],products).shipping,null);
});
test('exact catalog promotions apply and are not extrapolated',()=>{
 assert.equal(quoteCart([item(4,'500g',2)],products).grandTotal,69900);
 assert.equal(quoteCart([item(4,'2x500g')],products).grandTotal,69900);
 assert.equal(quoteCart([item(4,'500g',3)],products).subtotal,112500);
 assert.equal(quoteCart([item(12,null,2)],products).subtotal,99800);
 assert.equal(quoteCart([item(13,null,2)],products).subtotal,119800);
});
test('checkout allows shipping confirmation, validates phone and preserves notes',()=>{
 const customer={name:'Test Customer',phone:'+91 98765 43210',address:'Test address',city:'Test city',state:'Test state',pinCode:'110001',note:'A & B + C'};
 const message=buildOrderMessage(customer,quoteCart([item(8,'250g')],products));
 assert.match(message,/NEW FIT MONK ORDER/);assert.match(message,/Shipping to be confirmed/);assert.doesNotMatch(message,/Grand Total/);assert.match(message,/A & B \+ C/);
 assert.ok(validIndianPhone('09876543210'));assert.ok(validIndianPhone('9876543210'));assert.equal(validIndianPhone('abcdefghij'),false);
 assert.throws(()=>buildOrderMessage({...customer,pinCode:'123'},quoteCart([item(1)],products)));
});
