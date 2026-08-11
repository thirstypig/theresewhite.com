import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { LegalPage } from "@/components/legal-page";
import { terms } from "@/content/legal";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description:
    "This site is information about a mediation practice. Nothing here is legal advice, and an engagement begins only under a signed written agreement.",
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
