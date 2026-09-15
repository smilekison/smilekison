"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { projects, type Project } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

/** 3-column grid, matching smilekisan.com's own Projects layout: compact
 *  cards with tag pills and a highlighted Impact box, not a stacked list. */
export function Projects() {
  return (
    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: (index % 3) * 0.08 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        prefetch={false}
        data-cursor="open"
        aria-label={`Open case study: ${project.title}`}
        className="card-surface group flex h-full flex-col p-6 transition-transform duration-200 hover:-translate-y-1"
      >
        <div className="flex items-center gap-3">
          <span className="type-data text-signal">{project.index}</span>
          <span className="h-px flex-1 bg-line-bright" aria-hidden />
          <span className="type-data text-muted">{project.year}</span>
        </div>

        <h3 className="type-sub mt-4 text-[1.375rem] leading-tight">{project.title}</h3>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((t) => (
            <li key={t} className="rounded-full bg-signal-dim px-2.5 py-1 font-mono text-[0.625rem] text-signal">
              {t}
            </li>
          ))}
        </ul>

        <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-dim">{project.tagline}</p>

        <div className="mt-5 rounded-2xl border-l-4 border-signal bg-signal-dim/60 p-4">
          <p className="type-data mb-3 text-signal">Impact</p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-3">
            {project.outcomes.slice(0, 2).map((o) => (
              <li key={o.label} className="min-w-0">
                <p className="truncate text-base font-semibold tabular-nums text-bright">{o.value}</p>
                <p className="mt-0.5 text-[0.75rem] leading-snug text-dim">{o.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-signal">
          Read the case study
          <ArrowRight
            size={15}
            strokeWidth={1.75}
            className="transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden
          />
        </span>
      </Link>
    </motion.article>
  );
}
