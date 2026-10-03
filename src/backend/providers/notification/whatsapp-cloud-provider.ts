import type { WhatsAppNotificationProvider, NotificationPayload, NotificationResult } from './notification-provider.interface';

export interface WhatsAppCloudConfig {
  phoneNumberId?: string;
  accessToken?: string;
  businessAccountId?: string;
  apiVersion?: string;
}

export class WhatsAppCloudProvider implements WhatsAppNotificationProvider {
  readonly channel = 'whatsapp';
  readonly name = 'WhatsApp Cloud API';
  private config: WhatsAppCloudConfig;

  constructor(config: WhatsAppCloudConfig = {}) {
    this.config = {
      apiVersion: 'v20.0',
      ...config
    };
  }

  async sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
    if (!this.config.accessToken || !this.config.phoneNumberId) {
      // Mock log when unconfigured
      return {
        success: true,
        channel: 'whatsapp',
        messageId: `WA-MOCK-${Date.now().toString(36)}`,
        status: 'queued'
      };
    }

    try {
      const url = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: payload.recipient.replace(/\D/g, ''),
          type: 'template',
          template: {
            name: payload.templateCode,
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: Object.entries(payload.variables).map(([_, val]) => ({
                  type: 'text',
                  text: String(val)
                }))
              }
            ]
          }
        })
      });

      const data = await response.json() as any;

      if (!response.ok) {
        return {
          success: false,
          channel: 'whatsapp',
          messageId: '',
          status: 'failed',
          errorMessage: data.error?.message || 'WhatsApp Cloud API request failed'
        };
      }

      return {
        success: true,
        channel: 'whatsapp',
        messageId: data.messages?.[0]?.id || '',
        status: 'sent'
      };
    } catch (err) {
      return {
        success: false,
        channel: 'whatsapp',
        messageId: '',
        status: 'failed',
        errorMessage: err instanceof Error ? err.message : 'WhatsApp notification error'
      };
    }
  }

  async sendMessage(toPhone: string, text: string): Promise<NotificationResult> {
    return this.sendNotification({
      recipient: toPhone,
      templateCode: 'custom_message',
      variables: { message: text },
      fallbackText: text
    });
  }

  async sendOrderConfirmation(order: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    grandTotalFormatted: string;
    itemSummary: string;
  }): Promise<NotificationResult> {
    return this.sendNotification({
      recipient: order.customerPhone,
      templateCode: 'order_placed',
      variables: {
        customer_name: order.customerName,
        order_number: order.orderNumber,
        order_total: order.grandTotalFormatted,
        item_summary: order.itemSummary
      }
    });
  }

  async sendShipmentUpdate(shipment: {
    orderNumber: string;
    customerPhone: string;
    courierName: string;
    trackingNumber: string;
    trackingUrl: string;
  }): Promise<NotificationResult> {
    return this.sendNotification({
      recipient: shipment.customerPhone,
      templateCode: 'order_shipped',
      variables: {
        order_number: shipment.orderNumber,
        courier_name: shipment.courierName,
        tracking_number: shipment.trackingNumber,
        tracking_url: shipment.trackingUrl
      }
    });
  }
}
