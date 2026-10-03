import type { PaymentProvider, CreatePaymentInput, PaymentResult } from './payment-provider.interface';

export class CodPaymentProvider implements PaymentProvider {
  readonly code = 'cod';
  readonly name = 'Cash on Delivery';

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    return {
      success: true,
      provider: this.code,
      providerReference: `COD-${input.orderNumber}`,
      status: 'pending',
      instructions: 'Please keep exact cash ready upon package delivery.',
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      provider: this.code,
      providerReference: transactionId,
      status: 'paid',
    };
  }
}

export class UpiManualPaymentProvider implements PaymentProvider {
  readonly code = 'upi_qr';
  readonly name = 'UPI / WhatsApp Payment';

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    return {
      success: true,
      provider: this.code,
      providerReference: `UPI-${input.orderNumber}`,
      status: 'pending',
      instructions: 'Scan the official Fit Monk UPI QR code upon confirmation.',
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      provider: this.code,
      providerReference: transactionId,
      status: 'paid',
    };
  }
}
