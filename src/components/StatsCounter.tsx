"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StatsCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/**
 * StatsCounter
 * High-performance animated counter component designed for PATGOLITO's metrics.
 * Uses spring physics with direct DOM text updates to guarantee 60fps smoothness
 * while completely eliminating React re-render cascades and maximum update depth errors.
 */
export default function StatsCounter({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  
  // Memoize spring configuration so a new object is not created on every render
  const springConfig = useMemo(
    () => ({ duration: duration * 1000, bounce: 0 }),
    [duration]
  );
  const springValue = useSpring(motionValue, springConfig);
  const [displayValue, setDisplayValue] = useState(0);

  // Trigger spring animation when element enters the viewport
  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  // Subscribe to spring value changes
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      // Direct DOM update ensures maximum performance without React re-render churn
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });

    return () => unsubscribe();
  }, [springValue, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export { StatsCounter };
