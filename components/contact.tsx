"use client";

import { motion } from "motion/react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { contact, profile } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { Magnetic } from "./magnetic";
import { ContactForm } from "./contact-form";

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-line">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{ backgroundImage: "var(--gradient-brand)" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink" />

      <div className="shell relative py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <h2 className="type-section max-w-[18ch]">{contact.heading}</h2>
          <p className="measure type-body mt-6 text-dim">{contact.body}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.08 }}
          className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14"
        >
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5">
            <div className="card-surface p-6">
              <p className="type-data text-muted">Prefer a direct line?</p>

              <Magnetic className="mt-5 inline-block" strength={5}>
                <motion.a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent("Engineering role — let's talk")}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  className="group inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 font-medium text-white shadow-md shadow-black/10"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  {contact.cta}
                  <span
                    className="transition-transform duration-200 group-hover:translate-x-1.5"
                    aria-hidden
                  >
                    →
                  </span>
                </motion.a>
              </Magnetic>

              <div className="mt-6 space-y-2 font-mono text-sm text-muted">
                <a
                  href={`mailto:${profile.email}`}
                  className="block transition-colors duration-200 hover:text-signal"
                >
                  {profile.email}
                </a>
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  className="block transition-colors duration-200 hover:text-signal"
                >
                  {profile.phone}
                </a>
              </div>

              <div className="mt-6 flex items-center gap-1 border-t border-line pt-4">
                <IconLink href={`mailto:${profile.email}`} label="Email">
                  <Mail size={17} strokeWidth={1.6} aria-hidden />
                </IconLink>
                <IconLink href={`tel:${profile.phone.replace(/\s+/g, "")}`} label="Phone">
                  <Phone size={17} strokeWidth={1.6} aria-hidden />
                </IconLink>
                <IconLink href={profile.links.github} label="GitHub" external>
                  <Github size={17} strokeWidth={1.6} aria-hidden />
                </IconLink>
                <IconLink href={profile.links.linkedin} label="LinkedIn" external>
                  <Linkedin size={17} strokeWidth={1.6} aria-hidden />
                </IconLink>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-16 border-t border-line pt-8">
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
      className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-signal-dim hover:text-signal"
    >
      {children}
    </a>
  );
}
