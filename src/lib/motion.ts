"use client";

import * as React from "react";

/** Respect OS “Reduce motion” preference for Framer Motion and CSS. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function fadeUp(reduced: boolean) {
  if (reduced) {
    return {
      initial: false as const,
      animate: { opacity: 1 },
      transition: { duration: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  };
}

export function fadeInView(reduced: boolean) {
  if (reduced) {
    return {
      initial: false as const,
      whileInView: { opacity: 1 },
      viewport: { once: true },
      transition: { duration: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  };
}
