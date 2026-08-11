"use client";

import { useState } from "react";
import Link from "next/link";
import { contact } from "@/content/site";

/**
 * The email-capture form on the landing pages.
 *
 * Submits with fetch and confirms in place, unlike the site's contact form
 * which POSTs and redirects to a thank-you page. A landing page has no nav —
 * navigating away from it ends the visit, and there is nowhere to go back to.
 * The calculator's email gate already works this way; this matches it.
 *
 * `source` is stamped into the subject line. Two landing pages are running
 * against each other, and without it there is no way to tell which design
 * produced a lead.
 */

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export function LandingContactForm({ source }: { source: string }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field =
    "mt-2 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-base text-charcoal outline-none transition-colors focus:border-btn";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    // No key configured (local dev): don't pretend the message went anywhere.
    if (!ACCESS_KEY) {
      setSent(true);
      return;
    }

    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Landing page inquiry (${source})`,
          from_name: "theresewhite.com",
          name: form.get("name"),
          email: form.get("email"),
          organization: form.get("organization"),
          message: form.get("message"),
          botcheck: form.get("botcheck"),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? "Submission failed");
      setSent(true);
    } catch {
      setError(
        `That didn't send. Try again, or call ${contact.phone} and we'll talk it through.`,
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="border-l-2 border-rule-strong pl-6">
        <p className="display text-2xl text-heading">Your note is on its way</p>
        <p className="mt-3 text-base leading-relaxed text-charcoal">
          It goes straight to Therese, and she answers these herself. Expect a
          reply within one business day. If it&rsquo;s moving faster than that,
          call{" "}
          <a
            href={contact.phoneHref}
            className="text-heading underline decoration-accent-line underline-offset-4"
          >
            {contact.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    /* Clarity records sessions and this invites a description of a real
       conflict, so it is masked explicitly rather than relying on defaults. */
    <form onSubmit={submit} data-clarity-mask="True" className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <p className="m-0">
          <label htmlFor={`${source}-name`} className="label text-muted">
            Your name
          </label>
          <input
            id={`${source}-name`}
            name="name"
            required
            autoComplete="name"
            className={field}
          />
        </p>
        <p className="m-0">
          <label htmlFor={`${source}-email`} className="label text-muted">
            Email
          </label>
          <input
            id={`${source}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </p>
      </div>

      <p className="m-0">
        <label htmlFor={`${source}-org`} className="label text-muted">
          Organization
        </label>
        <input
          id={`${source}-org`}
          name="organization"
          required
          autoComplete="organization"
          className={field}
        />
      </p>

      <p className="m-0">
        <label htmlFor={`${source}-message`} className="label text-muted">
          What&rsquo;s going on? (optional)
        </label>
        <textarea
          id={`${source}-message`}
          name="message"
          rows={4}
          aria-describedby={`${source}-hint`}
          className={field}
        />
        <span id={`${source}-hint`} className="mt-1.5 block text-xs text-muted">
          A couple of sentences is plenty. No names needed at this stage.
        </span>
      </p>

      {/* Web3Forms' honeypot. Must be named exactly `botcheck`. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />

      {error ? (
        <p role="alert" className="border-l-2 border-btn pl-4 text-sm text-charcoal">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send it to Therese"}
        </button>
        <span className="text-xs text-muted">
          Goes straight to her.{" "}
          <Link
            href="/privacy"
            className="text-heading underline decoration-accent-line underline-offset-4"
          >
            Privacy
          </Link>
          .
        </span>
      </div>
    </form>
  );
}
