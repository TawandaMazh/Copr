/**
 * Sell-on-copr programme numbers — edit here to update the public /sell page.
 */

export const SELLER_PROGRAM = {
  commissionPercent: Number(
    process.env.NEXT_PUBLIC_DEFAULT_COMMISSION_PERCENT ?? 15,
  ),
  payoutTiming: "Within 3–5 business days after the shopper confirms delivery",
  holdNote: "Payments stay held until delivery is confirmed (or auto-confirmed).",
  steps: [
    {
      title: "Apply",
      body: "Tell us about your brand, where you make, and what you sell.",
    },
    {
      title: "List",
      body: "Upload products with sizes, colours, stock, and images. You keep the inventory.",
    },
    {
      title: "Fulfil & get paid",
      body: "Pack Lusaka orders when they land. After delivery is confirmed, your payout is released minus commission.",
    },
  ],
} as const;
