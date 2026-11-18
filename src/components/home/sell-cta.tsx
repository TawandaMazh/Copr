"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInView, usePrefersReducedMotion } from "@/lib/motion";
import { SELLER_PROGRAM } from "@/lib/commerce/seller-program";

export function SellCta() {
  const reduced = usePrefersReducedMotion();
  const inView = fadeInView(reduced);

  return (
    <motion.section
      {...inView}
      className="mb-16 overflow-hidden rounded-[2rem] bg-navy px-6 py-12 text-white sm:px-10 sm:py-14"
    >
      <div className="mx-auto max-w-2xl space-y-5 text-center">
        <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Got something to sell?
        </p>
        <p className="text-base leading-relaxed text-white/75 sm:text-lg">
          List in minutes. Keep your stuff until it sells.{" "}
          {SELLER_PROGRAM.commissionPercent}% commission when a sale completes —
          payouts after delivery is confirmed.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Button asChild size="lg" className="bg-white text-navy hover:bg-ice">
            <Link href="/seller/apply">Start selling</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/35 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/sell">How it works</Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
