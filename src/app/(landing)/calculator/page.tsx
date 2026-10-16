import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { CalculatorIntro } from "@/components/calculator-intro";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { calculator } from "@/content/site";
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
    <div className="lp-lock bg-paper">
      <CalculatorIntro />
      <ConflictCalculator ctaHref="https://theresewhite.com" ctaExternal />
    </div>
  );
}
