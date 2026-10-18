import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { MovedPage } from "@/components/moved-page";

/** Moved to the Wix address /terms-of-use/ on 2026-10-18. See MovedPage. */
export const metadata: Metadata = pageMetadata({
  title: "Terms of Use (moved)",
  description: "This page has moved to /terms-of-use/",
  path: "/terms",
  noindex: true,
  follow: true,
});

export default function TermsMovedPage() {
  return <MovedPage to="/terms-of-use/" label="Terms of Use" />;
}
