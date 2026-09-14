"use client";

import { motion } from "motion/react";
import { Award, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { certifications, type Certification } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

const earned = certifications.filter((c) => c.status === "Certified");
const inProgress = certifications.filter((c) => c.status === "In progress");

export function Certifications() {
  return (
    <div className="mt-14 space-y-12">
      <Group items={earned} startDelay={0} />

      {inProgress.length > 0 && (
        <div>
          <p className="type-data text-muted">In progress</p>
          <Group items={inProgress} startDelay={earned.length * 0.05} />
        </div>
      )}
    </div>
  );
}

function Group({ items, startDelay }: { items: Certification[]; startDelay: number }) {
  return (
    <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((c, i) => (
        <motion.li
          key={c.name}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.42, ease: EASE_OUT, delay: startDelay + i * 0.05 }}
          className="card-surface group flex flex-col items-center p-6 text-center transition-transform duration-200 hover:-translate-y-1"
        >
          <span
            className="grid h-14 w-14 place-items-center rounded-full text-white shadow-md shadow-black/10"
            style={{
              backgroundImage:
                c.status === "Certified" ? "var(--gradient-brand)" : "var(--gradient-rose)",
            }}
            aria-hidden
          >
            <Award size={22} strokeWidth={1.75} />
          </span>

          <p className="mt-4 text-[0.9375rem] font-medium leading-snug text-bright">{c.name}</p>
          <p className="mt-1 text-sm text-signal">{c.issuer}</p>
          <p className="mt-0.5 text-xs text-muted">
            {c.status === "Certified" ? c.year : `Expected ${c.year}`}
          </p>

          <p className="mt-3 text-[0.8125rem] leading-relaxed text-dim">{c.description}</p>

          {/* Status is text + icon, never colour alone (pre.txt §40). */}
          <span
            className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white ${
              c.status === "Certified" ? "bg-emerald-600" : "bg-amber-500"
            }`}
          >
            {c.status === "Certified" ? (
              <CheckCircle2 size={12} strokeWidth={2} aria-hidden />
            ) : (
              <Clock size={12} strokeWidth={2} aria-hidden />
            )}
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
