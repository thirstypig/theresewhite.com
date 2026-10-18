import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { pageMetadata } from "@/lib/page-metadata";
import { AssessmentBand } from "@/components/wix/wix-ui";
import { wixFaq } from "@/content/wix/faq";

/**
 * The Wix FAQ page, at Wix's address for it (/services-3).
 *
 * Desktop, measured on the live page at 1,440 wide on 2026-10-18:
 * - Cream page (#F4EFEB). A 980px column carries a fine vertical-line
 *   texture (Wix's own 150px tile, public/wix/faq/line-texture.webp, over a
 *   soft sand-to-cream radial glow).
 * - At the top of that column, a periwinkle block (#566FB8), 267px tall,
 *   holding a white title box 766px wide: the heading in navy (#3E569E)
 *   Arial 35px bold, and the introduction in EB Garamond 26px bold,
 *   justified.
 * - Under it, a white list of the twelve questions, Arial 18px bold black,
 *   each with a thin chevron. Opening one shows its answer in Arial 16px on
 *   24px lines and closes any other that is open, as on Wix.
 * - A white closing band.
 *
 * On phones Wix drops the periwinkle block: the heading and introduction sit
 * on the texture, and the white list runs the full width.
 *
 * The questions open and close with the browser's own disclosure element
 * (<details>). Giving all twelve the same `name` makes the browser keep only
 * one open at a time, with no script. Browsers older than about 2024 ignore
 * the name and simply let several stay open, which is harmless.
 *
 * EB Garamond is loaded here, not with the shared Wix fonts, because this
 * introduction is the only place the site uses it.
 */
const garamond = EB_Garamond({ weight: "700", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Twelve questions leaders ask before bringing in an outside mediator: cost, internal politics, top performers, urgent situations, legal issues, success rates and remote work.",
  path: "/services-3",
});

const texture =
  "url(/wix/faq/line-texture.webp) repeat, radial-gradient(circle, rgba(216,199,189,0.55) 15%, #f4efeb 80%)";

export default function FaqPage() {
  return (
    <>
      <section className="bg-[#f4efeb] md:pb-[105px]">
        <div className="relative mx-auto max-w-[980px]">
          {/* The texture starts 84px down on desktop, behind the periwinkle block. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 bottom-0 md:top-[84px]"
            style={{ background: texture }}
          />

          <div className="relative md:pt-[23px]">
            <div className="md:h-[267px] md:bg-[#566fb8] md:pt-[12px]">
              <div className="px-4 pt-5 pb-6 md:mx-auto md:h-[245px] md:w-[min(766px,calc(100%-48px))] md:bg-white md:px-[18px] md:pt-[11px] md:pb-0">
                <h1 className="text-[28px] leading-tight font-bold text-[#3e569e] md:text-[35px] md:leading-[1.15]">
                  {wixFaq.title}
                </h1>
                <p
                  className={`${garamond.className} mt-3 text-[19px] leading-[1.4] text-[#414141] md:mt-[6px] md:max-w-[730px] md:text-justify md:text-[26px]`}
                >
                  {wixFaq.intro}
                </p>
              </div>
            </div>

            <div className="bg-white md:mx-auto md:w-[min(766px,calc(100%-48px))]">
              {wixFaq.items.map((item) => (
                <details key={item.q} name="wix-faq" className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0d63d1] md:gap-[31px] md:px-[25px] md:py-[26px] [&::-webkit-details-marker]:hidden">
                    <h2 className="text-[20px] leading-[1.4] font-bold text-black md:text-[18px]">{item.q}</h2>
                    <Chevron />
                  </summary>
                  <p className="px-4 pb-10 text-[16px] leading-[24px] text-black md:px-[25px] md:pb-[56px]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AssessmentBand background="#FFFFFF" />
    </>
  );
}

/** Wix's thin chevron: points down when closed, up when open. */
function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="mt-[1px] shrink-0 text-black transition-transform duration-200 group-open:rotate-180"
    >
      <path d="M5.5 9l6.5 6.5L18.5 9" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
