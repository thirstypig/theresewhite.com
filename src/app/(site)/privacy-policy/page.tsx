import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { WixLegalPage } from "@/components/wix-pages/legal-page";
import { wixPrivacy } from "@/content/wix/legal";

/**
 * The Wix Privacy Policy at its Wix address, word for word except for the
 * drafting notes removed under ruling 6 (see src/content/wix/legal.ts).
 * The older rebuild policy at /privacy is separate and left alone.
 */
export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What information ThereseWhite.com collects, how it is used and shared, how long it is kept, and the choices you have, including California privacy rights.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <WixLegalPage page={wixPrivacy} />;
}
