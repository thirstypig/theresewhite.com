import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/content/legal";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "What this site collects, how analytics consent works, how long information is kept, and your rights under the GDPR and CCPA.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
