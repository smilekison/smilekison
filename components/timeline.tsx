"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { timeline } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  // The rail fills as the section passes through the viewport — it reports
  // reading position rather than decorating (pre.txt §17).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 70%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const scaleY = useTransform(fill, (v) => (reduced ? 1 : v));

  return (
    <ol ref={ref} className="relative mt-14">
      {/* Rail: unlit track, then the progress fill on top */}
      <div
        className="absolute bottom-3 left-[0.3125rem] top-3 w-px bg-line sm:left-[4.65rem] lg:left-[7.4rem]"
        aria-hidden
      />
      <motion.div
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute bottom-3 left-[0.3125rem] top-3 w-px bg-signal sm:left-[4.65rem] lg:left-[7.4rem]"
        aria-hidden
      />

      {timeline.map((item, i) => (
        <motion.li
          key={item.year + item.title}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.05 }}
          className="relative grid grid-cols-[auto_1fr] gap-x-6 pb-8 last:pb-0 sm:grid-cols-[4rem_auto_1fr] lg:grid-cols-[6.75rem_auto_1fr] lg:gap-x-8"
        >
          {/* Year sits in its own column from sm up; inline on the smallest screens */}
          <span className="type-data col-start-2 row-start-1 mb-2 text-signal sm:col-start-1 sm:row-start-1 sm:mb-0 sm:pt-6 sm:text-right">
            {item.year}
          </span>

          <span
            className="relative z-10 col-start-1 row-start-1 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-signal bg-ink sm:col-start-2 sm:mt-7"
            aria-hidden
          />

          <div className="card-surface col-start-2 row-start-2 p-5 sm:col-start-3 sm:row-start-1 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="type-sub">{item.title}</h3>
              <span
                className="rounded-full px-3 py-1 text-[0.6875rem] font-medium text-white"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                {item.year}
              </span>
            </div>
            <p className="mt-1 text-sm text-signal">{item.org}</p>
            <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-dim">{item.body}</p>
            <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
              {item.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-signal-dim px-3 py-1 text-[0.6875rem] text-signal"
                >
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
