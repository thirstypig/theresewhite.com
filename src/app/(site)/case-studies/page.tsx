import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";
import { AssessmentBand } from "@/components/wix/wix-ui";
import { CaseStudyVideo } from "@/components/case-study-video";
import { wixCaseStudies, type TextCaseStudy, type VideoCaseStudy } from "@/content/wix/case-studies";

export const metadata = pageMetadata({
  title: "Case Studies",
  description:
    "Five composite case studies from L. Therese White's workplace mediation and conflict coaching: an outside hire, an unsubstantiated finding, a return from medical leave, and two short videos.",
  path: "/case-studies",
});

/**
 * Case Studies, copied from the live Wix page (captured 2026-10-18).
 *
 * Wix layout, top to bottom: a dark gray (#414141) title band, then one
 * light gray (#C7C7C7) stretch holding all five case studies separated by
 * short dark rules, then the warm gray (#E8E6E6) assessment band. Case
 * studies #2 and #4 are framed blue panels with a video; the others are text
 * teasers that continue on their own pages.
 *
 * Every size and gap below was measured on the live page at 1,440 pixels
 * wide. Wix places each block by hand, so the gaps differ slightly from one
 * case study to the next, and Case Study #5 is set with tighter line spacing
 * than #1 and #3. Those differences are copied rather than evened out.
 *
 * On phones the Wix page shuffles the case studies into the order 1, 4, 3,
 * 5, 2 and lets the #2 panel run off the right edge of the screen. That looks
 * like an accident of Wix's separate phone editor, so this copy keeps the
 * numbered order on phones, using Wix's phone type sizes enlarged to read at
 * a real phone width.
 */
export default function CaseStudiesPage() {
  const { hero, one, two, three, four, five } = wixCaseStudies;
  return (
    <>
      <section className="bg-[#414141] text-white">
        <div className="mx-auto max-w-[980px] px-5 py-9 lg:grid lg:min-h-[235px] lg:grid-cols-[544px_436px] lg:items-center lg:px-0 lg:pt-9 lg:pb-8">
          <h1 className="text-[38px] leading-[1.2] lg:pl-[63px] lg:text-[56px]">{hero.title}</h1>
          <p className="mt-4 text-[17px] leading-[1.8] lg:mt-0 lg:text-[18px]">{hero.intro}</p>
        </div>
      </section>

      <div className="bg-[#c7c7c7] pt-6 lg:pt-[25px]">
        <div className="mx-auto max-w-[980px] px-4 lg:px-0">
          <TextStudy study={one} id="case-study-1" className="lg:pl-[13px]" />
          <Rule className="mt-7 mb-7 lg:mt-6 lg:mb-[18px]" />

          <FramedPanel color="#4bbff0" className="lg:h-[427px]">
            <div className="flex flex-col gap-4 p-4 pt-8 lg:h-full lg:flex-row-reverse lg:items-center lg:gap-0 lg:p-0 lg:pl-[21px]">
              <VideoHeading study={two} className="lg:flex-1 tracking-[0.08em] lg:text-center" titleClassName="text-black lg:leading-[41px]" />
              <StudyVideo study={two} aspect="632 / 343" className="lg:w-[632px] lg:flex-none" />
            </div>
          </FramedPanel>
          <Rule className="mt-7 mb-7 lg:mt-[22px] lg:mb-[17px]" />

          <TextStudy study={three} id="case-study-3" subtitleClassName="lg:text-[25px]" />
          <Rule className="mt-7 mb-7 lg:mt-10 lg:mb-[27px]" />

          <FramedPanel color="#3d9be9" className="lg:h-[388px]">
            <div className="flex flex-col gap-4 p-4 pt-8 lg:h-full lg:flex-row lg:items-center lg:gap-0 lg:p-0 lg:pt-[26px] lg:pr-[14px] lg:pb-[10px]">
              <VideoHeading study={four} className="lg:w-[386px] lg:flex-none lg:pr-6 lg:pl-5" titleClassName="text-[#414141] lg:leading-[44.8px]" />
              <StudyVideo study={four} aspect="579 / 352" className="lg:w-[579px] lg:flex-none" />
            </div>
          </FramedPanel>
          <Rule className="mt-7 mb-7 lg:mt-[33px] lg:mb-[41px]" />

          <TextStudy study={five} id="case-study-5" tight />
          <Rule className="mt-7 pb-8 lg:mt-[44px] lg:pb-[12px]" />
        </div>
      </div>

      <AssessmentBand background="#E8E6E6" />
    </>
  );
}

/** The short dark rule between case studies: 284 by 3 pixels, #282626. */
function Rule({ className = "" }: { className?: string }) {
  return <hr className={`mx-auto h-0 w-[284px] max-w-[80%] border-0 border-t-[3px] border-[#282626] ${className}`} />;
}

/**
 * The label, title and subtitle of a text case study, its "THE SITUATION"
 * opening, and the link to the rest of the story.
 *
 * `tight` copies Case Study #5's closer line spacing and smaller paragraph
 * gaps on Wix.
 */
function TextStudy({
  study,
  id,
  tight = false,
  className = "",
  subtitleClassName = "",
}: {
  study: TextCaseStudy;
  id: string;
  tight?: boolean;
  className?: string;
  subtitleClassName?: string;
}) {
  const headLeading = tight ? "lg:leading-[1.16]" : "lg:leading-[36.4px]";
  const bodyLeading = tight ? "leading-[1.45] lg:leading-[1.15]" : "leading-[1.45] lg:leading-[25.2px]";
  const last = study.paragraphs.length - 1;
  return (
    <article className={`font-bold text-[#414141] ${className}`}>
      <h2 id={id}>
        <span className={`block text-[22px] leading-[1.3] text-[#8b0000] lg:text-[26px] ${headLeading}`}>{study.label}</span>
        <span className={`block text-[24px] leading-[1.25] lg:text-[32px] ${headLeading}`}>{study.title}</span>
        <span className={`block text-[20px] leading-[1.3] lg:text-[26px] ${headLeading} ${subtitleClassName}`}>{study.subtitle}</span>
      </h2>
      <h3 className={`mt-4 text-[18px] leading-[1.4] text-[#8b0000] lg:text-[20px] ${tight ? "lg:mt-[18px] lg:leading-[1.15]" : "lg:mt-[23px] lg:leading-[28px]"}`}>
        {study.situationHeading}
      </h3>
      <div className={`font-normal ${tight ? "space-y-[19px]" : "space-y-[25px]"}`}>
        {study.paragraphs.map((paragraph, i) => (
          <p key={i} className={`text-[16px] lg:text-[18px] ${bodyLeading}`}>
            {paragraph}
            {i === last && (
              <>
                {" "}
                <span className="font-bold whitespace-nowrap lg:text-[20px]">
                  (
                  <Link
                    href={study.continueHref}
                    aria-describedby={id}
                    className="underline underline-offset-2 hover:text-[#8b0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d63d1]"
                  >
                    {study.continueLabel}
                  </Link>
                  )
                </span>
              </>
            )}
          </p>
        ))}
      </div>
    </article>
  );
}

/**
 * Wix's framed panel ("Iron Box"): a solid blue fill under a faint metal
 * texture, a 2px corner radius, a drop shadow, a white inner glow, and a
 * small screw head in each corner. The texture and screw images are Wix's
 * own decorations, copied into public/wix/case-studies/.
 */
function FramedPanel({
  color,
  className = "",
  children,
}: {
  color: string;
  className?: string;
  children: React.ReactNode;
}) {
  const screw = "pointer-events-none absolute h-[15px] w-[15px] bg-[url(/wix/case-studies/panel-screw.png)]";
  return (
    <div
      className={`relative rounded-[2px] bg-[url(/wix/case-studies/panel-texture.webp)] shadow-[0_2px_5px_rgba(0,0,0,.53),inset_0_0_6px_rgba(255,255,255,.59),inset_0_1px_0_rgba(255,255,255,.92),inset_0_0_5px_rgba(255,255,255,.2)] ${className}`}
      style={{ backgroundColor: color }}
    >
      <span className={`${screw} top-[5px] left-[5px]`} aria-hidden="true" />
      <span className={`${screw} top-[5px] right-[5px]`} aria-hidden="true" />
      <span className={`${screw} bottom-[5px] left-[5px]`} aria-hidden="true" />
      <span className={`${screw} right-[5px] bottom-[5px]`} aria-hidden="true" />
      {children}
    </div>
  );
}

/** The heading inside a video panel: the dark red label over the title. */
function VideoHeading({
  study,
  className = "",
  titleClassName = "",
}: {
  study: VideoCaseStudy;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <h2 className={`font-bold ${className}`}>
      <span className="block text-[22px] leading-[1.3] text-[#8b0000] lg:text-[26px]">{study.label}</span>
      {study.titleLines.map((line) => (
        <span key={line} className={`block text-[26px] leading-[1.3] lg:text-[32px] ${titleClassName}`}>
          {line}
        </span>
      ))}
    </h2>
  );
}

function StudyVideo({
  study,
  aspect,
  className = "",
}: {
  study: VideoCaseStudy;
  aspect: string;
  className?: string;
}) {
  return (
    <CaseStudyVideo
      {...study.video}
      label={`${study.label}, ${study.titleLines.join(" ").replace(/ /g, " ")}`}
      aspect={aspect}
      className={`w-full ${className}`}
    />
  );
}
