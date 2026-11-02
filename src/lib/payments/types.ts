import type { PaymentStatus } from "@/types";

export interface PaymentIntentInput {
  orderId: string;
  amount: number;
  currency?: string;
  customerPhone?: string;
  customerEmail?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentIntentResult {
  success: boolean;
  provider: string;
  providerRef: string;
  status: PaymentStatus;
  amount: number;
  message?: string;
  raw?: unknown;
}

export interface ReleasePaymentInput {
  providerRef: string;
  orderId: string;
  amount: number;
}

export interface RefundPaymentInput {
  providerRef: string;
  orderId: string;
  amount: number;
  reason?: string;
}

/**
 * Pluggable payment providers (MTN MoMo, Airtel Money, card aggregator).
 * Phase 2 ships MockProvider only.
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(input: PaymentIntentInput): Promise<PaymentIntentResult>;
  /** Mark funds HELD in escrow after successful shopper payment */
  hold(input: { providerRef: string; orderId: string }): Promise<PaymentIntentResult>;
  /** Release to seller after delivery confirmation */
  release(input: ReleasePaymentInput): Promise<PaymentIntentResult>;
  refund(input: RefundPaymentInput): Promise<PaymentIntentResult>;
}
