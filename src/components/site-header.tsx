import Link from "next/link";
import { contact, nav, cta } from "@/content/site";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Two rows on mobile (identity + action, then the links), one row from md up.
 *
 * Deliberately no hamburger: four short links fit on a phone, and a disclosure
 * menu would cost JavaScript and a tap to reach what's already visible.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex flex-col leading-none">
            <span className="display text-lg text-heading">{contact.name}</span>
            {/* Decorative on a phone, where the space is better spent. */}
            <span className="label mt-1.5 hidden whitespace-nowrap text-muted lg:block">
              {contact.roles.join(" · ")}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-3 md:hidden">
            <ThemeToggle />
            <Link
              href={cta.href}
              className="rounded-sm bg-btn px-4 py-2.5 text-sm font-medium whitespace-nowrap text-btn-fg transition-colors hover:bg-btn-hover"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Five items no longer fit a narrow phone, so the row scrolls
            horizontally rather than wrapping into a ragged second line. */}
        <nav
          aria-label="Primary"
          className="-mx-6 flex items-center overflow-x-auto px-6 md:mx-0 md:gap-7 md:overflow-visible md:px-0"
        >
          <ul className="flex flex-1 items-center gap-5 md:flex-none md:gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm whitespace-nowrap text-charcoal transition-colors hover:text-heading"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              href={cta.href}
              className="rounded-sm bg-btn px-4 py-2.5 text-sm font-medium whitespace-nowrap text-btn-fg transition-colors hover:bg-btn-hover"
            >
              {cta.short}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
