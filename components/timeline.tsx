"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { timeline } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

/** A vertical rail with a dot per entry — the actual timeline — running
 *  beside stacked cards (gradient date pill, itemized achievements where the
 *  role has them). The rail fills as the section scrolls by, newest first. */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 75%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const scaleY = useTransform(fill, (v) => (reduced ? 1 : v));

  return (
    <ol ref={ref} className="relative mt-14 space-y-5">
      {/* Rail: unlit track, then the progress fill drawn on top */}
      <div
        className="absolute bottom-3 left-[0.9375rem] top-3 w-px bg-line sm:left-[1.1875rem]"
        aria-hidden
      />
      <motion.div
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute bottom-3 left-[0.9375rem] top-3 w-px bg-signal sm:left-[1.1875rem]"
        aria-hidden
      />

      {timeline.map((item, i) => (
        <motion.li
          key={item.year + item.title}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.05 }}
          className="relative pl-9 sm:pl-12"
        >
          <span
            className="absolute left-2.5 top-8 z-10 h-2.5 w-2.5 rounded-full border-2 border-signal bg-ink sm:left-3.5"
            aria-hidden
          />

          <div className="card-surface p-6 sm:p-8">
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
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
