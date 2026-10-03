export interface CategoryEntity {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ProductVariantEntity {
  id: string;
  productId: string;
  variantKey: string;
  packSize: string;
  sku: string | null;
  pricePaise: number;
  compareAtPricePaise: number | null;
  weightGrams: number | null;
  isAvailable: boolean;
  shippingAmountPaise: number | null;
  shippingFree: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MediaEntity {
  id: string;
  filename: string;
  objectKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  uploaderAdminId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface ProductEntity {
  id: string;
  catalogNumber: number | null;
  slug: string;
  name: string;
  sourceName: string | null;
  displayName: string | null;
  shortName: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  description: string | null;
  pricePaise: number;
  compareAtPricePaise: number | null;
  currency: string;
  packSize: string | null;
  sku: string | null;
  weightGrams: number | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  nutrition: Record<string, unknown> | null;
  storage: string | null;
  shippingText: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  isAvailable: boolean;
  isFeatured: boolean;
  isOrderable: boolean;
  kind: 'product' | 'bundle';
  learnHub: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  faqs: Array<{ question: string; answer: string }>;
  promotions: Array<{ variantId: string | null; quantity: number; total: number; freeShipping: boolean }>;
  variants?: ProductVariantEntity[];
  media?: Array<MediaEntity & { role: string; sortOrder: number }>;
  createdAt: number;
  updatedAt: number;
}
