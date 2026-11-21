"use client";

import { useState, useSyncExternalStore } from "react";
import { passwordMatches, resolvePasswordHash } from "@/lib/admin-password";
import { adminSession } from "@/lib/admin-session";

/**
 * Password screen for /admin and for every page under /stylebible.
 *
 * READ THIS BEFORE PUTTING ANYTHING BEHIND IT.
 *
 * This is obfuscation, not security. The site is a static export, so every
 * byte of a locked page is already in the browser before this component
 * draws: "View source" defeats it in one step. The repository is public
 * too, so the content is readable on GitHub regardless of the password.
 *
 * It is appropriate for keeping a page out of the way of casual visitors
 * and search engines. It is NOT appropriate for anything confidential:
 * no client names, no case details, no credentials, no API keys.
 *
 * Real protection would need a server or an edge auth layer (Cloudflare
 * Access, a host with password-protected previews). That would mean leaving
 * GitHub Pages.
 *
 * What it does guarantee, and scripts/verify-built-output.mjs checks on every
 * deploy: the HTML a visitor receives holds only this password screen, not
 * the page's words. The build draws the "checking" state below, because it
 * cannot know who will open the page. The browser then switches to the form
 * or to the page itself, depending on whether this tab has already been
 * unlocked (src/lib/admin-session.ts).
 *
 * The password is stored only as a SHA-256 hash, so it isn't sitting in the
 * bundle in plain text. See src/lib/admin-password.ts for where it comes from.
 */

const PASSWORD_HASH = resolvePasswordHash(process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH);

export function AdminGate({
  children,
  title = "Admin",
  note = "Reference links and project notes. Nothing confidential lives here.",
}: {
  children: React.ReactNode;
  /** The heading on the password screen. */
  title?: string;
  /** One or two sentences under the heading. */
  note?: string;
}) {
  const state = useSyncExternalStore(
    adminSession.subscribe,
    adminSession.getSnapshot,
    adminSession.getServerSnapshot,
  );
  const [error, setError] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const entered = new FormData(e.currentTarget).get("password");
    if (await passwordMatches(String(entered ?? ""), PASSWORD_HASH)) {
      // Session-scoped: closing the tab re-locks it.
      adminSession.unlock();
    } else {
      setError(true);
    }
  }

  if (state === "unlocked") return <>{children}</>;

  return (
    // data-admin-gate is what scripts/verify-built-output.mjs looks for.
    // min-h-dvh fills the screen, so the pages with no site footer under them
    // (everything in /stylebible) don't show a white band below the form.
    <section className="min-h-dvh bg-cream" data-admin-gate={state}>
      <div className="mx-auto max-w-md px-6 py-28 sm:py-36">
        {state === "checking" ? (
          // This is all the built page contains. With JavaScript on, the form
          // or the page itself replaces it at once. With JavaScript off, the
          // visitor reads this sentence.
          <p className="text-base leading-relaxed text-charcoal">
            <noscript>This page is private. Turn on JavaScript to enter the password.</noscript>
          </p>
        ) : (
          <>
            <p className="label text-muted">Internal</p>
            <h1 className="display mt-4 text-3xl text-heading">{title}</h1>
            <p className="mt-4 text-base leading-relaxed text-charcoal">{note}</p>

            <form onSubmit={submit} className="mt-8">
              <label htmlFor="password" className="label text-muted">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoFocus
                autoComplete="current-password"
                aria-invalid={error || undefined}
                aria-describedby={error ? "password-error" : undefined}
                className="mt-2 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-base text-charcoal outline-none transition-colors focus:border-btn"
              />
              {error ? (
                <p id="password-error" role="alert" className="mt-2 text-sm text-charcoal">
                  That&rsquo;s not it. Try again.
                </p>
              ) : null}
              <button
                type="submit"
                className="mt-5 rounded-sm bg-btn px-6 py-3 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
              >
                Unlock
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
