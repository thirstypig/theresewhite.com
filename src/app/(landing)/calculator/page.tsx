import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { CalculatorIntro } from "@/components/calculator-intro";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { LiveSiteFooter, LiveSiteHeader } from "@/components/live-site-chrome";
import { calculator } from "@/content/site";
import { calendlyUrl } from "@/content/wix/chrome";
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
 * In the bare landing layout because the subdomain has no other pages: the
 * main site's header, full of links to /about and /services, would be a
 * header full of 404s. The live site's header links to the live pages
 * instead. The calculator's button, "Schedule Your Free Confidential
 * Assessment", opens Therese's Calendly booking page in a new tab (James's
 * request, 2026-10-26; it went to the live home page before).
 *
 * It wears the live theresewhite.com identity rather than the rebuild's:
 * Arial and Arial Bold with black headlines, the Wix site's gray and blues,
 * pill buttons, and the live site's own header (her logo and menu) and
 * footer, every link going to the live page of that name. Visitors arrive from the Wix site and
 * from ads that sit alongside it, and a page in the rebuild's teal and serif
 * would look like someone else's. The look is the `.lp-wix` theme in
 * globals.css.
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
      <LiveSiteHeader />
      <CalculatorIntro fontClass="display-wix" />
      <ConflictCalculator
        ctaHref={calendlyUrl}
        ctaExternal
        fontClass="display-wix"
        stickyTop="lg:top-[9.5rem]"
      />
      <LiveSiteFooter />
    </div>
  );
}
