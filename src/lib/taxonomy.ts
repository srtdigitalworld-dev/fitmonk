import { categories } from '../data/categories';
import type { Product } from './product-schema';
export const inCategory = (p: Product, slug: string) => p.category === slug || p.subcategory === slug || p.additionalCategories.includes(slug);
export const categoryFor = (p: Product) => categories.find(c => c.slug === p.subcategory) ?? categories.find(c => c.slug === p.category);
export const introductions: Record<string,string> = {
  'seeds-nuts-snack-mixes': 'Explore the five-seed mix, roasted dryfruits and seeds mix, and the Power Snacks Combo.',
  breakfast: 'Browse muesli, Talbina and breakfast combinations from the catalog.',
  muesli: 'Compare the Dryfruits, Seeds and Fruits Muesli with Mummy Bachcha Muesli.',
  talbina: 'Browse the separately listed Badaam Elaichi and Chocolate Badam Talbina packs.',
  'dates-date-sweets': 'Explore Ajwa, Medjool and Kalmi dates alongside Omani barfi.',
  'dried-fruits-fruit-sweets': 'Find anjeer, dried fruits cocktail, dates punch and anjeer punch.',
  'honey-dryfruits': 'Two separately listed honey dryfruits products, in 500g and 950g packs.',
  'combos-bundles': 'Compare catalog combinations. Incomplete bundle contents are marked for seller clarification.',
};
export const learnHubs = [['seeds-and-mixes','Seeds and mixes'],['muesli-breakfast','Muesli and breakfast'],['talbina','Talbina'],['dates-and-khajoor','Dates and khajoor'],['anjeer-and-dried-fruits','Anjeer and dried fruits'],['honey-dryfruits','Honey dryfruits'],['recipes-and-use-ideas','Recipes and use ideas'],['labels-allergens-and-storage','Labels, allergens and storage']] as const;

export const learnGuideMap: Record<string, { title: string; linkText: string }> = {
  'seeds-and-mixes': { title: 'Seed Mixes Explained: Five Seeds & Roasted Mixes', linkText: 'Explore our Seed Mixes Guide' },
  'muesli-breakfast': { title: 'Muesli & Breakfast Guide: Cereal, Oats & Serving Formats', linkText: 'Explore our Muesli & Breakfast Guide' },
  'talbina': { title: 'Talbina 101: Barley Porridge, Packs & Preparation', linkText: 'Read our Talbina 101 Guide' },
  'dates-and-khajoor': { title: 'Dates Varieties Guide: Ajwa, Medjool & Kalmi', linkText: 'Explore our Dates & Khajoor Varieties Guide' },
  'anjeer-and-dried-fruits': { title: 'Anjeer & Dried Fruits Guide: Figs, Cocktail & Punch', linkText: 'Explore our Anjeer & Dried Fruits Guide' },
  'honey-dryfruits': { title: 'Honey Dryfruits Buying & Storage Guide', linkText: 'Read our Honey Dryfruits Guide' },
  'recipes-and-use-ideas': { title: 'Recipes & Serving Ideas', linkText: 'Explore Recipes & Serving Ideas' },
  'labels-allergens-and-storage': { title: 'Packaged-Food Label, Allergen & Storage Guide', linkText: 'Read our Label & Storage Guide' },
};

