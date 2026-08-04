import Link from "next/link";
import { contact, nav, legalNav, cta } from "@/content/site";
import { CookiePreferencesButton } from "@/components/consent";

export function SiteFooter() {
  return (
    <footer className="on-dark border-t border-band-rule bg-band text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="display text-2xl text-band-fg">{contact.name}</p>
          <p className="label mt-2 text-band-muted">
            {contact.roles.join(" · ")}
          </p>
          <address className="mt-6 text-sm not-italic leading-relaxed text-band-muted">
            {contact.street}
            <br />
            {contact.city}, {contact.region} {contact.postalCode}{" "}
            {contact.country}
          </address>
          <ul className="mt-6 space-y-2 text-sm">
            <li>
              <a
                href={contact.phoneHref}
                className="transition-colors hover:text-band-fg"
              >
                {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={contact.emailHref}
                className="transition-colors hover:text-band-fg"
              >
                {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <p className="label text-band-muted">Pages</p>
          <ul className="mt-4 space-y-2 text-sm text-sand">
            {[...nav, { label: "Contact", href: cta.href }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-band-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label text-band-muted">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-sand">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-band-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <CookiePreferencesButton />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-band-rule">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-band-muted">
          Copyright {contact.name} {new Date().getFullYear()}. Mediation and
          coaching services. Not legal advice.
        </p>
      </div>
    </footer>
  );
}
