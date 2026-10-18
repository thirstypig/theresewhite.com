import Link from "next/link";
import { wixCaseStudyStoryEnd, type CaseStudyStory } from "@/content/wix/case-studies";

/**
 * The layout of the three Wix pages that continue a case study
 * (/case-study-extension, /finding-came-back and /the-medical-leave).
 *
 * On Wix each is one white stretch of text, centered title and subtitle,
 * then dark red (#8B0000) section headings over 18px gray paragraphs, and it
 * ends with two centered pairs of blue text links instead of the gray
 * assessment band the main Case Studies page has. The three pages were built
 * separately on Wix, so their title sizes and heading sizes differ; `look`
 * carries those differences, measured on the live pages at 1,440 pixels wide.
 *
 * `spaced` copies /the-medical-leave, which leaves a blank line between every
 * paragraph. The other two run each section's paragraphs together and leave
 * a blank line only before each heading.
 */
export function CaseStudyStoryPage({
  story,
  look,
}: {
  story: CaseStudyStory;
  look: {
    /** Space above the title on wide screens. */
    top: string;
    title: string;
    subtitle: string;
    heading: string;
    spaced?: boolean;
  };
}) {
  const end = wixCaseStudyStoryEnd;
  const link = "underline underline-offset-2 text-[#566fb8] hover:text-[#8b0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d63d1]";
  return (
    <article className={`mx-auto max-w-[980px] px-5 pt-6 pb-8 text-[#414141] lg:px-[3px] lg:pb-[30px] ${look.top}`}>
      <header className="text-center">
        <h1 className={look.title}>{story.title}</h1>
        <p className={`mt-1 lg:mt-0 ${look.subtitle}`}>{story.subtitle}</p>
      </header>

      <div className="mt-6 space-y-[25px] lg:mt-[26px]">
        {story.sections.map((section) => (
          <section key={section.heading}>
            <h2 className={`font-bold text-[#8b0000] ${look.heading}`}>{section.heading}</h2>
            <div className={look.spaced ? "space-y-[25px]" : ""}>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-[17px] leading-[1.45] lg:text-[18px] lg:leading-[25.2px]">
                  {typeof paragraph === "string" ? (
                    paragraph
                  ) : (
                    <>
                      {paragraph.before}
                      <span className="underline underline-offset-2">{paragraph.underlined}</span>
                    </>
                  )}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-7 text-center text-[19px] leading-[1.4] font-bold lg:mt-[24px] lg:text-[20px] lg:leading-[28px]">
        <p className="text-[#1d2cf3]">{end.assessment}</p>
        <p>
          <Link href={end.assessmentHref} className={link}>
            {end.assessmentLink}
          </Link>
        </p>
        <p className="mt-7 lg:mt-[30px]">
          <Link href={end.backHref} className="text-[#1d2cf3] hover:text-[#8b0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d63d1]">
            {end.back}
          </Link>
        </p>
        <p>
          <Link href={end.backHref} className={link}>
            {end.backLink}
          </Link>
        </p>
      </div>
    </article>
  );
}
