"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** A one-pixel report of how far through the page you are. Deliberately the
 *  quietest element on the site (pre.txt §21). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed inset-x-0 top-0 z-[70] h-px bg-signal"
    />
  );
}
