import type { OrderStatus, PaymentStatus, FulfillmentStatus, OrderSource } from './common';

export interface OrderItemEntity {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  productName: string;
  packSize: string | null;
  sku: string | null;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
  discountPaise: number;
  createdAt: number;
}

export interface OrderEntity {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  apartment: string | null;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  subtotalPaise: number;
  discountPaise: number;
  couponCode: string | null;
  shippingPaise: number;
  taxPaise: number;
  grandTotalPaise: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentMethodCode: string;
  deliveryMethodCode: string;
  shippingProviderCode: string | null;
  shipmentTrackingNumber: string | null;
  shipmentAwb: string | null;
  courierName: string | null;
  orderSource: OrderSource;
  customerNote: string | null;
  adminNote: string | null;
  items?: OrderItemEntity[];
  createdAt: number;
  updatedAt: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  apartment?: string | null;
  city: string;
  state: string;
  pinCode: string;
  items: Array<{
    productId: string;
    variantId: string | null;
    quantity: number;
  }>;
  couponCode?: string | null;
  paymentMethodCode?: string;
  deliveryMethodCode?: string;
  customerNote?: string | null;
  orderSource?: OrderSource;
}
