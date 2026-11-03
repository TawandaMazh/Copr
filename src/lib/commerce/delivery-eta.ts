import { LUSAKA_DELIVERY_ZONES } from "@/lib/commerce/delivery-config";
import type { DeliveryMethod } from "@/types/commerce";

/** Map checkout area labels to delivery-config zones. */
const AREA_TO_ZONE: Record<string, string> = {
  "CBD / Cairo Road": "cbd",
  Kabulonga: "kabulonga",
  Roma: "roma",
  Woodlands: "woodlands",
  Chilenje: "chilenje",
  Matero: "matero",
  "Rhodes Park": "rhodes-park",
  "Ibex Hill": "ibex",
};

export function resolveDeliveryEta(
  method: DeliveryMethod,
  area?: string | null,
): { etaDays: string; label: string; feeKwacha?: number } {
  if (method === "pickup") {
    return {
      etaDays: "1–2",
      label: "Ready for pickup in 1–2 days",
    };
  }

  const zoneId = area ? AREA_TO_ZONE[area] : undefined;
  const zone =
    LUSAKA_DELIVERY_ZONES.find((z) => z.id === zoneId) ??
    LUSAKA_DELIVERY_ZONES.find((z) => z.id === "other-lusaka")!;

  return {
    etaDays: zone.etaDays,
    label: `Expected delivery in ${zone.etaDays} days`,
    feeKwacha: zone.feeKwacha,
  };
}

/** Calendar window from an order timestamp + "1–2" / "2–4" style ETA. */
export function expectedDeliveryWindow(
  etaDays: string,
  fromIso: string,
): string {
  const match = etaDays.match(/(\d+)\s*[–-]\s*(\d+)/);
  const min = match ? Number(match[1]) : 2;
  const max = match ? Number(match[2]) : Math.max(min, 4);
  const start = new Date(fromIso);
  const end = new Date(fromIso);
  start.setDate(start.getDate() + min);
  end.setDate(end.getDate() + max);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-ZM", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  if (fmt(start) === fmt(end)) return fmt(start);
  return `${fmt(start)} – ${fmt(end)}`;
}
