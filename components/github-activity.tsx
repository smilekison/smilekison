"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ExternalLink, GitFork, Star } from "lucide-react";
import { profile } from "@/lib/content";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
};

type GithubUser = {
  public_repos: number;
  followers: number;
};

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; repos: Repo[]; user: GithubUser };

// smile-kisan's actual GitHub username, from lib/content.ts's real profile link.
const USERNAME = profile.links.github.split("/").filter(Boolean).pop()!;

/** Live repository data straight from GitHub's public REST API — no auth,
 *  no backend, fetched client-side so the site stays a static export.
 *  Loading skeleton and an explicit failure message per pre.txt §41–42:
 *  never a blank section, never a silently broken page. */
export function GithubActivity() {
  const [state, setState] = useState<State>({ status: "loading" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`, { signal: controller.signal }),
          fetch(
            `https://api.github.com/users/${USERNAME}/repos?sort=pushed&direction=desc&per_page=100`,
            { signal: controller.signal },
          ),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");

        const user: GithubUser = await userRes.json();
        const allRepos: Repo[] = await reposRes.json();
        const repos = allRepos
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.pushed_at) - +new Date(a.pushed_at))
          .slice(0, 6);

        setState({ status: "ready", repos, user });
      } catch (err) {
        if ((err as Error).name !== "AbortError") setState({ status: "error" });
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="mt-14">
      {state.status === "ready" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="mb-6 flex flex-wrap gap-6"
        >
          <Stat value={state.user.public_repos} label="Public repositories" />
          <Stat value={state.user.followers} label="Followers" />
        </motion.div>
      )}

      {state.status === "loading" && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className={`card-surface h-40 p-6 ${reduced ? "" : "animate-pulse"}`}
              aria-hidden
            >
              <div className="h-4 w-2/3 rounded-full bg-line-bright" />
              <div className="mt-3 h-3 w-full rounded-full bg-line" />
              <div className="mt-2 h-3 w-4/5 rounded-full bg-line" />
            </li>
          ))}
          <li className="sr-only" role="status">
            Loading GitHub repositories…
          </li>
        </ul>
      )}

      {state.status === "error" && (
        <div className="card-surface flex flex-col items-center gap-3 p-8 text-center">
          <AlertTriangle size={24} strokeWidth={1.75} className="text-amber" aria-hidden />
          <p className="text-sm font-medium text-bright">Unable to load live repository data.</p>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-signal hover:text-bright"
          >
            View the profile on GitHub directly
            <ExternalLink size={14} strokeWidth={2} aria-hidden />
          </a>
        </div>
      )}

      {state.status === "ready" && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {state.repos.map((repo, i) => (
            <motion.li
              key={repo.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: i * 0.05 }}
            >
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="open"
                className="card-surface group flex h-full flex-col p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-medium text-bright">{repo.name}</p>
                  <ExternalLink
                    size={14}
                    strokeWidth={2}
                    className="mt-1 shrink-0 text-muted transition-colors duration-200 group-hover:text-signal"
                    aria-hidden
                  />
                </div>
                <p className="mt-2 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-dim">
                  {repo.description || "No description provided."}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundImage: "var(--gradient-brand)" }}
                        aria-hidden
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Star size={13} strokeWidth={1.75} aria-hidden />
                    {repo.stargazers_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork size={13} strokeWidth={1.75} aria-hidden />
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-gradient text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
