export const categories = [
  { slug: 'seeds-nuts-snack-mixes', name: 'Seeds, Nuts & Snack Mixes', parent: null },
  { slug: 'breakfast', name: 'Breakfast', parent: null },
  { slug: 'muesli', name: 'Muesli', parent: 'breakfast' },
  { slug: 'talbina', name: 'Talbina', parent: 'breakfast' },
  { slug: 'dates-date-sweets', name: 'Dates & Date Sweets', parent: null },
  { slug: 'dried-fruits-fruit-sweets', name: 'Dried Fruits & Fruit Sweets', parent: null },
  { slug: 'honey-dryfruits', name: 'Honey Dryfruits', parent: null },
  { slug: 'combos-bundles', name: 'Combos & Bundles', parent: null },
] as const;
export type CategorySlug = (typeof categories)[number]['slug'];
