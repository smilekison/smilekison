"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { metrics, type Metric } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/motion";

export function Metrics() {
  return (
    <ul className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
      {metrics.map((m) => (
        <li key={m.label} className="bg-ink p-5 sm:p-6">
          <Counter metric={m} />
          <p className="mt-2 text-sm font-medium text-text">{m.label}</p>
          <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{m.note}</p>
        </li>
      ))}
    </ul>
  );
}

function Counter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const decimals = metric.decimals ?? 0;

  useEffect(() => {
    if (!inView) return;

    // Reduced motion: the value appears, it does not perform (pre.txt §18, §30).
    if (reduced) {
      setDisplay(metric.value);
      return;
    }

    const controls = animate(0, metric.value, {
      duration: 1.1,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduced, metric.value]);

  return (
    <p ref={ref} className="flex items-baseline text-bright">
      {/* The accessible value is always the real one, never the animating one. */}
      <span className="sr-only">
        {metric.value.toFixed(decimals)}
        {metric.suffix}
      </span>
      <span aria-hidden className="text-[clamp(2rem,5vw,2.75rem)] font-medium tabular-nums tracking-tight">
        {display.toFixed(decimals)}
      </span>
      <span aria-hidden className="ml-0.5 text-xl font-medium text-signal">
        {metric.suffix}
      </span>
    </p>
  );
}
