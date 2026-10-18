import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { WixLegalPage } from "@/components/wix-pages/legal-page";
import { wixAccessibility } from "@/content/wix/legal";

/** The Wix Accessibility Statement at its Wix address, word for word (see src/content/wix/legal.ts). */
export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description:
    "How ThereseWhite.com works toward WCAG 2.1 AA, its known limitations, other ways to get the information, and how to report an accessibility problem.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return <WixLegalPage page={wixAccessibility} />;
}
