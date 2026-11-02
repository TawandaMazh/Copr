import { z } from "zod";

export const emailAuthSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter a valid email")
    .email("Enter a valid email"),
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters)"),
});

export const phoneAuthSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(9, "Enter a Zambian mobile number")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return (
        digits.length === 9 ||
        digits.length === 10 ||
        (digits.startsWith("260") && digits.length >= 12)
      );
    }, "Use +260 format, e.g. +260 97 123 4567"),
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters)"),
});

export const otpSchema = z.object({
  token: z
    .string()
    .trim()
    .min(6, "Enter the 6-digit code")
    .max(8, "Code looks too long"),
});

export type EmailAuthValues = z.infer<typeof emailAuthSchema>;
export type PhoneAuthValues = z.infer<typeof phoneAuthSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
