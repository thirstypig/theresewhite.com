import Image from "next/image";
import { AssessmentBand } from "@/components/wix/wix-ui";
import { wixAboutTherese as page } from "@/content/wix/about-therese";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: page.meta.title,
  description: page.meta.description,
  path: "/about-therese",
});

/** Dark red, the heading color on this page and on Case Studies. */
const RED = "text-[#8b0000]";

/**
 * The thick near-black rule Wix draws between sections: 284px wide, 3px.
 * Capped to the screen width on phones.
 */
function Divider({ className = "" }: { className?: string }) {
  return <hr className={`h-[3px] w-[284px] max-w-full border-0 bg-[#282626] ${className}`} />;
}

/**
 * A near-exact copy of www.theresewhite.com/about-therese as it stood on
 * 2026-10-18. Words come from src/content/wix/about-therese.ts; sizes,
 * colors and spacing were measured on the live page at 1,440 pixels wide
 * and on its phone layout.
 *
 * One deliberate change (ruling 3, 2026-10-17): on Wix, the photo of
 * Therese with her dog covers half of the "About Therese" title and part of
 * the award image. Here the same three pieces sit side by side so nothing
 * overlaps. The title, award and photo keep their Wix sizes.
 */
export default function AboutTheresePage() {
  const { images } = page;
  return (
    <>
      {/* Title band: a sky-blue to gray-blue fade, with the sand-dune photo
          filling the right half on wide screens. On phones the fade holds the
          title and award, and the dune photo sits behind the dog photo. */}
      <section className="lg:pb-[30px]">
        <div className="relative overflow-hidden bg-[linear-gradient(90deg,#4ec0f1_0%,#b6c8d0_100%)] lg:h-[439px]">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[#e8e6e6] lg:block">
            <Image
              src={images.dune.src}
              width={images.dune.width}
              height={images.dune.height}
              alt=""
              loading="eager"
              sizes="50vw"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative flex flex-col items-center lg:flex-row lg:items-start lg:justify-center lg:gap-6 lg:pl-[78px]">
            <div className="flex w-full flex-col items-center px-5 pt-3 pb-5 lg:w-[393px] lg:px-0 lg:pt-[23px] lg:pb-0">
              <h1 className="text-center text-[28px] leading-[1.15] font-bold text-[#414141] lg:text-[56px] lg:text-[#8b0000]">
                {page.title[0]}
                <br />
                {page.title[1]}
              </h1>
              <Image
                src={images.award.src}
                width={images.award.width}
                height={images.award.height}
                alt={images.award.alt}
                loading="eager"
                sizes="(min-width: 1024px) 393px, calc(100vw - 40px)"
                className="mt-2 aspect-[393/220] w-full max-w-[393px] object-cover lg:mt-[33px]"
              />
            </div>

            {/* On phones the dune photo becomes the backdrop for the dog photo. */}
            <div className="relative w-full px-5 pt-5 pb-[110px] lg:w-auto lg:px-0 lg:pt-[30px] lg:pb-0">
              <Image
                src={images.dune.src}
                width={images.dune.width}
                height={images.dune.height}
                alt=""
                sizes="100vw"
                className="absolute inset-0 -z-0 h-full w-full object-cover lg:hidden"
              />
              <Image
                src={images.portrait.src}
                width={images.portrait.width}
                height={images.portrait.height}
                alt={images.portrait.alt}
                loading="eager"
                sizes="(min-width: 1024px) 464px, calc(100vw - 40px)"
                className="relative mx-auto aspect-[4/3] w-full max-w-[464px] object-cover lg:aspect-[464/378] lg:w-[464px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* My Calling · What I Believe · How I Work, over Wix's soft gray
          "Center Gradient Transparent" image. */}
      <section className="relative overflow-hidden bg-white">
        <Image
          src={images.gradient.src}
          width={images.gradient.width}
          height={images.gradient.height}
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative mx-auto grid max-w-[961px] gap-y-6 px-5 pt-5 pb-7 lg:grid-cols-3 lg:gap-x-[51px] lg:px-0 lg:pt-[39px] lg:pb-[28px]">
          {page.columns.map((column) => (
            <div key={column.heading}>
              <h2 className={`text-center text-[26px] leading-[1.4] font-bold ${RED}`}>{column.heading}</h2>
              <div className="space-y-[25px] text-[18px] leading-[1.4]">
                {column.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
          <Divider className="mx-auto mt-6 lg:col-start-2 lg:mt-[42px] lg:ml-[18px]" />
        </div>
      </section>

      {/* My Services */}
      <section className="px-5 lg:px-0">
        <div className="mx-auto max-w-[962px] pt-5 pb-5 lg:pt-[27px] lg:pb-[30px]">
          <h2 className={`text-center text-[23px] leading-[1.4] font-bold lg:text-[40px] ${RED}`}>
            {page.services.title}
          </h2>
          <p className="text-center text-[17px] leading-[1.4] font-bold lg:text-[22px]">
            {page.services.subtitle}
          </p>
          <div className="mt-6 grid gap-y-6 lg:mt-[27px] lg:grid-cols-[286px_298px_298px] lg:justify-between">
            {page.services.items.map((item) => (
              <div key={item.heading}>
                <h3 className={`text-center text-[26px] leading-[1.05] font-bold lg:min-h-[37px] ${RED}`}>
                  {item.heading}
                </h3>
                <p className="mt-1 text-[18px] leading-[1.4]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Record */}
      <section className="px-5 lg:px-0">
        <div className="mx-auto max-w-[974px] pt-2.5 pb-5 lg:pb-[47px]">
          <Divider className="mx-auto lg:relative lg:left-[8px]" />
          <h2 className={`mt-6 text-center text-[30px] leading-[1.4] font-bold lg:mt-[22px] lg:text-[40px] ${RED}`}>
            {page.record.title}
          </h2>
          <p className="text-center text-[22px] leading-[1.4] font-bold">{page.record.subtitle}</p>

          <div className="mt-[25px] space-y-[25px] text-[18px] leading-[1.4]">
            {page.record.groups.map((group) => (
              <div key={group.heading}>
                <h3 className={`text-[22px] leading-[1.15] ${RED}`}>{group.heading}</h3>
                {"paragraphs" in group && (
                  <div className="space-y-[25px]">
                    {group.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {"lines" in group && group.lines.map((line) => <p key={line}>{line}</p>)}
                {"list" in group && (
                  <ul className="mt-1 list-disc pl-8">
                    {group.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <AssessmentBand background="#E8E6E6" />
    </>
  );
}
