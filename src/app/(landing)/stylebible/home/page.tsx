import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import { pageMetadata } from "@/lib/page-metadata";
import { liveSite } from "@/content/site";
import { wixHomeImages } from "@/content/wix-home";
import { wixHomeCurrent } from "@/content/wix-home-current";
import s from "./home-sample.module.css";

/**
 * Design sample (version 2 on /stylebible/compare/): the live Wix homepage
 * as of 2026-11-20, word for word and in the same order, redrawn in the
 * style bible's Recommended system.
 *
 * The point is to judge the design alone, so the copy is frozen. Every word
 * comes from `src/content/wix-home-current.ts`, including button labels such
 * as "Click Here" that the style bible's red team would change. Copy is a
 * separate, later conversation.
 *
 * Every color, size, gap, corner and shadow used here is one of the values
 * in the "Recommended system" chapter of docs/style-bible/index.html. If
 * a value here changes, change it there too.
 *
 * Unlinked and noindex, like /stylebible itself. Links go to the live Wix
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

/** Line icons drawn in the one icon style: 24-pixel grid, 1.8-pixel stroke. */
const ICONS = {
  briefcase: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  thumb: "M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7",
  tools: "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  play: "M8 5v14l11-7z",
  calculator: "M6 3h12v18H6zM9 7h6M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01",
} as const;

function Icon({ name, className }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={ICONS[name]} />
      </svg>
    </span>
  );
}

function AssessmentCta({ onDark = false, center = false }: { onDark?: boolean; center?: boolean }) {
  const { cta } = wixHomeCurrent;
  return (
    <div className={`${s.cta} ${center ? s.ctaCenter : ""}`}>
      <p className={s.ctaLines}>
        {cta.lines[0]}
        <br />
        {cta.lines[1]}
      </p>
      <a className={`${s.button} ${onDark ? s.buttonOnDark : ""}`} href={cta.href}>
        {cta.button}
      </a>
    </div>
  );
}

export default function HomeSamplePage() {
  const { hero, quoteBand, calculator, beforeWeTalk, guide, reasons, panels, blueprint } = wixHomeCurrent;

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
                <a key={n.href} className={s.navLink} href={n.href}>
                  {n.label}
                </a>
              ))}
          </nav>
          <a className={`${s.button} ${s.buttonSmall} ${s.headerButton}`} href={CONTACT}>
            Contact
          </a>
        </div>
      </header>

      <main>
        {/* 1. Opening */}
        <section className={`${s.hero} ${s.cream}`}>
          <div className={`${s.wrap} ${s.heroGrid}`}>
            <div className={s.heroCopy}>
              <p className={s.eyebrow}>{hero.eyebrow}</p>
              <h1 className={s.display}>{hero.headline}</h1>
              <p className={s.lead}>{hero.lead}</p>
              <AssessmentCta />
              <dl className={s.stats}>
                {hero.stats.map((stat) => (
                  <div key={stat.figure} className={s.stat}>
                    <dt className={s.statFigure}>{stat.figure}</dt>
                    <dd className={s.statLabel}>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={s.portraitPanel}>
              <Image className={s.portrait} src="/wix/home/therese-portrait-red-jacket.webp" width={960} height={1088} alt="L. Therese White, smiling, in a red jacket" priority />
            </div>
          </div>
        </section>

        {/* 2. Quote and video */}
        <section className={`${s.section} ${s.navy}`}>
          <div className={`${s.wrap} ${s.stack} ${s.center}`}>
            <div className={s.stackTight}>
              <p className={s.kicker}>{quoteBand.lead}</p>
              <p className={s.quote}>{quoteBand.quote}</p>
              <p className={s.kicker}>{quoteBand.tail}</p>
            </div>
            <figure className={s.videoFigure}>
              <a className={s.video} href={quoteBand.videoUrl} aria-label="Watch the video on YouTube">
                <Image src="/stylebible/img/video-poster.jpg" width={960} height={540} alt="" />
                <span className={s.play}>
                  <Icon name="play" />
                </span>
              </a>
              <figcaption className={s.small}>
                <strong>{quoteBand.disclosure}</strong>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 3. Calculator */}
        <section className={s.section}>
          <div className={s.wrap}>
            {/* Two halves of one card: the question on navy, the answer on white.
                Wix's three heading lines run together here; the last line keeps
                the red family Wix uses, lightened so it reads on navy. */}
            <div className={s.calcCard}>
              <div className={s.calcLead}>
                <Icon name="calculator" className={s.calcIcon} />
                <h2 className={s.costTitle}>
                  {calculator.costTitle[0]} {calculator.costTitle[1]}{" "}
                  <span className={s.costAccent}>{calculator.costTitle[2]}</span>
                </h2>
              </div>
              <div className={s.calcSide}>
                <p className={s.smallHeading}>
                  {calculator.tryLead}
                  <em className={s.costName}>{calculator.tryName}</em>
                </p>
                <p>
                  {calculator.body[0]} {calculator.body[1]}
                </p>
                <p className={s.calcNote}>{calculator.body[2]}</p>
                <a className={s.button} href={calculator.href}>
                  {calculator.button}
                </a>
                <p className={s.small}>{calculator.fineprint}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. What to know */}
        <section className={`${s.section} ${s.cream}`}>
          <div className={`${s.wrap} ${s.split}`}>
            <h2 className={s.sectionTitle}>{beforeWeTalk.title}</h2>
            <ul className={s.checklist}>
              {beforeWeTalk.items.map((item, i) => (
                <li key={i}>
                  <Icon name="check" className={s.checkIcon} />
                  <span>
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
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Free guide */}
        <section className={s.section}>
          <div className={`${s.wrap} ${s.guide}`}>
            <div className={s.guideCopy}>
              <p className={s.guideLabel}>
                {guide.label}
                <em>{guide.name}</em>
              </p>
              <p className={s.guideSubtitle}>
                <strong>
                  <em>{guide.subtitle}</em>
                </strong>
              </p>
              <h2 className={s.sectionTitle}>{guide.title}</h2>
              <p className={s.reading}>{guide.body}</p>
              <a className={s.button} href={guide.href}>
                {guide.button}
              </a>
            </div>
            <Image className={s.cover} src={guide.cover.src} width={guide.cover.width} height={guide.cover.height} alt={guide.cover.alt} />
          </div>
        </section>

        {/* 6. Three reasons */}
        <section className={`${s.section} ${s.navy}`}>
          <div className={`${s.wrap} ${s.stack}`}>
            <h2 className={`${s.sectionTitle} ${s.center}`}>
              {reasons.title[0]}
              <br />
              {reasons.title[1]}
            </h2>
            <div className={s.cards}>
              {reasons.cards.map((card) => (
                <article key={card.title[0]} className={s.card}>
                  <Icon name={card.icon} className={s.iconChip} />
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

        {/* 7. Panels */}
        {/* One quiet row of grey logos, as in version 3: proof that should
            reassure without competing with the reasons above it. */}
        <section className={`${s.section} ${s.sectionCompact}`}>
          <div className={`${s.wrap} ${s.stack}`}>
            <h2 className={s.panelsTitle}>{panels.title}</h2>
            <ul className={s.logos}>
              {panels.logos.map((logo) => (
                <li key={logo.src} className={s.logoItem}>
                  <Image src={logo.src} width={440} height={220} alt={logo.alt} />
                  {/* On Wix this line is live text under the Ken Cloke logo, not part of the picture. */}
                  {logo.src === "/logos/cloke.png" && <span className={s.logoCaption}>{wixHomeImages.clokeCaption}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Blueprint */}
        <section className={`${s.section} ${s.cream}`}>
          <div className={`${s.wrap} ${s.stack}`}>
            <div className={`${s.stackTight} ${s.center}`}>
              <h2 className={s.sectionTitle}>{blueprint.title}</h2>
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

        {/* 9. Closing call to action */}
        <section className={`${s.section} ${s.navy}`}>
          <div className={s.wrap}>
            <AssessmentCta onDark center />
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footerInner}`}>
          <div className={s.footerBlock}>
            {liveSite.footer.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>
              <a href={`mailto:${liveSite.footer.email}`}>{liveSite.footer.email}</a>
            </p>
            <p>{liveSite.footer.phone}</p>
            <p className={s.copyright}>{liveSite.footer.copyright}</p>
          </div>
          <div className={`${s.footerBlock} ${s.footerLegal}`}>
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
