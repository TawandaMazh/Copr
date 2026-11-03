import type { Metadata } from "next";
import { ApplyForm } from "@/components/seller/apply-form";

export const metadata: Metadata = {
  title: "Apply",
};

export default function SellerApplyPage() {
  return <ApplyForm />;
}
