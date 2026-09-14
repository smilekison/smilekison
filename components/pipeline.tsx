"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Box,
  Cloud,
  Code2,
  GitBranch,
  Hexagon,
  RefreshCw,
  ServerCog,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { EASE_OUT, micro, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

type Stage = {
  id: string;
  label: string;
  short: string;
  detail: string;
  Icon: LucideIcon;
  /** Kept in the compact mobile flow (pre.txt §24). */
  compact: boolean;
};

const stages: Stage[] = [
  { id: "dev", label: "Developer", short: "Dev", detail: "Commit on a protected branch, reviewed before it merges.", Icon: Code2, compact: true },
  { id: "git", label: "Git", short: "Git", detail: "Trunk is the single source of truth for code and config.", Icon: GitBranch, compact: false },
  { id: "ci", label: "CI/CD", short: "Pipeline", detail: "Build, test and package once. Every stage after this promotes, never rebuilds.", Icon: RefreshCw, compact: true },
  { id: "sec", label: "Security", short: "Scan", detail: "Dependency, image and policy scanning. A critical finding stops the release.", Icon: ShieldCheck, compact: true },
  { id: "img", label: "Container", short: "Image", detail: "One signed, immutable image, addressed by digest.", Icon: Box, compact: false },
  { id: "k8s", label: "Kubernetes", short: "Cluster", detail: "Declarative rollout with health gates and automatic rollback.", Icon: Hexagon, compact: true },
  { id: "cloud", label: "Cloud", short: "Cloud", detail: "Provisioned from Terraform — no resource exists without a reviewed plan.", Icon: Cloud, compact: false },
  { id: "prod", label: "Production", short: "Live", detail: "Observed against service-level objectives, not host thresholds.", Icon: ServerCog, compact: true },
];

const compactStages = stages.filter((s) => s.compact);

export function Pipeline() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const current = stages.find((s) => s.id === active);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="type-data text-muted">Delivery path</span>
        <span className="flex items-center gap-2 type-data text-muted">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inset-0 bg-signal" />
            {!reduced && (
              <motion.span
                className="absolute inset-0 bg-signal"
                animate={{ opacity: [0.9, 0, 0.9], scale: [1, 2.4, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </span>
          Healthy
        </span>
      </div>

      {/* ---- Desktop / tablet: horizontal flow ---- */}
      <div className="hidden sm:block" onPointerLeave={() => setActive(null)}>
        <Flow stages={stages} active={active} setActive={setActive} reduced={reduced} />
      </div>

      {/* ---- Mobile: compact stacked flow, four stages only ---- */}
      <div className="sm:hidden">
        <FlowCompact stages={compactStages} active={active} setActive={setActive} />
      </div>

      {/* Shared explanation panel. Reserved height so nothing jumps (§47). */}
      <div className="mt-5 min-h-[4.5rem] border-t border-line pt-4">
        <AnimatePresence mode="wait" initial={false}>
          {current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
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
              className="max-w-prose text-sm leading-relaxed text-muted"
            >
              Every stage is code. <span className="hidden sm:inline">Hover</span>
              <span className="sm:hidden">Tap</span> a stage to see what it does.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Flow({
  stages,
  active,
  setActive,
  reduced,
}: {
  stages: Stage[];
  active: string | null;
  setActive: (v: string | null) => void;
  reduced: boolean;
}) {
  return (
    <div className="relative">
      {/* Connector rail, drawn once on entry */}
      <div className="pointer-events-none absolute left-0 right-0 top-6 h-px lg:top-7">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
          style={{ transformOrigin: "left" }}
          className="h-full w-full bg-line-bright"
        />
        {!reduced && (
          <motion.div
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-signal to-transparent"
            initial={{ x: "-10%", opacity: 0 }}
            whileInView={{ x: ["0%", "1200%"], opacity: [0, 0.7, 0] }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "linear", delay: 1 }}
          />
        )}
      </div>

      <ul className="relative flex items-start justify-between gap-1">
        {stages.map((s, i) => {
          const isActive = active === s.id;
          const dimmed = active !== null && !isActive;
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.2 + i * 0.055 }}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              <button
                type="button"
                onPointerEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                onClick={() => setActive(isActive ? null : s.id)}
                aria-pressed={isActive}
                className="group flex w-full flex-col items-center focus-visible:outline-offset-4"
              >
                <motion.span
                  animate={{
                    scale: isActive ? 1.12 : 1,
                    opacity: dimmed ? 0.42 : 1,
                  }}
                  transition={micro}
                  className={`grid h-12 w-12 place-items-center border transition-colors duration-200 lg:h-14 lg:w-14 ${
                    isActive
                      ? "border-signal bg-raise text-signal"
                      : "border-line-bright bg-panel text-dim group-hover:border-muted group-hover:text-text"
                  }`}
                >
                  <s.Icon size={18} strokeWidth={1.6} aria-hidden />
                </motion.span>
                <motion.span
                  animate={{ opacity: dimmed ? 0.42 : 1 }}
                  transition={micro}
                  className={`mt-3 truncate text-center text-[0.6875rem] tracking-wide lg:text-xs ${
                    isActive ? "text-bright" : "text-muted"
                  }`}
                >
                  {s.label}
                </motion.span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function FlowCompact({
  stages,
  active,
  setActive,
}: {
  stages: Stage[];
  active: string | null;
  setActive: (v: string | null) => void;
}) {
  return (
    <ul className="relative">
      <div className="absolute bottom-6 left-[1.4375rem] top-6 w-px bg-line-bright" aria-hidden />
      {stages.map((s, i) => {
        const isActive = active === s.id;
        return (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.36, ease: EASE_OUT, delay: i * 0.07 }}
            className="relative"
          >
            <button
              type="button"
              onClick={() => setActive(isActive ? null : s.id)}
              aria-pressed={isActive}
              className="flex min-h-12 w-full items-center gap-4 py-1.5 text-left"
            >
              <span
                className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center border transition-colors duration-200 ${
                  isActive
                    ? "border-signal bg-raise text-signal"
                    : "border-line-bright bg-panel text-dim"
                }`}
              >
                <s.Icon size={18} strokeWidth={1.6} aria-hidden />
              </span>
              <span className={`text-sm ${isActive ? "text-bright" : "text-text"}`}>{s.label}</span>
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}
