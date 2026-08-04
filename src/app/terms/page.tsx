import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "This site is information about a mediation practice. Nothing here is legal advice, and an engagement begins only under a signed written agreement.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
