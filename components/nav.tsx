"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { profile, sections } from "@/lib/content";
import { EASE_OUT, springTight } from "@/lib/motion";
import { useActiveSection } from "@/lib/hooks";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

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
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
      >
        {/* Floating pill — smilekisan.com's own nav chrome: a rounded,
            glass container that never touches the viewport edge. */}
        <nav
          aria-label="Primary"
          className={`flex w-full max-w-5xl items-center justify-between gap-3 rounded-full border border-line-bright bg-panel/80 py-2 pl-3 pr-2.5 shadow-lg shadow-black/[0.08] backdrop-blur-xl transition-shadow duration-300 supports-[backdrop-filter]:bg-panel/70 ${
            scrolled ? "shadow-black/[0.14]" : ""
          }`}
        >
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="smilekisan — home"
          >
            <Logo size={30} />
            <span className="hidden font-mono text-sm font-medium tracking-tight text-bright sm:inline">
              smilekisan
            </span>
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-0.5 md:flex">
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
                    className={`relative block rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors duration-200 ${
                      isActive ? "text-bright" : "text-muted hover:text-text"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        transition={springTight}
                        className="absolute inset-0 rounded-full bg-signal-dim"
                      />
                    )}
                    <span className="relative">{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-1.5 md:flex">
            <ThemeToggle />
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.8125rem] font-medium text-white shadow-sm transition-transform duration-200 hover:scale-[1.03]"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Email me
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>

          {/* Mobile: theme toggle + menu trigger, both 44px targets */}
          <div className="flex items-center gap-0.5 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-full text-bright"
            >
              <Menu size={20} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </nav>
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
                <span className="flex items-center gap-2.5">
                  <Logo size={30} />
                  <span className="font-mono text-sm text-bright">smilekisan</span>
                </span>
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-bright hover:bg-signal-dim"
                  >
                    <X size={20} strokeWidth={1.75} aria-hidden />
                  </button>
                </div>
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
                      className="flex items-baseline gap-4 rounded-2xl px-3 py-4 active:bg-signal-dim"
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
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-medium text-white"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
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
