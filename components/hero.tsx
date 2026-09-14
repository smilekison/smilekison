"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";
import { HeroField } from "./hero-field";
import { Pipeline } from "./pipeline";
import { Magnetic } from "./magnetic";

/* Page-load choreography (pre.txt §4). Content is never delayed for effect —
   the whole sequence finishes inside 900ms. */
const step = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE_OUT, delay },
});

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden" aria-label="Introduction">
      <HeroField />

      <div className="shell relative flex min-h-[100svh] flex-col justify-center pb-16 pt-28 sm:pb-20 lg:min-h-[100svh]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---- Left: the statement ---- */}
          <div className="lg:col-span-7">
            <motion.div {...step(0.05)} className="flex items-center">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-base font-semibold text-white shadow-lg shadow-black/10 ring-4 ring-signal-dim sm:h-16 sm:w-16"
                style={{ backgroundImage: "var(--gradient-brand)" }}
                aria-hidden
              >
                SK
              </span>
            </motion.div>

            <motion.div {...step(0.16)} className="mt-5 flex items-center gap-3">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inset-0 animate-pulse bg-signal" />
              </span>
              <span className="type-data text-signal">{profile.availability}</span>
            </motion.div>

            <h1 className="mt-6">
              <motion.span {...step(0.24)} className="text-gradient block type-hero">
                {profile.name}
              </motion.span>
              <motion.span
                {...step(0.28)}
                className="mt-2 block text-[clamp(1.125rem,3.4vw,1.75rem)] font-normal tracking-[-0.01em] text-dim"
              >
                {profile.role}
                <span className="mx-3 text-line-bright" aria-hidden>
                  /
                </span>
                <span className="text-text">{profile.statement}</span>
              </motion.span>
            </h1>

            <motion.p {...step(0.38)} className="measure type-body mt-7 text-dim">
              {profile.summary}
            </motion.p>

            <motion.div {...step(0.48)} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <motion.a
                  href="#projects"
                  data-cursor="view"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  className="group inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 font-medium text-white shadow-md shadow-black/10"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  See the work
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </motion.a>
              </Magnetic>

              <Magnetic>
                <motion.a
                  href={profile.links.resume}
                  download
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line-bright px-6 text-text transition-colors duration-200 hover:border-signal hover:text-bright"
                >
                  Résumé
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.75}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </motion.a>
              </Magnetic>
            </motion.div>
          </div>

          {/* ---- Right: the pipeline ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.55 }}
            className="card-surface bg-panel/70 p-5 backdrop-blur-sm sm:p-6 lg:col-span-5"
          >
            <Pipeline />
          </motion.div>
        </div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-14 hidden items-center gap-2.5 self-start text-muted transition-colors duration-200 hover:text-text lg:inline-flex"
        >
          <ArrowDown size={14} strokeWidth={1.75} aria-hidden />
          <span className="type-data">Scroll</span>
        </motion.a>
      </div>
    </section>
  );
}
