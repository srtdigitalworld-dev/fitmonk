// Fit Monk Server-Side Coupon Engine
// Validates coupons, enforces usage limits, checks time windows, and calculates discounts.

import type { CouponEntity, CouponValidationRequest, CouponValidationResult } from '../types/coupon';
import { formatPaise } from '../types/common';

export class CouponEngine {
  /**
   * Hydrates a CouponEntity from a D1 database row
   */
  static fromDbRow(row: any): CouponEntity {
    return {
      id: row.id,
      code: row.code,
      description: row.description ?? null,
      discountType: row.discount_type,
      discountValue: Number(row.discount_value),
      minOrderValuePaise: Number(row.min_order_value_paise) || 0,
      maxDiscountPaise: row.max_discount_paise !== null ? Number(row.max_discount_paise) : null,
      startAt: row.start_at !== null ? Number(row.start_at) : null,
      expiresAt: row.expires_at !== null ? Number(row.expires_at) : null,
      isActive: Boolean(row.is_active),
      maxTotalUses: row.max_total_usage !== null ? Number(row.max_total_usage) : null,
      currentTotalUses: Number(row.total_used_count) || 0,
      maxUsesPerCustomer: Number(row.max_usage_per_customer) || 1,
      scope: (row.scope === 'storewide' || row.scope === 'store') ? 'store' : (row.scope as any),
      targetIds: row.target_ids ? (typeof row.target_ids === 'string' ? JSON.parse(row.target_ids) : row.target_ids) : null,
      createdAt: Number(row.created_at) || 0,
      updatedAt: Number(row.updated_at) || 0
    };
  }

  /**
   * Evaluates a coupon against a shopping cart payload
   */
  static validate(
    coupon: CouponEntity,
    request: CouponValidationRequest,
    currentCustomerUsageCount = 0,
    currentTimestamp = Math.floor(Date.now() / 1000)
  ): CouponValidationResult {
    const code = coupon.code.toUpperCase();

    // 1. Active switch
    if (!coupon.isActive) {
      return {
        isValid: false,
        code,
        discountPaise: 0,
        discountFormatted: formatPaise(0),
        newSubtotalPaise: request.subtotalPaise,
        newSubtotalFormatted: formatPaise(request.subtotalPaise),
        message: 'This coupon is currently inactive.',
        error: 'COUPON_INACTIVE'
      };
    }

    // 2. Start date check
    if (coupon.startAt !== null && currentTimestamp < coupon.startAt) {
      return {
        isValid: false,
        code,
        discountPaise: 0,
        discountFormatted: formatPaise(0),
        newSubtotalPaise: request.subtotalPaise,
        newSubtotalFormatted: formatPaise(request.subtotalPaise),
        message: 'This coupon offer has not started yet.',
        error: 'COUPON_NOT_STARTED'
      };
    }

    // 3. Expiry date check
    if (coupon.expiresAt !== null && currentTimestamp > coupon.expiresAt) {
      return {
        isValid: false,
        code,
        discountPaise: 0,
        discountFormatted: formatPaise(0),
        newSubtotalPaise: request.subtotalPaise,
        newSubtotalFormatted: formatPaise(request.subtotalPaise),
        message: 'This coupon has expired.',
        error: 'COUPON_EXPIRED'
      };
    }

    // 4. Global total usage limit
    if (coupon.maxTotalUses !== null && coupon.currentTotalUses >= coupon.maxTotalUses) {
      return {
        isValid: false,
        code,
        discountPaise: 0,
        discountFormatted: formatPaise(0),
        newSubtotalPaise: request.subtotalPaise,
        newSubtotalFormatted: formatPaise(request.subtotalPaise),
        message: 'This coupon has reached its maximum redemption limit.',
        error: 'MAX_USAGE_REACHED'
      };
    }

    // 5. Customer usage limit (by phone)
    if (request.customerPhone && currentCustomerUsageCount >= coupon.maxUsesPerCustomer) {
      return {
        isValid: false,
        code,
        discountPaise: 0,
        discountFormatted: formatPaise(0),
        newSubtotalPaise: request.subtotalPaise,
        newSubtotalFormatted: formatPaise(request.subtotalPaise),
        message: `This coupon has already been redeemed ${coupon.maxUsesPerCustomer} time(s) for your mobile number.`,
        error: 'CUSTOMER_LIMIT_REACHED'
      };
    }

    // 6. Minimum order value in paise
    if (request.subtotalPaise < coupon.minOrderValuePaise) {
      return {
        isValid: false,
        code,
        discountPaise: 0,
        discountFormatted: formatPaise(0),
        newSubtotalPaise: request.subtotalPaise,
        newSubtotalFormatted: formatPaise(request.subtotalPaise),
        message: `Minimum order value for coupon ${code} is ${formatPaise(coupon.minOrderValuePaise)}.`,
        error: 'MIN_ORDER_NOT_MET'
      };
    }

    // 7. Scope calculation (Store-wide vs Category vs Product)
    let eligibleSubtotalPaise = 0;

    if (coupon.scope === 'store') {
      eligibleSubtotalPaise = request.subtotalPaise;
    } else if (coupon.scope === 'category') {
      const allowedCategories = new Set(coupon.targetIds ?? []);
      eligibleSubtotalPaise = request.items
        .filter(item => item.categoryId && allowedCategories.has(item.categoryId))
        .reduce((sum, item) => sum + item.lineTotalPaise, 0);

      if (eligibleSubtotalPaise === 0) {
        return {
          isValid: false,
          code,
          discountPaise: 0,
          discountFormatted: formatPaise(0),
          newSubtotalPaise: request.subtotalPaise,
          newSubtotalFormatted: formatPaise(request.subtotalPaise),
          message: 'This coupon is only valid on specific product categories.',
          error: 'NO_ELIGIBLE_CATEGORY_ITEMS'
        };
      }
    } else if (coupon.scope === 'product') {
      const allowedProducts = new Set(coupon.targetIds ?? []);
      eligibleSubtotalPaise = request.items
        .filter(item => allowedProducts.has(item.productId))
        .reduce((sum, item) => sum + item.lineTotalPaise, 0);

      if (eligibleSubtotalPaise === 0) {
        return {
          isValid: false,
          code,
          discountPaise: 0,
          discountFormatted: formatPaise(0),
          newSubtotalPaise: request.subtotalPaise,
          newSubtotalFormatted: formatPaise(request.subtotalPaise),
          message: 'This coupon is only valid on specific selected products.',
          error: 'NO_ELIGIBLE_PRODUCT_ITEMS'
        };
      }
    }

    // 8. Discount computation
    let calculatedDiscountPaise = 0;

    if (coupon.discountType === 'percentage') {
      calculatedDiscountPaise = Math.round((eligibleSubtotalPaise * coupon.discountValue) / 100);
      if (coupon.maxDiscountPaise !== null && calculatedDiscountPaise > coupon.maxDiscountPaise) {
        calculatedDiscountPaise = coupon.maxDiscountPaise;
      }
    } else if (coupon.discountType === 'fixed') {
      calculatedDiscountPaise = Math.min(coupon.discountValue, eligibleSubtotalPaise);
    }

    // Safety guard: discount can never exceed total cart subtotal
    calculatedDiscountPaise = Math.min(calculatedDiscountPaise, request.subtotalPaise);
    const newSubtotalPaise = request.subtotalPaise - calculatedDiscountPaise;

    return {
      isValid: true,
      code,
      discountPaise: calculatedDiscountPaise,
      discountFormatted: formatPaise(calculatedDiscountPaise),
      newSubtotalPaise,
      newSubtotalFormatted: formatPaise(newSubtotalPaise),
      message: `Coupon ${code} applied successfully! You saved ${formatPaise(calculatedDiscountPaise)}.`,
      couponDetails: {
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        scope: coupon.scope
      }
    };
  }
}
