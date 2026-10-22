"use client";

import { useState } from "react";
import { book } from "@/content/book";
import { calendlyUrl } from "@/content/wix/chrome";

/**
 * The signup form on book.theresewhite.com: a first name and an email go to
 * Therese's Kit account, and the download appears in place.
 *
 * Where the visitor came from travels WITH the signup, in four Kit custom
 * fields (utm_source, utm_medium, utm_campaign, utm_content). That is the
 * point of the page. Google Analytics only counts visitors who accept the
 * cookie banner, so it under-counts LinkedIn traffic by however many people
 * ignore the banner; the Kit record has the source for every single signup,
 * banner or no banner. The fields are read from the link the visitor
 * arrived on — tag every post's link, as DEPLOY.md explains.
 *
 * It posts to Kit's public form address, which needs only the form's number,
 * not an API key. The number is NEXT_PUBLIC_KIT_FORM_ID, a repository
 * variable. Without it (local development) nothing is sent, and the page
 * says so in the browser console rather than pretending.
 */

const KIT_FORM_ID = process.env.NEXT_PUBLIC_KIT_FORM_ID;

/**
 * True once Kit is set to email a copy of the guide on signup. Until then
 * the thank-you message must not promise one.
 */
const KIT_SENDS_COPY = process.env.NEXT_PUBLIC_KIT_SENDS_COPY === "true";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
type Source = Record<(typeof UTM_KEYS)[number], string>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * The visitor's source, from the link's utm_ tags.
 *
 * An untagged link still says something: when there are no tags, the site
 * that sent them (LinkedIn's own address, say) goes in utm_source, and a
 * visit with no referring site is recorded as "direct". utm_medium is left
 * empty in those two cases so a guessed source can be told apart from a
 * tagged one.
 */
export function readSource(search: string, referrer: string, ownHost: string): Source {
  const params = new URLSearchParams(search);
  const source = Object.fromEntries(
    UTM_KEYS.map((key) => [key, (params.get(key) ?? "").trim().slice(0, 100)]),
  ) as Source;
  if (source.utm_source) return source;

  let referrerHost = "";
  try {
    referrerHost = referrer ? new URL(referrer).host.toLowerCase() : "";
  } catch {
    // A malformed referrer is no referrer.
  }
  source.utm_source =
    referrerHost && referrerHost !== ownHost.toLowerCase()
      ? referrerHost.replace(/^www\./, "")
      : "direct";
  return source;
}

export function BookSignupForm() {
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [failures, setFailures] = useState(0);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const source = readSource(
      window.location.search,
      document.referrer,
      window.location.host,
    );

    if (!KIT_FORM_ID) {
      console.warn(
        "NEXT_PUBLIC_KIT_FORM_ID is not set, so this signup was not sent to Kit.",
        { source },
      );
      setDone(true);
      return;
    }

    const body = new FormData();
    body.set("email_address", String(form.get("email") ?? ""));
    body.set("first_name", String(form.get("first_name") ?? ""));
    for (const key of UTM_KEYS) body.set(`fields[${key}]`, source[key]);

    setSending(true);
    try {
      const res = await fetch(`https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      if (!res.ok) throw new Error(`Kit answered ${res.status}`);
      // Only reaches Google if the visitor accepted the cookie banner;
      // otherwise gtag was never loaded and this does nothing.
      window.gtag?.("event", "generate_lead", {
        lead_source: "book",
        ...source,
      });
      setDone(true);
    } catch {
      // A second failure is more likely Kit than a typo. Give them the guide
      // rather than a dead end; the signup is lost either way.
      if (failures >= 1) {
        window.gtag?.("event", "book_signup_failed", source);
        setDone(true);
      } else {
        setFailures(failures + 1);
      }
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div id="get-the-guide" className="rounded-sm bg-cream p-6 sm:p-8">
        <p className="book-serif m-0 text-3xl text-heading">{book.thanks.heading}</p>
        <p className="mt-3 text-base leading-relaxed text-charcoal">
          {book.thanks.body}
          {KIT_SENDS_COPY ? ` ${book.thanks.emailCopy}` : ""}
        </p>
        <a
          href={book.pdfHref}
          download={book.pdfFileName}
          className="mt-5 inline-block rounded-sm bg-btn px-6 py-3.5 text-base font-semibold text-btn-fg transition-colors hover:bg-btn-hover"
        >
          {book.thanks.button}
        </a>
        <div className="mt-8 border-t border-rule pt-6">
          <p className="m-0 text-base leading-relaxed text-charcoal">
            {book.thanks.nextStep.text}
          </p>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener"
            className="mt-3 inline-block font-semibold text-heading underline decoration-accent-line decoration-2 underline-offset-4"
          >
            {book.thanks.nextStep.button}
          </a>
        </div>
      </div>
    );
  }

  const field =
    "mt-1.5 w-full rounded-sm border border-rule bg-paper px-3.5 py-3 text-base text-charcoal outline-none transition-colors focus:border-btn";

  return (
    /* Masked from Clarity's session recordings: these are personal details. */
    <form
      id="get-the-guide"
      onSubmit={submit}
      data-clarity-mask="True"
      className="rounded-sm bg-cream p-6 sm:p-8"
    >
      <p className="book-serif m-0 text-2xl text-heading">{book.form.heading}</p>
      <div className="mt-5 flex flex-col gap-4">
        <p className="m-0">
          <label htmlFor="book-first-name" className="text-sm font-semibold text-heading">
            {book.form.firstNameLabel}
          </label>
          <input
            id="book-first-name"
            name="first_name"
            required
            autoComplete="given-name"
            className={field}
          />
        </p>
        <p className="m-0">
          <label htmlFor="book-email" className="text-sm font-semibold text-heading">
            {book.form.emailLabel}
          </label>
          <input
            id="book-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </p>
      </div>

      {failures > 0 ? (
        <p role="alert" className="mt-4 border-l-2 border-btn pl-4 text-sm text-charcoal">
          {book.form.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="mt-5 w-full rounded-sm bg-btn px-6 py-3.5 text-base font-semibold text-btn-fg transition-colors hover:bg-btn-hover disabled:opacity-60"
      >
        {sending ? book.form.sending : book.form.button}
      </button>
      <p className="mt-3 mb-0 text-xs leading-relaxed text-muted">{book.form.note}</p>
    </form>
  );
}
