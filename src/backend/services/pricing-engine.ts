// Fit Monk Authoritative Server-Side Pricing Engine
// Never trusts client calculations for prices, discounts, delivery fees, or totals.

export interface PricingLineItem {
  productId: string;
  variantId: string | null;
  productName: string;
  unitPricePaise: number;
  quantity: number;
  weightGrams?: number | null;
  categoryId?: string | null;
}

export interface PricingCalculationInput {
  items: PricingLineItem[];
  discountPaise?: number;
  couponCode?: string | null;
  deliveryMethodCode?: string;
  deliveryFeePaise?: number;
  freeShippingThresholdPaise?: number;
  taxRatePercent?: number; // E.g., 0 for current tax-inclusive pricing, or 5 for 5% GST
}

export interface PricingCalculationResult {
  lines: Array<PricingLineItem & { lineTotalPaise: number }>;
  subtotalPaise: number;
  discountPaise: number;
  couponCode: string | null;
  shippingPaise: number;
  taxPaise: number;
  grandTotalPaise: number;
  totalWeightGrams: number;
}

export class PricingEngine {
  /**
   * Authoritatively computes line totals and cart subtotal in integer paise
   */
  static calculateSubtotal(items: PricingLineItem[]): {
    lines: Array<PricingLineItem & { lineTotalPaise: number }>;
    subtotalPaise: number;
    totalWeightGrams: number;
  } {
    let subtotalPaise = 0;
    let totalWeightGrams = 0;

    const evaluatedLines = items.map(item => {
      const lineTotalPaise = item.unitPricePaise * item.quantity;
      subtotalPaise += lineTotalPaise;
      totalWeightGrams += (item.weightGrams ?? 0) * item.quantity;

      return {
        ...item,
        lineTotalPaise
      };
    });

    return {
      lines: evaluatedLines,
      subtotalPaise,
      totalWeightGrams
    };
  }

  /**
   * Computes delivery/shipping charge based on delivery method, subtotal, and weight
   */
  static calculateShipping(
    subtotalPaise: number,
    _totalWeightGrams?: number,
    baseRatePaise = 4900, // ₹49 standard default
    freeShippingThresholdPaise = 50000 // ₹500 default free shipping threshold
  ): number {
    // If order subtotal meets or exceeds the free shipping threshold
    if (subtotalPaise >= freeShippingThresholdPaise) {
      return 0;
    }
    return baseRatePaise;
  }

  /**
   * Computes tax in paise (Fit Monk pricing is currently MRP tax-inclusive)
   */
  static calculateTax(taxableAmountPaise: number, taxRatePercent = 0): number {
    if (!taxRatePercent || taxRatePercent <= 0) return 0;
    return Math.round((taxableAmountPaise * taxRatePercent) / 100);
  }

  /**
   * Central calculation pipeline:
   * Grand Total = Subtotal - Discount + Shipping + Tax
   */
  static calculateOrderTotal(input: PricingCalculationInput): PricingCalculationResult {
    const { lines, subtotalPaise, totalWeightGrams } = this.calculateSubtotal(input.items);

    const discountPaise = Math.max(0, Math.min(input.discountPaise ?? 0, subtotalPaise));
    const discountedSubtotal = subtotalPaise - discountPaise;

    let shippingPaise = input.deliveryFeePaise ?? this.calculateShipping(
      discountedSubtotal,
      totalWeightGrams,
      4900,
      input.freeShippingThresholdPaise ?? 50000
    );

    const taxPaise = this.calculateTax(discountedSubtotal, input.taxRatePercent ?? 0);
    const grandTotalPaise = Math.max(0, discountedSubtotal + shippingPaise + taxPaise);

    return {
      lines,
      subtotalPaise,
      discountPaise,
      couponCode: input.couponCode ?? null,
      shippingPaise,
      taxPaise,
      grandTotalPaise,
      totalWeightGrams
    };
  }
}
