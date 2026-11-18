/**
 * Sell-on-copr programme numbers — edit here to update the public /sell page.
 */

export const SELLER_PROGRAM = {
  commissionPercent: Number(
    process.env.NEXT_PUBLIC_DEFAULT_COMMISSION_PERCENT ?? 15,
  ),
  payoutTiming: "Within 3–5 business days after the buyer confirms delivery",
  holdNote: "Payments stay held until delivery is confirmed (or auto-confirmed).",
  steps: [
    {
      title: "Open your shop",
      body: "Create a seller profile in a minute — no brand approval wait.",
    },
    {
      title: "List anything",
      body: "Upload photos, set a price and condition, and go live. Keep the item until it sells.",
    },
    {
      title: "Ship & get paid",
      body: "Fulfil Lusaka orders when they land. After delivery is confirmed, your payout is released minus commission.",
    },
  ],
} as const;
