import type { Metadata } from "next";
import Image from "next/image";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { pageMetadata } from "@/lib/page-metadata";
import { liveSite } from "@/content/site";
import { wixHome } from "@/content/wix-home";
import { homeNew } from "@/content/home-new";
import s from "./home-new.module.css";

/**
 * Design sample, third column of /stylebible/compare/: the homepage with
 * proposed new copy AND a new layout. Column two (/stylebible/home/) keeps
 * the Wix words and changes only the design; this one changes both, so the
 * two can be judged separately.
 *
 * The copy is a proposal, not approved, and lives in
 * `src/content/home-new.ts`, whose header lists where every fact comes from.
 * The panel logos and the calculator address are shared with the Wix copy.
 *
 * Unlinked and noindex, like the rest of /stylebible. Links go to the live
 * Wix pages, so nothing here points at the rebuild's own pages.
 */
export const metadata: Metadata = pageMetadata({
  title: "Homepage Sample, New Copy",
  description:
    "A proposed theresewhite.com homepage with new copy and a modern layout, for comparison with the Wix original.",
  path: "/stylebible/home-new",
  noindex: true,
});

const serif = Source_Serif_4({
  variable: "--new-serif",
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Source_Sans_3({
  variable: "--new-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const link = (label: string) => liveSite.nav.find((n) => n.label === label)!.href;
const CONTACT = link("Contact");

function Check() {
  return (
    <span className={s.check} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8.5l3 3 7-7" />
      </svg>
    </span>
  );
}

export default function HomeNewSamplePage() {
  const { header, hero, proof, symptoms, cost, quote, blueprint, reasons, endorsements, panels, expect, close } = homeNew;

  return (
    <div className={`lp-lock ${s.page} ${serif.variable} ${sans.variable}`}>
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
              {header.button}
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero: the problem in her buyer's words, one action, reassurance under it. */}
        <section>
          <div className={`${s.wrap} ${s.hero}`}>
            <div className={s.heroCopy}>
              <p className={s.eyebrow}>{hero.eyebrow}</p>
              <h1 className={`${s.serif} ${s.heroTitle}`}>{hero.title}</h1>
              <p className={s.lead}>{hero.lead}</p>
              <div className={s.actions}>
                <a className={s.button} href={CONTACT}>
                  {hero.primary}
                </a>
                <a className={`${s.button} ${s.buttonGhost}`} href={wixHome.calculator.href}>
                  {hero.secondary}
                </a>
              </div>
              <p className={`${s.reassure} ${s.small}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                {hero.reassurance}
              </p>
            </div>
            <div className={s.portraitFrame}>
              <Image src="/therese-white.webp" width={749} height={900} alt="L. Therese White" priority />
            </div>
          </div>
        </section>

        {/* Proof directly under the hero, where a skeptical buyer looks next. */}
        <div className={s.proofStrip}>
          <div className={s.wrap}>
            <ul className={s.proof}>
              {proof.map((p) => (
                <li key={p.figure}>
                  <span className={s.figure}>{p.figure}</span>
                  <span className={s.figureLabel}>{p.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panels right under the proof: the credentials a stranger checks first. */}
        <section className={s.panelsBand}>
          <div className={s.wrap}>
            <h2 className={s.panelsHead}>{panels.title}</h2>
            <div className={s.logos}>
              {wixHome.panels.logos.map((logo) => (
                <Image key={logo.src} src={logo.src} width={440} height={220} alt={logo.alt} />
              ))}
            </div>
          </div>
        </section>

        {/* Symptoms: lets the visitor recognize their own situation. */}
        <section className={s.section}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <p className={s.eyebrow}>{symptoms.eyebrow}</p>
              <h2 className={`${s.serif} ${s.h2}`}>{symptoms.title}</h2>
            </div>
            <div className={s.grid3}>
              {symptoms.items.map((item, i) => (
                <article key={item.title} className={s.card}>
                  <span className={s.cardNumber}>0{i + 1}</span>
                  <h3 className={s.h3}>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Cost: the business case, and the second way in for a buyer not ready to call. */}
        <section className={`${s.section} ${s.navy}`}>
          <div className={`${s.wrap} ${s.cost}`}>
            <div className={s.costText}>
              <h2 className={`${s.serif} ${s.h2}`}>{cost.title}</h2>
              <p className={s.lead}>{cost.body}</p>
            </div>
            <div className={s.costAction}>
              <a className={`${s.button} ${s.buttonLight}`} href={wixHome.calculator.href}>
                {cost.button}
              </a>
              <p className={s.small}>{cost.fineprint}</p>
            </div>
          </div>
        </section>

        {/* Her line and her voice. */}
        <section className={`${s.section} ${s.cream}`}>
          <div className={`${s.wrap} ${s.quoteGrid}`}>
            <div className={s.quoteText}>
              <p className={`${s.serif} ${s.bigQuote}`}>&ldquo;{quote.text}&rdquo;</p>
              <p className={s.lead}>{quote.body}</p>
              <p className={s.small}>{quote.disclosure}</p>
            </div>
            <a className={s.video} href={wixHome.quoteBand.videoUrl} aria-label="Watch the video on YouTube">
              <Image src="/stylebible/img/video-poster.jpg" width={960} height={540} alt="" />
              <span className={s.play}>
                <span>
                  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" fill="#1a78c9" />
                  </svg>
                </span>
              </span>
            </a>
          </div>
        </section>

        {/* How it works. */}
        <section className={s.section}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <p className={s.eyebrow}>{blueprint.eyebrow}</p>
              <h2 className={`${s.serif} ${s.h2}`}>{blueprint.title}</h2>
              <p className={s.lead}>{blueprint.intro}</p>
            </div>
            <ol className={s.steps}>
              {blueprint.steps.map((step, i) => (
                <li key={step.title} className={s.step}>
                  <span className={s.stepNumber}>{i + 1}</span>
                  <h3 className={s.h3}>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why her. */}
        <section className={`${s.section} ${s.cream}`}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <p className={s.eyebrow}>{reasons.eyebrow}</p>
              <h2 className={`${s.serif} ${s.h2}`}>{reasons.title}</h2>
            </div>
            <div className={s.grid3}>
              {reasons.items.map((item) => (
                <article key={item.title} className={s.card}>
                  <h3 className={s.h3}>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Peers vouching for her. */}
        <section className={s.section}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <p className={s.eyebrow}>{endorsements.eyebrow}</p>
            </div>
            <div className={s.quotes}>
              {endorsements.items.map((e) => (
                <figure key={e.name} className={s.endorse}>
                  <blockquote>&ldquo;{e.quote}&rdquo;</blockquote>
                  <figcaption>
                    <strong>{e.name}</strong>
                    <span className={s.small}>{e.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className={s.endorseLink}>
              <a className={s.textLink} href={link("Endorsements")}>
                {endorsements.link}
              </a>
            </p>
          </div>
        </section>

        {/* What happens next, with the price stated plainly. */}
        <section className={`${s.section} ${s.cream}`}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <p className={s.eyebrow}>{expect.eyebrow}</p>
              <h2 className={`${s.serif} ${s.h2}`}>{expect.title}</h2>
            </div>
            <div className={s.expect}>
              <div className={s.priceCard}>
                <p className={s.small}>{expect.price.label}</p>
                <p className={s.price}>{expect.price.figure}</p>
                <p className={s.small}>{expect.price.note}</p>
              </div>
              <ul className={s.expectList}>
                {expect.items.map((item) => (
                  <li key={item.title}>
                    <Check />
                    <h3 className={s.h3}>{item.title}</h3>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.navy}`}>
          <div className={`${s.wrap} ${s.close}`}>
            <h2 className={`${s.serif} ${s.h2}`}>{close.title}</h2>
            <p className={s.lead}>{close.body}</p>
            <a className={`${s.button} ${s.buttonLight}`} href={CONTACT}>
              {close.button}
            </a>
            <p className={`${s.small} ${s.urgent}`}>
              {close.urgent} <a href={close.phoneHref}>{close.phone}</a>.
            </p>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footerInner}`}>
          <div>
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
