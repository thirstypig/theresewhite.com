import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { MovedPage } from "@/components/moved-page";

/** Moved to the Wix address /privacy-policy/ on 2026-10-18. See MovedPage. */
export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy (moved)",
  description: "This page has moved to /privacy-policy/",
  path: "/privacy",
  noindex: true,
  follow: true,
});

export default function PrivacyMovedPage() {
  return <MovedPage to="/privacy-policy/" label="Privacy Policy" />;
}
