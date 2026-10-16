import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { CalculatorIntro } from "@/components/calculator-intro";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { calculator, cta } from "@/content/site";

/**
 * Therese's Workplace Conflict Cost Calculator, on the main site with its
 * header and footer. The same page, without them, is published on its own
 * at calculator.theresewhite.com — see src/app/(landing)/calculator/page.tsx.
 *
 * `noindex` for now: it is meant to launch with the ad campaign. Remove the
 * `noindex` line below to launch it, as the calculator-launch todo describes.
 *
 * No AssessmentCta at the end, unlike other pages: the calculator's own
 * closing panel already makes the same offer, in Therese's words, beside the
 * result, and a second one directly below would repeat it.
 */
export const metadata: Metadata = pageMetadata({
  title: calculator.title,
  description:
    "Put a number on what an unresolved workplace conflict has already cost you, and what it costs over the next twelve months if nothing changes.",
  path: "/conflict-calculator",
  noindex: true,
});

export default function ConflictCalculatorPage() {
  return (
    <>
      <CalculatorIntro />
      <ConflictCalculator ctaHref={cta.href} />
    </>
  );
}
