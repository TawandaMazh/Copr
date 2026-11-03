/**
 * Editable Lusaka delivery / pickup config.
 * Change fees, ETAs, and out-of-city notes here — no code hunt required.
 */

export type DeliveryZone = {
  id: string;
  name: string;
  feeKwacha: number;
  etaDays: string;
  note?: string;
};

export const LUSAKA_DELIVERY_ZONES: DeliveryZone[] = [
  { id: "cbd", name: "CBD / Cairo Road", feeKwacha: 40, etaDays: "1–2" },
  { id: "kabulonga", name: "Kabulonga", feeKwacha: 50, etaDays: "1–2" },
  { id: "roma", name: "Roma", feeKwacha: 50, etaDays: "1–2" },
  { id: "woodlands", name: "Woodlands", feeKwacha: 50, etaDays: "1–2" },
  { id: "chilenje", name: "Chilenje", feeKwacha: 55, etaDays: "2–3" },
  { id: "matero", name: "Matero", feeKwacha: 55, etaDays: "2–3" },
  { id: "rhodes-park", name: "Rhodes Park", feeKwacha: 45, etaDays: "1–2" },
  { id: "ibex", name: "Ibex Hill", feeKwacha: 55, etaDays: "2–3" },
  {
    id: "other-lusaka",
    name: "Other Lusaka areas",
    feeKwacha: 60,
    etaDays: "2–4",
    note: "Exact fee confirmed at checkout by neighbourhood.",
  },
];

export const OUTSIDE_LUSAKA = {
  available: false as boolean,
  label: "Outside Lusaka",
  message:
    "Delivery to Copperbelt and Livingstone is coming soon. For now we ship within Lusaka and offer mall pickup points.",
  regionsComingSoon: ["Copperbelt (Ndola, Kitwe)", "Livingstone"],
};

export const PICKUP_POINTS_PUBLIC = [
  {
    id: "pickup-levy",
    label: "Levy Junction",
    area: "Mass Media",
    detail: "Customer service desk, ground floor",
  },
  {
    id: "pickup-manda",
    label: "Manda Hill",
    area: "Olympia",
    detail: "Outside Game entrance",
  },
  {
    id: "pickup-arcades",
    label: "Arcades Shopping Centre",
    area: "Olympia",
    detail: "Food court entrance",
  },
] as const;
