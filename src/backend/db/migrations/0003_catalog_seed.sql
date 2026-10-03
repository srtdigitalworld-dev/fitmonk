-- FIT MONK CATALOG SEED MIGRATION (26 Products)

-- Auto-generated from existing content collections without data loss



-- Categories

INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('seeds-nuts-snack-mixes', 'seeds-nuts-snack-mixes', 'Seeds, Nuts & Snack Mixes', NULL, 0);

INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('breakfast', 'breakfast', 'Breakfast', NULL, 0);

INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('muesli', 'muesli', 'Muesli', 'breakfast', 0);

INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('talbina', 'talbina', 'Talbina', 'breakfast', 0);

INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('dates-date-sweets', 'dates-date-sweets', 'Dates & Date Sweets', NULL, 0);

INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('dried-fruits-fruit-sweets', 'dried-fruits-fruit-sweets', 'Dried Fruits & Fruit Sweets', NULL, 0);

INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('honey-dryfruits', 'honey-dryfruits', 'Honey Dryfruits', NULL, 0);

INSERT OR REPLACE INTO categories (id, slug, name, parent_id, sort_order) VALUES ('combos-bundles', 'combos-bundles', 'Combos & Bundles', NULL, 0);



-- Products

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-01',
  1,
  'roasted-dryfruits-seeds-mix-250g',
  'Roasted Dryfruits and Seeds Mix – 250g',
  'Roasted dryfruits and seeds mix 250g',
  'Roasted Dryfruits and Seeds Mix – 250g',
  NULL,
  'seeds-nuts-snack-mixes',
  NULL,
  'Fit Monk Roasted Dryfruits and Seeds Mix is a crunchy snack blend of roasted cashew nuts, almonds, mixed seeds, and dehydrated fruits. Packed in a 250g pouch, this dry fruit and seed mix provides a ready-to-eat option for daily pantry snacking or topping breakfast bowls.',
  29900,
  39900,
  'INR',
  '250g',
  'DFMIX250',
  250,
  '["Roasted cashew nuts","Almonds","Seeds","Dehydrated fruits"]',
  NULL,
  NULL,
  NULL,
  'This is 250g pack of Dry fruits likes roasted cashew, almonds, Seeds and dehydrated fruits. + ₹49 shipping on orders under 1 kg. Code: DFMIX250.',
  'review',
  1,
  1,
  1,
  'product',
  'seeds-and-mixes',
  'Roasted Dryfruits and Seeds Mix – 250g | Fit Monk',
  'Buy Fit Monk Roasted Dryfruits and Seeds Mix 250g online. A crunchy mix of roasted cashew nuts, almonds, seeds and dehydrated fruits. Order via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 1, item 1","raw":{"sourceName":"Roasted dryfruits and seeds mix 250g","cardPricePaise":29900,"compareAtPricePaise":39900,"description":"This is 250g pack of Dry fruits likes roasted cashew, almonds, Seeds and dehydrated fruits. + ₹49 shipping on orders under 1 kg. Code: DFMIX250.","text":"Roasted dryfruits and seeds mix 250g\n₹299.00   (was ₹399.00)\nThis  is  250g  pack  of  Dry  fruits  likes  roasted  cashew,  almonds,  Seeds  and\ndehydrated fruits. + ₹49 shipping on orders under 1 kg. Code: DFMIX250.","imageReview":"Catalog artwork contains unverified nutrition/health claims; withheld from display pending review.","catalogImages":[{"src":"/images/products/catalog-1-960.webp","alt":"Roasted Dryfruits and Seeds Mix — catalog image","width":470,"height":569,"sources":[{"src":"/images/products/catalog-1-320.webp","width":320},{"src":"/images/products/catalog-1-960.webp","width":470}]}]},"conflicts":[]}',
  '[{"question":"What ingredients are in the Roasted Dryfruits and Seeds Mix?","answer":"According to the Fit Monk catalog, this 250g mix includes roasted cashew nuts, almonds, mixed seeds, and dehydrated fruits."},{"question":"How is this mix packaged and shipped?","answer":"It comes in a 250g sealed pouch. The catalog lists a ₹49 delivery charge for orders under 1kg."},{"question":"How does this compare with the 5 Seeds Mix?","answer":"The Roasted Dryfruits and Seeds Mix contains roasted nuts and dehydrated fruits in addition to seeds, whereas the 5 Seeds Mix consists entirely of five whole seeds."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-02',
  2,
  'power-snacks-combo',
  'Power Snacks Combo – 750g',
  'Power snacks Comho 750g',
  'Power Snacks Combo – 750g',
  NULL,
  'combos-bundles',
  NULL,
  'The Fit Monk Power Snacks Combo is a 750g snack bundle containing three separate 250g packs: one pack of Roasted Dry Fruits & Seeds Mix, one pack of Dehydrated Fruits Cocktail, and one pack of 5 Seeds Mix. This combination provides a variety of seeds, roasted nuts, and dried fruit snacks for the home or office pantry.',
  74900,
  89900,
  'INR',
  '750g',
  NULL,
  750,
  NULL,
  NULL,
  NULL,
  NULL,
  'This combo contains 1. Roasted dry fruits and Seeds mix 250g, 2. 6 Dehydrated fruits cocktail 250g, 3. 5 Seeds mix 250g. + ₹49 shipping on orders under 1 kg.',
  'review',
  1,
  0,
  1,
  'bundle',
  'labels-allergens-and-storage',
  'Power Snacks Combo – 750g | Fit Monk',
  'Shop the Fit Monk Power Snacks Combo 750g featuring Roasted Dryfruits & Seeds Mix (250g), Dehydrated Fruits Cocktail (250g), and 5 Seeds Mix (250g). Order online.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 1, item 2","raw":{"sourceName":"Power snacks Comho 750g","cardPricePaise":74900,"compareAtPricePaise":89900,"description":"This combo contains 1. Roasted dry fruits and Seeds mix 250g, 2. 6 Dehydrated fruits cocktail 250g, 3. 5 Seeds mix 250g. + ₹49 shipping on orders under 1 kg.","text":"Power snacks Comho 750g\n₹749.00   (was ₹899.00)\nThis  combo  contains  1.  Roasted  dry  fruits  and  Seeds  mix  250g,  2.  6\nDehydrated  fruits  cocktail  250g,  3.  5  Seeds  mix  250g.  +  ₹49  shipping  on\norders under 1 kg.","imageReview":"Catalog artwork contains unverified nutrition/health claims; withheld from display pending review.","catalogImages":[{"src":"/images/products/catalog-2-960.webp","alt":"Power Snacks Combo — catalog image","width":455,"height":567,"sources":[{"src":"/images/products/catalog-2-320.webp","width":320},{"src":"/images/products/catalog-2-960.webp","width":455}]}]},"conflicts":[]}',
  '[{"question":"What packs are included in the Power Snacks Combo?","answer":"The 750g combo includes three 250g packs: Roasted Dry Fruits and Seeds Mix (250g), Dehydrated Fruits Cocktail (250g), and 5 Seeds Mix (250g)."},{"question":"What is the total weight and shipping of this combo?","answer":"The total weight is 750g. Orders under 1kg carry a catalog shipping charge of ₹49."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-03',
  3,
  'five-seeds-mix',
  '5 Seeds Mix – 250g',
  '5 seeds mix 250g',
  '5 Seeds Mix – 250g',
  NULL,
  'seeds-nuts-snack-mixes',
  NULL,
  'Fit Monk 5 Seeds Mix is a balanced blend of five named whole seeds: flax seeds, watermelon seeds, pumpkin seeds, muskmelon seeds, and sunflower seeds, combined in equal proportions. Available in 250g, 500g, and 1000g packs, this mixed seeds blend is suited for everyday eating, smoothies, salads, and breakfast bowls.',
  29900,
  34900,
  'INR',
  '250g',
  NULL,
  250,
  '["Flax seeds","Watermelon seeds","Pumpkin seeds","Muskmelon seeds","Sunflower seeds"]',
  NULL,
  NULL,
  NULL,
  'This 5 seeds mix has flax seeds, watermelon seeds, pumpkin seeds, muskmelon seeds and sunflower seeds. All seeds are equally mixed. Beneficial for health, full of nutritions. 250g: 299+49, 500g: 499+49, 1000g: 899+0. + ₹49 shipping on orders under 1 kg.',
  'review',
  1,
  1,
  1,
  'product',
  'seeds-and-mixes',
  '5 Seeds Mix – 250g | Fit Monk',
  'Buy Fit Monk 5 Seeds Mix 250g online. A blend of flax, watermelon, pumpkin, muskmelon, and sunflower seeds mixed in equal proportions. Order via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 1, item 3","raw":{"sourceName":"5 seeds mix 250g","cardPricePaise":29900,"compareAtPricePaise":34900,"description":"This 5 seeds mix has flax seeds, watermelon seeds, pumpkin seeds, muskmelon seeds and sunflower seeds. All seeds are equally mixed. Beneficial for health, full of nutritions. 250g: 299+49, 500g: 499+49, 1000g: 899+0. + ₹49 shipping on orders under 1 kg.","text":"5 seeds mix 250g\n₹299.00   (was ₹349.00)\nThis  5  seeds  mix  has  flax  seeds,  watermelon  seeds,  pumpkin  seeds,\nmuskmelon  seeds  and  sunflower  seeds.  All  seeds  are  equally  mixed.\nBeneficial for health, full of nutritions. 250g: 299+49, 500g: 499+49, 1000g:\n899+0. + ₹49 shipping on orders under 1 kg.","imageReview":"Catalog artwork contains unverified nutrition/health claims; withheld from display pending review.","catalogImages":[{"src":"/images/products/catalog-3-960.webp","alt":"5 Seeds Mix — catalog image","width":457,"height":570,"sources":[{"src":"/images/products/catalog-3-320.webp","width":320},{"src":"/images/products/catalog-3-960.webp","width":457}]}]},"conflicts":[]}',
  '[{"question":"Which five seeds are included in this mix?","answer":"Fit Monk 5 Seeds Mix contains flax seeds, watermelon seeds, pumpkin seeds, muskmelon seeds, and sunflower seeds, blended in equal proportions."},{"question":"What pack sizes are available for 5 Seeds Mix?","answer":"It is offered in 250g, 500g, and 1000g (1kg) packs. Orders of the 1kg pack include free catalog shipping."},{"question":"How can 5 Seeds Mix be used daily?","answer":"It can be eaten as a plain seed snack, sprinkled over oatmeal, muesli, or yogurt, or blended into morning smoothies."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-04',
  4,
  'dryfruits-seeds-fruits-muesli',
  'Fit Monk Dryfruits, Seeds & Fruits Muesli – 500g',
  '500g Fit Monk Dryfruits Seeds and Fruits Super Muesli | 1000g',
  'Fit Monk Dryfruits, Seeds & Fruits Muesli – 500g',
  NULL,
  'breakfast',
  'muesli',
  'Fit Monk Dryfruits, Seeds and Fruits Muesli is a breakfast cereal combining grains with dried fruits, nuts, and seeds. Available in a 500g pack with multi-pack savings (buy two 500g packs for ₹699 with free shipping), it serves as a ready-to-eat breakfast with warm or cold milk, curd, or yogurt.',
  37500,
  37600,
  'INR',
  '500g',
  NULL,
  500,
  NULL,
  NULL,
  NULL,
  NULL,
  '500g: 375+49. DISCOUNT: BUY 2 X 500g and get 51 discount with free shipping (Price: 699). BUY 3 X 500g and more.',
  'review',
  1,
  0,
  1,
  'product',
  'muesli-breakfast',
  'Fit Monk Dryfruits, Seeds & Fruits Muesli – 500g | Fit Monk',
  'Order Fit Monk Dryfruits, Seeds & Fruits Muesli 500g. Wholesome breakfast muesli with dried fruits and seeds. Multi-pack offers available with direct delivery.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 1, item 4","raw":{"sourceName":"500g Fit Monk Dryfruits Seeds and Fruits Super Muesli | 1000g","cardPricePaise":37500,"compareAtPricePaise":37600,"description":"500g: 375+49. DISCOUNT: BUY 2 X 500g and get 51 discount with free shipping (Price: 699). BUY 3 X 500g and more.","text":"500g  Fit  Monk  Dryfruits  Seeds  and  Fruits  Super  Muesli  |\n1000g\n₹375.00   (was ₹376.00)\n500g:  375+49.  DISCOUNT:  BUY  2  X  500g  and  get  51  discount  with  free\nshipping (Price: 699). BUY 3 X 500g and more."},"conflicts":[]}',
  '[{"question":"How is Fit Monk Dryfruits, Seeds and Fruits Muesli served?","answer":"It can be served with cold or warm milk, stirred into curd or yogurt, or soaked overnight as an overnight muesli bowl."},{"question":"Are there multi-pack discount offers on this muesli?","answer":"Yes, the catalog features an offer to buy two 500g packs (1000g total) for ₹699 with free shipping."}]',
  '[{"variantId":"500g","quantity":2,"total":69900,"freeShipping":true}]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-05',
  5,
  'turkish-anjeer',
  'Turkish Anjeer – 250g',
  'Turkish anjeer | 250g',
  'Turkish Anjeer – 250g',
  NULL,
  'dried-fruits-fruit-sweets',
  NULL,
  'Fit Monk Turkish Anjeer offers whole dried figs sourced from Turkey, selected for their naturally sweet taste, round shape, and chewy texture. Available in 250g, 500g, and 1000g packs, these dried figs can be enjoyed as a dry fruit snack or soaked in clean water overnight for traditional consumption.',
  44900,
  NULL,
  'INR',
  '250g',
  NULL,
  250,
  NULL,
  NULL,
  NULL,
  NULL,
  'Turkish anjeer 250g: 449 + 60 shipping, 500g: 849 + 60 shipping, 1000g: 1575 + free shipping.',
  'review',
  1,
  1,
  1,
  'product',
  'anjeer-and-dried-fruits',
  'Turkish Anjeer – 250g | Fit Monk',
  'Buy authentic Turkish Anjeer 250g online from Fit Monk. Premium whole dried figs available in 250g, 500g, and 1kg packs. Fast order confirmation via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 2, item 5","raw":{"sourceName":"Turkish anjeer | 250g","cardPricePaise":44900,"compareAtPricePaise":null,"description":"Turkish anjeer 250g: 449 + 60 shipping, 500g: 849 + 60 shipping, 1000g: 1575 + free shipping.","text":"Turkish anjeer | 250g\n₹449.00\nTurkish  anjeer  250g:  449  +  60  shipping,  500g:  849  +  60  shipping,  1000g:\n1575 + free shipping."},"conflicts":[]}',
  '[{"question":"What is anjeer?","answer":"Anjeer is the traditional Hindi and Persian term for the common fig (Ficus carica), widely enjoyed dried as a nutritious pantry fruit."},{"question":"How are Turkish dried figs typically eaten?","answer":"They can be eaten as a chewy snack directly from the pack, soaked in water overnight, or chopped into desserts, porridge, and fruit salads."},{"question":"What pack sizes are available?","answer":"Available in 250g, 500g, and 1000g packs. The 1000g pack includes free catalog shipping."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-06',
  6,
  'omani-barfi',
  'Omani Dates Arabic Barfi – 500g',
  'Omani barfi — Premium Dates Arabic barfi | 500g',
  'Omani Dates Arabic Barfi – 500g',
  NULL,
  'dates-date-sweets',
  NULL,
  'Fit Monk Omani Dates Arabic Barfi is a rich date-and-nut confection prepared with chopped dates, mixed nuts, and pure clarified butter (desi ghee). Packed in a 500g box, this traditional Arabic-style khajoor barfi offers a dense, chewy sweet suited for festive gifting, celebrations, and after-meal desserts.',
  54900,
  55000,
  'INR',
  '500g',
  NULL,
  500,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'dates-and-khajoor',
  'Omani Dates Arabic Barfi – 500g | Fit Monk',
  'Buy Fit Monk Omani Dates Arabic Barfi 500g. Traditional Arabic date sweet made with chopped dates, mixed nuts, and desi ghee. Easy WhatsApp ordering.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 2, item 6","raw":{"sourceName":"Omani barfi — Premium Dates Arabic barfi | 500g","cardPricePaise":54900,"compareAtPricePaise":55000,"description":"Dates barfi in desi ghee and nuts is a decadent Arabic sweet made with chopped dates, nuts, and clarified butter.","text":"Omani barfi — Premium Dates Arabic barfi | 500g\n₹549.00   (was ₹550.00)\nDates  barfi  in  desi  ghee  and  nuts  is  a  decadent  Arabic  sweet  made  with\nchopped dates, nuts, and clarified butter."},"conflicts":[]}',
  '[{"question":"What ingredients are used in Omani Barfi?","answer":"The catalog specifies that this Arabic sweet is made with chopped dates, mixed nuts, and clarified butter (desi ghee)."},{"question":"What occasions is Omani Dates Barfi suited for?","answer":"With its rich date-and-ghee composition, it is commonly chosen for festive gifting, family celebrations, Ramadan iftar, and everyday sweet treats."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-07',
  7,
  'ajwa-dates',
  'Saudi Ajwa Dates – 250g',
  '250g Saudi Ajwa Dates Premium',
  'Saudi Ajwa Dates – 250g',
  NULL,
  'dates-date-sweets',
  NULL,
  'Fit Monk Saudi Ajwa Dates are celebrated dark dates renowned for their soft texture, fine wrinkled skin, and gentle sweetness. Sourced from Saudi Arabia and available in 250g, 500g, and 1kg pack options, these Ajwa khajoor dates are popular for daily eating, gifting, and Ramadan fasting.',
  0,
  NULL,
  'INR',
  '250g',
  NULL,
  250,
  NULL,
  NULL,
  NULL,
  NULL,
  'Saudi Ajwa Premium Dates | 250g: 449 + 60 shipping, 500g: 849 + 60 shipping, 1000g: 1550.',
  'review',
  1,
  0,
  1,
  'product',
  'dates-and-khajoor',
  'Saudi Ajwa Dates – 250g | Fit Monk',
  'Buy genuine Saudi Ajwa Dates 250g from Fit Monk. Soft, dark Ajwa khajoor available in 250g, 500g, and 1kg packs. Simple, direct ordering via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 2, item 7","raw":{"sourceName":"250g Saudi Ajwa Dates Premium","cardPricePaise":49900,"compareAtPricePaise":null,"description":"Saudi Ajwa Premium Dates | 250g: 449 + 60 shipping, 500g: 849 + 60 shipping, 1000g: 1550.","text":"250g Saudi Ajwa Dates Premium\n₹499.00\nSaudi  Ajwa  Premium  Dates  |  250g:  449  +  60  shipping,  500g:  849  +  60\nshipping, 1000g: 1550."},"conflicts":[{"field":"price:250g","values":["₹499 card","₹449 description"],"note":"Do not select either price without confirmation."}]}',
  '[{"question":"What makes Ajwa dates distinctive?","answer":"Ajwa dates are known for their dark brown to black color, fine wrinkled texture, soft bite, and mild, fruity sweetness."},{"question":"What pack options are listed for Saudi Ajwa Dates?","answer":"The catalog lists 250g, 500g, and 1000g packs. The 250g price is subject to final seller confirmation."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-08',
  8,
  'medjool-dates',
  'Medjool Dates – 250g',
  '250g Jordon Medjool Dates',
  'Medjool Dates – 250g',
  NULL,
  'dates-date-sweets',
  NULL,
  'Fit Monk Medjool Dates are prized large-sized dates known for their succulent, caramel-like sweetness and tender, fleshy pulp. Listed in the catalog with 250g, 500g, and 1kg options, these Medjool khajoor dates make an indulgent everyday treat, baking ingredient, or thoughtful gift.',
  44900,
  49900,
  'INR',
  '250g',
  'MED250',
  250,
  NULL,
  NULL,
  NULL,
  NULL,
  'Premium Mejdool Dates | Free Shipping. 250g: 449+60 shipping, 500g: 849+60 shipping, 1000g: 1550. Code: MED250.',
  'review',
  1,
  0,
  1,
  'product',
  'dates-and-khajoor',
  'Medjool Dates – 250g | Fit Monk',
  'Order large, succulent Medjool Dates 250g from Fit Monk. Tender texture and caramel sweetness, available in 250g, 500g, and 1kg packs. WhatsApp ordering.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 2, item 8","raw":{"sourceName":"250g Jordon Medjool Dates","cardPricePaise":44900,"compareAtPricePaise":49900,"description":"Premium Mejdool Dates | Free Shipping. 250g: 449+60 shipping, 500g: 849+60 shipping, 1000g: 1550. Code: MED250.","text":"250g Jordon Medjool Dates\n₹449.00   (was ₹499.00)\nPremium  Mejdool  Dates  |  Free  Shipping.  250g:  449+60  shipping,  500g:\n849+60 shipping, 1000g: 1550. Code: MED250."},"conflicts":[{"field":"shipping","values":["Free Shipping","250g/500g + ₹60"],"note":"Shipping to be confirmed."}]}',
  '[{"question":"How do Medjool dates taste and feel?","answer":"Medjool dates are distinctly large with a soft, moist flesh and a rich, honey-caramel flavor profile."},{"question":"Why was the catalog name normalized?","answer":"The catalog lists \"Jordon Medjool Dates\", which represents Jordan Medjool dates. We normalize the title while retaining the catalog reference for full traceability."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-09',
  9,
  'health-combo',
  'Health Combo – 1500g',
  '1500g Health Combo',
  'Health Combo – 1500g',
  NULL,
  'combos-bundles',
  NULL,
  'The Fit Monk Health Combo is a 1500g multi-product breakfast and snack bundle. Confirmed components include 500g of Fit Monk Dryfruits Muesli and 500g of Fit Monk Honey Dryfruits, providing both morning breakfast cereal and honey-coated nuts. Remaining pack contents are subject to seller confirmation.',
  107500,
  119900,
  'INR',
  '1500g',
  NULL,
  1500,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  0,
  'bundle',
  'labels-allergens-and-storage',
  'Health Combo – 1500g | Fit Monk',
  'Fit Monk Health Combo 1500g bundle featuring 500g Dryfruits Muesli and 500g Honey Dryfruits. Inquire with seller via WhatsApp for full bundle details.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 3, item 9","raw":{"sourceName":"1500g Health Combo","cardPricePaise":107500,"compareAtPricePaise":119900,"description":"From 1 April, it''s for 1075. It contains 500g of FIT MONK muesli, 500g of FIT MONK Honey dryfruits and more.","text":"1500g Health Combo\n₹1,075.00   (was ₹1,199.00)\nFrom 1 April, it''s for 1075. It contains 500g of FIT MONK muesli, 500g of FIT\nMONK Honey dryfruits and more."},"conflicts":[]}',
  '[{"question":"What confirmed products are in the Health Combo?","answer":"The catalog confirms 500g of Fit Monk Muesli and 500g of Fit Monk Honey Dryfruits within the 1500g total weight."},{"question":"Why is this combo inquiry-only?","answer":"Because the catalog states \"and more\" for the remaining component weight, we recommend confirming the exact contents directly with the seller before ordering."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-10',
  10,
  'dried-fruits-cocktail',
  'Dried Fruits Cocktail – 500g',
  'Dried Fruits Cocktail, 500g',
  'Dried Fruits Cocktail – 500g',
  NULL,
  'dried-fruits-fruit-sweets',
  NULL,
  'Fit Monk Dried Fruits Cocktail is a colorful medley of diced, dehydrated fruits offering a naturally sweet, chewy fruit snack. Available in 500g and 1kg packs, this fruit blend can be eaten directly as a sweet snack or mixed into oatmeal, muesli, yogurt, and festive baked dishes.',
  49900,
  NULL,
  'INR',
  '500g',
  NULL,
  500,
  NULL,
  NULL,
  NULL,
  NULL,
  'Dried fruits cocktail for kids and young ones, one kg is for 849 free shipping.',
  'review',
  1,
  1,
  1,
  'product',
  'anjeer-and-dried-fruits',
  'Dried Fruits Cocktail – 500g | Fit Monk',
  'Buy Fit Monk Dried Fruits Cocktail 500g. A delicious mix of dehydrated fruits in 500g and 1kg packs. Convenient order confirmation via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 3, item 10","raw":{"sourceName":"Dried Fruits Cocktail, 500g","cardPricePaise":49900,"compareAtPricePaise":null,"description":"Dried fruits cocktail for kids and young ones, one kg is for 849 free shipping.","text":"Dried Fruits Cocktail, 500g\n₹499.00\nDried fruits cocktail for kids and young ones, one kg is for 849 free shipping."},"conflicts":[]}',
  '[{"question":"What is in the Dried Fruits Cocktail?","answer":"It contains a blend of diced dehydrated fruits, offering a sweet and chewy snack suitable for toppings and baking."},{"question":"What pack sizes are available?","answer":"It is offered in 500g and 1000g (1kg) packs. The 1kg pack includes free catalog shipping."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-11',
  11,
  'dry-fruits-dipped-in-honey-950g',
  'Dry Fruits Dipped in Honey – 950g',
  'Dry fruits dipped in honey 950g',
  'Dry Fruits Dipped in Honey – 950g',
  NULL,
  'honey-dryfruits',
  NULL,
  'Fit Monk Dry Fruits Dipped in Honey features a selection of whole dry fruits and crunchy seeds steeped in pure Kashmiri honey. Packed in a generous 950g jar, this honey-nut mix offers a sweet, wholesome treat for spooning over desserts, spreading on warm toast, or enjoying straight from the jar.',
  79900,
  NULL,
  'INR',
  '950g',
  NULL,
  950,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'honey-dryfruits',
  'Dry Fruits Dipped in Honey – 950g | Fit Monk',
  'Order Fit Monk Dry Fruits Dipped in Honey 950g. Wholesome mixed dry fruits and seeds steeped in Kashmiri honey. Easy WhatsApp ordering and delivery.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 3, item 11","raw":{"sourceName":"Dry fruits dipped in honey 950g","cardPricePaise":79900,"compareAtPricePaise":null,"description":"Acts as a natural energy booster. Dry fruits and seeds dipped in Kashmiri honey is a delicious and nutritious treat.","text":"Dry fruits dipped in honey 950g\n₹799.00\nActs  as  a  natural  energy  booster.  Dry  fruits  and  seeds  dipped  in  Kashmiri\nhoney is a delicious and nutritious treat."},"conflicts":[]}',
  '[{"question":"What type of honey is used?","answer":"The catalog states that dry fruits and seeds are dipped in genuine Kashmiri honey."},{"question":"Is this product suitable for infants?","answer":"No. In accordance with public health guidance (such as CDC guidelines), honey should never be given to infants under 12 months of age."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-12',
  12,
  'dates-dry-fruits-punch',
  'Dates Dry Fruits Punch – 450g',
  'DATES DRY FRUITS PUNCH | 450g',
  'Dates Dry Fruits Punch – 450g',
  NULL,
  'dried-fruits-fruit-sweets',
  NULL,
  'Fit Monk Dates Dry Fruits Punch is an artisanal Indian sweet snack crafted from roasted nuts bound together with rich, natural dates. Sliced into ready-to-eat squares in a 450g pack, this date punch offers a firm, chewy texture and nutty flavor without relying on artificial fillers.',
  59900,
  60000,
  'INR',
  '450g',
  NULL,
  450,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'anjeer-and-dried-fruits',
  'Dates Dry Fruits Punch – 450g | Fit Monk',
  'Buy Fit Monk Dates Dry Fruits Punch 450g. Roasted nuts bound with rich dates into an Indian sweet roll. Multi-pack offers available via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 3, item 12","raw":{"sourceName":"DATES DRY FRUITS PUNCH | 450g","cardPricePaise":59900,"compareAtPricePaise":60000,"description":"Get 200 off on two packs. Short and Sweet: Dates Punch — a guilt-free delight of roasted nuts bound together.","text":"DATES DRY FRUITS PUNCH | 450g\n₹599.00   (was ₹600.00)\nGet  200  off  on  two  packs.  Short  and  Sweet:  Dates  Punch  —  a  guilt-free\ndelight of roasted nuts bound together."},"conflicts":[]}',
  '[{"question":"What does \"punch\" mean in this product?","answer":"In Indian confectionery and the Fit Monk catalog, \"punch\" refers to a solid, sliced sweet block made of roasted nuts bound with fruit paste (dates), not a beverage."},{"question":"Is there a multi-pack discount?","answer":"Yes, the catalog notes an offer of ₹200 off when ordering two packs."}]',
  '[{"variantId":null,"quantity":2,"total":99800,"freeShipping":false}]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-13',
  13,
  'anjeer-dryfruits-punch',
  'Anjeer Dryfruits Punch – 450g',
  'ANJEER DRYFRUITS PUNCH | 450 G',
  'Anjeer Dryfruits Punch – 450g',
  NULL,
  'dried-fruits-fruit-sweets',
  NULL,
  'Fit Monk Anjeer Dryfruits Punch combines dried figs (anjeer) and assorted dry fruits into a dense, chewy sweet confection. Prepared in a 450g pack with a ₹200 discount offer when buying two packs, this traditional fig punch delivers authentic nutty flavour and distinctive fig crunch.',
  69900,
  70000,
  'INR',
  '450g',
  NULL,
  450,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'anjeer-and-dried-fruits',
  'Anjeer Dryfruits Punch – 450g | Fit Monk',
  'Buy Fit Monk Anjeer Dryfruits Punch 450g. Traditional fig and nut confection offering rich, chewy sweetness. Enjoy multi-pack savings via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 4, item 13","raw":{"sourceName":"ANJEER DRYFRUITS PUNCH | 450 G","cardPricePaise":69900,"compareAtPricePaise":70000,"description":"Get 200 off on 2 packs. Anjeer Punch: a guilt-free delight. Indulge in the rich, nutty flavor of anjeer and dry fruits.","text":"ANJEER DRYFRUITS PUNCH | 450 G\n₹699.00   (was ₹700.00)\nGet 200 off on 2 packs. Anjeer Punch: a guilt-free delight. Indulge in the rich,\nnutty flavor of anjeer and dry fruits."},"conflicts":[]}',
  '[{"question":"What ingredients are highlighted in Anjeer Punch?","answer":"The catalog highlights the rich, nutty flavor of dried figs (anjeer) combined with assorted dry fruits bound into a sweet roll format."},{"question":"How does it differ from Dates Punch?","answer":"Anjeer Punch is led by dried figs which provide a characteristic fig crunch, whereas Dates Punch uses a base of dates."}]',
  '[{"variantId":null,"quantity":2,"total":119800,"freeShipping":false}]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-14',
  14,
  'badaam-elaichi-talbina-500g',
  'Badam Elaichi Talbina – 500g',
  '500g Badaam Elaichi Talbina',
  'Badam Elaichi Talbina – 500g',
  NULL,
  'breakfast',
  'talbina',
  'Fit Monk Badam Elaichi Talbina is a traditional barley porridge powder infused with fragrant cardamom (elaichi) and crushed almonds (badam). Packaged in a 500g pouch, this wholesome barley porridge is prepared by simmering with milk or water, traditionally sweetened with pure honey for a soothing morning breakfast.',
  37500,
  NULL,
  'INR',
  '500g',
  NULL,
  500,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'talbina',
  'Badam Elaichi Talbina – 500g | Fit Monk',
  'Buy Fit Monk Badam Elaichi Talbina 500g. Soothing barley porridge powder with cardamom and crushed almonds. Order online with WhatsApp confirmation.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 4, item 14","raw":{"sourceName":"500g Badaam Elaichi Talbina","cardPricePaise":37500,"compareAtPricePaise":null,"description":"Talbina is a warm and nourishing porridge made with barley, milk, and typically sweetened with honey.","text":"500g Badaam Elaichi Talbina\n₹375.00\nTalbina  is  a  warm  and  nourishing  porridge  made  with  barley,  milk,  and\ntypically sweetened with honey."},"conflicts":[]}',
  '[{"question":"What is Talbina?","answer":"Talbina is a traditional warm and nourishing porridge made with ground whole barley, gently cooked with milk or water, and typically sweetened with honey."},{"question":"Does Talbina contain gluten?","answer":"Yes, barley is a gluten-containing grain. People with celiac disease or gluten intolerance should not consume barley porridge."},{"question":"How is Badam Elaichi Talbina prepared?","answer":"Stir the powder into cold milk or water, bring to a gentle simmer while stirring, and cook until thick and creamy before sweetening to taste."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-15',
  15,
  'kalmi-dates',
  'Kalmi Dates – 250g',
  '250g Kalmi Dates',
  'Kalmi Dates – 250g',
  NULL,
  'dates-date-sweets',
  NULL,
  'Fit Monk Kalmi Dates (often recognized as Safawi dates) are dark, cylindrical dates from Saudi Arabia known for their pleasantly chewy texture and balanced sweetness. Available in 250g, 500g, and 1kg packs, these Kalmi khajoor dates are well-suited for everyday snacking, breaking fasts, and family sharing.',
  24900,
  NULL,
  'INR',
  '250g',
  NULL,
  250,
  NULL,
  NULL,
  NULL,
  NULL,
  'Saudi Kalmi dates, free shipping. 250g: 249 + 60 shipping, 500g: 449 + 60 shipping, 1000g: 849.',
  'review',
  1,
  0,
  1,
  'product',
  'dates-and-khajoor',
  'Kalmi Dates – 250g | Fit Monk',
  'Order Saudi Kalmi Dates 250g from Fit Monk. Dark, chewy Kalmi khajoor dates available in 250g, 500g, and 1kg packs. Fast ordering via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 4, item 15","raw":{"sourceName":"250g Kalmi Dates","cardPricePaise":24900,"compareAtPricePaise":null,"description":"Saudi Kalmi dates, free shipping. 250g: 249 + 60 shipping, 500g: 449 + 60 shipping, 1000g: 849.","text":"250g Kalmi Dates\n₹249.00\nSaudi Kalmi dates, free shipping. 250g: 249 + 60 shipping, 500g: 449 + 60\nshipping, 1000g: 849."},"conflicts":[{"field":"shipping","values":["free shipping","250g/500g + ₹60"],"note":"Shipping to be confirmed."}]}',
  '[{"question":"What are Kalmi dates?","answer":"Kalmi dates are a popular dark, medium-sized date variety from Saudi Arabia (frequently known in markets as Safawi), prized for their firm chew and moderate sweetness."},{"question":"What pack sizes are available?","answer":"Kalmi dates are available in 250g, 500g, and 1000g packs with tiered delivery terms."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-16',
  16,
  'chocolate-badam-dates-talbina-1kg',
  'Chocolate Badam Dates Talbina – 1kg',
  'Choclate Badam Dates Talbina | 1 kg',
  'Chocolate Badam Dates Talbina – 1kg',
  NULL,
  'breakfast',
  'talbina',
  'Fit Monk Chocolate Badam Dates Talbina combines wholesome barley porridge base with cocoa chocolate flavor, almonds, and sweet dates. Provided in a family-sized 1kg pack, this flavorful Talbina variant offers a comforting warm bowl when cooked with milk, appealing to both adults and children for breakfast.',
  64900,
  75000,
  'INR',
  '1000g',
  NULL,
  1000,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'talbina',
  'Chocolate Badam Dates Talbina – 1kg | Fit Monk',
  'Buy Fit Monk Chocolate Badam Dates Talbina 1kg. Hearty barley porridge blended with cocoa, almonds, and dates. Convenient WhatsApp order confirmation.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 4, item 16","raw":{"sourceName":"Choclate Badam Dates Talbina | 1 kg","cardPricePaise":64900,"compareAtPricePaise":75000,"description":"Chocolate Badam Dates Talbina, 1 kg pack.","text":"Choclate Badam Dates Talbina | 1 kg\n₹649.00   (was ₹750.00)\nChocolate Badam Dates Talbina, 1 kg pack."},"conflicts":[]}',
  '[{"question":"What ingredients are featured in this Talbina blend?","answer":"The catalog specifically lists chocolate, badam (almonds), and dates blended into a barley porridge base."},{"question":"How does this SKU differ from standard Chocolate Badam Talbina?","answer":"This 1kg pack is cataloged specifically with dates included in the formulation and title."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-17',
  17,
  'badaam-elaichi-talbina-1000g',
  'Badam Elaichi Talbina – 1kg',
  '1000g Badaam Elaichi Talbina',
  'Badam Elaichi Talbina – 1kg',
  NULL,
  'breakfast',
  'talbina',
  'Fit Monk Badam Elaichi Talbina in a 1kg economy pack delivers a generous supply of traditional barley porridge powder scented with cardamom and almonds. Designed for regular household use, simply cook with milk or water and sweeten to taste for a nourishing, comforting breakfast.',
  64900,
  NULL,
  'INR',
  '1000g',
  'TAL1K',
  1000,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'talbina',
  'Badam Elaichi Talbina – 1kg | Fit Monk',
  'Buy Fit Monk Badam Elaichi Talbina 1kg family pack. Wholesome barley porridge with cardamom and almonds. Quick order confirmation via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 5, item 17","raw":{"sourceName":"1000g Badaam Elaichi Talbina","cardPricePaise":64900,"compareAtPricePaise":null,"description":"Talbina is a warm and nourishing porridge made with barley, milk, and typically sweetened with honey. Code: TAL1K.","text":"1000g Badaam Elaichi Talbina\n₹649.00\nTalbina  is  a  warm  and  nourishing  porridge  made  with  barley,  milk,  and\ntypically sweetened with honey. Code: TAL1K."},"conflicts":[]}',
  '[{"question":"What is the difference between the 500g and 1kg Badam Elaichi Talbina?","answer":"Both share the same cardamom and almond barley porridge formulation; the 1kg pack offers an economical larger quantity for regular breakfast routines."},{"question":"How should Talbina powder be stored?","answer":"Keep in a cool, dry place inside an airtight container away from direct sunlight and moisture."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-18',
  18,
  'mummy-bachcha-muesli-talbina-combo',
  'Mummy Bachcha Muesli & Talbina Combo – 1500g',
  '1500 Mummy bachcha Muesli - Talbina Combo',
  'Mummy Bachcha Muesli & Talbina Combo – 1500g',
  NULL,
  'combos-bundles',
  NULL,
  'The Fit Monk Mummy Bachcha Muesli & Talbina Combo brings together three popular breakfast staples: Elaichi Badam Talbina, Chocolate Badam Talbina, and Mummy Bachcha Muesli. Listed under a 1500g catalog weight, this variety bundle allows households to sample different warm porridge and cold cereal options.',
  99900,
  NULL,
  'INR',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  0,
  'bundle',
  'talbina',
  'Mummy Bachcha Muesli & Talbina Combo – 1500g | Fit Monk',
  'Fit Monk Mummy Bachcha Muesli & Talbina Combo 1500g. Includes Elaichi Badam Talbina, Chocolate Talbina & Muesli. Check bundle details via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 5, item 18","raw":{"sourceName":"1500 Mummy bachcha Muesli - Talbina Combo","cardPricePaise":99900,"compareAtPricePaise":null,"description":"It contains Elaichi Badam Talbina, Chocolate Badam Talbina & Mummy bachcha Muesli worth rupees 375+375 and more.","text":"1500 Mummy bachcha Muesli - Talbina Combo\n₹999.00\nIt  contains  Elaichi  Badam  Talbina,  Chocolate  Badam  Talbina  &  Mummy\nbachcha Muesli worth rupees 375+375 and more."},"conflicts":[]}',
  '[{"question":"What items are named in this combo?","answer":"The catalog names Elaichi Badam Talbina, Chocolate Badam Talbina, and Mummy Bachcha Muesli."},{"question":"Why is this combo subject to confirmation?","answer":"The catalog indicates additional items (\"and more\") beyond the named values; exact pack weights and contents should be verified with the seller."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-19',
  19,
  'talbina-muesli-combo',
  'Talbina & Muesli Combo – 1500g',
  '1500g TALBINA-MUESLI COMBO',
  'Talbina & Muesli Combo – 1500g',
  NULL,
  'combos-bundles',
  NULL,
  'The Fit Monk Talbina & Muesli Combo is a 1500g breakfast bundle combining two distinct Talbina flavors—Elaichi Badam and Chocolate Badam—together with Fit Monk Dryfruits Muesli. This trio offers variety for daily breakfast, alternating between hearty cooked barley porridge and crunchy fruit muesli.',
  94900,
  NULL,
  'INR',
  '1500g',
  NULL,
  1500,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  0,
  'bundle',
  'talbina',
  'Talbina & Muesli Combo – 1500g | Fit Monk',
  'Shop Fit Monk Talbina & Muesli Combo 1500g. Combines Elaichi Badam Talbina, Chocolate Badam Talbina, and Dryfruits Muesli. Order easily via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 5, item 19","raw":{"sourceName":"1500g TALBINA-MUESLI COMBO","cardPricePaise":94900,"compareAtPricePaise":null,"description":"It contains Elaichi Badam Talbina, Chocolate Badam Talbina & Dryfruits Muesli worth rupees 375+375+375 and more.","text":"1500g TALBINA-MUESLI COMBO\n₹949.00\nIt  contains  Elaichi  Badam  Talbina,  Chocolate  Badam  Talbina  &  Dryfruits\nMuesli worth rupees 375+375+375 and more."},"conflicts":[]}',
  '[{"question":"What products make up the Talbina & Muesli Combo?","answer":"The bundle brings together Elaichi Badam Talbina, Chocolate Badam Talbina, and Dryfruits Muesli."},{"question":"How does this bundle help meal planning?","answer":"It provides both warm cooked barley porridge and ready-to-eat muesli cereal for varied family breakfasts throughout the week."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-20',
  20,
  'jumbo-health-combo',
  'Jumbo Health Combo – 2950g',
  '2950g JUMBO Health Combo',
  'Jumbo Health Combo – 2950g',
  NULL,
  'combos-bundles',
  NULL,
  'The Fit Monk Jumbo Health Combo is our largest pantry bundle, providing 2,950g of essentials: 1000g Fit Monk Dryfruits Muesli, 950g Honey Dipped Dry Fruits, and 1000g Badam Elaichi Talbina. A comprehensive supply offering breakfast porridge, cereal, and honey-coated nut snacks for the entire family.',
  177300,
  NULL,
  'INR',
  '2950g',
  NULL,
  2950,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  0,
  'bundle',
  'labels-allergens-and-storage',
  'Jumbo Health Combo – 2950g | Fit Monk',
  'Fit Monk Jumbo Health Combo 2950g. Generous family bundle with 1kg Muesli, 950g Honey Dryfruits, and 1kg Badam Elaichi Talbina. WhatsApp ordering.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 5, item 20","raw":{"sourceName":"2950g JUMBO Health Combo","cardPricePaise":177300,"compareAtPricePaise":null,"description":"It contains 1000g of FIT MONK muesli, 950g of FIT MONK Honey dryfruits and 1000g of FIT MONK badam Elaichi and more.","text":"2950g JUMBO Health Combo\n₹1,773.00\nIt contains 1000g of FIT MONK muesli, 950g of FIT MONK Honey dryfruits and\n1000g of FIT MONK badam Elaichi and more."},"conflicts":[{"field":"contents","values":["1000g + 950g + 1000g = 2950g","and more"],"note":"Confirm full component list and weight."}]}',
  '[{"question":"What is included in the Jumbo Health Combo?","answer":"The bundle contains 1000g Fit Monk Muesli, 950g Fit Monk Honey Dryfruits, and 1000g Badam Elaichi Talbina, totaling 2,950g."},{"question":"Is honey in this bundle suitable for infants?","answer":"No. The included honey dryfruits must not be given to children under 12 months."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-21',
  21,
  'chocolate-badam-talbina-500g',
  'Chocolate Badam Talbina – 500g',
  '500g Chocolate Badam Talbina',
  'Chocolate Badam Talbina – 500g',
  NULL,
  'breakfast',
  'talbina',
  'Fit Monk Chocolate Badam Talbina blends finely milled barley flour with cocoa chocolate and almonds. In a handy 500g pack, this comforting porridge cooks quickly with warm milk to create a rich, lightly chocolatey breakfast that combines traditional barley goodness with contemporary flavor.',
  37500,
  NULL,
  'INR',
  '500g',
  NULL,
  500,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'talbina',
  'Chocolate Badam Talbina – 500g | Fit Monk',
  'Order Fit Monk Chocolate Badam Talbina 500g. Hearty barley porridge powder with chocolate cocoa and almonds. Easy order confirmation via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 6, item 21","raw":{"sourceName":"500g Chocolate Badam Talbina","cardPricePaise":37500,"compareAtPricePaise":null,"description":"Talbina is a warm and nourishing porridge made with barley, milk, and typically sweetened with honey.","text":"500g Chocolate Badam Talbina\n₹375.00\nTalbina  is  a  warm  and  nourishing  porridge  made  with  barley,  milk,  and\ntypically sweetened with honey."},"conflicts":[]}',
  '[{"question":"What makes Chocolate Badam Talbina popular?","answer":"It offers the wholesome benefits of traditional barley porridge while incorporating cocoa and almonds, making it especially appealing for children and breakfast porridge lovers."},{"question":"How is it served?","answer":"Simmer gently with milk, stir continuously until thickened, and serve warm with a drizzle of honey if desired."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-22',
  22,
  'combo-talbina',
  'Combo Talbina – 1000g',
  '1000g Combo Talbina',
  'Combo Talbina – 1000g',
  NULL,
  'combos-bundles',
  NULL,
  'The Fit Monk Combo Talbina package pairs two 500g bags: one bag of Badam Elaichi Talbina and one bag of Chocolate Badam Talbina, totaling 1kg of barley porridge. It allows you to rotate between traditional aromatic cardamom and rich cocoa flavors throughout the week.',
  64900,
  NULL,
  'INR',
  '1000g',
  'ECTAL1K',
  1000,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'bundle',
  'talbina',
  'Combo Talbina – 1000g | Fit Monk',
  'Buy Fit Monk Combo Talbina 1000g. Includes 500g Badam Elaichi Talbina + 500g Chocolate Badam Talbina. WhatsApp order confirmation and delivery.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 6, item 22","raw":{"sourceName":"1000g Combo Talbina","cardPricePaise":64900,"compareAtPricePaise":null,"description":"This combo has 1 bag of 500g Elaichi Badam Talbina and 1 bag of 500g Chocolate Badam Talbina. Code: ECTAL1K.","text":"1000g Combo Talbina\n₹649.00\nThis  combo  has  1  bag  of  500g  Elaichi  Badam  Talbina  and  1  bag  of  500g\nChocolate Badam Talbina. Code: ECTAL1K."},"conflicts":[]}',
  '[{"question":"Which packs are inside Combo Talbina?","answer":"It contains one 500g bag of Badam Elaichi Talbina and one 500g bag of Chocolate Badam Talbina (code: ECTAL1K)."},{"question":"Can I prepare both flavors the same way?","answer":"Yes, both flavors cook easily with warm milk or water on the stove until reaching a creamy porridge consistency."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-23',
  23,
  'mummy-bachcha-muesli',
  'Mummy Bachcha Muesli – 500g',
  '500G Mummy Bachcha Muesli',
  'Mummy Bachcha Muesli – 500g',
  NULL,
  'breakfast',
  'muesli',
  'Fit Monk Mummy Bachcha Muesli is a dedicated 500g breakfast cereal blend featuring wholesome rolled grains, seeds, and dried fruit bits. Crafted for quick morning meals, it can be served chilled with milk or layered with yogurt, fruit slices, and honey for the family breakfast table.',
  39900,
  NULL,
  'INR',
  '500g',
  NULL,
  500,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'muesli-breakfast',
  'Mummy Bachcha Muesli – 500g | Fit Monk',
  'Buy Fit Monk Mummy Bachcha Muesli 500g online. Delicious breakfast grain cereal blend with seeds and fruit bits. Order easily via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 6, item 23","raw":{"sourceName":"500G Mummy Bachcha Muesli","cardPricePaise":39900,"compareAtPricePaise":null,"description":"Muesli is a nutritious and versatile breakfast option.","text":"500G Mummy Bachcha Muesli\n₹399.00\nMuesli is a nutritious and versatile breakfast option."},"conflicts":[]}',
  '[{"question":"What is Mummy Bachcha Muesli?","answer":"It is a 500g breakfast cereal blend from Fit Monk described in the catalog as a nutritious and versatile morning option."},{"question":"How should this muesli be served?","answer":"It can be enjoyed with cold milk, warm milk, or stirred into fresh yogurt with sliced fresh fruits."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-24',
  24,
  'fit-monk-honey-dryfruits-500g',
  'Fit Monk Honey Dryfruits – 500g',
  '500g Fit Monk Honey dryfruits',
  'Fit Monk Honey Dryfruits – 500g',
  NULL,
  'honey-dryfruits',
  NULL,
  'Fit Monk Honey Dryfruits (500g) brings together assorted crunchy nuts and seeds immersed in genuine Kashmiri honey. A convenient smaller jar size compared to the 950g edition, it makes an appetizing standalone treat, oatmeal mix-in, or elegant gift for festive occasions.',
  44900,
  NULL,
  'INR',
  '500g',
  NULL,
  500,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'review',
  1,
  0,
  1,
  'product',
  'honey-dryfruits',
  'Fit Monk Honey Dryfruits – 500g | Fit Monk',
  'Order Fit Monk Honey Dryfruits 500g. Crunchy mixed nuts and seeds soaked in pure Kashmiri honey. Fast order confirmation and shipping via WhatsApp.',
  '{"reference":"Fit Monk Catalog PDF (1).pdf, page 6, item 24","raw":{"sourceName":"500g Fit Monk Honey dryfruits","cardPricePaise":44900,"compareAtPricePaise":null,"description":"Acts as a natural energy booster. Dry fruits and seeds dipped in Kashmiri honey is a delicious and nutritious treat.","text":"500g Fit Monk Honey dryfruits\n₹449.00\nActs  as  a  natural  energy  booster.  Dry  fruits  and  seeds  dipped  in  Kashmiri\nhoney is a delicious and nutritious treat."},"conflicts":[]}',
  '[{"question":"What is in Fit Monk Honey Dryfruits?","answer":"Assorted crunchy dry fruits and seeds steeped in natural Kashmiri honey."},{"question":"Is this safe for infants?","answer":"No. Natural honey carries a risk of infant botulism and must never be fed to children under 1 year of age."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-25',
  25,
  'dates-dry-fruit-punch',
  'Dates Dry Fruits Punch',
  'DATES DRY FRUITS PUNCH',
  'Dates Dry Fruits Punch',
  'Dates Dry Fruits Punch',
  'dates-date-sweets',
  NULL,
  'Dates-based dry fruit punch/barfi crafted with roasted cashew, almond, and pistachio bound in dates. Prepared with desi ghee with no refined sugar, no maida, and no artificial additives.',
  29900,
  30000,
  'INR',
  '250g',
  NULL,
  250,
  '["Dates","Roasted cashew","Almond","Pistachio","Desi ghee"]',
  NULL,
  NULL,
  NULL,
  '250g: + ₹49 shipping. 500g: Free shipping. 1kg: Free shipping.',
  'review',
  1,
  1,
  1,
  'product',
  'dates-and-khajoor',
  'Dates Dry Fruits Punch | Fit Monk',
  'Buy Dates Dry Fruits Punch online from Fit Monk. Traditional dates barfi with roasted cashew, almond & pistachio in desi ghee. No refined sugar.',
  '{"reference":"Fit Monk New Product Addition, Item 25","raw":{"name":"DATES DRY FRUITS PUNCH","subtitle":"Traditional Dates Barfi with Pistachio & Almonds","variants":"250g — ₹299 (compare-at ₹300, ₹49 shipping), 500g — ₹599 (free shipping), 1kg — ₹998 (free shipping)","facts":"Roasted cashew, almond and pistachio bound in dates. Made with desi ghee. No refined sugar. No maida. No artificial additives."},"conflicts":[]}',
  '[{"question":"What is Dates Dry Fruits Punch?","answer":"Dates Dry Fruits Punch is a traditional dates barfi prepared with roasted cashew, almond, and pistachio bound together in dates and desi ghee, without refined sugar, maida, or artificial additives."},{"question":"What pack sizes and shipping options are available?","answer":"It is available in 250g (₹299 + ₹49 shipping), 500g (₹599 with free shipping), and 1kg (₹998 with free shipping)."}]',
  '[]'
);

INSERT OR REPLACE INTO products (
  id, catalog_number, slug, name, source_name, display_name, short_name,
  category_id, subcategory_id, description, price_paise, compare_at_price_paise,
  currency, pack_size, sku, weight_grams, ingredients, allergens, nutrition,
  storage, shipping_text, status, is_available, is_featured, is_orderable,
  kind, learn_hub, seo_title, seo_description, source_raw, faqs, promotions
) VALUES (
  'fm-26',
  26,
  'anjeer-dry-fruit-punch',
  'Anjeer Dry Fruits Punch',
  'ANJEER DRY FRUITS PUNCH',
  'Anjeer Dry Fruits Punch',
  'Anjeer Dry Fruits Punch',
  'dried-fruits-fruit-sweets',
  NULL,
  'Traditional anjeer barfi crafted from Afghan anjeer with roasted cashew, almond, and pistachio. Made with pure desi ghee and described as protein-packed, with no refined sugar, no palm oil, and no maida.',
  34900,
  35000,
  'INR',
  '250g',
  NULL,
  250,
  '["Afghan anjeer (figs)","Roasted cashew","Almond","Pistachio","Desi ghee"]',
  NULL,
  NULL,
  NULL,
  '250g: + ₹49 shipping. 500g: Free shipping. 1kg: Free shipping.',
  'review',
  1,
  1,
  1,
  'product',
  'anjeer-and-dried-fruits',
  'Anjeer Dry Fruits Punch | Fit Monk',
  'Buy Anjeer Dry Fruits Punch online from Fit Monk. Traditional Afghan anjeer barfi with roasted cashew, almond & pistachio made in desi ghee. No refined sugar.',
  '{"reference":"Fit Monk New Product Addition, Item 26","raw":{"name":"ANJEER DRY FRUITS PUNCH","subtitle":"Traditional Anjeer Barfi with Pistachio & Almonds","variants":"250g — ₹349 (compare-at ₹350, ₹49 shipping), 500g — ₹699 (free shipping), 1kg — ₹1,198 (free shipping)","facts":"Afghan anjeer with roasted cashew, almond and pistachio. Made with desi ghee. No refined sugar. No palm oil. No maida. Described as protein-packed."},"conflicts":[]}',
  '[{"question":"What is Anjeer Dry Fruits Punch?","answer":"Anjeer Dry Fruits Punch is a traditional anjeer barfi made from Afghan anjeer (figs) and roasted cashew, almond, and pistachio bound in pure desi ghee, without refined sugar, palm oil, or maida."},{"question":"What pack sizes and shipping options are available?","answer":"It is available in 250g (₹349 + ₹49 shipping), 500g (₹699 with free shipping), and 1kg (₹1,198 with free shipping)."}]',
  '[]'
);



-- Product Variants

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-03-250g',
  'fm-03',
  '250g',
  '250g',
  NULL,
  29900,
  34900,
  250,
  1,
  4900,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-03-500g',
  'fm-03',
  '500g',
  '500g',
  NULL,
  49900,
  NULL,
  500,
  1,
  4900,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-03-1000g',
  'fm-03',
  '1000g',
  '1000g',
  NULL,
  89900,
  NULL,
  1000,
  1,
  0,
  1
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-04-500g',
  'fm-04',
  '500g',
  '500g',
  NULL,
  37500,
  37600,
  500,
  1,
  4900,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-04-2x500g',
  'fm-04',
  '2x500g',
  '2 × 500g',
  NULL,
  69900,
  NULL,
  1000,
  1,
  0,
  1
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-04-1000g',
  'fm-04',
  '1000g',
  '1000g — price unconfirmed',
  NULL,
  0,
  NULL,
  1000,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-05-250g',
  'fm-05',
  '250g',
  '250g',
  NULL,
  44900,
  NULL,
  250,
  1,
  6000,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-05-500g',
  'fm-05',
  '500g',
  '500g',
  NULL,
  84900,
  NULL,
  500,
  1,
  6000,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-05-1000g',
  'fm-05',
  '1000g',
  '1000g',
  NULL,
  157500,
  NULL,
  1000,
  1,
  0,
  1
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-07-250g',
  'fm-07',
  '250g',
  '250g',
  NULL,
  0,
  NULL,
  250,
  1,
  6000,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-07-500g',
  'fm-07',
  '500g',
  '500g',
  NULL,
  84900,
  NULL,
  500,
  1,
  6000,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-07-1000g',
  'fm-07',
  '1000g',
  '1000g',
  NULL,
  155000,
  NULL,
  1000,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-08-250g',
  'fm-08',
  '250g',
  '250g',
  'MED250',
  44900,
  49900,
  250,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-08-500g',
  'fm-08',
  '500g',
  '500g',
  NULL,
  84900,
  NULL,
  500,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-08-1000g',
  'fm-08',
  '1000g',
  '1000g',
  NULL,
  155000,
  NULL,
  1000,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-10-500g',
  'fm-10',
  '500g',
  '500g',
  NULL,
  49900,
  NULL,
  500,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-10-1000g',
  'fm-10',
  '1000g',
  '1000g',
  NULL,
  84900,
  NULL,
  1000,
  1,
  0,
  1
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-15-250g',
  'fm-15',
  '250g',
  '250g',
  NULL,
  24900,
  NULL,
  250,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-15-500g',
  'fm-15',
  '500g',
  '500g',
  NULL,
  44900,
  NULL,
  500,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-15-1000g',
  'fm-15',
  '1000g',
  '1000g',
  NULL,
  84900,
  NULL,
  1000,
  1,
  NULL,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-25-250g',
  'fm-25',
  '250g',
  '250g',
  NULL,
  29900,
  30000,
  250,
  1,
  4900,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-25-500g',
  'fm-25',
  '500g',
  '500g',
  NULL,
  59900,
  NULL,
  500,
  1,
  0,
  1
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-25-1kg',
  'fm-25',
  '1kg',
  '1kg',
  NULL,
  99800,
  NULL,
  1000,
  1,
  0,
  1
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-26-250g',
  'fm-26',
  '250g',
  '250g',
  NULL,
  34900,
  35000,
  250,
  1,
  4900,
  0
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-26-500g',
  'fm-26',
  '500g',
  '500g',
  NULL,
  69900,
  NULL,
  500,
  1,
  0,
  1
);

INSERT OR REPLACE INTO product_variants (
  id, product_id, variant_key, pack_size, sku, price_paise, compare_at_price_paise, weight_grams, is_available, shipping_amount_paise, shipping_free
) VALUES (
  'fm-26-1kg',
  'fm-26',
  '1kg',
  '1kg',
  NULL,
  119800,
  NULL,
  1000,
  1,
  0,
  1
);



-- Media & Associations

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-01-0',
  '01-roasted-dryfruits-seeds-mix.jpg',
  '/Fit Monk listing photos/01-roasted-dryfruits-seeds-mix.jpg',
  '/Fit Monk listing photos/01-roasted-dryfruits-seeds-mix.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Roasted Dryfruits and Seeds Mix'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-01',
  'media-fm-01-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-02-0',
  '02-power-snacks-combo.jpg',
  '/Fit Monk listing photos/02-power-snacks-combo.jpg',
  '/Fit Monk listing photos/02-power-snacks-combo.jpg',
  'image/jpeg',
  0,
  1408,
  1760,
  'Power Snacks Combo'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-02',
  'media-fm-02-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-03-0',
  '03-5-seeds-mix.jpg',
  '/Fit Monk listing photos/03-5-seeds-mix.jpg',
  '/Fit Monk listing photos/03-5-seeds-mix.jpg',
  'image/jpeg',
  0,
  1408,
  1760,
  '5 Seeds Mix'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-03',
  'media-fm-03-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-04-0',
  '04-super-muesli.jpg',
  '/Fit Monk listing photos/04-super-muesli.jpg',
  '/Fit Monk listing photos/04-super-muesli.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Fit Monk Dryfruits, Seeds and Fruits Muesli'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-04',
  'media-fm-04-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-05-0',
  '05-turkish-anjeer.jpg',
  '/Fit Monk listing photos/05-turkish-anjeer.jpg',
  '/Fit Monk listing photos/05-turkish-anjeer.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Turkish Anjeer'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-05',
  'media-fm-05-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-06-0',
  '06-omani-barfi.jpg',
  '/Fit Monk listing photos/06-omani-barfi.jpg',
  '/Fit Monk listing photos/06-omani-barfi.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Omani Barfi — Dates Arabic Barfi'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-06',
  'media-fm-06-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-07-0',
  '07-saudi-ajwa-dates.jpg',
  '/Fit Monk listing photos/07-saudi-ajwa-dates.jpg',
  '/Fit Monk listing photos/07-saudi-ajwa-dates.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Saudi Ajwa Dates'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-07',
  'media-fm-07-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-08-0',
  '08-medjool-dates.jpg',
  '/Fit Monk listing photos/08-medjool-dates.jpg',
  '/Fit Monk listing photos/08-medjool-dates.jpg',
  'image/jpeg',
  0,
  1408,
  1760,
  'Medjool Dates'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-08',
  'media-fm-08-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-09-0',
  '09-health-combo.jpg',
  '/Fit Monk listing photos/09-health-combo.jpg',
  '/Fit Monk listing photos/09-health-combo.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Health Combo'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-09',
  'media-fm-09-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-10-0',
  '10-dried-fruits-cocktail.jpg',
  '/Fit Monk listing photos/10-dried-fruits-cocktail.jpg',
  '/Fit Monk listing photos/10-dried-fruits-cocktail.jpg',
  'image/jpeg',
  0,
  1616,
  1568,
  'Dried Fruits Cocktail'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-10',
  'media-fm-10-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-11-0',
  '11-dryfruits-dipped-in-honey.jpg',
  '/Fit Monk listing photos/11-dryfruits-dipped-in-honey.jpg',
  '/Fit Monk listing photos/11-dryfruits-dipped-in-honey.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Dry Fruits Dipped in Honey'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-11',
  'media-fm-11-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-12-0',
  '12-dates-dryfruits-punch.jpg',
  '/Fit Monk listing photos/12-dates-dryfruits-punch.jpg',
  '/Fit Monk listing photos/12-dates-dryfruits-punch.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Dates Dry Fruits Punch'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-12',
  'media-fm-12-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-13-0',
  '13-anjeer-dryfruits-punch.jpg',
  '/Fit Monk listing photos/13-anjeer-dryfruits-punch.jpg',
  '/Fit Monk listing photos/13-anjeer-dryfruits-punch.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Anjeer Dryfruits Punch'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-13',
  'media-fm-13-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-14-0',
  '14-badaam-elaichi-talbina.jpg',
  '/Fit Monk listing photos/14-badaam-elaichi-talbina.jpg',
  '/Fit Monk listing photos/14-badaam-elaichi-talbina.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Badaam Elaichi Talbina — 500g'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-14',
  'media-fm-14-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-15-0',
  '15-kalmi-dates.jpg',
  '/Fit Monk listing photos/15-kalmi-dates.jpg',
  '/Fit Monk listing photos/15-kalmi-dates.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Kalmi Dates'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-15',
  'media-fm-15-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-16-0',
  '16-chocolate-badam-dates-talbina.jpg',
  '/Fit Monk listing photos/16-chocolate-badam-dates-talbina.jpg',
  '/Fit Monk listing photos/16-chocolate-badam-dates-talbina.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Chocolate Badam Dates Talbina — 1kg'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-16',
  'media-fm-16-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-17-0',
  '17-badaam-elaichi-talbina-1000g.jpg',
  '/Fit Monk listing photos/17-badaam-elaichi-talbina-1000g.jpg',
  '/Fit Monk listing photos/17-badaam-elaichi-talbina-1000g.jpg',
  'image/jpeg',
  0,
  1616,
  1584,
  'Badaam Elaichi Talbina — 1000g'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-17',
  'media-fm-17-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-18-0',
  '18-muesli-talbina-combo.jpg',
  '/Fit Monk listing photos/18-muesli-talbina-combo.jpg',
  '/Fit Monk listing photos/18-muesli-talbina-combo.jpg',
  'image/jpeg',
  0,
  1920,
  1280,
  'Mummy Bachcha Muesli–Talbina Combo'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-18',
  'media-fm-18-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-19-0',
  '19-talbina-muesli-combo.jpg',
  '/Fit Monk listing photos/19-talbina-muesli-combo.jpg',
  '/Fit Monk listing photos/19-talbina-muesli-combo.jpg',
  'image/jpeg',
  0,
  1920,
  1280,
  'Talbina–Muesli Combo'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-19',
  'media-fm-19-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-20-0',
  '20-jumbo-health-combo.jpg',
  '/Fit Monk listing photos/20-jumbo-health-combo.jpg',
  '/Fit Monk listing photos/20-jumbo-health-combo.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Jumbo Health Combo'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-20',
  'media-fm-20-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-21-0',
  '21-chocolate-badam-talbina.jpg',
  '/Fit Monk listing photos/21-chocolate-badam-talbina.jpg',
  '/Fit Monk listing photos/21-chocolate-badam-talbina.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Chocolate Badam Talbina — 500g'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-21',
  'media-fm-21-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-22-0',
  '22-combo-talbina.jpg',
  '/Fit Monk listing photos/22-combo-talbina.jpg',
  '/Fit Monk listing photos/22-combo-talbina.jpg',
  'image/jpeg',
  0,
  1616,
  1568,
  'Combo Talbina'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-22',
  'media-fm-22-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-23-0',
  '23-mummy-bachcha-muesli.jpg',
  '/Fit Monk listing photos/23-mummy-bachcha-muesli.jpg',
  '/Fit Monk listing photos/23-mummy-bachcha-muesli.jpg',
  'image/jpeg',
  0,
  1392,
  1680,
  'Mummy Bachcha Muesli'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-23',
  'media-fm-23-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-24-0',
  '24-honey-dryfruits.jpg',
  '/Fit Monk listing photos/24-honey-dryfruits.jpg',
  '/Fit Monk listing photos/24-honey-dryfruits.jpg',
  'image/jpeg',
  0,
  1600,
  1600,
  'Fit Monk Honey Dryfruits — 500g'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-24',
  'media-fm-24-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-25-0',
  '25-dates-dry-fruits-punch-raw.png',
  '/Fit Monk listing photos/25-dates-dry-fruits-punch-raw.png',
  '/Fit Monk listing photos/25-dates-dry-fruits-punch-raw.png',
  'image/jpeg',
  0,
  357,
  476,
  'Dates Dry Fruits Punch – Freshly prepared traditional dates barfi tray with pistachio and almonds'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-25',
  'media-fm-25-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-25-1',
  '25-dates-dry-fruits-punch-marketing.png',
  '/Fit Monk listing photos/25-dates-dry-fruits-punch-marketing.png',
  '/Fit Monk listing photos/25-dates-dry-fruits-punch-marketing.png',
  'image/jpeg',
  0,
  455,
  476,
  'Fit Monk Dates Dry Fruit Punch – Marketing and ingredients presentation'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-25',
  'media-fm-25-1',
  'gallery',
  1
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-26-0',
  '26-anjeer-dryfruits-punch-raw.png',
  '/Fit Monk listing photos/26-anjeer-dryfruits-punch-raw.png',
  '/Fit Monk listing photos/26-anjeer-dryfruits-punch-raw.png',
  'image/jpeg',
  0,
  285,
  373,
  'Anjeer Dry Fruits Punch – Freshly prepared traditional anjeer barfi container with pistachio and almonds'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-26',
  'media-fm-26-0',
  'primary',
  0
);

INSERT OR REPLACE INTO media (
  id, filename, object_key, url, mime_type, size_bytes, width, height, alt_text
) VALUES (
  'media-fm-26-1',
  '26-anjeer-dryfruits-punch-marketing.png',
  '/Fit Monk listing photos/26-anjeer-dryfruits-punch-marketing.png',
  '/Fit Monk listing photos/26-anjeer-dryfruits-punch-marketing.png',
  'image/jpeg',
  0,
  285,
  381,
  'Fit Monk Anjeer Dry Fruit Punch – Marketing and ingredients presentation'
);

INSERT OR REPLACE INTO product_media (
  product_id, media_id, media_role, sort_order
) VALUES (
  'fm-26',
  'media-fm-26-1',
  'gallery',
  1
);