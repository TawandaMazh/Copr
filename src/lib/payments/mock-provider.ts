import type {
  PaymentIntentInput,
  PaymentIntentResult,
  PaymentProvider,
  RefundPaymentInput,
  ReleasePaymentInput,
} from "./types";

/**
 * Mock escrow provider for local / preview use.
 * Flow: createPayment → held → release (or refund).
 */
export class MockProvider implements PaymentProvider {
  readonly name = "mock";

  async createPayment(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    const providerRef = `mock_${input.orderId.slice(0, 8)}_${Date.now()}`;
    return {
      success: true,
      provider: this.name,
      providerRef,
      status: "held",
      amount: input.amount,
      message: "Mock payment authorised and held in escrow.",
      raw: { simulated: true, input },
    };
  }

  async hold(input: {
    providerRef: string;
    orderId: string;
  }): Promise<PaymentIntentResult> {
    return {
      success: true,
      provider: this.name,
      providerRef: input.providerRef,
      status: "held",
      amount: 0,
      message: "Funds held in mock escrow.",
    };
  }

  async release(input: ReleasePaymentInput): Promise<PaymentIntentResult> {
    return {
      success: true,
      provider: this.name,
      providerRef: input.providerRef,
      status: "released",
      amount: input.amount,
      message: "Mock escrow released to seller (minus commission).",
    };
  }

  async refund(input: RefundPaymentInput): Promise<PaymentIntentResult> {
    return {
      success: true,
      provider: this.name,
      providerRef: input.providerRef,
      status: "refunded",
      amount: input.amount,
      message: input.reason ?? "Mock refund completed.",
    };
  }
}
