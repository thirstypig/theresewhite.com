import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import { pageMetadata } from "@/lib/page-metadata";
import { liveSite } from "@/content/site";
import { wixHome } from "@/content/wix-home";
import s from "./home-sample.module.css";

/**
 * Design sample: the live Wix homepage, word for word and in the same order,
 * redrawn in the style bible's Recommended system (six colors, six text
 * sizes, one button style).
 *
 * The point is to judge the design alone, so the copy is frozen. Every word
 * comes from `src/content/wix-home.ts`, including button labels such as
 * "Click Here" that the style bible's red team would change. Copy is a
 * separate, later conversation.
 *
 * Unlinked and noindex, like /stylebible itself. It is meant to be seen next
 * to the Wix original at /stylebible/compare/. Links go to the live Wix
 * pages of the same name, so nothing here points at the rebuild's own pages.
 */
export const metadata: Metadata = pageMetadata({
  title: "Homepage Sample",
  description:
    "The theresewhite.com homepage, word for word, redrawn in the style bible's recommended design.",
  path: "/stylebible/home",
  noindex: true,
});

// The font files are stored in src/fonts, so the build never downloads them.
const sampleSerif = localFont({
  src: [
    { path: "../../../../fonts/source-serif-4/source-serif-4-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../../../../fonts/source-serif-4/source-serif-4-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--sample-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

// One file serves all three weights, exactly as Google Fonts sends it.
const sampleSans = localFont({
  src: [
    { path: "../../../../fonts/source-sans-3/source-sans-3-latin-400-700.woff2", weight: "400", style: "normal" },
    { path: "../../../../fonts/source-sans-3/source-sans-3-latin-400-700.woff2", weight: "600", style: "normal" },
    { path: "../../../../fonts/source-sans-3/source-sans-3-latin-400-700.woff2", weight: "700", style: "normal" },
    { path: "../../../../fonts/source-sans-3/source-sans-3-latin-400-700-italic.woff2", weight: "400", style: "italic" },
    { path: "../../../../fonts/source-sans-3/source-sans-3-latin-400-700-italic.woff2", weight: "600", style: "italic" },
    { path: "../../../../fonts/source-sans-3/source-sans-3-latin-400-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--sample-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

const CONTACT = liveSite.nav.find((n) => n.label === "Contact")!.href;

/** Simple line icons for the three reasons cards, in place of Wix's images. */
function Icon({ name }: { name: "briefcase" | "thumb" | "tools" }) {
  const paths = {
    briefcase: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
    thumb: "M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7",
    tools: "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z",
  } as const;
  return (
    <span className={s.icon} aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[name]} />
      </svg>
    </span>
  );
}

function AssessmentCta({ center = false }: { center?: boolean }) {
  return (
    <div className={`${s.ctaBlock} ${center ? s.center : ""}`} style={center ? { justifyItems: "center" } : undefined}>
      <p className={`${s.smallHeading}`} style={{ margin: 0 }}>
        {wixHome.cta.lines[0]}
        <br />
        {wixHome.cta.lines[1]}
      </p>
      <a className={s.button} href={CONTACT}>
        {wixHome.cta.button}
      </a>
    </div>
  );
}

export default function HomeSamplePage() {
  const { hero, whereIWork, calculator, quoteBand, beforeWeTalk, panels, reasons, blueprint } = wixHome;

  return (
    <div className={`lp-lock ${s.page} ${sampleSerif.variable} ${sampleSans.variable}`}>
      <header className={s.header}>
        <div className={`${s.wrap} ${s.headerInner}`}>
          <a href={liveSite.home} aria-label="L. Therese White, home">
            <Image className={s.logo} src="/brand/therese-white-logo.webp" width={560} height={243} alt="L. Therese White, Employment Mediator, Workplace Conflict Coach" priority />
          </a>
          <nav className={s.nav} aria-label="Main">
            {liveSite.nav
              .filter((n) => n.label !== "Contact")
              .map((n) => (
                <a key={n.href} href={n.href}>
                  {n.label}
                </a>
              ))}
            <a className={`${s.button} ${s.buttonSmall}`} href={CONTACT}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className={s.cream}>
        <div className={`${s.wrap} ${s.hero}`}>
          <div className={s.heroCopy}>
            <h1 className={`${s.serif} ${s.display}`}>{hero.question}</h1>
            <ul className={s.bullets}>
              {hero.bullets.map((b) => (
                <li key={b.before}>
                  {b.before}
                  {"em" in b && <em>{b.em}</em>}
                  {"after" in b && b.after}
                </li>
              ))}
            </ul>
            <p className={s.tagline}>
              <em>{hero.tagline}</em>
            </p>
            <AssessmentCta />
            <div className={s.proof}>
              {hero.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
          </div>
          <Image className={s.portrait} src="/therese-white.webp" width={749} height={900} alt="L. Therese White" priority />
        </div>
      </section>

      {/* Where I work */}
      <section className={s.section}>
        <div className={`${s.wrap} ${s.stackTight} ${s.center}`}>
          <h2 className={`${s.serif} ${s.sectionTitle}`}>{whereIWork.title}</h2>
          <p className={`${s.reading} ${s.centerBlock}`}>{whereIWork.body}</p>
        </div>
      </section>

      {/* Calculator */}
      <section className={`${s.section} ${s.navy}`}>
        <div className={s.wrap}>
          <div className={s.calcCard}>
            <h2 className={`${s.serif} ${s.title} ${s.costTitle}`}>
              {calculator.costTitle.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < calculator.costTitle.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <div className={s.calcSide}>
              <p className={s.smallHeading}>
                {calculator.tryLead}
                <em>{calculator.tryName}</em>
              </p>
              <p aria-hidden="true" className={s.small}>
                {calculator.divider}
              </p>
              <p>
                {calculator.body[0]} {calculator.body[1]}
                <br />
                {calculator.body[2]}
              </p>
              <a className={`${s.button} ${s.buttonOutline}`} href={calculator.href}>
                {calculator.button}
              </a>
              <p className={s.small}>{calculator.fineprint}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote, video, what to know */}
      <section className={`${s.section} ${s.cream}`}>
        <div className={`${s.wrap} ${s.stack}`}>
          <div className={`${s.stackTight} ${s.center}`}>
            <p className={s.smallHeading}>{quoteBand.lead}</p>
            <p className={`${s.serif} ${s.title} ${s.quote}`}>{quoteBand.quote}</p>
            <p className={s.smallHeading}>{quoteBand.tail}</p>
          </div>
          <p className={`${s.small} ${s.center} ${s.reading} ${s.centerBlock}`}>
            <strong>{quoteBand.disclosure}</strong>
          </p>
          <a className={s.videoLink} href={quoteBand.videoUrl} aria-label="Watch the video on YouTube">
            <Image src="/stylebible/img/video-poster.jpg" width={960} height={540} alt="" />
            <span className={s.play}>
              <span>
                <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" fill="#1a78c9" />
                </svg>
              </span>
            </span>
          </a>
          <div className={`${s.stackTight} ${s.reading} ${s.centerBlock}`}>
            <h2 className={`${s.serif} ${s.sectionTitle} ${s.center}`}>{beforeWeTalk.title}</h2>
            <ul className={s.checklist}>
              {beforeWeTalk.items.map((item, i) => (
                <li key={i}>
                  {"text" in item ? (
                    item.text
                  ) : (
                    <>
                      {item.before}
                      <strong>
                        <em>{item.strong}</em>
                      </strong>
                      {item.after}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Panels */}
      <section className={s.section}>
        <div className={`${s.wrap} ${s.stack}`}>
          <h2 className={`${s.serif} ${s.sectionTitle} ${s.center}`}>{panels.title}</h2>
          <div className={s.logos}>
            {panels.logos.map((logo) => (
              <Image key={logo.src} src={logo.src} width={440} height={220} alt={logo.alt} />
            ))}
          </div>
        </div>
      </section>

      {/* Three reasons */}
      <section className={`${s.section} ${s.navy}`}>
        <div className={`${s.wrap} ${s.stack}`}>
          <h2 className={`${s.serif} ${s.sectionTitle} ${s.center}`}>
            {reasons.title[0]}
            <br />
            {reasons.title[1]}
          </h2>
          <div className={s.cards}>
            {reasons.cards.map((card) => (
              <article key={card.title[0]} className={s.card}>
                <Icon name={card.icon} />
                <h3 className={s.smallHeading}>
                  {card.title[0]}
                  <br />
                  {card.title[1]}
                </h3>
                {card.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprint */}
      <section className={s.section}>
        <div className={`${s.wrap} ${s.stack}`}>
          <div className={`${s.stackTight} ${s.center}`}>
            <h2 className={`${s.serif} ${s.sectionTitle}`}>{blueprint.title}</h2>
            <p className={`${s.reading} ${s.centerBlock}`}>{blueprint.intro}</p>
          </div>
          <ol className={s.steps}>
            {blueprint.steps.map((step) => (
              <li key={step.number} className={s.step}>
                <span className={s.stepNumber}>{step.number}</span>
                <h3 className={s.smallHeading}>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing call to action */}
      <section className={`${s.section} ${s.cream}`}>
        <div className={s.wrap}>
          <AssessmentCta center />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footerInner}`}>
          <div className={s.stackTight} style={{ gap: 2 }}>
            {liveSite.footer.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>
              <a href={`mailto:${liveSite.footer.email}`}>{liveSite.footer.email}</a>
            </p>
            <p>{liveSite.footer.phone}</p>
            <p style={{ marginTop: 16 }}>{liveSite.footer.copyright}</p>
          </div>
          <div className={s.footerLegal}>
            <p>
              <strong>{liveSite.footer.legalTitle}</strong>
            </p>
            {liveSite.footer.legal.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
