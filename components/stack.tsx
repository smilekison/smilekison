"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { stack, type Tech } from "@/lib/content";
import { EASE_OUT, micro, viewportOnce } from "@/lib/motion";

const categories = [
  "Cloud",
  "Orchestration",
  "Infrastructure as code",
  "Delivery",
  "Observability",
  "Languages",
] as const;

/** The ecosystem, grouped by role. Selecting one technology lights the ones it
 *  actually works with — no skill percentages (pre.txt §16). */
export function Stack() {
  const [active, setActive] = useState<string | null>(null);

  const lit = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>();
    const tech = stack.find((t) => t.name === active);
    tech?.related.forEach((r) => set.add(r));
    stack.forEach((t) => t.related.includes(active) && set.add(t.name));
    return set;
  }, [active]);

  const current = stack.find((t) => t.name === active);

  return (
    <div className="mt-14" onPointerLeave={() => setActive(null)}>
      <div className="space-y-8">
        {categories.map((cat, ci) => {
          const items = stack.filter((t) => t.category === cat);
          if (items.length === 0) return null;
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: ci * 0.05 }}
              className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:gap-8 lg:grid-cols-[12rem_1fr]"
            >
              <p className="type-data pt-2.5 text-muted">{cat}</p>
              <ul className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <TechChip
                    key={t.name}
                    tech={t}
                    state={
                      active === t.name ? "active" : lit.has(t.name) ? "lit" : active ? "dim" : "idle"
                    }
                    onHover={() => setActive(t.name)}
                    onToggle={() => setActive(active === t.name ? null : t.name)}
                  />
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Explanation panel with reserved height — no layout jump on selection. */}
      <div className="mt-10 min-h-[5rem] border-t border-line pt-5">
        <AnimatePresence mode="wait" initial={false}>
          {current ? (
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={micro}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-ink font-medium text-bright">{current.name}</p>
                <p className="type-data text-signal">{current.category}</p>
              </div>
              <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-dim">{current.use}</p>
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={micro}
              className="measure text-[0.9375rem] leading-relaxed text-muted"
            >
              Select a technology to see how it fits the workflow, and which tools it works
              alongside.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TechChip({
  tech,
  state,
  onHover,
  onToggle,
}: {
  tech: Tech;
  state: "active" | "lit" | "dim" | "idle";
  onHover: () => void;
  onToggle: () => void;
}) {
  return (
    <li>
      <motion.button
        type="button"
        onPointerEnter={onHover}
        onFocus={onHover}
        onClick={onToggle}
        aria-pressed={state === "active"}
        animate={{ opacity: state === "dim" ? 0.35 : 1 }}
        transition={micro}
        className={`flex min-h-11 items-center border px-3.5 text-sm transition-colors duration-200 ${
          state === "active"
            ? "border-signal bg-raise text-bright"
            : state === "lit"
              ? "border-signal-dim bg-raise text-text"
              : "border-line bg-panel/40 text-dim hover:border-line-bright hover:text-text"
        }`}
      >
        {tech.name}
      </motion.button>
    </li>
  );
}
