import fs from 'node:fs';
import path from 'node:path';

const dir = './src/content/products';

const updates = {
  1: {
    name: 'Roasted Dryfruits and Seeds Mix – 250g',
    displayName: 'Roasted Dryfruits and Seeds Mix – 250g',
    description: 'Fit Monk Roasted Dryfruits and Seeds Mix is a crunchy snack blend of roasted cashew nuts, almonds, mixed seeds, and dehydrated fruits. Packed in a 250g pouch, this dry fruit and seed mix provides a ready-to-eat option for daily pantry snacking or topping breakfast bowls.',
    seoTitle: 'Roasted Dryfruits and Seeds Mix – 250g | Fit Monk',
    seoDescription: 'Buy Fit Monk Roasted Dryfruits and Seeds Mix 250g online. A crunchy mix of roasted cashew nuts, almonds, seeds and dehydrated fruits. Order via WhatsApp.',
    ingredients: ['Roasted cashew nuts', 'Almonds', 'Seeds', 'Dehydrated fruits'],
    faqs: [
      {
        question: 'What ingredients are in the Roasted Dryfruits and Seeds Mix?',
        answer: 'According to the Fit Monk catalog, this 250g mix includes roasted cashew nuts, almonds, mixed seeds, and dehydrated fruits.'
      },
      {
        question: 'How is this mix packaged and shipped?',
        answer: 'It comes in a 250g sealed pouch. The catalog lists a ₹49 delivery charge for orders under 1kg.'
      },
      {
        question: 'How does this compare with the 5 Seeds Mix?',
        answer: 'The Roasted Dryfruits and Seeds Mix contains roasted nuts and dehydrated fruits in addition to seeds, whereas the 5 Seeds Mix consists entirely of five whole seeds.'
      }
    ]
  },
  2: {
    name: 'Power Snacks Combo – 750g',
    displayName: 'Power Snacks Combo – 750g',
    description: 'The Fit Monk Power Snacks Combo is a 750g snack bundle containing three separate 250g packs: one pack of Roasted Dry Fruits & Seeds Mix, one pack of Dehydrated Fruits Cocktail, and one pack of 5 Seeds Mix. This combination provides a variety of seeds, roasted nuts, and dried fruit snacks for the home or office pantry.',
    seoTitle: 'Power Snacks Combo – 750g | Fit Monk',
    seoDescription: 'Shop the Fit Monk Power Snacks Combo 750g featuring Roasted Dryfruits & Seeds Mix (250g), Dehydrated Fruits Cocktail (250g), and 5 Seeds Mix (250g). Order online.',
    faqs: [
      {
        question: 'What packs are included in the Power Snacks Combo?',
        answer: 'The 750g combo includes three 250g packs: Roasted Dry Fruits and Seeds Mix (250g), Dehydrated Fruits Cocktail (250g), and 5 Seeds Mix (250g).'
      },
      {
        question: 'What is the total weight and shipping of this combo?',
        answer: 'The total weight is 750g. Orders under 1kg carry a catalog shipping charge of ₹49.'
      }
    ]
  },
  3: {
    name: '5 Seeds Mix – 250g',
    displayName: '5 Seeds Mix – 250g',
    description: 'Fit Monk 5 Seeds Mix is a balanced blend of five named whole seeds: flax seeds, watermelon seeds, pumpkin seeds, muskmelon seeds, and sunflower seeds, combined in equal proportions. Available in 250g, 500g, and 1000g packs, this mixed seeds blend is suited for everyday eating, smoothies, salads, and breakfast bowls.',
    seoTitle: '5 Seeds Mix – 250g | Fit Monk',
    seoDescription: 'Buy Fit Monk 5 Seeds Mix 250g online. A blend of flax, watermelon, pumpkin, muskmelon, and sunflower seeds mixed in equal proportions. Order via WhatsApp.',
    ingredients: ['Flax seeds', 'Watermelon seeds', 'Pumpkin seeds', 'Muskmelon seeds', 'Sunflower seeds'],
    faqs: [
      {
        question: 'Which five seeds are included in this mix?',
        answer: 'Fit Monk 5 Seeds Mix contains flax seeds, watermelon seeds, pumpkin seeds, muskmelon seeds, and sunflower seeds, blended in equal proportions.'
      },
      {
        question: 'What pack sizes are available for 5 Seeds Mix?',
        answer: 'It is offered in 250g, 500g, and 1000g (1kg) packs. Orders of the 1kg pack include free catalog shipping.'
      },
      {
        question: 'How can 5 Seeds Mix be used daily?',
        answer: 'It can be eaten as a plain seed snack, sprinkled over oatmeal, muesli, or yogurt, or blended into morning smoothies.'
      }
    ]
  },
  4: {
    name: 'Fit Monk Dryfruits, Seeds & Fruits Muesli – 500g',
    displayName: 'Fit Monk Dryfruits, Seeds & Fruits Muesli – 500g',
    description: 'Fit Monk Dryfruits, Seeds and Fruits Muesli is a breakfast cereal combining grains with dried fruits, nuts, and seeds. Available in a 500g pack with multi-pack savings (buy two 500g packs for ₹699 with free shipping), it serves as a ready-to-eat breakfast with warm or cold milk, curd, or yogurt.',
    seoTitle: 'Fit Monk Dryfruits, Seeds & Fruits Muesli – 500g | Fit Monk',
    seoDescription: 'Order Fit Monk Dryfruits, Seeds & Fruits Muesli 500g. Wholesome breakfast muesli with dried fruits and seeds. Multi-pack offers available with direct delivery.',
    faqs: [
      {
        question: 'How is Fit Monk Dryfruits, Seeds and Fruits Muesli served?',
        answer: 'It can be served with cold or warm milk, stirred into curd or yogurt, or soaked overnight as an overnight muesli bowl.'
      },
      {
        question: 'Are there multi-pack discount offers on this muesli?',
        answer: 'Yes, the catalog features an offer to buy two 500g packs (1000g total) for ₹699 with free shipping.'
      }
    ]
  },
  5: {
    name: 'Turkish Anjeer – 250g',
    displayName: 'Turkish Anjeer – 250g',
    description: 'Fit Monk Turkish Anjeer offers whole dried figs sourced from Turkey, selected for their naturally sweet taste, round shape, and chewy texture. Available in 250g, 500g, and 1000g packs, these dried figs can be enjoyed as a dry fruit snack or soaked in clean water overnight for traditional consumption.',
    seoTitle: 'Turkish Anjeer – 250g | Fit Monk',
    seoDescription: 'Buy authentic Turkish Anjeer 250g online from Fit Monk. Premium whole dried figs available in 250g, 500g, and 1kg packs. Fast order confirmation via WhatsApp.',
    faqs: [
      {
        question: 'What is anjeer?',
        answer: 'Anjeer is the traditional Hindi and Persian term for the common fig (Ficus carica), widely enjoyed dried as a nutritious pantry fruit.'
      },
      {
        question: 'How are Turkish dried figs typically eaten?',
        answer: 'They can be eaten as a chewy snack directly from the pack, soaked in water overnight, or chopped into desserts, porridge, and fruit salads.'
      },
      {
        question: 'What pack sizes are available?',
        answer: 'Available in 250g, 500g, and 1000g packs. The 1000g pack includes free catalog shipping.'
      }
    ]
  },
  6: {
    name: 'Omani Dates Arabic Barfi – 500g',
    displayName: 'Omani Dates Arabic Barfi – 500g',
    description: 'Fit Monk Omani Dates Arabic Barfi is a rich date-and-nut confection prepared with chopped dates, mixed nuts, and pure clarified butter (desi ghee). Packed in a 500g box, this traditional Arabic-style khajoor barfi offers a dense, chewy sweet suited for festive gifting, celebrations, and after-meal desserts.',
    seoTitle: 'Omani Dates Arabic Barfi – 500g | Fit Monk',
    seoDescription: 'Buy Fit Monk Omani Dates Arabic Barfi 500g. Traditional Arabic date sweet made with chopped dates, mixed nuts, and desi ghee. Easy WhatsApp ordering.',
    faqs: [
      {
        question: 'What ingredients are used in Omani Barfi?',
        answer: 'The catalog specifies that this Arabic sweet is made with chopped dates, mixed nuts, and clarified butter (desi ghee).'
      },
      {
        question: 'What occasions is Omani Dates Barfi suited for?',
        answer: 'With its rich date-and-ghee composition, it is commonly chosen for festive gifting, family celebrations, Ramadan iftar, and everyday sweet treats.'
      }
    ]
  },
  7: {
    name: 'Saudi Ajwa Dates – 250g',
    displayName: 'Saudi Ajwa Dates – 250g',
    description: 'Fit Monk Saudi Ajwa Dates are celebrated dark dates renowned for their soft texture, fine wrinkled skin, and gentle sweetness. Sourced from Saudi Arabia and available in 250g, 500g, and 1kg pack options, these Ajwa khajoor dates are popular for daily eating, gifting, and Ramadan fasting.',
    seoTitle: 'Saudi Ajwa Dates – 250g | Fit Monk',
    seoDescription: 'Buy genuine Saudi Ajwa Dates 250g from Fit Monk. Soft, dark Ajwa khajoor available in 250g, 500g, and 1kg packs. Simple, direct ordering via WhatsApp.',
    faqs: [
      {
        question: 'What makes Ajwa dates distinctive?',
        answer: 'Ajwa dates are known for their dark brown to black color, fine wrinkled texture, soft bite, and mild, fruity sweetness.'
      },
      {
        question: 'What pack options are listed for Saudi Ajwa Dates?',
        answer: 'The catalog lists 250g, 500g, and 1000g packs. The 250g price is subject to final seller confirmation.'
      }
    ]
  },
  8: {
    name: 'Medjool Dates – 250g',
    displayName: 'Medjool Dates – 250g',
    description: 'Fit Monk Medjool Dates are prized large-sized dates known for their succulent, caramel-like sweetness and tender, fleshy pulp. Listed in the catalog with 250g, 500g, and 1kg options, these Medjool khajoor dates make an indulgent everyday treat, baking ingredient, or thoughtful gift.',
    seoTitle: 'Medjool Dates – 250g | Fit Monk',
    seoDescription: 'Order large, succulent Medjool Dates 250g from Fit Monk. Tender texture and caramel sweetness, available in 250g, 500g, and 1kg packs. WhatsApp ordering.',
    faqs: [
      {
        question: 'How do Medjool dates taste and feel?',
        answer: 'Medjool dates are distinctly large with a soft, moist flesh and a rich, honey-caramel flavor profile.'
      },
      {
        question: 'Why was the catalog name normalized?',
        answer: 'The catalog lists "Jordon Medjool Dates", which represents Jordan Medjool dates. We normalize the title while retaining the catalog reference for full traceability.'
      }
    ]
  },
  9: {
    name: 'Health Combo – 1500g',
    displayName: 'Health Combo – 1500g',
    description: 'The Fit Monk Health Combo is a 1500g multi-product breakfast and snack bundle. Confirmed components include 500g of Fit Monk Dryfruits Muesli and 500g of Fit Monk Honey Dryfruits, providing both morning breakfast cereal and honey-coated nuts. Remaining pack contents are subject to seller confirmation.',
    seoTitle: 'Health Combo – 1500g | Fit Monk',
    seoDescription: 'Fit Monk Health Combo 1500g bundle featuring 500g Dryfruits Muesli and 500g Honey Dryfruits. Inquire with seller via WhatsApp for full bundle details.',
    faqs: [
      {
        question: 'What confirmed products are in the Health Combo?',
        answer: 'The catalog confirms 500g of Fit Monk Muesli and 500g of Fit Monk Honey Dryfruits within the 1500g total weight.'
      },
      {
        question: 'Why is this combo inquiry-only?',
        answer: 'Because the catalog states "and more" for the remaining component weight, we recommend confirming the exact contents directly with the seller before ordering.'
      }
    ]
  },
  10: {
    name: 'Dried Fruits Cocktail – 500g',
    displayName: 'Dried Fruits Cocktail – 500g',
    description: 'Fit Monk Dried Fruits Cocktail is a colorful medley of diced, dehydrated fruits offering a naturally sweet, chewy fruit snack. Available in 500g and 1kg packs, this fruit blend can be eaten directly as a sweet snack or mixed into oatmeal, muesli, yogurt, and festive baked dishes.',
    seoTitle: 'Dried Fruits Cocktail – 500g | Fit Monk',
    seoDescription: 'Buy Fit Monk Dried Fruits Cocktail 500g. A delicious mix of dehydrated fruits in 500g and 1kg packs. Convenient order confirmation via WhatsApp.',
    faqs: [
      {
        question: 'What is in the Dried Fruits Cocktail?',
        answer: 'It contains a blend of diced dehydrated fruits, offering a sweet and chewy snack suitable for toppings and baking.'
      },
      {
        question: 'What pack sizes are available?',
        answer: 'It is offered in 500g and 1000g (1kg) packs. The 1kg pack includes free catalog shipping.'
      }
    ]
  },
  11: {
    name: 'Dry Fruits Dipped in Honey – 950g',
    displayName: 'Dry Fruits Dipped in Honey – 950g',
    description: 'Fit Monk Dry Fruits Dipped in Honey features a selection of whole dry fruits and crunchy seeds steeped in pure Kashmiri honey. Packed in a generous 950g jar, this honey-nut mix offers a sweet, wholesome treat for spooning over desserts, spreading on warm toast, or enjoying straight from the jar.',
    seoTitle: 'Dry Fruits Dipped in Honey – 950g | Fit Monk',
    seoDescription: 'Order Fit Monk Dry Fruits Dipped in Honey 950g. Wholesome mixed dry fruits and seeds steeped in Kashmiri honey. Easy WhatsApp ordering and delivery.',
    faqs: [
      {
        question: 'What type of honey is used?',
        answer: 'The catalog states that dry fruits and seeds are dipped in genuine Kashmiri honey.'
      },
      {
        question: 'Is this product suitable for infants?',
        answer: 'No. In accordance with public health guidance (such as CDC guidelines), honey should never be given to infants under 12 months of age.'
      }
    ]
  },
  12: {
    name: 'Dates Dry Fruits Punch – 450g',
    displayName: 'Dates Dry Fruits Punch – 450g',
    description: 'Fit Monk Dates Dry Fruits Punch is an artisanal Indian sweet snack crafted from roasted nuts bound together with rich, natural dates. Sliced into ready-to-eat squares in a 450g pack, this date punch offers a firm, chewy texture and nutty flavor without relying on artificial fillers.',
    seoTitle: 'Dates Dry Fruits Punch – 450g | Fit Monk',
    seoDescription: 'Buy Fit Monk Dates Dry Fruits Punch 450g. Roasted nuts bound with rich dates into an Indian sweet roll. Multi-pack offers available via WhatsApp.',
    faqs: [
      {
        question: 'What does "punch" mean in this product?',
        answer: 'In Indian confectionery and the Fit Monk catalog, "punch" refers to a solid, sliced sweet block made of roasted nuts bound with fruit paste (dates), not a beverage.'
      },
      {
        question: 'Is there a multi-pack discount?',
        answer: 'Yes, the catalog notes an offer of ₹200 off when ordering two packs.'
      }
    ]
  },
  13: {
    name: 'Anjeer Dryfruits Punch – 450g',
    displayName: 'Anjeer Dryfruits Punch – 450g',
    description: 'Fit Monk Anjeer Dryfruits Punch combines dried figs (anjeer) and assorted dry fruits into a dense, chewy sweet confection. Prepared in a 450g pack with a ₹200 discount offer when buying two packs, this traditional fig punch delivers authentic nutty flavour and distinctive fig crunch.',
    seoTitle: 'Anjeer Dryfruits Punch – 450g | Fit Monk',
    seoDescription: 'Buy Fit Monk Anjeer Dryfruits Punch 450g. Traditional fig and nut confection offering rich, chewy sweetness. Enjoy multi-pack savings via WhatsApp.',
    faqs: [
      {
        question: 'What ingredients are highlighted in Anjeer Punch?',
        answer: 'The catalog highlights the rich, nutty flavor of dried figs (anjeer) combined with assorted dry fruits bound into a sweet roll format.'
      },
      {
        question: 'How does it differ from Dates Punch?',
        answer: 'Anjeer Punch is led by dried figs which provide a characteristic fig crunch, whereas Dates Punch uses a base of dates.'
      }
    ]
  },
  14: {
    name: 'Badam Elaichi Talbina – 500g',
    displayName: 'Badam Elaichi Talbina – 500g',
    description: 'Fit Monk Badam Elaichi Talbina is a traditional barley porridge powder infused with fragrant cardamom (elaichi) and crushed almonds (badam). Packaged in a 500g pouch, this wholesome barley porridge is prepared by simmering with milk or water, traditionally sweetened with pure honey for a soothing morning breakfast.',
    seoTitle: 'Badam Elaichi Talbina – 500g | Fit Monk',
    seoDescription: 'Buy Fit Monk Badam Elaichi Talbina 500g. Soothing barley porridge powder with cardamom and crushed almonds. Order online with WhatsApp confirmation.',
    faqs: [
      {
        question: 'What is Talbina?',
        answer: 'Talbina is a traditional warm and nourishing porridge made with ground whole barley, gently cooked with milk or water, and typically sweetened with honey.'
      },
      {
        question: 'Does Talbina contain gluten?',
        answer: 'Yes, barley is a gluten-containing grain. People with celiac disease or gluten intolerance should not consume barley porridge.'
      },
      {
        question: 'How is Badam Elaichi Talbina prepared?',
        answer: 'Stir the powder into cold milk or water, bring to a gentle simmer while stirring, and cook until thick and creamy before sweetening to taste.'
      }
    ]
  },
  15: {
    name: 'Kalmi Dates – 250g',
    displayName: 'Kalmi Dates – 250g',
    description: 'Fit Monk Kalmi Dates (often recognized as Safawi dates) are dark, cylindrical dates from Saudi Arabia known for their pleasantly chewy texture and balanced sweetness. Available in 250g, 500g, and 1kg packs, these Kalmi khajoor dates are well-suited for everyday snacking, breaking fasts, and family sharing.',
    seoTitle: 'Kalmi Dates – 250g | Fit Monk',
    seoDescription: 'Order Saudi Kalmi Dates 250g from Fit Monk. Dark, chewy Kalmi khajoor dates available in 250g, 500g, and 1kg packs. Fast ordering via WhatsApp.',
    faqs: [
      {
        question: 'What are Kalmi dates?',
        answer: 'Kalmi dates are a popular dark, medium-sized date variety from Saudi Arabia (frequently known in markets as Safawi), prized for their firm chew and moderate sweetness.'
      },
      {
        question: 'What pack sizes are available?',
        answer: 'Kalmi dates are available in 250g, 500g, and 1000g packs with tiered delivery terms.'
      }
    ]
  },
  16: {
    name: 'Chocolate Badam Dates Talbina – 1kg',
    displayName: 'Chocolate Badam Dates Talbina – 1kg',
    description: 'Fit Monk Chocolate Badam Dates Talbina combines wholesome barley porridge base with cocoa chocolate flavor, almonds, and sweet dates. Provided in a family-sized 1kg pack, this flavorful Talbina variant offers a comforting warm bowl when cooked with milk, appealing to both adults and children for breakfast.',
    seoTitle: 'Chocolate Badam Dates Talbina – 1kg | Fit Monk',
    seoDescription: 'Buy Fit Monk Chocolate Badam Dates Talbina 1kg. Hearty barley porridge blended with cocoa, almonds, and dates. Convenient WhatsApp order confirmation.',
    faqs: [
      {
        question: 'What ingredients are featured in this Talbina blend?',
        answer: 'The catalog specifically lists chocolate, badam (almonds), and dates blended into a barley porridge base.'
      },
      {
        question: 'How does this SKU differ from standard Chocolate Badam Talbina?',
        answer: 'This 1kg pack is cataloged specifically with dates included in the formulation and title.'
      }
    ]
  },
  17: {
    name: 'Badam Elaichi Talbina – 1kg',
    displayName: 'Badam Elaichi Talbina – 1kg',
    description: 'Fit Monk Badam Elaichi Talbina in a 1kg economy pack delivers a generous supply of traditional barley porridge powder scented with cardamom and almonds. Designed for regular household use, simply cook with milk or water and sweeten to taste for a nourishing, comforting breakfast.',
    seoTitle: 'Badam Elaichi Talbina – 1kg | Fit Monk',
    seoDescription: 'Buy Fit Monk Badam Elaichi Talbina 1kg family pack. Wholesome barley porridge with cardamom and almonds. Quick order confirmation via WhatsApp.',
    faqs: [
      {
        question: 'What is the difference between the 500g and 1kg Badam Elaichi Talbina?',
        answer: 'Both share the same cardamom and almond barley porridge formulation; the 1kg pack offers an economical larger quantity for regular breakfast routines.'
      },
      {
        question: 'How should Talbina powder be stored?',
        answer: 'Keep in a cool, dry place inside an airtight container away from direct sunlight and moisture.'
      }
    ]
  },
  18: {
    name: 'Mummy Bachcha Muesli & Talbina Combo – 1500g',
    displayName: 'Mummy Bachcha Muesli & Talbina Combo – 1500g',
    description: 'The Fit Monk Mummy Bachcha Muesli & Talbina Combo brings together three popular breakfast staples: Elaichi Badam Talbina, Chocolate Badam Talbina, and Mummy Bachcha Muesli. Listed under a 1500g catalog weight, this variety bundle allows households to sample different warm porridge and cold cereal options.',
    seoTitle: 'Mummy Bachcha Muesli & Talbina Combo – 1500g | Fit Monk',
    seoDescription: 'Fit Monk Mummy Bachcha Muesli & Talbina Combo 1500g. Includes Elaichi Badam Talbina, Chocolate Talbina & Muesli. Check bundle details via WhatsApp.',
    faqs: [
      {
        question: 'What items are named in this combo?',
        answer: 'The catalog names Elaichi Badam Talbina, Chocolate Badam Talbina, and Mummy Bachcha Muesli.'
      },
      {
        question: 'Why is this combo subject to confirmation?',
        answer: 'The catalog indicates additional items ("and more") beyond the named values; exact pack weights and contents should be verified with the seller.'
      }
    ]
  },
  19: {
    name: 'Talbina & Muesli Combo – 1500g',
    displayName: 'Talbina & Muesli Combo – 1500g',
    description: 'The Fit Monk Talbina & Muesli Combo is a 1500g breakfast bundle combining two distinct Talbina flavors—Elaichi Badam and Chocolate Badam—together with Fit Monk Dryfruits Muesli. This trio offers variety for daily breakfast, alternating between hearty cooked barley porridge and crunchy fruit muesli.',
    seoTitle: 'Talbina & Muesli Combo – 1500g | Fit Monk',
    seoDescription: 'Shop Fit Monk Talbina & Muesli Combo 1500g. Combines Elaichi Badam Talbina, Chocolate Badam Talbina, and Dryfruits Muesli. Order easily via WhatsApp.',
    faqs: [
      {
        question: 'What products make up the Talbina & Muesli Combo?',
        answer: 'The bundle brings together Elaichi Badam Talbina, Chocolate Badam Talbina, and Dryfruits Muesli.'
      },
      {
        question: 'How does this bundle help meal planning?',
        answer: 'It provides both warm cooked barley porridge and ready-to-eat muesli cereal for varied family breakfasts throughout the week.'
      }
    ]
  },
  20: {
    name: 'Jumbo Health Combo – 2950g',
    displayName: 'Jumbo Health Combo – 2950g',
    description: 'The Fit Monk Jumbo Health Combo is our largest pantry bundle, providing 2,950g of essentials: 1000g Fit Monk Dryfruits Muesli, 950g Honey Dipped Dry Fruits, and 1000g Badam Elaichi Talbina. A comprehensive supply offering breakfast porridge, cereal, and honey-coated nut snacks for the entire family.',
    seoTitle: 'Jumbo Health Combo – 2950g | Fit Monk',
    seoDescription: 'Fit Monk Jumbo Health Combo 2950g. Generous family bundle with 1kg Muesli, 950g Honey Dryfruits, and 1kg Badam Elaichi Talbina. WhatsApp ordering.',
    faqs: [
      {
        question: 'What is included in the Jumbo Health Combo?',
        answer: 'The bundle contains 1000g Fit Monk Muesli, 950g Fit Monk Honey Dryfruits, and 1000g Badam Elaichi Talbina, totaling 2,950g.'
      },
      {
        question: 'Is honey in this bundle suitable for infants?',
        answer: 'No. The included honey dryfruits must not be given to children under 12 months.'
      }
    ]
  },
  21: {
    name: 'Chocolate Badam Talbina – 500g',
    displayName: 'Chocolate Badam Talbina – 500g',
    description: 'Fit Monk Chocolate Badam Talbina blends finely milled barley flour with cocoa chocolate and almonds. In a handy 500g pack, this comforting porridge cooks quickly with warm milk to create a rich, lightly chocolatey breakfast that combines traditional barley goodness with contemporary flavor.',
    seoTitle: 'Chocolate Badam Talbina – 500g | Fit Monk',
    seoDescription: 'Order Fit Monk Chocolate Badam Talbina 500g. Hearty barley porridge powder with chocolate cocoa and almonds. Easy order confirmation via WhatsApp.',
    faqs: [
      {
        question: 'What makes Chocolate Badam Talbina popular?',
        answer: 'It offers the wholesome benefits of traditional barley porridge while incorporating cocoa and almonds, making it especially appealing for children and breakfast porridge lovers.'
      },
      {
        question: 'How is it served?',
        answer: 'Simmer gently with milk, stir continuously until thickened, and serve warm with a drizzle of honey if desired.'
      }
    ]
  },
  22: {
    name: 'Combo Talbina – 1000g',
    displayName: 'Combo Talbina – 1000g',
    description: 'The Fit Monk Combo Talbina package pairs two 500g bags: one bag of Badam Elaichi Talbina and one bag of Chocolate Badam Talbina, totaling 1kg of barley porridge. It allows you to rotate between traditional aromatic cardamom and rich cocoa flavors throughout the week.',
    seoTitle: 'Combo Talbina – 1000g | Fit Monk',
    seoDescription: 'Buy Fit Monk Combo Talbina 1000g. Includes 500g Badam Elaichi Talbina + 500g Chocolate Badam Talbina. WhatsApp order confirmation and delivery.',
    faqs: [
      {
        question: 'Which packs are inside Combo Talbina?',
        answer: 'It contains one 500g bag of Badam Elaichi Talbina and one 500g bag of Chocolate Badam Talbina (code: ECTAL1K).'
      },
      {
        question: 'Can I prepare both flavors the same way?',
        answer: 'Yes, both flavors cook easily with warm milk or water on the stove until reaching a creamy porridge consistency.'
      }
    ]
  },
  23: {
    name: 'Mummy Bachcha Muesli – 500g',
    displayName: 'Mummy Bachcha Muesli – 500g',
    description: 'Fit Monk Mummy Bachcha Muesli is a dedicated 500g breakfast cereal blend featuring wholesome rolled grains, seeds, and dried fruit bits. Crafted for quick morning meals, it can be served chilled with milk or layered with yogurt, fruit slices, and honey for the family breakfast table.',
    seoTitle: 'Mummy Bachcha Muesli – 500g | Fit Monk',
    seoDescription: 'Buy Fit Monk Mummy Bachcha Muesli 500g online. Delicious breakfast grain cereal blend with seeds and fruit bits. Order easily via WhatsApp.',
    faqs: [
      {
        question: 'What is Mummy Bachcha Muesli?',
        answer: 'It is a 500g breakfast cereal blend from Fit Monk described in the catalog as a nutritious and versatile morning option.'
      },
      {
        question: 'How should this muesli be served?',
        answer: 'It can be enjoyed with cold milk, warm milk, or stirred into fresh yogurt with sliced fresh fruits.'
      }
    ]
  },
  24: {
    name: 'Fit Monk Honey Dryfruits – 500g',
    displayName: 'Fit Monk Honey Dryfruits – 500g',
    description: 'Fit Monk Honey Dryfruits (500g) brings together assorted crunchy nuts and seeds immersed in genuine Kashmiri honey. A convenient smaller jar size compared to the 950g edition, it makes an appetizing standalone treat, oatmeal mix-in, or elegant gift for festive occasions.',
    seoTitle: 'Fit Monk Honey Dryfruits – 500g | Fit Monk',
    seoDescription: 'Order Fit Monk Honey Dryfruits 500g. Crunchy mixed nuts and seeds soaked in pure Kashmiri honey. Fast order confirmation and shipping via WhatsApp.',
    faqs: [
      {
        question: 'What is in Fit Monk Honey Dryfruits?',
        answer: 'Assorted crunchy dry fruits and seeds steeped in natural Kashmiri honey.'
      },
      {
        question: 'Is this safe for infants?',
        answer: 'No. Natural honey carries a risk of infant botulism and must never be fed to children under 1 year of age.'
      }
    ]
  }
};

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let count = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const num = data.catalogNumber;
  if (!num || !updates[num]) {
    console.warn(`No update found for ${file} (catalog #${num})`);
    continue;
  }
  const u = updates[num];
  data.name = u.name;
  data.displayName = u.displayName;
  data.description = u.description;
  data.seoTitle = u.seoTitle;
  data.seoDescription = u.seoDescription;
  if (u.ingredients) data.ingredients = u.ingredients;
  data.faqs = u.faqs;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  count++;
  console.log(`Updated #${num}: ${u.name}`);
}

console.log(`Successfully updated ${count} products.`);
