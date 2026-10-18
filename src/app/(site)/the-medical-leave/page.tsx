import { pageMetadata } from "@/lib/page-metadata";
import { CaseStudyStoryPage } from "@/components/case-study-story";
import { wixMedicalLeaveStory } from "@/content/wix/case-studies";

export const metadata = pageMetadata({
  // Wix's own wording for this page's title, double hyphen included.
  title: "Case Study: The Return -- Medical",
  description:
    "His medical leave was handled by the book, but he came back to a job quietly divided up. How the accounts, and the trust, came back. A composite case study.",
  path: "/the-medical-leave",
});

/**
 * The rest of Case Study #5, copied from the live Wix page (captured
 * 2026-10-18). Unlike the other two follow-on pages, this one leaves a blank
 * line between every paragraph and sets its section headings at body size.
 */
export default function MedicalLeavePage() {
  return (
    <CaseStudyStoryPage
      story={wixMedicalLeaveStory}
      look={{
        top: "lg:pt-[25px]",
        title: "text-[28px] leading-[1.3] font-bold lg:text-[30px] lg:leading-[42px]",
        subtitle: "text-[22px] leading-[1.35] font-bold lg:text-[24px] lg:leading-[33.6px]",
        heading: "text-[18px] leading-[1.4] lg:leading-[25.2px]",
        spaced: true,
      }}
    />
  );
}
