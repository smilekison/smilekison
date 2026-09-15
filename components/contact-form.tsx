"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { profile } from "@/lib/content";
import { EASE_OUT, micro } from "@/lib/motion";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-2xl border border-line-bright bg-panel/60 px-4 py-3 text-[0.9375rem] text-bright placeholder:text-muted transition-colors duration-200 focus:border-signal focus:outline-none";

<<<<<<< HEAD
/** Posts to /api/contact — a small endpoint served by the same container
 *  (server.js) that sends through AWS SES using the EC2 instance's IAM
 *  role. No API key lives in the client; SES_FROM/SES_TO are set as
 *  environment variables at `docker run` time (see DOCKER.md). If those
 *  aren't set, the endpoint reports that clearly rather than pretending
 *  to send. */
=======
/** Sends the contact form to the server-side endpoint used by SES. */
>>>>>>> cd84abb7974383e0475b69c95020d01b267de4f4
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
<<<<<<< HEAD
=======

>>>>>>> cd84abb7974383e0475b69c95020d01b267de4f4
    // Honeypot: real users never fill a hidden field; bots often do.
    if (data.get("botcheck")) return;

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
<<<<<<< HEAD
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      const result = await res.json();
      if (result.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setError(result.error || "Something went wrong sending that — try email instead.");
=======
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          message: String(data.get("message") ?? "").trim(),
        }),
      });

      const result = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };

      if (!res.ok || !result.success) {
        setStatus("error");
        setError(result.message || "Something went wrong sending that — try email instead.");
        return;
>>>>>>> cd84abb7974383e0475b69c95020d01b267de4f4
      }

      setStatus("sent");
      form.reset();
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
        className="card-surface flex min-h-[21rem] flex-col items-center justify-center gap-3 bg-panel/60 px-6 text-center"
      >
        <span
          className="grid h-14 w-14 place-items-center rounded-full text-white shadow-md shadow-black/10"
          style={{ backgroundImage: "var(--gradient-brand)" }}
          aria-hidden
        >
          <CheckCircle2 size={26} strokeWidth={1.75} />
        </span>
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
          <label htmlFor="cf-name" className="sr-only">Name</label>
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
          <label htmlFor="cf-email" className="sr-only">Email</label>
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
        <label htmlFor="cf-message" className="sr-only">Message</label>
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
          style={{ backgroundImage: "var(--gradient-brand)" }}
          className="inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 font-medium text-white shadow-md shadow-black/10 disabled:opacity-60"
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
