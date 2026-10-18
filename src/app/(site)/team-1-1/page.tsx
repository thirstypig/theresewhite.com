import Image from "next/image";
import { AssessmentBand } from "@/components/wix/wix-ui";
import {
  wixEndorsements as page,
  type WixRichParagraph,
} from "@/content/wix/endorsements";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: page.meta.title,
  description: page.meta.description,
  path: "/team-1-1",
});

/** Periwinkle, the heading color on this page only. */
const PERIWINKLE = "text-[#566fb8]";

/**
 * Renders one paragraph from the content file: plain text, italic pieces,
 * and links. Line breaks inside a paragraph are kept, as on Wix.
 */
function Rich({ paragraph }: { paragraph: WixRichParagraph }) {
  if (typeof paragraph === "string") return <>{paragraph}</>;
  return (
    <>
      {paragraph.map((piece, i) => {
        if (typeof piece === "string") return <span key={i}>{piece}</span>;
        if ("em" in piece) return <em key={i}>{piece.em}</em>;
        return (
          <a key={i} href={piece.href} target="_blank" rel="noopener noreferrer" className="underline">
            {piece.text}
          </a>
        );
      })}
    </>
  );
}

/**
 * A near-exact copy of www.theresewhite.com/team-1-1 (the Endorsements
 * page) as it stood on 2026-10-18. The odd address is Wix's, kept so old
 * links keep working. Words come from src/content/wix/endorsements.ts;
 * sizes, colors and spacing were measured on the live page at 1,440 pixels
 * wide and on its phone layout.
 *
 * Layout: a sky-blue band holding a white rounded box with the title and
 * introduction, then four gray cards on cream, two across on wide screens
 * and one across on phones.
 */
export default function EndorsementsPage() {
  return (
    <>
      <section className="bg-[#4ec0f1] px-2.5 pt-[22px] pb-10 lg:px-4 lg:pt-[47px] lg:pb-[42px]">
        <div className="mx-auto max-w-[862px] rounded-[10px] bg-white px-2 pt-1 pb-5 lg:min-h-[215px] lg:px-[54px] lg:pt-0 lg:pb-[18px]">
          <h1 className={`text-center text-[30px] leading-[1.15] lg:text-[56px] ${PERIWINKLE}`}>{page.title}</h1>
          <p className="mt-2 text-center text-[18px] leading-[1.4] text-[#414141] lg:mt-[17px] lg:text-justify lg:text-[27px]">
            <Rich paragraph={page.intro} />
          </p>
        </div>
      </section>

      <section className="bg-[#f4efeb] px-5 pt-[9px] pb-7 lg:px-4 lg:pt-6 lg:pb-5">
        <div className="mx-auto grid max-w-[480px] gap-y-6 lg:max-w-[866px] lg:-translate-x-[6px] lg:grid-cols-2 lg:gap-x-[60px] lg:gap-y-[60px]">
          {page.people.map((person) => (
            <article key={person.name} className="bg-[rgba(232,230,230,0.8)] pb-9 lg:pt-2.5 lg:pr-[14px] lg:pb-10 lg:pl-[13px]">
              <Image
                src={person.photo.src}
                width={person.photo.width}
                height={person.photo.height}
                alt={person.photo.alt}
                sizes="(min-width: 1024px) 365px, calc(100vw - 40px)"
                className="aspect-[271/219] w-full object-cover lg:aspect-[365/391] lg:w-[365px]"
              />
              <div className="px-2.5 lg:px-0">
                <h2 className={`mt-4 font-[family-name:var(--wix-caudex)] text-[26px] leading-[1.3] italic lg:mt-[25px] lg:text-[32px] ${PERIWINKLE}`}>
                  {person.name}
                </h2>
                {"note" in person && (
                  <p className={`font-[family-name:var(--wix-caudex)] text-[15px] leading-[1.4] italic lg:text-[14px] ${PERIWINKLE}`}>
                    {person.note}
                  </p>
                )}
                <div className="mt-5 space-y-6 text-[16px] leading-[1.5] whitespace-pre-line text-black lg:pl-1">
                  {"lead" in person && <p className="text-[17px] leading-[1.4] text-[#414141]">{person.lead}</p>}
                  {person.bio.map((p, i) => (
                    <p key={`bio-${i}`} className={"lead" in person ? "text-[17px] leading-[1.4]" : undefined}>
                      <Rich paragraph={p} />
                    </p>
                  ))}
                  {person.quote.map((p, i) => (
                    <p key={`quote-${i}`} className={`text-[17px] leading-[1.4] ${typeof p === "string" ? "italic" : ""}`}>
                      <Rich paragraph={p} />
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AssessmentBand background="#E8E6E6" />
    </>
  );
}
