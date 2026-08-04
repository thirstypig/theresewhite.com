"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "tw-theme";

type Theme = "light" | "dark";

/**
 * Theme toggle.
 *
 * The site follows the OS preference by default. Choosing a theme here stamps
 * `data-theme` on <html>, which overrides the media query in both directions,
 * and the choice persists.
 *
 * The inline script in the layout applies the stored theme before first paint;
 * without it the page would render in the OS theme and visibly repaint into
 * the chosen one.
 */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** What's actually on screen right now: explicit choice, else OS preference. */
function getSnapshot(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage unavailable; the choice still applies to this page view.
  }
  emit();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="shrink-0 rounded-sm border border-rule p-2 text-charcoal transition-colors hover:border-btn hover:text-heading"
    >
      {/* Show the theme you'd switch TO, which is the convention people read
          fastest: a moon means "go dark". */}
      {theme === "dark" ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-none stroke-current stroke-2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-none stroke-current stroke-2"
          aria-hidden="true"
        >
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}
