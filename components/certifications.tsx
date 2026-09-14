"use client";

import { motion } from "motion/react";
import { Award, CheckCircle2, ExternalLink } from "lucide-react";
import { certifications } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

export function Certifications() {
  return (
    <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {certifications.map((c, i) => (
        <motion.li
          key={c.name}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.42, ease: EASE_OUT, delay: i * 0.05 }}
          className="card-surface group flex flex-col items-center p-6 text-center transition-transform duration-200 hover:-translate-y-1"
        >
          <span
            className="grid h-14 w-14 place-items-center rounded-full text-white shadow-md shadow-black/10"
            style={{ backgroundImage: "var(--gradient-brand)" }}
            aria-hidden
          >
            <Award size={22} strokeWidth={1.75} />
          </span>

          <p className="mt-4 text-[0.9375rem] font-medium leading-snug text-bright">{c.name}</p>
          <p className="mt-1 text-sm text-signal">{c.issuer}</p>
          <p className="mt-0.5 text-xs text-muted">{c.year}</p>

          <p className="mt-3 text-[0.8125rem] leading-relaxed text-dim">{c.description}</p>

          {/* Status is text + icon, never colour alone (pre.txt §40). */}
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white">
            <CheckCircle2 size={12} strokeWidth={2} aria-hidden />
            {c.status}
          </span>

          {c.url && (
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-medium text-signal transition-colors duration-200 hover:text-bright"
            >
              View credential
              <ExternalLink size={13} strokeWidth={2} aria-hidden />
            </a>
          )}
        </motion.li>
      ))}
    </ul>
  );
}
