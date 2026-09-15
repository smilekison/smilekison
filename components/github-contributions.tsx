"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { profile } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; days: Day[]; total: number };

const USERNAME = profile.links.github.split("/").filter(Boolean).pop()!;
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Same brand gradient stepped into 5 intensities, replacing GitHub's green.
const LEVEL_COLOR = [
  "var(--color-line)",
  "color-mix(in oklab, #667eea 35%, var(--color-panel))",
  "color-mix(in oklab, #667eea 60%, var(--color-panel))",
  "color-mix(in oklab, #667eea 85%, #764ba2)",
  "color-mix(in oklab, #667eea 20%, #764ba2)",
];

/** GitHub's own contribution data isn't available from a CORS-enabled
 *  endpoint without an auth token (their public REST API doesn't expose it;
 *  the profile page's HTML fragment has no Access-Control-Allow-Origin).
 *  Uses github-contributions-api.jogruber.de — an open-source, CORS-enabled
 *  proxy for exactly this data — so the graph can still be real and styled
 *  in the site's own colors rather than an embedded third-party image. */
export function GithubContributions() {
  const [state, setState] = useState<State>({ status: "loading" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("contributions API error");
        return res.json();
      })
      .then((data: { total: Record<string, number>; contributions: Day[] }) => {
        const total = Object.values(data.total).reduce((a, b) => a + b, 0);
        setState({ status: "ready", days: data.contributions, total });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  // Group into weeks (columns), Sunday-first, matching GitHub's own layout.
  const weeks = useMemo(() => {
    if (state.status !== "ready") return [];
    const cols: Day[][] = [];
    let col: Day[] = [];
    state.days.forEach((day, i) => {
      const dow = new Date(day.date + "T00:00:00Z").getUTCDay();
      if (i === 0) col = Array(dow).fill(null);
      col.push(day);
      if (dow === 6) {
        cols.push(col);
        col = [];
      }
    });
    if (col.length) cols.push(col);
    return cols;
  }, [state]);

  const monthMarkers = useMemo(() => {
    const markers: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstReal = week.find(Boolean);
      if (!firstReal) return;
      const m = new Date(firstReal.date + "T00:00:00Z").getUTCMonth();
      if (m !== lastMonth) {
        markers.push({ label: MONTH_LABELS[m], weekIndex: wi });
        lastMonth = m;
      }
    });
    return markers;
  }, [weeks]);

  if (state.status === "error") {
    return (
      <div className="card-surface mt-8 flex flex-col items-center gap-2 p-6 text-center">
        <AlertTriangle size={20} strokeWidth={1.75} className="text-amber" aria-hidden />
        <p className="text-sm text-muted">Unable to load contribution history right now.</p>
      </div>
    );
  }

  return (
    <div className="card-surface mt-8 overflow-x-auto p-6">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium text-bright">
          {state.status === "ready" ? (
            <>
              <span className="text-gradient font-semibold">{state.total.toLocaleString()}</span>{" "}
              contributions in the last year
            </>
          ) : (
            "Loading contribution history…"
          )}
        </p>
      </div>

      <div className={`min-w-[42rem] ${state.status === "loading" && !reduced ? "animate-pulse" : ""}`}>
        {state.status === "ready" && (
          <div className="relative mb-1 h-4">
            {monthMarkers.map((m) => (
              <span
                key={m.label + m.weekIndex}
                className="absolute text-[0.6875rem] text-muted"
                style={{ left: `${m.weekIndex * 14.5}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>
        )}

        {/* One fade for the whole grid, not 365+ individually-animated cells
            (pre.txt §31: don't animate hundreds of DOM elements at once —
            this alone cost ~600ms of main-thread work). */}
        <motion.div
          initial={state.status === "ready" ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
          className="flex gap-[3px]"
          role="img"
          aria-label="GitHub contribution calendar for the last year"
        >
          {(state.status === "ready" ? weeks : Array.from({ length: 53 }, () => Array(7).fill(null))).map(
            (week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di] as Day | null;
                  return (
                    <div
                      key={di}
                      title={day ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}` : undefined}
                      className="h-[11px] w-[11px] rounded-[2px]"
                      style={{ background: day ? LEVEL_COLOR[day.level] : "transparent" }}
                    />
                  );
                })}
              </div>
            ),
          )}
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 text-[0.6875rem] text-muted">
        Less
        {LEVEL_COLOR.map((c, i) => (
          <span key={i} className="h-[11px] w-[11px] rounded-[2px]" style={{ background: c }} aria-hidden />
        ))}
        More
      </div>
    </div>
  );
}
