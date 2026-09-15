"use client";

import { motion } from "motion/react";
import { reveal, wipe, stagger, viewportOnce, section as sectionT } from "@/lib/motion";

/** Standard entrance for a block of content. Used sparingly — not every
 *  paragraph gets one (pre.txt §43). */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { ...sectionT, delay } },
      }}
    >
      {children}
    </Tag>
  );
}

/** Section header: the index and label arrive first, the headline wipes in,
 *  the description follows. Under 500ms end to end (pre.txt §8). */
export function SectionHeading({
  index,
  label,
  title,
  description,
  headingId,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
  headingId?: string;
}) {
  return (
    <motion.header
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger(0.1)}
    >
      <motion.div variants={reveal} className="flex items-center gap-3">
        <span className="type-data tabular-nums text-signal">{index}</span>
        <span className="h-px w-8 bg-line-bright" aria-hidden />
        <span className="type-data text-muted">{label}</span>
      </motion.div>

      <div className="mt-5 overflow-hidden">
        <motion.h2 id={headingId} variants={wipe} className="type-section">
          {title}
        </motion.h2>
      </div>

      {description && (
        <motion.p variants={reveal} className="measure type-body mt-5 text-dim">
          {description}
        </motion.p>
      )}
    </motion.header>
  );
}
