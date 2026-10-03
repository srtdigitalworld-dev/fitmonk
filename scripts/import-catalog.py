"""Reproducible import of the supplied PDF, with explicit editorial decisions.
Run with Python + pypdf + Pillow. No external product facts are imported.
"""
from pathlib import Path
from pypdf import PdfReader
import re, json

root = Path(__file__).resolve().parents[1]
reader = PdfReader(root / 'source-assets/Fit Monk Catalog PDF (1).pdf')
records = {}
for page_number, page in enumerate(reader.pages, 1):
    text = page.extract_text()
    starts = list(re.finditer(r'(?m)^(\d{1,2})\.\s+', text))
    for index, match in enumerate(starts):
        block = text[match.end(): starts[index+1].start() if index+1 < len(starts) else len(text)].strip()
        name, rest = block.split('₹', 1)
        price_line, description = rest.split('\n', 1)
        prices = re.findall(r'[\d,]+\.\d{2}', price_line)
        records[int(match.group(1))] = dict(name=' '.join(name.split()), price=round(float(prices[0].replace(',',''))*100), compare=round(float(prices[1].replace(',',''))*100) if len(prices)>1 else None, description=' '.join(description.split()), page=page_number, block=block)
assert sorted(records) == list(range(1,25))

# Canonical pages stay separate where composition equivalence is not verified.
names = ['Roasted Dryfruits and Seeds Mix','Power Snacks Combo','5 Seeds Mix','Fit Monk Dryfruits, Seeds and Fruits Muesli','Turkish Anjeer','Omani Barfi — Dates Arabic Barfi','Saudi Ajwa Dates','Medjool Dates','Health Combo','Dried Fruits Cocktail','Dry Fruits Dipped in Honey','Dates Dry Fruits Punch','Anjeer Dryfruits Punch','Badaam Elaichi Talbina — 500g','Kalmi Dates','Chocolate Badam Dates Talbina — 1kg','Badaam Elaichi Talbina — 1000g','Mummy Bachcha Muesli–Talbina Combo','Talbina–Muesli Combo','Jumbo Health Combo','Chocolate Badam Talbina — 500g','Combo Talbina','Mummy Bachcha Muesli','Fit Monk Honey Dryfruits — 500g']
slugs = ['roasted-dryfruits-seeds-mix-250g','power-snacks-combo','five-seeds-mix','dryfruits-seeds-fruits-muesli','turkish-anjeer','omani-barfi','ajwa-dates','medjool-dates','health-combo','dried-fruits-cocktail','dry-fruits-dipped-in-honey-950g','dates-dry-fruits-punch','anjeer-dryfruits-punch','badaam-elaichi-talbina-500g','kalmi-dates','chocolate-badam-dates-talbina-1kg','badaam-elaichi-talbina-1000g','mummy-bachcha-muesli-talbina-combo','talbina-muesli-combo','jumbo-health-combo','chocolate-badam-talbina-500g','combo-talbina','mummy-bachcha-muesli','fit-monk-honey-dryfruits-500g']
weights = [250,750,250,500,250,500,250,250,1500,500,950,450,450,500,250,1000,1000,None,1500,2950,500,1000,500,500]
descriptions = [
 'A 250g mix described in the catalog as roasted cashew, almonds, seeds and dehydrated fruits.',
 'Three 250g packs: roasted dryfruits and seeds mix, dehydrated fruits cocktail, and five-seed mix.',
 'Flax, watermelon, pumpkin, muskmelon and sunflower seeds, mixed in equal proportions according to the catalog.',
 'Dryfruits, seeds and fruits muesli. The catalog lists a 500g pack and a two-pack offer.',
 'Anjeer listed in 250g, 500g and 1000g packs.',
 'The catalog describes this barfi as chopped dates, nuts and clarified butter (desi ghee).',
 'Ajwa dates listed in 250g, 500g and 1000g packs. The 250g price needs confirmation.',
 'Medjool dates listed in 250g, 500g and 1000g packs. Shipping terms need confirmation.',
 'The catalog lists 500g muesli and 500g honey dryfruits within this 1500g combo. The remaining contents need confirmation.',
 'Dried fruits cocktail, listed in 500g and 1000g packs.',
 'A 950g pack of dry fruits and seeds dipped in honey, as described in the catalog.',
 'A 450g dates dry fruits punch. The catalog describes roasted nuts bound together.',
 'A 450g anjeer dryfruits punch, described with anjeer and dry fruits.',
 'A 500g pack listed as Badaam Elaichi Talbina. Product-specific ingredients and preparation directions are not supplied.',
 'Kalmi dates listed in 250g, 500g and 1000g packs. Shipping terms need confirmation.',
 'A 1kg pack listed as Chocolate Badam Dates Talbina.',
 'A 1000g pack listed as Badaam Elaichi Talbina. Product-specific ingredients and preparation directions are not supplied.',
 'A combo naming Elaichi Badam Talbina, Chocolate Badam Talbina and Mummy Bachcha Muesli. Exact contents and pack weights need confirmation.',
 'A 1500g combo naming Elaichi Badam Talbina, Chocolate Badam Talbina and Dryfruits Muesli. Exact contents need confirmation.',
 'A combo listing 1000g muesli, 950g honey dryfruits and 1000g badam Elaichi. The additional-content wording needs confirmation.',
 'A 500g pack listed as Chocolate Badam Talbina. It is kept separate from the product named Chocolate Badam Dates Talbina.',
 'One 500g Elaichi Badam Talbina pack and one 500g Chocolate Badam Talbina pack.',
 'A 500g muesli listed as Mummy Bachcha Muesli. The name does not establish age suitability.',
 'A 500g pack of dry fruits and seeds dipped in honey, as described in the catalog.'
]
groups = {'seeds-nuts-snack-mixes':[1,2,3], 'breakfast':[4,14,16,17,18,19,21,22,23], 'dates-date-sweets':[6,7,8,15], 'dried-fruits-fruit-sweets':[5,10,12,13], 'honey-dryfruits':[11,24], 'combos-bundles':[2,9,18,19,20,22]}
bundles = groups['combos-bundles']
def rule(amount=None, free=False, mode='single-pack', notes=None):
    return dict(amount=None if amount is None else amount*100,freeShippingThreshold=None,freeShipping=free,chargeBasis='per-line',thresholdBasis=None,weightBands=None,reviewNotes=notes or [],catalogMode=mode)
def variant(grams, price, shipping, sku=None, compare=None, label=None, vid=None):
    return dict(id=vid or str(grams)+'g',packSize=label or str(grams)+'g',sku=sku,price=None if price is None else price*100,compareAtPrice=None if compare is None else compare*100,available=None,weightGrams=grams,shipping=shipping)
variants = {
 3:[variant(250,299,rule(49,mode='order-under-1kg'),compare=349),variant(500,499,rule(49,mode='order-under-1kg')),variant(1000,899,rule(0,True))],
 4:[variant(500,375,rule(49),compare=376),variant(1000,699,rule(0,True),label='2 × 500g',vid='2x500g'),variant(1000,None,None,label='1000g — price unconfirmed')],
 5:[variant(250,449,rule(60)),variant(500,849,rule(60)),variant(1000,1575,rule(0,True))],
 7:[variant(250,None,rule(60)),variant(500,849,rule(60)),variant(1000,1550,None)],
 8:[variant(250,449,rule(notes=['Free shipping conflicts with ₹60.']),sku='MED250',compare=499),variant(500,849,rule(notes=['Free shipping conflicts with ₹60.'])),variant(1000,1550,None)],
 10:[variant(500,499,None),variant(1000,849,rule(0,True))],
 15:[variant(250,249,rule(notes=['Free shipping conflicts with ₹60.'])),variant(500,449,rule(notes=['Free shipping conflicts with ₹60.'])),variant(1000,849,None)],
}
notes = {2:['Comho normalized to Combo; source spelling retained. Cocktail component is not confirmed equivalent to the standalone 500g product.'],4:['The title mentions 1000g without a standalone price. BUY 3 X 500g and more has no complete offer terms.'],7:['250g card price ₹499 conflicts with description price ₹449.'],8:['Jordon is retained in the catalog name; origin is not asserted. Shipping says both free and ₹60 for small packs.'],9:['Incomplete bundle: the two named 500g packs do not account for the stated 1500g.'],11:['Equivalence with the 500g honey product is unverified.'],14:['Generic porridge wording is not a product ingredient list. Composition equivalence with 1000g is unverified.'],15:['Shipping says both free and ₹60 for small packs.'],16:['Choclate normalized to Chocolate. Dates appears in this name but not in the 500g product; formulation equivalence unverified.'],17:['Generic porridge wording is not a product ingredient list. Composition equivalence with 500g is unverified.'],18:['1500 has no unit in the source name. Component weights and “and more” are unresolved.'],19:['Component weights and “and more” are unresolved.'],20:['Listed weights already total 2950g; “and more” is unresolved.'],21:['Composition equivalence with Chocolate Badam Dates Talbina is unverified.'],23:['Mummy Bachcha is a catalog name, not a verified age-suitability claim.'],24:['Equivalence with the 950g honey product is unverified.']}
conflicts = {7:[dict(field='price:250g',values=['₹499 card','₹449 description'],note='Do not select either price without confirmation.')],8:[dict(field='shipping',values=['Free Shipping','250g/500g + ₹60'],note='Shipping to be confirmed.')],15:[dict(field='shipping',values=['free shipping','250g/500g + ₹60'],note='Shipping to be confirmed.')],20:[dict(field='contents',values=['1000g + 950g + 1000g = 2950g','and more'],note='Confirm full component list and weight.')]}
images = {}
for page_index, product_ids in {0:[1,2,3],1:[8],2:[10],4:[17],5:[22]}.items():
    embedded = list(reader.pages[page_index].images)
    assert len(embedded) == len(product_ids), (page_index,len(embedded))
    for img, number in zip(embedded,product_ids):
        im = img.image.convert('RGB'); directory=root/'public/images/products'; directory.mkdir(parents=True,exist_ok=True)
        sources=[]
        for max_width in [320,640,960]:
            copy=im.copy(); copy.thumbnail((max_width,max_width*2)); filename=f'catalog-{number}-{max_width}.webp'; copy.save(directory/filename,'WEBP',quality=85)
            sources.append(dict(src='/images/products/'+filename,width=copy.width))
        # Width candidates must be unique when the catalog image is small.
        sources=list({s['width']:s for s in sources}.values())
        images[number]=[dict(src=sources[-1]['src'],alt=names[number-1]+' — catalog image',width=copy.width,height=copy.height,sources=sources)]

out=root/'src/content/products';out.mkdir(parents=True,exist_ok=True)
for number, raw in records.items():
    category=next(g for g,ids in groups.items() if number in ids)
    if number in bundles: category='combos-bundles'
    sub='muesli' if number in [4,23] else 'talbina' if number in [14,16,17,21] else None
    extra=[g for g,ids in groups.items() if number in ids and g!=category]
    hub='muesli-breakfast' if sub=='muesli' else 'talbina' if sub=='talbina' or number in [18,19,22] else {'seeds-nuts-snack-mixes':'seeds-and-mixes','dates-date-sweets':'dates-and-khajoor','dried-fruits-fruit-sweets':'anjeer-and-dried-fruits','honey-dryfruits':'honey-dryfruits'}.get(category,'labels-allergens-and-storage')
    sku={1:'DFMIX250',8:'MED250',17:'TAL1K',22:'ECTAL1K'}.get(number)
    review=notes.get(number,[])
    weight=weights[number-1]
    shipping=rule(49,mode='order-under-1kg') if number in [1,2] else None
    related=[n for n in groups[category] if n!=number][:3]
    if number==22: related=[14,21]
    if number in [14,21]: related=[22]+[n for n in related if n!=22][:2]
    product=dict(id=f'fm-{number:02}',catalogNumber=number,slug=slugs[number-1],name=names[number-1],sourceName=raw['name'],displayName=names[number-1],shortName=None,category=category,subcategory=sub,additionalCategories=extra,description=descriptions[number-1],images=images.get(number,[]),price=None if number==7 else raw['price'],compareAtPrice=raw['compare'],currency='INR',packSize=str(weight)+'g' if weight else None,sku=sku,ingredients=['Flax seeds','Watermelon seeds','Pumpkin seeds','Muskmelon seeds','Sunflower seeds'] if number==3 else None,allergens=None,nutrition=None,storage=None,shipping=shipping,shippingText=raw['description'] if any(s in raw['description'].lower() for s in ['shipping','+49','+60']) else None,weightGrams=weight,available=None,featured=number in [1,3,5,10],variants=variants.get(number,[]),relatedProducts=[f'fm-{n:02}' for n in related],seoTitle=f'{names[number-1]} | Fit Monk',seoDescription=descriptions[number-1]+' View packs and prepare a WhatsApp order.',status='review',reviewRequired=bool(review),reviewNotes=review,orderable=number not in [9,18,19,20],kind='bundle' if number in bundles else 'product',learnHub=hub,promotions=[],source=dict(reference=f'Fit Monk Catalog PDF (1).pdf, page {raw["page"]}, item {number}',raw=dict(sourceName=raw['name'],cardPricePaise=raw['price'],compareAtPricePaise=raw['compare'],description=raw['description'],text=raw['block']),conflicts=conflicts.get(number,[])))
    if number==4: product['promotions']=[dict(variantId='500g',quantity=2,total=69900,freeShipping=True)]
    if number in [12,13]: product['promotions']=[dict(variantId=None,quantity=2,total=raw['price']*2-20000,freeShipping=False)]
    if number in [1,2,3]:
        product['source']['raw']['imageReview'] = 'Catalog artwork contains unverified nutrition/health claims; withheld from display pending review.'
        product['source']['raw']['catalogImages'] = product['images']
        product['images'] = []
    (out/f'{number:02}-{slugs[number-1]}.json').write_text(json.dumps(product,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'Imported {len(records)} records; {sum(len(v) for v in variants.values())} pack options; {len(images)} catalog images. No cross-record family merges.')
