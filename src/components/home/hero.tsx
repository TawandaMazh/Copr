"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, usePrefersReducedMotion } from "@/lib/motion";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const motionProps = fadeUp(reduced);

  return (
    <section className="relative mb-16 w-full overflow-hidden">
      <div className="relative min-h-[85vh] w-full sm:min-h-[78vh] lg:min-h-[85vh]">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80"
          alt="Model wearing contemporary fashion"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-navy/25" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-28 sm:pb-20">
            <motion.div
              {...motionProps}
              className="max-w-xl space-y-5 text-white"
            >
              <p className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                copr
              </p>
              <h1 className="text-balance text-2xl font-medium leading-snug tracking-tight text-white/95 sm:text-3xl">
                Zambian fashion, from local brands to your door.
              </h1>
              <p className="max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
                Discover dresses, chitenge, and city staples from makers across
                Lusaka and beyond — priced in Kwacha, delivered in Lusaka.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild size="lg" className="bg-white text-navy hover:bg-ice">
                  <Link href="/shop">Shop now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                >
                  <Link href="/sell">Sell on copr</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
