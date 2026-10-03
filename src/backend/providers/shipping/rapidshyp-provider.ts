// RapidShyp B2C Shipping Provider Implementation
// Modular B2C architecture: Serviceability, Order Creation, AWB Assignment, Tracking & Webhook handling.

import type {
  ShippingProvider,
  ServiceabilityCheckInput,
  ServiceabilityResult,
  CreateShipmentInput,
  CreateShipmentResult,
  TrackingResult
} from './shipping-provider.interface';

export interface RapidShypEndpoints {
  createOrder?: string;
  serviceabilityCheck?: string;
  assignAwb?: string;
  getOrderInfo?: string;
  tracking?: string;
}

export interface RapidShypConfig {
  apiToken?: string;
  baseUrl?: string;
  pickupLocation?: string;
  pickupPincode?: string;
  rtoLocation?: string;
  defaultChannel?: string;
  endpoints?: RapidShypEndpoints;
}

export const DEFAULT_RAPIDSHYP_BASE_URL = 'https://api.rapidshyp.com/rapidshyp/apis/v1';

export const DEFAULT_RAPIDSHYP_ENDPOINTS: Required<RapidShypEndpoints> = {
  createOrder: '/create_order',
  serviceabilityCheck: '/serviceability_check',
  assignAwb: '/assign_awb',
  getOrderInfo: '/get_orders_info',
  tracking: '/track'
};

export class RapidShypProvider implements ShippingProvider {
  readonly code = 'rapidshyp';
  readonly name = 'RapidShyp Logistics';
  private config: RapidShypConfig;

  constructor(config: RapidShypConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || DEFAULT_RAPIDSHYP_BASE_URL,
      pickupLocation: config.pickupLocation || 'Fit Monk Central Warehouse',
      defaultChannel: config.defaultChannel || 'Fit Monk Website',
      ...config,
      endpoints: {
        ...DEFAULT_RAPIDSHYP_ENDPOINTS,
        ...config.endpoints
      }
    };
  }

  /**
   * Helper to construct fully-qualified endpoint URLs from centralized configuration
   */
  public getEndpointUrl(action: keyof RapidShypEndpoints): string {
    const base = (this.config.baseUrl || DEFAULT_RAPIDSHYP_BASE_URL).replace(/\/+$/, '');
    const path = (this.config.endpoints?.[action] || DEFAULT_RAPIDSHYP_ENDPOINTS[action]).replace(/^\/+/, '');
    return `${base}/${path}`;
  }

  /**
   * 1. Check PIN code serviceability across courier partners
   * Endpoint: /serviceability_check
   */
  async checkServiceability(input: ServiceabilityCheckInput): Promise<ServiceabilityResult> {
    if (!this.config.apiToken) {
      // Mock / fallback serviceability check when API token is not yet configured
      const isIndianPin = /^[1-9]\d{5}$/.test(input.deliveryPincode);
      return {
        serviceable: isIndianPin,
        courierPartners: isIndianPin ? [
          {
            courierName: 'RapidShyp Standard Surface',
            courierCode: 'RS_SURFACE',
            estimatedDeliveryDays: 4,
            shippingFeePaise: 4900,
            codAvailable: true
          },
          {
            courierName: 'RapidShyp Express Air',
            courierCode: 'RS_AIR',
            estimatedDeliveryDays: 2,
            shippingFeePaise: 9900,
            codAvailable: input.cod
          }
        ] : [],
        message: isIndianPin ? 'Serviceable across courier network' : 'Invalid PIN code'
      };
    }

    try {
      const endpoint = this.getEndpointUrl('serviceabilityCheck');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiToken}`
        },
        body: JSON.stringify({
          pickup_pincode: input.pickupPincode,
          delivery_pincode: input.deliveryPincode,
          weight: input.weightGrams / 1000,
          cod: input.cod ? 1 : 0,
          order_value: input.orderValuePaise / 100
        })
      });

      if (!response.ok) {
        throw new Error(`RapidShyp serviceability error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return {
        serviceable: data.serviceable ?? false,
        courierPartners: (data.couriers ?? []).map((c: any) => ({
          courierName: c.courier_name,
          courierCode: c.courier_id,
          estimatedDeliveryDays: c.estimated_days ?? 4,
          shippingFeePaise: Math.round((c.freight_charge ?? 49) * 100),
          codAvailable: Boolean(c.cod_available)
        }))
      };
    } catch (err) {
      return {
        serviceable: true,
        courierPartners: [],
        message: err instanceof Error ? err.message : 'Serviceability lookup error'
      };
    }
  }

  /**
   * 2. Create B2C Shipment Order
   * Endpoint: /create_order
   */
  async createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
    if (!this.config.apiToken) {
      // Mock / fallback creation for development / staging
      const mockId = `RS-${Date.now().toString(36).toUpperCase()}`;
      return {
        success: true,
        provider: this.code,
        providerShipmentId: mockId,
        awbNumber: `AWB${Math.floor(100000000 + Math.random() * 900000000)}`,
        courierName: 'Delhivery Surface via RapidShyp',
        status: 'created'
      };
    }

    const payload = {
      order_id: input.orderNumber,
      order_date: new Date().toISOString(),
      channel: this.config.defaultChannel,
      pickup_location: input.pickupLocationName || this.config.pickupLocation,
      billing_customer_name: input.customerName,
      billing_phone: input.customerPhone,
      billing_address: input.deliveryAddress,
      billing_city: input.city,
      billing_state: input.state,
      billing_pincode: input.pinCode,
      shipping_is_billing: true,
      order_items: input.items.map(i => ({
        name: i.name,
        sku: i.sku || 'FM-ITEM',
        units: i.quantity,
        selling_price: i.pricePaise / 100
      })),
      payment_method: input.isCod ? 'COD' : 'Prepaid',
      sub_total: input.totalAmountPaise / 100,
      length: 15,
      breadth: 15,
      height: 10,
      weight: Math.max(0.25, input.totalWeightGrams / 1000)
    };

    const endpoint = this.getEndpointUrl('createOrder');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json() as any;

    if (!response.ok || !data.success) {
      return {
        success: false,
        provider: this.code,
        providerShipmentId: '',
        status: 'created',
        errorMessage: data.message || 'RapidShyp order creation failed',
        rawResponse: data
      };
    }

    return {
      success: true,
      provider: this.code,
      providerShipmentId: data.order_id || data.shipment_id,
      awbNumber: data.awb_code,
      courierName: data.courier_name,
      status: 'created',
      labelUrl: data.label_url,
      rawResponse: data
    };
  }

  /**
   * 3. Assign Courier / Generate AWB
   * Endpoint: /assign_awb
   */
  async assignCourier(shipmentId: string, courierCode: string): Promise<{ success: boolean; awbNumber: string; courierName: string }> {
    if (!this.config.apiToken) {
      return {
        success: true,
        awbNumber: `AWB${Math.floor(100000000 + Math.random() * 900000000)}`,
        courierName: 'RapidShyp Partner'
      };
    }

    const endpoint = this.getEndpointUrl('assignAwb');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiToken}`
      },
      body: JSON.stringify({ order_id: shipmentId, courier_id: courierCode })
    });

    const data = await response.json() as any;
    return {
      success: Boolean(data.success),
      awbNumber: data.awb_code || '',
      courierName: data.courier_name || ''
    };
  }

  /**
   * 4. Real-time Live Tracking
   * Endpoint: /track/:awb or fallback
   */
  async getTracking(awbNumber: string): Promise<TrackingResult> {
    if (!this.config.apiToken) {
      return {
        provider: this.code,
        awbNumber,
        currentStatus: 'in_transit',
        statusDescription: 'Shipment dispatched from Fit Monk facility',
        currentLocation: 'Hub Agra, Uttar Pradesh',
        activities: [
          { status: 'Manifested', location: 'Warehouse', time: new Date().toISOString(), remarks: 'Package ready for courier pickup' },
          { status: 'In Transit', location: 'Agra Hub', time: new Date().toISOString(), remarks: 'Dispatched to destination sorting hub' }
        ]
      };
    }

    const endpoint = `${this.getEndpointUrl('tracking')}/${encodeURIComponent(awbNumber)}`;
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${this.config.apiToken}` }
    });

    const data = await response.json() as any;
    return {
      provider: this.code,
      awbNumber,
      currentStatus: data.current_status || 'in_transit',
      statusDescription: data.status_description || '',
      currentLocation: data.current_location,
      activities: (data.activities || []).map((a: any) => ({
        status: a.status,
        location: a.location,
        time: a.activity_time,
        remarks: a.remarks
      }))
    };
  }

  /**
   * 5. Get Order Information
   * Endpoint: /get_orders_info
   */
  async getOrderInfo(orderId: string): Promise<any> {
    if (!this.config.apiToken) {
      return {
        success: true,
        order_id: orderId,
        status: 'mock_pending'
      };
    }

    const endpoint = `${this.getEndpointUrl('getOrderInfo')}?order_id=${encodeURIComponent(orderId)}`;
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${this.config.apiToken}` }
    });
    return response.json();
  }

  /**
   * 6. Webhook & Event Ingestion
   */
  async handleWebhook(_event: string, payload: Record<string, unknown>): Promise<{ handled: boolean; awb?: string; status?: any }> {
    const awb = (payload.awb || payload.awb_code) as string | undefined;
    const status = (payload.status || payload.current_status) as string | undefined;
    return {
      handled: true,
      awb,
      status: status || 'in_transit'
    };
  }
}
