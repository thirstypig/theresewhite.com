import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { WixLegalPage } from "@/components/wix-pages/legal-page";
import { wixTerms } from "@/content/wix/legal";

/**
 * The Wix Terms of Use at their Wix address, word for word (see
 * src/content/wix/legal.ts). The older rebuild terms at /terms are separate
 * and left alone.
 */
export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms for using ThereseWhite.com: no legal or professional advice, how the conflict cost calculator may be used, acceptable use, and governing law.",
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  return <WixLegalPage page={wixTerms} />;
}
