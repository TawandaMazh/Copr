/** Size guide in centimetres — XS–XL. Edit measurements here. */

export const SIZE_GUIDE_ROWS = [
  { size: "XS", chest: 80, waist: 62, hip: 86 },
  { size: "S", chest: 84, waist: 66, hip: 90 },
  { size: "M", chest: 90, waist: 72, hip: 96 },
  { size: "L", chest: 96, waist: 78, hip: 102 },
  { size: "XL", chest: 104, waist: 86, hip: 110 },
] as const;

export const SIZE_GUIDE_NOTE =
  "Measurements are body circumference in centimetres. Brands may fit slightly differently — check the product description.";
