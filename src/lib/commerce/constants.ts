export const DELIVERY_FEE_KWACHA = Number(
  process.env.NEXT_PUBLIC_DELIVERY_FEE_KWACHA ?? 50,
);
export const DEFAULT_COMMISSION_PERCENT = Number(
  process.env.NEXT_PUBLIC_DEFAULT_COMMISSION_PERCENT ?? 15,
);
export const DELIVERY_CITY =
  process.env.NEXT_PUBLIC_DELIVERY_CITY ?? "Lusaka";
export const AUTO_CONFIRM_DAYS = 3;

export const LUSAKA_AREAS = [
  "Kabulonga",
  "Rhodes Park",
  "Roma",
  "Woodlands",
  "Ibex Hill",
  "Kalundu",
  "Northmead",
  "Olympia",
  "Mass Media",
  "Chilenje",
  "Kabwata",
  "Libala",
  "Chilanga",
  "Chelstone",
  "Meanwood",
  "Garden",
  "Mtendere",
  "Bauleni",
  "Matero",
  "Chawama",
  "Kalingalinga",
  "Kamwala",
  "CBD / Cairo Road",
  "Other",
] as const;

export const PICKUP_POINTS = [
  {
    id: "pickup-levy",
    label: "Levy Junction pickup",
    area: "Mass Media",
    neighbourhood: "Levy Junction Mall",
    landmark: "Customer service desk, ground floor",
  },
  {
    id: "pickup-manda",
    label: "Manda Hill pickup",
    area: "Olympia",
    neighbourhood: "Manda Hill Mall",
    landmark: "Outside Game entrance",
  },
  {
    id: "pickup-arcades",
    label: "Arcades pickup",
    area: "Olympia",
    neighbourhood: "Arcades Shopping Centre",
    landmark: "Food court entrance",
  },
] as const;
