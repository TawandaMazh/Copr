import type { OrderStatus, PaymentStatus } from "@/types";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid — preparing",
  processing: "Being prepared",
  shipped: "On the way",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  disputed: "In dispute",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  held: "Payment secured",
  released: "Paid to brands",
  refunded: "Refunded",
  failed: "Payment failed",
};

export function orderStatusLabel(status: string) {
  return (
    ORDER_STATUS_LABELS[status as OrderStatus] ??
    status.replaceAll("_", " ")
  );
}

export function paymentStatusLabel(status: string) {
  return (
    PAYMENT_STATUS_LABELS[status as PaymentStatus] ??
    status.replaceAll("_", " ")
  );
}

export function orderStatusHint(status: string) {
  switch (status) {
    case "paid":
    case "processing":
      return "Each brand ships separately once they pack your items.";
    case "shipped":
      return "Confirm delivery when your parcel arrives so the brand can be paid.";
    case "delivered":
      return "Almost done — confirm delivery to finish this order.";
    case "completed":
      return "All set. Thanks for shopping on copr.";
    case "disputed":
      return "Support has been emailed about this order. We’ll follow up soon.";
    default:
      return null;
  }
}
