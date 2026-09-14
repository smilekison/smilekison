import { about } from "@/lib/content";
import { Nav } from "@/components/nav";
import { Cursor } from "@/components/cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { Hero } from "@/components/hero";
import { Reveal, SectionHeading } from "@/components/section";
import { Terminal } from "@/components/terminal";
import { Metrics } from "@/components/metrics";
import { Timeline } from "@/components/timeline";
import { Projects } from "@/components/projects";
import { Stack } from "@/components/stack";
import { Certifications } from "@/components/certifications";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Nav />

      <main id="main">
        <Hero />

        {/* ---- 01 About ---- */}
        <section id="about" className="shell scroll-mt-24 border-t border-line py-24 sm:py-32">
          <SectionHeading
            index="01"
            label="About"
            title={about.heading}
            description={about.body[0]}
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="measure type-body text-dim">{about.body[1]}</p>
              </Reveal>

              <ul className="mt-12 grid gap-4 sm:grid-cols-3">
                {about.principles.map((p, i) => (
                  <Reveal as="li" key={p.title} delay={i * 0.07} className="card-surface p-5">
                    <span
                      className="mb-3 block h-1.5 w-8 rounded-full"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                      aria-hidden
                    />
                    <p className="text-[0.9375rem] font-medium text-bright">{p.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                  </Reveal>
                ))}
              </ul>
            </div>

            <Reveal delay={0.1} className="lg:col-span-5">
              <Terminal />
            </Reveal>
          </div>

          <Reveal delay={0.05} className="mt-14">
            <Metrics />
          </Reveal>
        </section>

        {/* ---- 02 Experience ---- */}
        <section id="experience" className="shell scroll-mt-24 border-t border-line py-24 sm:py-32">
          <SectionHeading
            index="02"
            label="Experience"
            title="From an intern in Nepal to DevOps in the UK."
            description="A decade of study and two engineering roles across two countries — each one moving closer to the infrastructure, and to the reasons software fails in production."
          />
          <Timeline />
        </section>

        {/* ---- 03 Projects ---- */}
        <section id="projects" className="shell scroll-mt-24 border-t border-line py-24 sm:py-32">
          <SectionHeading
            index="03"
            label="Projects"
            title="Three systems, and what changed after."
            description="Each case study covers the problem as the team experienced it, the architecture that replaced it, and what measurably improved."
          />
          <Projects />
        </section>

        {/* ---- 04 Stack ---- */}
        <section id="stack" className="shell scroll-mt-24 border-t border-line py-24 sm:py-32">
          <SectionHeading
            index="04"
            label="Stack"
            title="The tools, and how they connect."
            description="Grouped by the job they do rather than ranked by confidence. Selecting one highlights the tools it genuinely works alongside."
          />
          <Stack />
        </section>

        {/* ---- 05 Certifications ---- */}
        <section
          id="certifications"
          className="shell scroll-mt-24 border-t border-line py-24 sm:py-32"
        >
          <SectionHeading
            index="05"
            label="Certifications"
            title="Verified, and in progress."
            description="Certification is a floor, not a ceiling — but it is a useful, checkable floor."
          />
          <Certifications />
        </section>
      </main>

      <Contact />
    </>
  );
}
