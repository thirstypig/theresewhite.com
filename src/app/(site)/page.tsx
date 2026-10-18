import type { Metadata } from "next";
import Image from "next/image";
import { AssessmentBand, WixButton } from "@/components/wix/wix-ui";
import { WixHomeVideo } from "@/components/wix-home-video";
import { wixHome, wixHomeImages } from "@/content/wix-home";
import { pageMetadata, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/page-metadata";

/*
 * The homepage needs its own metadata even though the root layout already
 * describes the site. Without it, the opengraph-image.tsx file convention
 * attaches to the root segment and wins over anything the layout sets, so
 * the homepage alone would advertise the extensionless /opengraph-image
 * path that GitHub Pages serves as application/octet-stream.
 *
 * A page-level openGraph replaces the parent's, which is how every other
 * page already gets /og.png. This puts the homepage on the same footing.
 */
export const metadata: Metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

/*
 * A near-exact copy of the live Wix homepage at www.theresewhite.com
 * (James's decision of 2026-10-18: the first build matches the current site,
 * words unchanged; the redesign comes later). Every word comes from
 * src/content/wix-home.ts, and every picture from public/wix/home/.
 *
 * How to read the sizes below. Wix pins every element at a fixed spot on a
 * 980-pixel-wide grid. From 1,024 pixels wide up ("lg:" in the class names),
 * this page puts each element at the size and spacing measured on Wix at
 * 1,440 pixels wide (docs/style-bible/data/home-desktop.json). Below that it
 * follows Wix's phone version, stacked in one column, but stretches to the
 * real screen width instead of Wix's fixed 320 pixels, and keeps reading text
 * at 15 pixels or larger (ruling of 2026-10-17; Wix's phone text is 10 to 14
 * pixels).
 *
 * Wix's own oddities are kept on purpose where a visitor can see them: the
 * Forum-font capital "I" that starts the second card, the thin italic
 * "One-Trick Pony", and the forced line break in the blueprint introduction.
 */

/** Wix's stat pill: a stretched rounded rectangle, so its corners are oval. */
const pill =
  "flex items-center justify-center bg-[#3d9be9] text-center font-bold text-white tracking-[0.03em] rounded-[30px/16px] lg:rounded-[45px/26px]";

/**
 * Logos and their frames shrink with the screen below 1,012 pixels wide,
 * keeping Wix's proportions. At 390 pixels wide they come out at about the
 * size Wix's phone version draws them.
 */
const shrink = (px: number) => `min(${px}px, calc((100vw - 32px) * ${px} / 980))`;

/** Splits a sentence after a phrase, to copy a line break Wix forces. */
function splitAfter(text: string, phrase: string): string[] {
  const at = text.indexOf(phrase);
  if (at < 0) return [text];
  const end = at + phrase.length;
  return [text.slice(0, end), text.slice(end).trimStart()];
}

export default function HomePage() {
  const { hero, cta, whereIWork, calculator, quoteBand, beforeWeTalk, panels, reasons, blueprint } = wixHome;
  const img = wixHomeImages;

  return (
    <>
      {/* 1. Hero: the question, the symptoms, the portrait. Warm gray, as the header. */}
      <section className="relative overflow-hidden bg-[#e8e6e6]">
        <div className="relative mx-auto max-w-[980px] px-4 pt-5 pb-6 lg:h-[925px] lg:px-0 lg:pt-[31px] lg:pb-0">
          <Image
            src={img.portrait.src}
            width={img.portrait.width}
            height={img.portrait.height}
            alt={img.portrait.alt}
            priority
            sizes="(min-width: 1024px) 711px, 45vw"
            className="absolute top-4 right-0 h-[min(520px,135vw)] w-[46%] max-w-[330px] object-cover object-[50%_0%] lg:top-0 lg:right-[max(-152px,calc((980px-100vw)/2))] lg:h-[897px] lg:w-[711px] lg:max-w-none lg:object-center"
          />

          <div className="relative z-10 w-[58%] lg:w-auto">
            <h1 className="text-[19px] leading-[1.3] font-bold text-black lg:ml-4 lg:w-[630px] lg:text-[40px] lg:leading-[52px]">
              {hero.question}
            </h1>

            <ul className="mt-3 list-disc pl-[18px] text-[15px] leading-[1.35] font-bold text-[#414141] lg:mt-[39px] lg:w-[748px] lg:pl-[33px] lg:text-[25px] lg:leading-[36px]">
              {hero.bullets.map((b) => (
                <li key={b.before} className="mb-1 lg:mb-0">
                  {b.before}
                  {"em" in b && <em>{b.em}</em>}
                  {"after" in b && b.after}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 mt-3 w-[62%] text-center text-[15px] leading-[1.3] font-bold text-black italic lg:mt-[11px] lg:ml-[22px] lg:w-[546px] lg:text-[26px] lg:leading-[30px]">
            {hero.tagline}
          </p>

          <div className="relative z-10 mt-4 flex w-[58%] flex-col items-center gap-2 lg:mt-[35px] lg:ml-[35px] lg:w-auto lg:flex-row lg:gap-[19px]">
            <p className={`${pill} h-[44px] w-[132px] px-3 text-[13px] leading-tight lg:h-[72px] lg:w-[206px] lg:px-8 lg:text-[20px]`}>
              {hero.stats[0]}
            </p>
            <p className={`${pill} h-[44px] w-[132px] px-3 text-[13px] leading-tight lg:h-[72px] lg:w-[215px] lg:px-4 lg:text-[20px]`}>
              {hero.stats[1]}
            </p>
          </div>

          <hr aria-hidden="true" className="hidden border-0 border-t-[3px] border-[#282626] lg:mt-[23px] lg:ml-[137px] lg:block lg:w-[222px]" />

          <div className="relative z-10 mt-5 flex w-[58%] flex-col items-center lg:mt-[36px] lg:ml-[22px] lg:w-[416px]">
            <p className="text-center text-[15px] leading-[1.25] font-bold text-[#414141] lg:text-[24px] lg:leading-[28px]">
              {cta.lines[0]}
              <br />
              {cta.lines[1]}
            </p>
            <div className="mt-3 flex w-full justify-center lg:mt-[31px] lg:ml-[2px] lg:w-[341px]">
              <WixButton href="/contact">{cta.button}</WixButton>
            </div>
          </div>

          <hr aria-hidden="true" className="absolute top-[869px] left-[120px] hidden w-[222px] border-0 border-t-[3px] border-[#282626] lg:block" />
        </div>
      </section>

      {/* 2. "Where I Work": a charcoal box on the same warm gray. */}
      <section className="bg-[#e8e6e6] px-4 pb-6 lg:h-[210px] lg:px-0 lg:pt-[25px] lg:pb-0">
        <div className="mx-auto max-w-[980px]">
          <div className="rounded-[10px] bg-[#282626] px-3 py-3 text-center font-bold text-white lg:ml-[128px] lg:h-[159px] lg:w-[752px] lg:px-0 lg:pt-[18px] lg:pb-0">
            <h2 className="text-[23px] leading-[1.3] lg:text-[40px] lg:leading-[52px]">{whereIWork.title}</h2>
            <p className="text-[18px] leading-[1.3] lg:mx-auto lg:w-[742px] lg:text-[26px] lg:leading-[33.8px]">{whereIWork.body}</p>
          </div>
        </div>
      </section>

      {/* 3. The cost calculator: a white panel inside a black band. */}
      <section className="bg-black pb-5 lg:h-[412px] lg:px-[80px] lg:pt-[35px] lg:pb-0">
        <div className="bg-white px-4 pt-5 pb-5 lg:h-[341px] lg:p-0">
          <div className="mx-auto flex max-w-[980px] flex-col items-center text-center font-bold text-[#414141] lg:relative lg:h-full lg:w-[980px] lg:max-w-none">
            <h2 className="text-[26px] leading-[1.3] text-[#ed4545] lg:absolute lg:top-[64px] lg:left-[4px] lg:w-[502px] lg:text-[34px] lg:leading-[44px]">
              {calculator.costTitle.map((line, i) => (
                <span key={line} className="lg:block">
                  {i > 0 && " "}
                  {line}
                </span>
              ))}
            </h2>

            <div className="mt-4 flex flex-col items-center lg:absolute lg:top-[20px] lg:left-[434px] lg:mt-0 lg:w-[595px]">
              <p className="text-[25px] leading-[1.25] lg:text-[28px] lg:leading-[25.2px]">
                {/* Wix keeps the opening quotation mark upright and slants only the name. */}
                {calculator.tryLead}
                {calculator.tryName.slice(0, 1)}
                <em>{calculator.tryName.slice(1)}</em>
              </p>
              <p className="mt-1 text-[22px] leading-[1.4] lg:mt-[10px] lg:text-[24px] lg:leading-[33.6px]">{calculator.divider}</p>
              <p className="text-[22px] leading-[1.4] lg:text-[24px] lg:leading-[33.6px]">
                {calculator.body.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <div className="mt-3 flex w-full justify-center lg:mt-[7px] lg:mr-[18px]">
                <WixButton href={calculator.href}>{calculator.button}</WixButton>
              </div>
              <p className="mt-2 text-[13px] leading-[1.4] font-normal lg:mt-[6px] lg:text-[12px] lg:leading-[16.8px]">
                {calculator.fineprint}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The quote, the AI-avatar video, and "What To Know Before We Talk". Bright blue. */}
      <section className="border-b border-[#282626] bg-[#3d9be9] px-4 pt-4 pb-16 lg:h-[1035px] lg:border-0 lg:px-0 lg:pt-[41px] lg:pb-0">
        <div className="mx-auto max-w-[980px]">
          <div className="text-center font-bold lg:mx-auto lg:w-[960px]">
            <p className="text-[18px] leading-[1.35] text-white lg:text-[28px] lg:leading-[40px]">{quoteBand.lead}</p>
            <p className="mt-1 text-[22px] leading-[1.35] text-white italic lg:mt-0 lg:text-[45px] lg:leading-[65px] lg:text-black">
              {quoteBand.quote}
            </p>
            <p className="mt-1 text-[18px] leading-[1.35] text-white lg:mt-0 lg:text-[28px] lg:leading-[40px]">{quoteBand.tail}</p>
          </div>

          <p className="mt-5 text-[15px] leading-[1.4] font-bold text-black lg:mt-[30px] lg:ml-[144px] lg:w-[691px] lg:text-[18px] lg:leading-[25.2px]">
            {quoteBand.disclosure}
          </p>

          <div className="mx-auto mt-5 max-w-[640px] lg:mt-[42px] lg:w-[640px]">
            <WixHomeVideo />
          </div>

          <h2 className="mt-8 text-center text-[23px] leading-[1.35] font-bold text-black lg:mt-[57px] lg:text-[35px] lg:leading-[51px]">
            {beforeWeTalk.title}
          </h2>
          <ul className="mt-1 list-disc pl-5 text-[15px] leading-[1.4] text-white lg:mt-0 lg:ml-[154px] lg:w-[689px] lg:pl-[26px] lg:text-[20px] lg:leading-[26px]">
            {beforeWeTalk.items.map((item, i) => (
              <li key={i}>
                {"text" in item ? (
                  item.text
                ) : (
                  <>
                    {item.before}
                    <strong className="italic">{item.strong}</strong>
                    {item.after}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Mediation panel memberships: framed logos on Wix's "Blue Gradient". */}
      <section className="relative overflow-hidden px-4 pt-2 pb-9 lg:h-[785px] lg:px-0 lg:pt-[30px] lg:pb-0">
        <Image
          src={img.panelBackground.src}
          width={img.panelBackground.width}
          height={img.panelBackground.height}
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative mx-auto max-w-[980px]">
          <h2 className="text-center text-[30px] leading-[1.2] font-bold tracking-[0.01em] text-black lg:text-[61px] lg:leading-[70px]">
            {panels.title}
          </h2>
          <ul className="mt-5 grid grid-cols-2 items-center justify-items-center gap-y-4 lg:mt-[46px] lg:gap-y-[20px]">
            {img.panelLogos.map((logo, i) => (
              <li key={logo.src}>
                <PanelTile logo={logo} caption={i === 5 ? img.clokeCaption : undefined} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Three reasons: white cards on black (one blue panel on phones, as on Wix). */}
      <section className="bg-black pb-5 lg:h-[841px] lg:pt-[42px] lg:pb-0">
        <h2 className="px-3 py-3 text-center text-[20px] leading-[1.25] font-bold tracking-[0.01em] text-white lg:p-0 lg:text-[50px] lg:leading-[57px]">
          {reasons.title[0]}
          <br />
          {reasons.title[1]}
        </h2>
        <div className="mx-auto border border-[#0c4426] bg-[#3d9be9] shadow-[-0.52px_9.99px_50px_-26px_#22495a] lg:mt-[27px] lg:flex lg:w-[987px] lg:justify-between lg:border-0 lg:bg-transparent lg:shadow-none">
          {reasons.cards.map((card, ci) => {
            const icon = img.reasonIcons[ci];
            // Wix pads each card slightly differently; these are its measurements.
            const pad = ["lg:pl-[23px] lg:pr-[1px]", "lg:pl-[12px] lg:pr-[10px]", "lg:px-[12px]"][ci];
            return (
              <article
                key={card.title[0]}
                className={`px-4 pt-3 pb-6 lg:h-[590px] lg:w-[325px] lg:border lg:border-[#0c4426] lg:bg-white lg:pt-[15px] lg:pb-0 lg:shadow-[-0.52px_9.99px_50px_-26px_#22495a] ${pad}`}
              >
                <div className="flex justify-center lg:h-[100px] lg:items-start">
                  <Image
                    src={icon.src}
                    width={icon.width}
                    height={icon.height}
                    alt=""
                    className="h-auto w-[98px] lg:w-auto"
                  />
                </div>
                <h3 className="mt-2 text-center text-[16px] leading-[1.4] font-bold text-black lg:mt-0 lg:text-[20px] lg:leading-[26px]">
                  {card.title.map((line, li) => (
                    <span
                      key={line}
                      className={`block ${ci === 0 ? "tracking-[0.03em]" : ""} ${
                        // Wix sets this one line in a thin, slanted face (Bree Thin Oblique).
                        ci === 2 && li === 1 ? "font-normal italic" : ""
                      }`}
                    >
                      {li > 0 && " "}
                      {line}
                    </span>
                  ))}
                </h3>
                <div className="mt-4 space-y-[1.4em] text-[15px] leading-[1.5] text-[#414141] lg:mt-[23px] lg:space-y-[22.4px] lg:text-[16px] lg:leading-[22.4px]">
                  {card.paragraphs.map((para, pi) =>
                    ci === 1 && pi === 0 ? (
                      // On Wix the opening "I" of this card is in the Forum font, a size larger.
                      <p key={pi} className="lg:leading-[25.2px]">
                        <span className="font-[family-name:var(--wix-forum)] text-[16px] lg:text-[18px]">{para.slice(0, 1)}</span>
                        {para.slice(1)}
                      </p>
                    ) : (
                      <p key={pi}>{para}</p>
                    ),
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 7. The Working Peace Blueprint: four numbered steps on white. */}
      <section className="bg-white px-4 pt-3 pb-8 lg:h-[593px] lg:px-0 lg:pt-[43px] lg:pb-0">
        <div className="mx-auto max-w-[980px] text-[#414141]">
          <h2 className="text-center text-[32px] leading-[1.15] font-bold lg:text-[50px] lg:leading-[42px]">{blueprint.title}</h2>
          <p className="mt-2 text-center text-[22px] leading-[1.4] lg:mt-[6px] lg:text-[30px] lg:leading-[42px]">
            {splitAfter(blueprint.intro, "write their").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
          <ol className="mt-4 grid gap-8 lg:mx-auto lg:mt-[7px] lg:w-[959px] lg:grid-cols-4 lg:gap-[33px]">
            {blueprint.steps.map((step, si) => {
              const icon = img.stepIcons[si];
              return (
                <li key={step.number}>
                  {/* Wix lines up the icons by their tops, with the larger fourth icon 9 pixels higher. */}
                  <div className={`flex justify-center lg:h-[123px] lg:items-start ${si === 3 ? "" : "lg:pt-[9px]"}`}>
                    <Image
                      src={icon.src}
                      width={icon.width}
                      height={icon.height}
                      alt=""
                      // Phones draw the icons at 80% of their desktop size, as Wix does.
                      className="h-auto w-[var(--phone-w)] lg:w-auto"
                      style={{ "--phone-w": `${Math.round(icon.width * 0.8)}px` } as React.CSSProperties}
                    />
                  </div>
                  <h3 className="mt-1 text-center text-[21px] leading-[1.3] font-bold tracking-[0.05em] text-[#282626] lg:mt-[-12px] lg:text-[20px] lg:leading-[27px]">
                    <span className="block">{step.number}</span>
                    <span className="block"> {step.title}</span>
                  </h3>
                  <p className="mt-2 text-center text-[15px] leading-[1.45] lg:mt-[8px] lg:text-left lg:text-[14px] lg:leading-[19.6px]">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 8. The closing band, cream on the homepage. */}
      <AssessmentBand background="#F4EFEB" />
    </>
  );
}

/**
 * One panel logo in Wix's "iron" frame: a 12-pixel textured white border,
 * a soft drop shadow, a faint white inner glow, and a screw in each corner.
 */
function PanelTile({
  logo,
  caption,
}: {
  logo: (typeof wixHomeImages.panelLogos)[number];
  caption?: string;
}) {
  const frame = wixHomeImages.tileFrame;
  const screws = ["top-[5px] left-[5px]", "top-[5px] right-[5px]", "bottom-[5px] left-[5px]", "bottom-[5px] right-[5px]"];
  return (
    <div
      className="relative rounded-[2px] bg-white p-[12px] shadow-[0_2px_5px_rgba(0,0,0,0.53)]"
      style={{ backgroundImage: `url(${frame.texture})` }}
    >
      <Image
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt={logo.alt}
        className="block object-cover"
        style={{ width: shrink(logo.drawnWidth), aspectRatio: `${logo.drawnWidth} / ${logo.drawnHeight}`, height: "auto" }}
      />
      {caption && (
        <span
          className="absolute inset-x-0 text-center font-[family-name:var(--wix-caudex)] leading-[1.4] font-bold whitespace-nowrap text-[#414141]"
          style={{ fontSize: `max(8px, ${shrink(16)})`, bottom: shrink(9) }}
        >
          {caption}
        </span>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[2px] shadow-[inset_0_0_6px_rgba(255,255,255,0.59),inset_0_1px_0_rgba(255,255,255,0.92),inset_0_0_5px_rgba(255,255,255,0.2)]"
      />
      {screws.map((pos) => (
        <Image
          key={pos}
          src={frame.screw}
          width={15}
          height={15}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute ${pos}`}
        />
      ))}
    </div>
  );
}
