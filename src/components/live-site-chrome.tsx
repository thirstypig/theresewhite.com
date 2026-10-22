import Image from "next/image";
import { Forum } from "next/font/google";
import { contact, liveSite, logo } from "@/content/site";

/**
 * The live Wix site's header and footer, rebuilt for
 * calculator.theresewhite.com so the calculator reads as a page of that site
 * rather than a separate one. Measured off https://www.theresewhite.com on
 * 2026-10-16:
 *
 *  - Header: a warm gray bar (#E8E6E6), the logo top left in a 3px bright
 *    blue frame (#1D2CF3) with rounded corners and a drop shadow, and the
 *    menu as square blue boxes (#0D63D1, thin white border) in the Forum
 *    font at 19px. From tablet width up it stays at the top of the window
 *    while scrolling, as the live one does. Not on a phone, where it would
 *    hold a sixth of the screen.
 *  - Footer: the same gray, contact details on the left and the legal links
 *    on the right, underlined.
 *
 * Forum is loaded here rather than in the root layout, so only pages that
 * use this header download it.
 */
const forum = Forum({ weight: "400", subsets: ["latin"], display: "swap" });

export function LiveSiteHeader() {
  return (
    <header className="z-40 border-b md:sticky md:top-0 border-rule bg-[#e8e6e6]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-2.5 md:flex-row md:items-center md:gap-3">
        <a
          href={liveSite.home}
          className="inline-block shrink-0 self-start rounded-[6px] border-[3px] border-[#1d2cf3] bg-white shadow-[0_8px_10px_-6px_rgba(0,0,0,0.55)]"
        >
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={logo.alt}
            priority
            className="h-auto w-[170px] md:w-[240px]"
          />
        </a>

        {/* Five items do not fit a phone, so the row scrolls sideways rather
            than wrapping into a ragged second line — the same choice the main
            site's header makes. */}
        <nav aria-label="theresewhite.com" className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0">
          <ul className={`${forum.className} flex gap-1.5`}>
            {liveSite.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block border border-white bg-[#0d63d1] px-4 py-2 text-base tracking-[0.05em] whitespace-nowrap text-white transition-colors hover:bg-[#2e92e5] md:px-6 md:text-[19px]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function LiveSiteFooter() {
  const f = liveSite.footer;
  const link =
    "underline underline-offset-2 transition-colors hover:text-black";
  return (
    <footer className="bg-[#e8e6e6] text-[15px] leading-snug text-charcoal">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 sm:flex-row sm:justify-between">
        <div>
          {f.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>
            <a href={contact.emailHref} className={link}>
              {f.email}
            </a>
          </p>
          <p>
            <a href={contact.phoneHref} className="hover:text-black">
              {f.phone}
            </a>
          </p>
          <p className="mt-5">{f.copyright}</p>
        </div>
        <div className="sm:text-right">
          <p>{f.legalTitle}</p>
          <ul>
            {f.legal.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
