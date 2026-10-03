// Fit Monk Edge API: POST /api/coupons/validate
// Server-side authoritative coupon validation endpoint.

import { CouponEngine } from '../../../src/backend/services/coupon-engine';
import type { CouponEntity, CouponValidationRequest } from '../../../src/backend/types/coupon';

interface Env {
  DB?: any;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const body = await request.json().catch(() => null) as any;

    if (!body || !body.code || typeof body.code !== 'string') {
      return new Response(
        JSON.stringify({
          isValid: false,
          error: 'INVALID_PAYLOAD',
          message: 'Coupon code is required.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const code = body.code.trim().toUpperCase();
    const subtotalPaise = Number(body.subtotalPaise) || 0;
    const customerPhone = body.customerPhone ? String(body.customerPhone).trim() : undefined;
    const items = Array.isArray(body.items) ? body.items : [];

    const validationReq: CouponValidationRequest = {
      code,
      subtotalPaise,
      customerPhone,
      items
    };

    // If D1 is connected, query the database
    if (env.DB) {
      const stmt = env.DB.prepare(
        `SELECT * FROM coupons WHERE UPPER(code) = ? AND is_active = 1 LIMIT 1`
      );
      const row = await stmt.bind(code).first();

      if (!row) {
        return new Response(
          JSON.stringify({
            isValid: false,
            code,
            discountPaise: 0,
            discountFormatted: '₹0.00',
            newSubtotalPaise: subtotalPaise,
            newSubtotalFormatted: `₹${(subtotalPaise / 100).toFixed(2)}`,
            message: 'Coupon code not found or invalid.',
            error: 'COUPON_NOT_FOUND'
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const coupon = CouponEngine.fromDbRow(row);

      // Check customer usage count if phone provided
      let customerUsage = 0;
      if (customerPhone) {
        const usageStmt = env.DB.prepare(
          `SELECT COUNT(*) as count FROM coupon_redemptions WHERE coupon_id = ? AND customer_phone = ?`
        );
        const usageRow = await usageStmt.bind(coupon.id, customerPhone).first();
        customerUsage = usageRow ? Number(usageRow.count) : 0;
      }

      const result = CouponEngine.validate(coupon, validationReq, customerUsage);
      return new Response(JSON.stringify(result), {
        status: result.isValid ? 200 : 422,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback/Local Development Preview Mode (when D1 is not bound locally)
    // We mock the seeded coupons: WELCOME10, FITMONK50, HIGHPROTEIN
    const mockCoupons: Record<string, CouponEntity> = {
      'WELCOME10': {
        id: 'cpn_seed_welcome10',
        code: 'WELCOME10',
        description: '10% off on orders above ₹499 (Max ₹150)',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValuePaise: 49900,
        maxDiscountPaise: 15000,
        maxTotalUses: 500,
        maxUsesPerCustomer: 1,
        currentTotalUses: 14,
        startAt: null,
        expiresAt: null,
        scope: 'store',
        targetIds: null,
        isActive: true,
        createdAt: 1704067200,
        updatedAt: 1704067200
      },
      'FITMONK50': {
        id: 'cpn_seed_fitmonk50',
        code: 'FITMONK50',
        description: 'Flat ₹50 off on orders above ₹999',
        discountType: 'fixed',
        discountValue: 5000,
        minOrderValuePaise: 99900,
        maxDiscountPaise: 5000,
        maxTotalUses: 1000,
        maxUsesPerCustomer: 2,
        currentTotalUses: 38,
        startAt: null,
        expiresAt: null,
        scope: 'store',
        targetIds: null,
        isActive: true,
        createdAt: 1704067200,
        updatedAt: 1704067200
      }
    };

    const mock = mockCoupons[code];
    if (!mock) {
      return new Response(
        JSON.stringify({
          isValid: false,
          code,
          discountPaise: 0,
          discountFormatted: '₹0.00',
          newSubtotalPaise: subtotalPaise,
          newSubtotalFormatted: `₹${(subtotalPaise / 100).toFixed(2)}`,
          message: `Coupon '${code}' is invalid or expired.`,
          error: 'COUPON_NOT_FOUND'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = CouponEngine.validate(mock, validationReq, 0);
    return new Response(JSON.stringify(result), {
      status: result.isValid ? 200 : 422,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        isValid: false,
        error: 'SERVER_ERROR',
        message: err?.message || 'Error processing coupon validation'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
