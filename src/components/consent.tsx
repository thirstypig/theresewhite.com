"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  IS_BOOK_SITE,
  IS_CALCULATOR_SITE,
  IS_STANDALONE_SITE,
  PRIVACY_HREF,
} from "@/lib/site-config";

const STORAGE_KEY = "tw-analytics-consent";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "xxajqpw2g7";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-4QVRMZJVWS";

type Decision = "granted" | "denied";

/*
 * localStorage as an external store.
 *
 * useSyncExternalStore rather than useState + useEffect: the consent decision
 * lives outside React, and this is the hook built for that. It also keeps the
 * server and client snapshots explicitly separate, which is what makes the
 * markup match on hydration.
 *
 * The decision is stored in localStorage rather than a cookie, since setting a
 * cookie to record whether cookies are allowed is its own small absurdity.
 */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep other tabs in sync.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Decision | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Private browsing with storage disabled. Undecided means analytics stay
    // off — failing closed is the right default.
    return null;
  }
}

/** No decision is known while rendering on the server. */
function getServerSnapshot(): Decision | null {
  return null;
}

function decide(next: Decision) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The choice still applies for this page view.
  }
  emit();
}

function reopen() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
  emit();
}

/**
 * Consent gate for Clarity and GA4.
 *
 * Both set cookies and send data to US processors, so under the GDPR they need
 * consent before they run — not a notice that they already have. Nothing loads
 * until someone accepts, and declining sticks.
 */
export function Consent() {
  const decision = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <>
      {decision === "granted" && isProduction ? (
        <>
          {CLARITY_ID ? (
            <Script id="ms-clarity" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");`}
            </Script>
          ) : null}
          {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
        </>
      ) : null}

      {decision === null ? (
        // On calculator.theresewhite.com the banner wears the live Wix
        // site's look like the rest of that page: the `.lp-wix` theme gives
        // it Arial, the Wix blues and pill buttons, and `cta-button` the
        // live site's capital lettering. On book.theresewhite.com it wears
        // the book's navy (`.lp-book`). The banner sits outside the page's
        // own wrapper, so it has to opt in itself.
        <div
          role="dialog"
          aria-label="Cookie preferences"
          className={`fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-paper shadow-[0_-8px_24px_rgba(0,0,0,0.08)] ${
            IS_CALCULATOR_SITE
              ? "lp-wix lp-lock"
              : IS_BOOK_SITE
                ? "lp-book lp-lock"
                : ""
          }`}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 max-w-2xl text-sm leading-relaxed text-charcoal">
              {/* The one-page sites have no contact form, so they do not
                  promise anything about one. */}
              {IS_STANDALONE_SITE
                ? "We\u2019d like to use analytics cookies to see how this site gets used. Nothing loads unless you accept."
                : "We\u2019d like to use analytics cookies to see how this site gets used. Nothing loads unless you accept, and the contact form is never recorded."}{" "}
              <Link
                href={PRIVACY_HREF}
                className="text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
              >
                Privacy policy
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="cta-button rounded-sm border border-rule px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-btn hover:text-heading"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="cta-button rounded-sm bg-btn px-4 py-2.5 text-sm font-medium text-btn-fg transition-colors hover:bg-btn-hover"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Footer control that clears the stored choice so the banner asks again. */
export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={reopen}
      /* Rendered inside the footer, which is a dark band in both themes. */
      className="text-left transition-colors hover:text-band-fg"
    >
      Cookie preferences
    </button>
  );
}
