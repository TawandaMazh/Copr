import { z } from "zod";
import { LUSAKA_AREAS } from "@/lib/commerce/constants";

const phoneRefine = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return (
    digits.length === 9 ||
    digits.length === 10 ||
    (digits.startsWith("260") && digits.length >= 12)
  );
};

export const addressSchema = z.object({
  label: z.string().max(40).optional(),
  area: z.enum(LUSAKA_AREAS as unknown as [string, ...string[]], {
    message: "Choose a Lusaka area",
  }),
  neighbourhood: z.string().min(2, "Neighbourhood is required"),
  landmark: z.string().min(2, "Add a landmark to help the rider").max(120),
  phone: z
    .string()
    .min(9, "Delivery phone required")
    .refine(phoneRefine, "Use +260 format"),
  isDefault: z.boolean().optional(),
});

export const checkoutSchema = z
  .object({
    deliveryMethod: z.enum(["delivery", "pickup"]),
    pickupPointId: z.string().optional(),
    savedAddressId: z.string().optional(),
    area: z.string().optional(),
    neighbourhood: z.string().optional(),
    landmark: z.string().optional(),
    phone: z.string().min(9, "Phone required"),
    notes: z.string().max(240).optional(),
    fullName: z.string().min(2, "Name required"),
    /** Opt-in: save this delivery address for next time. */
    saveAddress: z.boolean().optional(),
    paymentMethod: z.enum(["mtn_momo", "airtel_money", "card"]),
    mobileMoneyPhone: z.string().optional(),
    whatsappUpdates: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "delivery") {
      if (!data.area) {
        ctx.addIssue({
          code: "custom",
          path: ["area"],
          message: "Select an area",
        });
      }
      if (!data.neighbourhood || data.neighbourhood.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["neighbourhood"],
          message: "Neighbourhood required",
        });
      }
      if (!data.landmark || data.landmark.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["landmark"],
          message: "Landmark required",
        });
      }
    }
    if (data.deliveryMethod === "pickup" && !data.pickupPointId) {
      ctx.addIssue({
        code: "custom",
        path: ["pickupPointId"],
        message: "Choose a pickup point",
      });
    }
    if (
      data.paymentMethod === "mtn_momo" ||
      data.paymentMethod === "airtel_money"
    ) {
      const phone = data.mobileMoneyPhone?.trim() ?? "";
      if (!phone || !phoneRefine(phone)) {
        ctx.addIssue({
          code: "custom",
          path: ["mobileMoneyPhone"],
          message: "Enter a valid +260 mobile money number",
        });
      }
    }
  });

export type AddressFormValues = z.infer<typeof addressSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
