"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { terminal } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/motion";

/** A readable summary in a familiar shape. Nothing here executes — it prints a
 *  fixed script (pre.txt §19). */
export function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  const total = terminal.length;
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);

  const play = () => {
    setShown(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setShown(total);
      return;
    }
    setRunning(true);
  }, [inView, reduced, total]);

  useEffect(() => {
    if (!running) return;
    if (shown >= total) {
      setRunning(false);
      return;
    }
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 260 : 620);
    return () => window.clearTimeout(t);
  }, [running, shown, total]);

  const done = shown >= total;

  return (
    <div ref={ref} className="card-surface overflow-hidden bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-line-bright" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-line-bright" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-signal-dim" aria-hidden />
          <span className="ml-2 font-mono text-[0.6875rem] text-muted">~/about</span>
        </div>
        <button
          type="button"
          onClick={play}
          className="flex min-h-9 items-center gap-1.5 px-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted transition-colors duration-200 hover:text-signal"
        >
          {done ? <RotateCcw size={12} strokeWidth={1.75} aria-hidden /> : <Play size={12} strokeWidth={1.75} aria-hidden />}
          {done ? "Replay" : "Run"}
        </button>
      </div>

      {/* Fixed min-height stops the card resizing line by line. */}
      <div className="min-h-[17rem] space-y-3.5 p-4 font-mono text-[0.75rem] leading-relaxed sm:min-h-[16rem] sm:p-5 sm:text-[0.8125rem]">
        {terminal.slice(0, shown).map((block) => (
          <motion.div
            key={block.cmd}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            <p className="flex gap-2 break-words">
              <span className="shrink-0 text-signal" aria-hidden>
                $
              </span>
              <span className="text-bright">{block.cmd}</span>
            </p>
            <div className="mt-1 pl-4">
              {block.out.map((line) => (
                <p key={line} className="break-words text-dim">
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        ))}

        {!done && (
          <span className="inline-block h-4 w-2 animate-pulse bg-signal align-middle" aria-hidden />
        )}
      </div>
    </div>
  );
}
