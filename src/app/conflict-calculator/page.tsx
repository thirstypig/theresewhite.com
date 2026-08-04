import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { AssessmentCta } from "@/components/assessment-cta";

/**
 * Ad landing page. Deliberately not in the primary nav and not in the sitemap
 * — it is reached from paid traffic, not from browsing the site.
 *
 * `noindex` for now: the page is built and styled ahead of the campaign, and
 * shouldn't be crawled until the ads actually run. Remove the robots block
 * below to launch it.
 */
export const metadata: Metadata = {
  title: "The Workplace Conflict Calculator",
  description:
    "Put a number on what an unresolved workplace conflict has already cost you, and what it costs over the next twelve months if nothing changes.",
  alternates: { canonical: "/conflict-calculator" },
  robots: { index: false, follow: false },
};

export default function ConflictCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cost of conflict"
        title="Your biggest expense is the conversation nobody knows how to have"
        intro="Two people who can't be in the same room is not a personality problem. It's a line item. This puts a number on it."
      />
      <ConflictCalculator />
      <AssessmentCta />
    </>
  );
}
