"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { springTight } from "@/lib/motion";

type Theme = "light" | "dark";

/** Reads the theme the inline head script already applied (see layout.tsx),
 *  so there's no mismatch between first paint and this component's state. */
function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works
      // for this page view, it just won't persist.
    }
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-signal-dim hover:text-signal ${className ?? ""}`}
    >
      {/* Avoid rendering an icon that might not match the real theme before
          hydration settles — reserve the space instead of flashing wrong. */}
      {mounted && (
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={springTight}
          className="grid place-items-center"
        >
          {isDark ? (
            <Moon size={18} strokeWidth={1.6} aria-hidden />
          ) : (
            <Sun size={18} strokeWidth={1.6} aria-hidden />
          )}
        </motion.span>
      )}
    </button>
  );
}
