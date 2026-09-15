import type { Variants, Transition } from "motion/react";

/* Motion tokens — pre.txt §3. Every duration in the app comes from here so the
   page has one rhythm rather than per-component guesses. */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const micro: Transition = { duration: 0.2, ease: EASE_OUT };
export const standard: Transition = { duration: 0.38, ease: EASE_OUT };
export const section: Transition = { duration: 0.55, ease: EASE_OUT };

export const springSoft: Transition = { type: "spring", stiffness: 260, damping: 30, mass: 0.6 };
export const springTight: Transition = { type: "spring", stiffness: 420, damping: 34, mass: 0.4 };

/** The default section entrance: opacity + a short lift. Nothing dramatic. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: section },
};

/** Clip-path wipe for headings only — reserved, so it stays meaningful. */
export const wipe: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  show: {
    opacity: 1,
    clipPath: "inset(0 0 -10% 0)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Shared viewport config — animations play once, never on scroll-back. */
export const viewportOnce = { once: true, amount: 0.25, margin: "0px 0px -80px 0px" } as const;
