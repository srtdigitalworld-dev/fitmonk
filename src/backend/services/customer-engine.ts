// Fit Monk Customer / CRM-Lite Engine
// Derives customer profiles, lifetime metrics, and order histories from D1 orders.
// 100% PREPAID ONLY - Unpaid drafts and cancelled orders never count as revenue.

export interface CustomerOrderRecord {
  id: string;
  order_number?: string;
  customer_id?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  delivery_address?: string | null;
  apartment?: string | null;
  city?: string | null;
  state?: string | null;
  pin_code?: string | null;
  country?: string | null;
  grand_total_paise: number;
  discount_paise?: number;
  coupon_code?: string | null;
  order_status?: string | null;
  payment_status?: string | null;
  fulfillment_status?: string | null;
  created_at: number;
}

export interface CustomerAddress {
  address: string | null;
  apartment: string | null;
  city: string | null;
  state: string | null;
  pinCode: string | null;
  country: string;
}

export interface CustomerCouponUsage {
  code: string;
  discountPaise: number;
  orderNumber?: string;
  date?: number;
}

export interface CustomerSummary {
  phone: string;
  name: string;
  email: string | null;
  customerId: string | null;
  totalOrders: number;
  qualifyingOrders: number;
  totalSpentPaise: number;
  aovPaise: number;
  isRepeat: boolean;
  firstOrderAt: number;
  lastOrderAt: number;
  latestOrderStatus: string;
  latestPaymentStatus: string;
  latestFulfillmentStatus: string;
  latestAddress: CustomerAddress;
  couponsUsed: CustomerCouponUsage[];
  totalCouponDiscountPaise: number;
}

export class CustomerEngine {
  /**
   * Identifies whether a record corresponds to a meaningful customer (not an anonymous pending draft)
   */
  static isMeaningfulCustomer(phone?: string | null): boolean {
    if (!phone) return false;
    const clean = phone.trim();
    if (!clean) return false;
    if (clean.toLowerCase().includes('pending')) return false;
    if (clean === 'Pending on WhatsApp') return false;
    // Check if contains digits
    return /\d{4,}/.test(clean);
  }

  /**
   * Only paid, non-cancelled/refunded orders qualify for revenue and AOV
   */
  static isQualifyingOrder(order: { payment_status?: string | null; order_status?: string | null }): boolean {
    const payStatus = (order.payment_status || '').toLowerCase();
    const ordStatus = (order.order_status || '').toLowerCase();
    return payStatus === 'paid' && !['cancelled', 'refunded'].includes(ordStatus);
  }

  /**
   * Normalizes customer phone number for consistent identity matching
   */
  static normalizePhone(phone: string): string {
    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
    return trimmed.startsWith('+') ? trimmed : `+${digits}`;
  }

  /**
   * Derives customer summary from a customer's order history
   */
  static deriveCustomer(phone: string, orders: CustomerOrderRecord[]): CustomerSummary {
    // Sort chronologically ascending for first order, descending for latest
    const sortedDesc = [...orders].sort((a, b) => b.created_at - a.created_at);
    const sortedAsc = [...orders].sort((a, b) => a.created_at - b.created_at);

    const latest = sortedDesc[0] || {
      id: '',
      grand_total_paise: 0,
      created_at: Math.floor(Date.now() / 1000)
    };
    const first = sortedAsc[0] || latest;

    // Best customer name: find earliest non-generic name, fallback to latest, then 'Customer'
    const nameOrder = sortedDesc.find(o => o.customer_name && o.customer_name !== 'WhatsApp Buyer' && o.customer_name.trim() !== '') || latest;
    const name = nameOrder.customer_name?.trim() || 'Customer';

    // Best email
    const emailOrder = sortedDesc.find(o => o.customer_email && o.customer_email.trim() !== '');
    const email = emailOrder?.customer_email?.trim() || null;

    // Customer ID if any
    const idOrder = sortedDesc.find(o => o.customer_id && o.customer_id.trim() !== '');
    const customerId = idOrder?.customer_id?.trim() || null;

    // Latest delivery address
    const addressOrder = sortedDesc.find(o => o.city && o.city !== 'Pending') ||
      sortedDesc.find(o => o.delivery_address && !o.delivery_address.toLowerCase().includes('pending')) || 
      latest;
    const cityOrder = sortedDesc.find(o => o.city && o.city !== 'Pending');
    const stateOrder = sortedDesc.find(o => o.state && o.state !== 'Pending');
    const pinOrder = sortedDesc.find(o => o.pin_code && o.pin_code !== '000000');

    const latestAddress: CustomerAddress = {
      address: addressOrder.delivery_address || null,
      apartment: addressOrder.apartment || null,
      city: (cityOrder?.city && cityOrder.city !== 'Pending') ? cityOrder.city : (addressOrder.city && addressOrder.city !== 'Pending' ? addressOrder.city : null),
      state: (stateOrder?.state && stateOrder.state !== 'Pending') ? stateOrder.state : (addressOrder.state && addressOrder.state !== 'Pending' ? addressOrder.state : null),
      pinCode: (pinOrder?.pin_code && pinOrder.pin_code !== '000000') ? pinOrder.pin_code : (addressOrder.pin_code && addressOrder.pin_code !== '000000' ? addressOrder.pin_code : null),
      country: addressOrder.country || 'India'
    };

    // Revenue calculations: strict prepaid qualification
    const totalOrders = orders.length;
    const qualifyingOrdersList = orders.filter(o => this.isQualifyingOrder(o));
    const qualifyingOrders = qualifyingOrdersList.length;
    const totalSpentPaise = qualifyingOrdersList.reduce((sum, o) => sum + (Number(o.grand_total_paise) || 0), 0);
    const aovPaise = qualifyingOrders > 0 ? Math.round(totalSpentPaise / qualifyingOrders) : 0;
    const isRepeat = qualifyingOrders > 1;

    // Coupon tracking from orders
    const couponsUsed: CustomerCouponUsage[] = [];
    let totalCouponDiscountPaise = 0;
    for (const o of sortedDesc) {
      if (o.coupon_code && Number(o.discount_paise) > 0) {
        couponsUsed.push({
          code: o.coupon_code,
          discountPaise: Number(o.discount_paise) || 0,
          orderNumber: o.order_number || o.id,
          date: o.created_at
        });
        totalCouponDiscountPaise += Number(o.discount_paise) || 0;
      }
    }

    return {
      phone,
      name,
      email,
      customerId,
      totalOrders,
      qualifyingOrders,
      totalSpentPaise,
      aovPaise,
      isRepeat,
      firstOrderAt: first.created_at,
      lastOrderAt: latest.created_at,
      latestOrderStatus: latest.order_status || 'pending',
      latestPaymentStatus: latest.payment_status || 'pending',
      latestFulfillmentStatus: latest.fulfillment_status || 'unfulfilled',
      latestAddress,
      couponsUsed,
      totalCouponDiscountPaise
    };
  }

  /**
   * Aggregates multiple orders into a unique customer directory list
   */
  static aggregateOrders(orders: CustomerOrderRecord[]): CustomerSummary[] {
    const byPhone: Record<string, CustomerOrderRecord[]> = {};

    for (const order of orders) {
      if (!this.isMeaningfulCustomer(order.customer_phone)) continue;
      const normalized = this.normalizePhone(order.customer_phone!);
      if (!byPhone[normalized]) {
        byPhone[normalized] = [];
      }
      byPhone[normalized].push(order);
    }

    const customers: CustomerSummary[] = [];
    for (const [phone, customerOrders] of Object.entries(byPhone)) {
      customers.push(this.deriveCustomer(phone, customerOrders));
    }

    return customers;
  }

  /**
   * In-memory search, filter, and sort for mock or client-side evaluation
   */
  static filterAndSort(
    customers: CustomerSummary[],
    options: { search?: string; filter?: string; sort?: string } = {}
  ): CustomerSummary[] {
    let result = [...customers];

    if (options.search) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    }

    if (options.filter === 'repeat') {
      result = result.filter(c => c.isRepeat);
    } else if (options.filter === 'single') {
      result = result.filter(c => c.qualifyingOrders === 1);
    } else if (options.filter === 'unpaid') {
      result = result.filter(c => c.qualifyingOrders === 0);
    }

    const sort = options.sort || 'last_order_desc';
    if (sort === 'total_spent_desc') {
      result.sort((a, b) => b.totalSpentPaise - a.totalSpentPaise || b.lastOrderAt - a.lastOrderAt);
    } else if (sort === 'total_orders_desc') {
      result.sort((a, b) => b.totalOrders - a.totalOrders || b.lastOrderAt - a.lastOrderAt);
    } else if (sort === 'first_order_desc') {
      result.sort((a, b) => b.firstOrderAt - a.firstOrderAt);
    } else if (sort === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // default: last_order_desc
      result.sort((a, b) => b.lastOrderAt - a.lastOrderAt);
    }

    return result;
  }
}
