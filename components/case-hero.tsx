"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";

/** Opens with the same three pieces the card showed — index, title, tagline —
 *  so the page reads as a continuation of what was clicked (pre.txt §14). */
const step = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: EASE_OUT, delay },
});

export function CaseHero({ project }: { project: Project }) {
  return (
    <header className="relative overflow-hidden">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />

      <div className="shell relative pb-16 pt-32 sm:pb-20 sm:pt-40">
        <motion.div {...step(0)}>
          <Link
            href="/#projects"
            className="group inline-flex min-h-11 items-center gap-2.5 text-sm text-muted transition-colors duration-200 hover:text-bright"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.75}
              className="transition-transform duration-200 group-hover:-translate-x-1"
              aria-hidden
            />
            All projects
          </Link>
        </motion.div>

        <motion.div {...step(0.08)} className="mt-10 flex items-center gap-3">
          <span className="type-data text-signal">{project.index}</span>
          <span className="h-px w-8 bg-line-bright" aria-hidden />
          <span className="type-data text-muted">{project.year}</span>
        </motion.div>

        <motion.h1 {...step(0.16)} className="type-section mt-5 max-w-[22ch]">
          {project.title}
        </motion.h1>

        <motion.p {...step(0.26)} className="measure type-body mt-6 text-dim">
          {project.tagline}
        </motion.p>
      </div>
    </header>
  );
}
