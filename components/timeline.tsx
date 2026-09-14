"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { timeline } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

/** Stacked full-width cards, newest first — matching smilekisan.com's own
 *  Experience section layout: a gradient date pill top-right, org name in
 *  the brand color, and itemized achievements where the role has them. */
export function Timeline() {
  return (
    <ol className="mt-14 space-y-5">
      {timeline.map((item, i) => (
        <motion.li
          key={item.year + item.title}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.05 }}
          className="card-surface p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="type-sub">{item.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] font-medium text-signal">{item.org}</p>
              {item.location && <p className="mt-0.5 text-sm text-muted">{item.location}</p>}
            </div>
            <span
              className="shrink-0 rounded-full px-4 py-1.5 text-[0.8125rem] font-medium text-white shadow-sm shadow-black/10"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              {item.year}
            </span>
          </div>

          {item.bullets ? (
            <>
              <p className="measure mt-5 text-[0.9375rem] leading-relaxed text-dim">{item.body}</p>
              <p className="type-data mt-6 text-muted">Key achievements</p>
              <ul className="mt-3 space-y-2.5">
                {item.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-text">
                    <ChevronRight
                      size={16}
                      strokeWidth={2.25}
                      className="mt-1 shrink-0 text-signal"
                      aria-hidden
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="measure mt-5 text-[0.9375rem] leading-relaxed text-dim">{item.body}</p>
          )}

          <ul className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full bg-signal-dim px-3 py-1 text-[0.6875rem] text-signal">
                {t}
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  );
}
