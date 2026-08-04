"use client";

import { useState } from "react";

/**
 * Password gate for the admin page.
 *
 * READ THIS BEFORE PUTTING ANYTHING HERE.
 *
 * This is obfuscation, not security. The site is a static export, so every
 * byte of the admin page is already in the browser before this component
 * renders — "View source" defeats it in one step. The repository is public
 * too, so the content is readable on GitHub regardless of the password.
 *
 * It is appropriate for keeping the page out of the way of casual visitors
 * and search engines. It is NOT appropriate for anything confidential:
 * no client names, no case details, no credentials, no API keys.
 *
 * Real protection would need a server or an edge auth layer (Cloudflare
 * Access, a host with password-protected previews). That would mean leaving
 * GitHub Pages.
 *
 * The stored value is a SHA-256 hash so the password isn't sitting in the
 * bundle in plain text. That raises the bar slightly; it does not change
 * anything above.
 */

const PASSWORD_HASH =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH ??
  // sha256("theresewhite") — change this. See the admin page for the command.
  "eeb9a5fd80b393f2135c167f2a299db494a8b10deb06dd3ee618c38e37ce311f";

const SESSION_KEY = "tw-admin-unlocked";

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [error, setError] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const entered = new FormData(e.currentTarget).get("password");
    const hash = await sha256Hex(String(entered ?? ""));
    if (hash === PASSWORD_HASH) {
      setUnlocked(true);
      setError(false);
      try {
        // Session-scoped: closing the tab re-locks it.
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Fine — it just won't persist across navigations.
      }
    } else {
      setError(true);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-md px-6 py-28 sm:py-36">
        <p className="label text-muted">Internal</p>
        <h1 className="display mt-4 text-3xl text-heading">Admin</h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal">
          Reference links and project notes. Nothing confidential lives here.
        </p>

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
      </div>
    </section>
  );
}
