import type { CouponDiscountType, CouponScope } from './common';

export interface CouponEntity {
  id: string;
  code: string;
  description: string | null;
  discountType: CouponDiscountType;
  discountValue: number; // Percentage (e.g., 10) or Paise (e.g., 10000 = ₹100)
  minOrderValuePaise: number;
  maxDiscountPaise: number | null;
  startAt: number | null; // Unix timestamp
  expiresAt: number | null; // Unix timestamp
  isActive: boolean;
  maxTotalUses: number | null;
  currentTotalUses: number;
  maxUsesPerCustomer: number;
  scope: CouponScope;
  targetIds: string[] | null; // Array of category or product slugs/IDs
  createdAt: number;
  updatedAt: number;
}

export interface CouponRedemptionEntity {
  id: string;
  couponId: string;
  orderId: string | null;
  customerPhone: string;
  discountAmountPaise: number;
  orderSubtotalPaise: number;
  redeemedAt: number;
}

export interface CouponValidationRequest {
  code: string;
  customerPhone?: string;
  items: Array<{
    productId: string;
    variantId?: string | null;
    categoryId?: string | null;
    unitPricePaise: number;
    quantity: number;
    lineTotalPaise: number;
  }>;
  subtotalPaise: number;
}

export interface CouponValidationResult {
  isValid: boolean;
  code: string;
  discountPaise: number;
  discountFormatted: string;
  newSubtotalPaise: number;
  newSubtotalFormatted: string;
  message: string;
  error?: string;
  couponDetails?: {
    discountType: CouponDiscountType;
    discountValue: number;
    scope: CouponScope;
  };
}
