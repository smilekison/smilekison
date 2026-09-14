"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { projects, stack, type Tech } from "@/lib/content";
import { EASE_OUT, micro, viewportOnce } from "@/lib/motion";

const categories = [
  "Cloud",
  "Orchestration",
  "Infrastructure as code",
  "Delivery",
  "Observability",
  "Databases",
  "Languages",
] as const;

/** A grid of category cards — matching smilekisan.com's Skills section
 *  layout. Selecting a technology lights the ones it actually works with and
 *  links to any case study that really uses it — no fabricated skill
 *  percentages (pre.txt §16). */
export function Stack() {
  // Pinned (click/tap) and hovered are separate: a click should stick until
  // the user clicks again, never cleared by a pointer leaving mid-scroll —
  // that combination used to silently drop the selection.
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = pinned ?? hovered;
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matches = (name: string) => !q || name.toLowerCase().includes(q);
  const visibleCount = stack.filter((t) => matches(t.name)).length;

  const lit = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>();
    const tech = stack.find((t) => t.name === active);
    tech?.related.forEach((r) => set.add(r));
    stack.forEach((t) => t.related.includes(active) && set.add(t.name));
    return set;
  }, [active]);

  const current = stack.find((t) => t.name === active);
  // Real cross-link: only shown when the selected tech genuinely appears in
  // a project's stack — never a fabricated connection.
  const usedIn = current ? projects.filter((p) => p.stack.includes(current.name)) : [];

  return (
    <div className="mt-14" onPointerLeave={() => setHovered(null)}>
      <div className="relative mx-auto mb-8 max-w-sm">
        <Search
          size={16}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter tools…"
          aria-label="Filter technologies by name"
          className="w-full rounded-full border border-line-bright bg-panel/60 py-2.5 pl-11 pr-9 text-sm text-bright placeholder:text-muted focus:border-signal focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear filter"
            className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-signal-dim hover:text-signal"
          >
            <X size={13} strokeWidth={2} aria-hidden />
          </button>
        )}
      </div>

      {visibleCount === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No tools match “{query}”.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, ci) => {
            const items = stack.filter((t) => t.category === cat && matches(t.name));
            if (items.length === 0) return null;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.45, ease: EASE_OUT, delay: ci * 0.05 }}
                className="card-surface p-6"
              >
                <p className="flex items-center gap-2 text-[0.9375rem] font-medium text-bright">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                    aria-hidden
                  />
                  {cat}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((t) => (
                    <TechChip
                      key={t.name}
                      tech={t}
                      state={
                        active === t.name ? "active" : lit.has(t.name) ? "lit" : active ? "dim" : "idle"
                      }
                      onHover={() => setHovered(t.name)}
                      onToggle={() => setPinned(pinned === t.name ? null : t.name)}
                    />
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Explanation panel with reserved height — no layout jump on selection. */}
      <div className="card-surface mt-8 min-h-[5.5rem] p-6">
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
                <p className="font-medium text-bright">{current.name}</p>
                <p className="type-data text-signal">{current.category}</p>
              </div>
              <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-dim">{current.use}</p>

              {usedIn.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <span className="type-data text-muted">Used in</span>
                  {usedIn.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 rounded-full bg-signal-dim px-3 py-1 text-[0.8125rem] font-medium text-signal transition-colors duration-200 hover:bg-signal hover:text-white"
                    >
                      {p.title}
                      <span aria-hidden>→</span>
                    </Link>
                  ))}
                </div>
              )}
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
              Select a technology to see how it fits the workflow, which tools it works
              alongside, and which case study actually uses it.
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
        style={state === "active" ? { backgroundImage: "var(--gradient-brand)" } : undefined}
        className={`flex min-h-9 items-center rounded-full border px-3.5 text-[0.8125rem] font-medium transition-colors duration-200 ${
          state === "active"
            ? "border-transparent text-white shadow-sm shadow-black/10"
            : state === "lit"
              ? "border-transparent bg-signal-dim text-signal"
              : "border-transparent bg-signal-dim/60 text-dim hover:bg-signal-dim hover:text-signal"
        }`}
      >
        {tech.name}
      </motion.button>
    </li>
  );
}
