"use client";

import { useEffect, useState } from "react";

/** SSR-safe media query. Returns false during render on the server and on the
 *  first client paint, so markup never mismatches and hydration stays clean. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True only on a device that can genuinely hover with a precise pointer.
 *  Gates every cursor-tracking effect (pre.txt §22, §29). */
export const usePointerFine = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** Desktop-only rich effects: fine pointer, wide enough, motion allowed. */
export function useRichMotion(): boolean {
  const fine = usePointerFine();
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  return fine && wide && !reduced;
}

/** Tracks which section is currently in view, for the nav indicator. */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    // Weight the upper-middle band of the viewport so the active item changes
    // when a section genuinely takes over the screen, not at its first pixel.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
