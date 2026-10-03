import type { ShipmentStatus } from '../../types/common';

export interface ServiceabilityCheckInput {
  pickupPincode: string;
  deliveryPincode: string;
  weightGrams: number;
  cod: boolean;
  orderValuePaise: number;
}

export interface ServiceabilityResult {
  serviceable: boolean;
  courierPartners: Array<{
    courierName: string;
    courierCode: string;
    estimatedDeliveryDays: number;
    shippingFeePaise?: number;
    codAvailable: boolean;
  }>;
  message?: string;
}

export interface CreateShipmentInput {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  apartment?: string | null;
  city: string;
  state: string;
  pinCode: string;
  items: Array<{
    name: string;
    sku?: string | null;
    quantity: number;
    pricePaise: number;
    weightGrams?: number | null;
  }>;
  totalWeightGrams: number;
  totalAmountPaise: number;
  isCod: boolean;
  pickupLocationName?: string;
}

export interface CreateShipmentResult {
  success: boolean;
  provider: string;
  providerShipmentId: string;
  awbNumber?: string;
  courierName?: string;
  status: ShipmentStatus;
  labelUrl?: string;
  manifestUrl?: string;
  errorMessage?: string;
  rawResponse?: Record<string, unknown>;
}

export interface TrackingResult {
  provider: string;
  awbNumber: string;
  currentStatus: ShipmentStatus;
  statusDescription: string;
  currentLocation?: string;
  estimatedDeliveryDate?: string;
  activities: Array<{
    status: string;
    location: string;
    time: string;
    remarks: string;
  }>;
}

export interface ShippingProvider {
  readonly code: string;
  readonly name: string;

  checkServiceability(input: ServiceabilityCheckInput): Promise<ServiceabilityResult>;
  createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult>;
  assignCourier?(shipmentId: string, courierCode: string): Promise<{ success: boolean; awbNumber: string; courierName: string }>;
  getTracking(awbNumber: string): Promise<TrackingResult>;
  generateLabel?(shipmentId: string): Promise<{ labelUrl: string }>;
  cancelShipment?(shipmentId: string, reason?: string): Promise<{ success: boolean; message: string }>;
  handleWebhook?(event: string, payload: Record<string, unknown>): Promise<{ handled: boolean; awb?: string; status?: ShipmentStatus }>;
}
