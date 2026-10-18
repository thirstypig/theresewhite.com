import { pageMetadata } from "@/lib/page-metadata";
import { CaseStudyStoryPage } from "@/components/case-study-story";
import { wixOutsideHireStory } from "@/content/wix/case-studies";

export const metadata = pageMetadata({
  title: "Case Study: Outside Hire",
  description:
    "A new director from outside, a team that had wanted someone else, and the conversations that turned quiet resistance into working trust. A composite case study.",
  path: "/case-study-extension",
});

/**
 * The rest of Case Study #1, copied from the live Wix page (captured
 * 2026-10-18). This page's title and subtitle are set larger, in regular
 * weight and in black, unlike the other two follow-on pages.
 */
export default function OutsideHirePage() {
  return (
    <CaseStudyStoryPage
      story={wixOutsideHireStory}
      look={{
        top: "lg:pt-[19px]",
        title: "text-[30px] leading-[1.3] text-black lg:text-[53px] lg:leading-[74.2px]",
        subtitle: "text-[25px] leading-[1.3] text-black lg:text-[36px] lg:leading-[50.4px]",
        heading: "text-[20px] leading-[1.4] lg:text-[24px] lg:leading-[33.6px]",
      }}
    />
  );
}
