export interface NotificationPayload {
  recipient: string; // Phone number or email
  templateCode: string;
  variables: Record<string, string | number>;
  fallbackText?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  channel: 'whatsapp' | 'email' | 'sms' | 'internal';
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  errorMessage?: string;
}

export interface NotificationChannelProvider {
  readonly channel: 'whatsapp' | 'email' | 'sms' | 'internal';
  readonly name: string;

  sendNotification(payload: NotificationPayload): Promise<NotificationResult>;
}

export interface WhatsAppNotificationProvider extends NotificationChannelProvider {
  sendMessage(toPhone: string, text: string): Promise<NotificationResult>;
  sendOrderConfirmation(order: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    grandTotalFormatted: string;
    itemSummary: string;
  }): Promise<NotificationResult>;
  sendShipmentUpdate(shipment: {
    orderNumber: string;
    customerPhone: string;
    courierName: string;
    trackingNumber: string;
    trackingUrl: string;
  }): Promise<NotificationResult>;
}
