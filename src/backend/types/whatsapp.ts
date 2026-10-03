export interface WhatsAppMessageEntity {
  id: string;
  orderId: string | null;
  customerPhone: string;
  templateCode: string | null;
  messageBody: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  providerMessageId: string | null;
  errorMessage: string | null;
  sentAt: number | null;
  createdAt: number;
}

export interface NotificationTemplateEntity {
  id: string;
  code: string;
  channel: 'whatsapp' | 'email' | 'sms';
  title: string;
  bodyTemplate: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}
