import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { MovedPage } from "@/components/moved-page";

/** Moved to the Wix address /services-3/ on 2026-10-18. See MovedPage. */
export const metadata: Metadata = pageMetadata({
  title: "FAQ (moved)",
  description: "This page has moved to /services-3/",
  path: "/faq",
  noindex: true,
  follow: true,
});

export default function FaqMovedPage() {
  return <MovedPage to="/services-3/" label="FAQ" />;
}
