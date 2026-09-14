"use client";

import { motion } from "motion/react";
import { certifications } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

export function Certifications() {
  return (
    <ul className="mt-14 border-t border-line">
      {certifications.map((c, i) => (
        <motion.li
          key={c.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.42, ease: EASE_OUT, delay: i * 0.05 }}
          className="group flex flex-col gap-2 border-b border-line py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
        >
          <div className="flex min-w-0 items-baseline gap-4">
            <span className="type-data shrink-0 text-muted tabular-nums">{c.year}</span>
            <div className="min-w-0">
              <p className="text-[0.9375rem] leading-snug text-text transition-colors duration-200 group-hover:text-bright">
                {c.name}
              </p>
              <p className="mt-0.5 text-sm text-muted">{c.issuer}</p>
            </div>
          </div>

          {/* Status is text, never colour alone (pre.txt §40). */}
          <span
            className={`inline-flex shrink-0 items-center gap-2 self-start border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] sm:self-auto ${
              c.status === "Certified"
                ? "border-signal-dim text-signal"
                : "border-line-bright text-muted"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 ${c.status === "Certified" ? "bg-signal" : "bg-muted"}`}
              aria-hidden
            />
            {c.status}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}
