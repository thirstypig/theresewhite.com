import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { MovedPage } from "@/components/moved-page";

/** Moved to the Wix address /team-1-1/ on 2026-10-18. See MovedPage. */
export const metadata: Metadata = pageMetadata({
  title: "Endorsements (moved)",
  description: "This page has moved to /team-1-1/",
  path: "/endorsements",
  noindex: true,
  follow: true,
});

export default function EndorsementsMovedPage() {
  return <MovedPage to="/team-1-1/" label="Endorsements" />;
}
