import { pageMetadata } from "@/lib/page-metadata";
import { CaseStudyStoryPage } from "@/components/case-study-story";
import { wixFindingStory } from "@/content/wix/case-studies";

export const metadata = pageMetadata({
  title: "Case Study: Claim Unsubstantiated",
  description:
    "An investigation closed the legal question but not the conflict between two people. How one mediated conversation dissolved the camps. A composite case study.",
  path: "/finding-came-back",
});

/** The rest of Case Study #3, copied from the live Wix page (captured 2026-10-18). */
export default function FindingCameBackPage() {
  return (
    <CaseStudyStoryPage
      story={wixFindingStory}
      look={{
        top: "lg:pt-[30px]",
        title: "text-[28px] leading-[1.3] font-bold text-black lg:text-[34px] lg:leading-[47.6px]",
        subtitle: "text-[22px] leading-[1.35] font-bold lg:text-[24px] lg:leading-[33.6px]",
        heading: "text-[20px] leading-[1.4] lg:leading-[28px]",
      }}
    />
  );
}
