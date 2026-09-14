"use client";

import { motion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";
import { contact, profile } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { Magnetic } from "./magnetic";

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-line">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink" />

      <div className="shell relative py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <h2 className="type-section max-w-[18ch]">{contact.heading}</h2>
          <p className="measure type-body mt-6 text-dim">{contact.body}</p>

          <div className="mt-10">
            <Magnetic className="inline-block" strength={5}>
              <motion.a
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Engineering role — let's talk")}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="group inline-flex min-h-14 items-center gap-3 bg-signal px-7 text-[1.0625rem] font-medium text-ink"
              >
                {/* Both labels occupy the same cell, so the button never resizes. */}
                <span className="grid">
                  <span className="col-start-1 row-start-1 transition-opacity duration-200 group-hover:opacity-0">
                    {contact.cta}
                  </span>
                  <span
                    className="col-start-1 row-start-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden
                  >
                    Let&rsquo;s build it
                  </span>
                </span>
                <span
                  className="transition-transform duration-200 group-hover:translate-x-1.5"
                  aria-hidden
                >
                  →
                </span>
              </motion.a>
            </Magnetic>
          </div>

          <p className="mt-6 font-mono text-sm text-muted">
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors duration-200 hover:text-signal"
            >
              {profile.email}
            </a>
          </p>
        </motion.div>

        <div className="mt-20 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1">
            <IconLink href={`mailto:${profile.email}`} label="Email">
              <Mail size={17} strokeWidth={1.6} aria-hidden />
            </IconLink>
            <IconLink href={profile.links.github} label="GitHub" external>
              <Github size={17} strokeWidth={1.6} aria-hidden />
            </IconLink>
            <IconLink href={profile.links.linkedin} label="LinkedIn" external>
              <Linkedin size={17} strokeWidth={1.6} aria-hidden />
            </IconLink>
          </div>

          <p className="font-mono text-[0.6875rem] tracking-wide text-muted">
            © {year} {profile.name} · {profile.location}
          </p>
        </div>
      </div>
    </footer>
  );
}

function IconLink({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className="grid h-11 w-11 place-items-center text-muted transition-colors duration-200 hover:text-signal"
    >
      {children}
    </a>
  );
}
