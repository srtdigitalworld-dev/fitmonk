import type { PaymentStatus } from './common';

export interface PaymentMethodEntity {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isEnabled: boolean;
  instructions: string | null;
  settings: Record<string, unknown> | null;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface PaymentTransactionEntity {
  id: string;
  orderId: string;
  provider: string;
  providerReference: string | null;
  amountPaise: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  metadata: Record<string, unknown> | null;
  createdAt: number;
  updatedAt: number;
}

export interface PaymentEventEntity {
  id: string;
  transactionId: string | null;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: number;
}
