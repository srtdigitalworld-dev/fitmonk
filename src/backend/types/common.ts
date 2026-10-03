// Core commerce status enums and common types for Fit Monk

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'
  | 'failed';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export type FulfillmentStatus =
  | 'unfulfilled'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type ShipmentStatus =
  | 'created'
  | 'manifested'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'rto'
  | 'cancelled';

export type CouponDiscountType = 'percentage' | 'fixed';
export type CouponScope = 'store' | 'category' | 'product';

export type OrderSource =
  | 'website'
  | 'admin'
  | 'whatsapp'
  | 'manual'
  | 'api';

export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'content_manager'
  | 'order_manager'
  | 'marketing_manager';

export interface Money {
  paise: number;
  formatted: string;
}

export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}
