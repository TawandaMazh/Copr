import { MockProvider } from "./mock-provider";
import type { PaymentProvider } from "./types";

export type * from "./types";
export { MockProvider };

let cached: PaymentProvider | null = null;

/** Resolve the active payment provider (mock until MoMo / Airtel / card plug in). */
export function getPaymentProvider(): PaymentProvider {
  if (cached) return cached;
  const name = (process.env.PAYMENT_PROVIDER ?? "mock").toLowerCase();
  switch (name) {
    case "mock":
    default:
      cached = new MockProvider();
      return cached;
  }
}
