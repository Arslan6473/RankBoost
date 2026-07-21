"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  /** Milliseconds for the count-up. */
  duration?: number;
  decimals?: number;
  className?: string;
}

/** Counts up to `value` on mount / whenever it changes. Respects reduced motion. */
export function AnimatedCounter({
  value,
  duration = 700,
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const from = fromRef.current;
    const to = value;
    if (prefersReduced || from === to) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration]);

  const rounded =
    decimals > 0
      ? display.toFixed(decimals)
      : formatNumber(Math.round(display));

  return <span className={className}>{rounded}</span>;
}
