import type { PaymentStatus } from '../../types/common';

export interface CreatePaymentInput {
  orderId: string;
  orderNumber: string;
  amountPaise: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  returnUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  success: boolean;
  provider: string;
  providerReference: string;
  status: PaymentStatus;
  checkoutUrl?: string;
  qrPayload?: string;
  instructions?: string;
  errorMessage?: string;
  rawResponse?: Record<string, unknown>;
}

export interface PaymentProvider {
  readonly code: string;
  readonly name: string;

  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
  verifyPayment(transactionId: string, payload: Record<string, unknown>): Promise<PaymentResult>;
  capturePayment?(transactionId: string, amountPaise: number): Promise<PaymentResult>;
  refundPayment?(transactionId: string, amountPaise: number, reason?: string): Promise<PaymentResult>;
  handleWebhook?(event: string, payload: Record<string, unknown>, signature?: string): Promise<{ handled: boolean; orderId?: string; status?: PaymentStatus }>;
}
