import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { Nav } from "@/components/nav";
import { Cursor } from "@/components/cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { Contact } from "@/components/contact";
import { ArchDiagram } from "@/components/arch-diagram";
import { Reveal } from "@/components/section";
import { CaseHero } from "@/components/case-hero";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Nav variant="sub" />

      <main id="main">
        <CaseHero project={project} />

        <div className="shell border-t border-line py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-14 lg:col-span-7">
              <Reveal>
                <h2 className="type-data text-signal">The problem</h2>
                <p className="measure type-body mt-5 text-dim">{project.problem}</p>
              </Reveal>

              <Reveal>
                <h2 className="type-data text-signal">What I built</h2>
                <p className="measure type-body mt-5 text-dim">{project.solution}</p>
              </Reveal>

              <Reveal>
                <h2 className="type-data text-signal">Outcome</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                  {project.outcomes.map((o) => (
                    <li key={o.label} className="card-surface p-5">
                      <p className="text-gradient text-2xl font-semibold tracking-tight">{o.value}</p>
                      <p className="mt-1.5 text-sm leading-snug text-muted">{o.label}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Sticky detail rail on large screens */}
            <aside className="lg:col-span-5">
              <div className="space-y-8 lg:sticky lg:top-28">
                <Reveal>
                  <h2 className="type-data text-muted">Role</h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-text">{project.role}</p>
                </Reveal>

                <Reveal delay={0.05}>
                  <h2 className="type-data text-muted">Stack</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-signal-dim px-3 py-1.5 font-mono text-[0.6875rem] text-signal"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {(project.repo || project.live) && (
                  <Reveal delay={0.1}>
                    <div className="flex flex-wrap gap-3">
                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-bright px-4 text-sm text-text transition-colors duration-200 hover:border-signal hover:text-bright"
                        >
                          Repository
                          <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-bright px-4 text-sm text-text transition-colors duration-200 hover:border-signal hover:text-bright"
                        >
                          Live
                          <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
                        </a>
                      )}
                    </div>
                  </Reveal>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* ---- Architecture ---- */}
        <div className="shell border-t border-line py-20 sm:py-24">
          <Reveal>
            <h2 className="type-section">Architecture</h2>
            <p className="measure type-body mt-4 text-dim">
              The shape of the system after the work. Inspect any component to see the part it
              plays.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <ArchDiagram nodes={project.architecture} label={project.title} />
          </Reveal>
        </div>

        {/* ---- Next ---- */}
        <div className="shell border-t border-line py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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

            <Link
              href={`/projects/${next.slug}`}
              prefetch={false}
              data-cursor="open"
              className="group inline-flex min-h-11 flex-col items-start gap-1 sm:items-end"
            >
              <span className="type-data text-muted">Next case study</span>
              <span className="inline-flex items-center gap-2 text-[0.9375rem] text-text transition-colors duration-200 group-hover:text-bright">
                {next.title}
                <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </main>

      <Contact />
    </>
  );
}
