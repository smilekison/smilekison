"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
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

const infoCards = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s+/g, "")}`,
  },
  { icon: MapPin, label: "Location", value: profile.location },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden" aria-label="Introduction">
      <HeroField />

      <div className="shell relative flex min-h-[100svh] flex-col justify-center gap-12 pb-16 pt-32 sm:pb-20 lg:min-h-[100svh]">
        {/* ---- Centered statement — matches smilekisan.com's hero layout ---- */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...step(0.05)} className="flex justify-center">
            <span
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-2xl font-semibold text-white shadow-lg shadow-black/10 ring-4 ring-signal-dim sm:h-24 sm:w-24 sm:text-3xl"
              style={{ backgroundImage: "var(--gradient-brand)" }}
              aria-hidden
            >
              SK
            </span>
          </motion.div>

          <motion.div {...step(0.16)} className="mt-6 flex items-center justify-center gap-3">
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
              {...step(0.3)}
              className="mt-3 block text-[clamp(1.125rem,3.4vw,1.75rem)] font-normal tracking-[-0.01em] text-dim"
            >
              {profile.role}
              <span className="mx-3 text-line-bright" aria-hidden>
                /
              </span>
              <span className="text-text">{profile.statement}</span>
            </motion.span>
          </h1>

          <motion.p {...step(0.38)} className="type-body mx-auto mt-7 max-w-2xl text-dim">
            {profile.summary}
          </motion.p>

          <motion.div
            {...step(0.48)}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
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

        {/* ---- Info cards — Email / Phone / Location, as on smilekisan.com ---- */}
        <motion.div
          {...step(0.56)}
          className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-3"
        >
          {infoCards.map((c) => {
            const Tag = c.href ? "a" : "div";
            return (
              <Tag
                key={c.label}
                {...(c.href ? { href: c.href } : {})}
                className="card-surface flex items-center gap-3 bg-panel/70 p-4 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                  aria-hidden
                >
                  <c.icon size={17} strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="type-data block text-muted">{c.label}</span>
                  <span className="block truncate text-sm font-medium text-bright">{c.value}</span>
                </span>
              </Tag>
            );
          })}
        </motion.div>

        {/* ---- Delivery path — kept as its own band beneath the fold rather
            than split beside the hero text, to match the source's simpler,
            single-column flow. ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.66 }}
          className="card-surface mx-auto w-full max-w-4xl bg-panel/70 p-5 backdrop-blur-sm sm:p-6"
        >
          <Pipeline />
        </motion.div>
      </div>
    </section>
  );
}
