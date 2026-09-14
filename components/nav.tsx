"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { profile, sections } from "@/lib/content";
import { EASE_OUT, springTight } from "@/lib/motion";
import { useActiveSection } from "@/lib/hooks";

const ids = sections.map((s) => s.id);

export function Nav({ variant = "home" }: { variant?: "home" | "sub" }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    if (next !== scrolled) setScrolled(next);
  });

  // Lock the page while the mobile sheet is open, and allow Escape to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (id: string) => (variant === "home" ? `#${id}` : `/#${id}`);

  // Close first, then navigate — the sheet must never animate over the target.
  const go = (id: string) => {
    setOpen(false);
    if (variant !== "home") return;
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);
  };

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-all duration-300 ${
            scrolled
              ? "border-b border-line bg-ink/80 backdrop-blur-xl supports-[backdrop-filter]:bg-ink/70"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <nav
            aria-label="Primary"
            className={`shell flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-14" : "h-20"
            }`}
          >
            <Link
              href="/"
              className="group flex items-baseline gap-2"
              aria-label={`${profile.name} — home`}
            >
              <span className="font-mono text-sm font-medium tracking-tight text-bright">
                smilekisan
              </span>
              <span
                className="h-1.5 w-1.5 shrink-0 bg-signal transition-transform duration-200 group-hover:scale-125"
                aria-hidden
              />
            </Link>

            {/* Desktop */}
            <ul className="hidden items-center gap-1 md:flex">
              {sections.map((s) => {
                const isActive = variant === "home" && active === s.id;
                return (
                  <li key={s.id} className="relative">
                    <a
                      href={href(s.id)}
                      onClick={(e) => {
                        if (variant !== "home") return;
                        e.preventDefault();
                        go(s.id);
                        history.replaceState(null, "", `#${s.id}`);
                      }}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block px-3 py-2 text-[0.8125rem] transition-colors duration-200 ${
                        isActive ? "text-bright" : "text-muted hover:text-text"
                      }`}
                    >
                      {s.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          transition={springTight}
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-signal"
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="hidden md:block">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 border border-line-bright px-4 py-2 text-[0.8125rem] text-text transition-colors duration-200 hover:border-signal hover:text-bright"
              >
                Email me
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>

            {/* Mobile trigger — 44px target */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="-mr-2 grid h-11 w-11 place-items-center text-bright md:hidden"
            >
              <Menu size={20} strokeWidth={1.75} aria-hidden />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile sheet — designed for touch, not a shrunken desktop bar */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sheet"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="fixed inset-0 z-[60] bg-ink md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="grid-field absolute inset-0 opacity-[0.35]" aria-hidden />

            <div className="relative flex h-[100dvh] flex-col">
              <div className="shell flex h-20 shrink-0 items-center justify-between">
                <span className="font-mono text-sm text-bright">smilekisan</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="-mr-2 grid h-11 w-11 place-items-center text-bright"
                >
                  <X size={20} strokeWidth={1.75} aria-hidden />
                </button>
              </div>

              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
                className="shell flex flex-1 flex-col justify-center gap-1 pb-16"
              >
                {sections.map((s) => (
                  <motion.li
                    key={s.id}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE_OUT } },
                    }}
                  >
                    <a
                      href={href(s.id)}
                      onClick={(e) => {
                        if (variant !== "home") {
                          setOpen(false);
                          return;
                        }
                        e.preventDefault();
                        go(s.id);
                      }}
                      className="flex items-baseline gap-4 border-b border-line py-4 active:bg-panel"
                    >
                      <span className="type-data w-6 shrink-0 text-signal">{s.index}</span>
                      <span className="text-2xl tracking-tight text-bright">{s.label}</span>
                    </a>
                  </motion.li>
                ))}

                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE_OUT } },
                  }}
                  className="mt-8"
                >
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex min-h-12 items-center justify-center gap-2 bg-signal px-5 font-medium text-ink"
                  >
                    Email me <span aria-hidden>→</span>
                  </a>
                </motion.li>
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
