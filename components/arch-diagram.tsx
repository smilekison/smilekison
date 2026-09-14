"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ArchNode } from "@/lib/content";
import { EASE_OUT, micro, viewportOnce } from "@/lib/motion";

/** Architecture flow. Reflows vertically on small screens rather than scrolling
 *  sideways, and every explanation is reachable by tap (pre.txt §15, §27). */
export function ArchDiagram({ nodes, label }: { nodes: ArchNode[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  // A node is "related" if it feeds the active node or is fed by it.
  const related = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>();
    const node = nodes.find((n) => n.id === active);
    node?.to.forEach((id) => set.add(id));
    nodes.forEach((n) => n.to.includes(active) && set.add(n.id));
    return set;
  }, [active, nodes]);

  const current = nodes.find((n) => n.id === active);

  return (
    <figure className="card-surface overflow-hidden bg-panel/50">
      <figcaption className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
        <span className="type-data text-muted">{label}</span>
        <span className="type-data text-muted">
          <span className="hidden sm:inline">Hover</span>
          <span className="sm:hidden">Tap</span> to inspect
        </span>
      </figcaption>

      <div
        className="p-4 sm:p-6"
        onPointerLeave={() => setActive(null)}
      >
        <ul className="flex flex-col items-stretch gap-0 md:flex-row md:flex-wrap md:items-start md:gap-y-6">
          {nodes.map((node, i) => {
            const isActive = active === node.id;
            const isRelated = related.has(node.id);
            const dimmed = active !== null && !isActive && !isRelated;
            const last = i === nodes.length - 1;

            return (
              <li key={node.id} className="flex items-stretch md:items-center">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.35, ease: EASE_OUT, delay: i * 0.05 }}
                  onPointerEnter={() => setActive(node.id)}
                  onFocus={() => setActive(node.id)}
                  onClick={() => setActive(isActive ? null : node.id)}
                  aria-pressed={isActive}
                  animate={{ opacity: dimmed ? 0.38 : 1 }}
                  style={isActive ? { backgroundImage: "var(--gradient-brand)" } : undefined}
                  className={`flex min-h-12 w-full items-center justify-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200 md:w-auto ${
                    isActive
                      ? "border-transparent text-white shadow-sm shadow-black/10"
                      : isRelated
                        ? "border-transparent bg-signal-dim text-signal"
                        : "border-line-bright bg-ink text-dim hover:border-signal hover:text-text"
                  }`}
                >
                  {node.label}
                </motion.button>

                {!last && (
                  <span
                    className="flex shrink-0 items-center justify-center self-center py-1.5 text-line-bright md:px-2 md:py-0"
                    aria-hidden
                  >
                    <ChevronDown size={16} strokeWidth={1.5} className="md:hidden" />
                    <ChevronRight size={16} strokeWidth={1.5} className="hidden md:block" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 min-h-[3.25rem] border-t border-line pt-4">
          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={micro}
              >
                <p className="text-sm font-medium text-bright">{current.label}</p>
                <p className="mt-1 max-w-prose text-sm leading-relaxed text-dim">{current.detail}</p>
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={micro}
                className="text-sm text-muted"
              >
                Select a component to see its role in the system.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}
