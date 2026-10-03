import type { ShipmentStatus } from './common';

export interface ShippingProviderEntity {
  id: string;
  code: string;
  name: string;
  isEnabled: boolean;
  settings: Record<string, unknown> | null;
  createdAt: number;
  updatedAt: number;
}

export interface ShipmentEntity {
  id: string;
  orderId: string;
  providerCode: string;
  providerShipmentId: string | null;
  awbNumber: string | null;
  courierPartner: string | null;
  status: ShipmentStatus;
  pickupToken: string | null;
  shippingLabelUrl: string | null;
  manifestUrl: string | null;
  shippedAt: number | null;
  deliveredAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface ShipmentEventEntity {
  id: string;
  shipmentId: string;
  status: string;
  location: string | null;
  remarks: string | null;
  eventTime: number;
  rawPayload: Record<string, unknown> | null;
}
