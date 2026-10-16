import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/page-metadata";
import { CalculatorIntro } from "@/components/calculator-intro";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { calculator, logo } from "@/content/site";
import { IS_CALCULATOR_SITE } from "@/lib/site-config";

/**
 * The source of calculator.theresewhite.com.
 *
 * theresewhite.com is still on Wix, so the calculator gets its own address on
 * a subdomain, served free by GitHub Pages from a second repository. The
 * deploy builds the site a second time with NEXT_PUBLIC_SITE_URL set to that
 * address, and scripts/build-calculator-site.mjs publishes this one page from
 * that build as the subdomain's home page.
 *
 * In the bare landing layout because the subdomain has no other pages: a
 * header full of links to /about and /services would be a header full of
 * 404s. For the same reason the button goes to the live site in a new tab,
 * as Therese's original does.
 *
 * It wears the live theresewhite.com identity rather than the rebuild's:
 * Arial and Arial Bold, the Wix site's blues, pill buttons, and her logo top
 * left, linking back to the Wix site. Visitors arrive from the Wix site and
 * from ads that sit alongside it, and a page in the rebuild's teal and serif
 * would look like someone else's. The look is the `.lp-wix` theme in
 * globals.css, the same one landing page B uses, so the two cannot drift.
 * Switch to the rebuild's look at cutover, when the main site changes too.
 *
 * `path` is "/" in that build, so the canonical and link-preview URL say
 * calculator.theresewhite.com/ rather than /calculator/. On the main site
 * this route is a noindex preview of the same page.
 */
export const metadata: Metadata = pageMetadata({
  title: calculator.title,
  description:
    "Put a number on what an unresolved workplace conflict has already cost you, and what it costs over the next twelve months if nothing changes.",
  path: IS_CALCULATOR_SITE ? "/" : "/calculator",
  noindex: true,
});

export default function StandaloneCalculator() {
  return (
    <div className="lp-wix lp-lock bg-paper">
      {/* The logo, top left, as on every page of the live site. It sits on
          white with the live site's blue frame, because the logo itself has
          a white background that would show as a box on the cream below. */}
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <a
            href="https://theresewhite.com"
            target="_blank"
            rel="noopener"
            className="inline-block rounded-[0.375rem] border-2 border-[#0d63d1] bg-white p-1 shadow-[0_6px_10px_-6px_rgba(0,0,0,0.45)]"
          >
            <Image
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
              priority
              className="h-auto w-[180px] sm:w-[240px]"
            />
          </a>
        </div>
      </header>
      <CalculatorIntro fontClass="display-wix" />
      <ConflictCalculator
        ctaHref="https://theresewhite.com"
        ctaExternal
        fontClass="display-wix"
      />
    </div>
  );
}
