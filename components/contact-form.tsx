"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { contact, profile } from "@/lib/content";
import { EASE_OUT, micro } from "@/lib/motion";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full border border-line-bright bg-panel/60 px-4 py-3 text-[0.9375rem] text-bright placeholder:text-muted transition-colors duration-200 focus:border-signal focus:outline-none";

/** Sends straight to Web3Forms from the browser — no backend, so this stays
 *  a true static export. Requires contact.web3formsAccessKey (see
 *  lib/content.ts) to actually deliver mail; without it the form still
 *  renders and validates, it just reports the missing key on submit. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contact.web3formsAccessKey) {
      setStatus("error");
      setError("Form isn't wired up yet — add a Web3Forms access key in lib/content.ts.");
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", contact.web3formsAccessKey);
    data.append("subject", `Portfolio contact from ${data.get("name")}`);
    // Honeypot: real users never fill a hidden field; bots often do.
    if (data.get("botcheck")) return;

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setError(result.message || "Something went wrong sending that — try email instead.");
      }
    } catch {
      setStatus("error");
      setError("Couldn't reach the server — check your connection, or try email instead.");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="flex min-h-[21rem] flex-col items-center justify-center gap-3 border border-line-bright bg-panel/60 px-6 text-center"
      >
        <CheckCircle2 size={28} strokeWidth={1.5} className="text-signal" aria-hidden />
        <p className="text-base font-medium text-bright">Message sent.</p>
        <p className="max-w-xs text-sm text-dim">
          Thanks — I read every message and reply from {profile.email}.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-signal underline-offset-4 transition-colors duration-200 hover:text-bright hover:underline"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* Honeypot — hidden from real users via CSS, not display:none (which
          some screen readers still announce inconsistently). */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="sr-only">
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            placeholder="Name"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="sr-only">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            placeholder="Email"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="sr-only">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="What are you building?"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileHover={status !== "sending" ? { scale: 1.02 } : undefined}
          whileTap={status !== "sending" ? { scale: 0.97 } : undefined}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className="inline-flex min-h-12 items-center gap-2.5 bg-signal px-6 font-medium text-ink disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={16} strokeWidth={2} className="animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              Send message
              <span aria-hidden>→</span>
            </>
          )}
        </motion.button>

        <AnimatePresence mode="wait" initial={false}>
          {status === "error" && error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={micro}
              role="alert"
              className="flex items-start gap-2 text-sm text-amber"
            >
              <TriangleAlert size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
