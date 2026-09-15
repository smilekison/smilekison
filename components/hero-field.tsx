"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRichMotion } from "@/lib/hooks";

/** The hero's reactive background: a measurement grid that drifts a few pixels
 *  with the pointer, plus a soft local light. Desktop and fine-pointer only —
 *  touch devices get the static field (pre.txt §5, §29, §36). */
export function HeroField() {
  const rich = useRichMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Motion values, never React state — no re-render per mouse event (§45).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const sx = useSpring(px, { stiffness: 70, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 70, damping: 22, mass: 0.6 });

  // Deliberately tiny: the field shifts, it does not swim.
  const gridX = useTransform(sx, [0, 1], [10, -10]);
  const gridY = useTransform(sy, [0, 1], [8, -8]);
  const lightX = useTransform(sx, [0, 1], ["30%", "70%"]);
  const lightY = useTransform(sy, [0, 1], ["25%", "75%"]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rich) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      className="pointer-events-auto absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Measurement grid — the page's structural signature */}
      <motion.div
        style={rich ? { x: gridX, y: gridY } : undefined}
        className="grid-field absolute -inset-16 opacity-[0.5]"
      />

      {/* Horizon fade so the grid dissolves rather than stopping at an edge */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/50 to-ink" />

      {/* Local light. Follows the pointer on desktop; parked centre-left otherwise. */}
      <motion.div
        style={
          rich
            ? { left: lightX, top: lightY, translateX: "-50%", translateY: "-50%" }
            : { left: "50%", top: "42%", translateX: "-50%", translateY: "-50%" }
        }
        className="absolute h-[38rem] w-[38rem] max-w-[140vw] rounded-full opacity-[0.16] blur-[110px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,var(--color-signal)_0%,transparent_65%)]" />
      </motion.div>

      {/* A single anchored rule: the page sits on a baseline, like a schematic */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
    </div>
  );
}
