"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { projects, type Project } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useRichMotion } from "@/lib/hooks";

export function Projects() {
  return (
    <div className="mt-14 space-y-5">
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const rich = useRichMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Internal parallax: the card stays put, the schematic inside it shifts a few
  // pixels. Depth without moving the page (pre.txt §13).
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 110, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 110, damping: 20, mass: 0.5 });
  const artX = useTransform(sx, [0, 1], [12, -12]);
  const artY = useTransform(sy, [0, 1], [8, -8]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.55, ease: EASE_OUT, delay: index * 0.06 }}
    >
      <motion.div
        ref={ref}
        whileHover={rich ? { y: -6 } : undefined}
        transition={{ duration: 0.3, ease: EASE_OUT }}
        onPointerMove={(e) => {
          if (!rich) return;
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className="card-surface group relative overflow-hidden"
      >
        <Link
          href={`/projects/${project.slug}`}
          data-cursor="open"
          className="block p-6 sm:p-8 lg:p-10"
          aria-label={`Open case study: ${project.title}`}
        >
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Meta */}
            <div className="flex items-center gap-3 lg:col-span-2 lg:flex-col lg:items-start lg:gap-2">
              <span className="type-data text-signal">{project.index}</span>
              <span className="h-px w-6 bg-line-bright lg:w-full" aria-hidden />
              <span className="type-data text-muted">{project.year}</span>
            </div>

            {/* Body */}
            <div className="lg:col-span-6">
              <h3 className="type-sub transition-transform duration-300 group-hover:translate-x-1">
                {project.title}
              </h3>
              <p className="measure mt-4 text-[0.9375rem] leading-relaxed text-dim">
                {project.tagline}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-signal-dim px-3 py-1 font-mono text-[0.6875rem] text-signal"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-signal">
                Read the case study
                <ArrowRight
                  size={15}
                  strokeWidth={1.75}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden
                />
              </span>
            </div>

            {/* Schematic — the parallax layer */}
            <div
              className="overflow-hidden rounded-2xl border-l-4 border-signal bg-signal-dim/60 lg:col-span-4"
            >
              <motion.div style={rich ? { x: artX, y: artY } : undefined} className="p-5">
                <p className="type-data mb-4 text-signal">Impact</p>
                <ul className="space-y-3.5">
                  {project.outcomes.map((o) => (
                    <li key={o.label} className="flex items-baseline gap-3">
                      <span className="min-w-[3.5rem] font-medium tabular-nums text-bright">
                        {o.value}
                      </span>
                      <span className="text-[0.8125rem] leading-snug text-dim">{o.label}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}
