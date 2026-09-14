"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useRichMotion } from "@/lib/hooks";

/** A small companion dot that reads the element under the pointer and names the
 *  action. The native cursor is never hidden — this augments, it does not
 *  replace (pre.txt §32). */
export function Cursor() {
  const rich = useRichMotion();
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 38, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 500, damping: 38, mass: 0.25 });

  useEffect(() => {
    if (!rich) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const el = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor], a, button");
      if (!el) {
        if (label !== null) setLabel(null);
        return;
      }
      const next =
        el.dataset.cursor ||
        (el.tagName === "A" && (el as HTMLAnchorElement).target === "_blank" ? "↗" : "") ||
        null;
      if (next !== label) setLabel(next);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [rich, x, y, label, visible]);

  if (!rich) return null;

  const hot = label !== null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <motion.div
        animate={{
          width: label ? "auto" : 8,
          height: label ? 30 : 8,
          borderRadius: label ? 2 : 8,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={`grid place-items-center overflow-hidden whitespace-nowrap ${
          hot && label ? "bg-signal px-3" : "bg-bright"
        }`}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
