import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { MovedPage } from "@/components/moved-page";

/** Moved to the Wix address /about-therese/ on 2026-10-18. See MovedPage. */
export const metadata: Metadata = pageMetadata({
  title: "About Therese (moved)",
  description: "This page has moved to /about-therese/",
  path: "/about",
  noindex: true,
  follow: true,
});

export default function AboutMovedPage() {
  return <MovedPage to="/about-therese/" label="About Therese" />;
}
