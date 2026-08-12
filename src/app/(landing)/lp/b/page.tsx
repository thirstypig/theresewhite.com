import type { Metadata } from "next";
import Image from "next/image";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { LandingContactForm } from "@/components/landing-contact-form";
import { pageMetadata } from "@/lib/page-metadata";
import {
  calculator,
  contact,
  credentials,
  endorsements,
  landing,
  portrait,
  proof,
} from "@/content/site";

/**
 * Variant B — the live theresewhite.com identity.
 *
 * Values were read off the live Wix site rather than guessed: #0D63D1 is its
 * nav blue, #2E92E5 its button blue, #3D9BE9 its section bands, headlines and
 * body are both Arial (bold for headlines), and its buttons are full pills. All
 * of that lives in the `.lp-wix` scope in globals.css, which overrides the
 * design tokens so the shared calculator and form re-theme themselves rather
 * than being forked.
 *
 * Two deliberate departures from the live site, both because it is a landing
 * page and not a brochure:
 *
 *  - Body copy and bullets are left-aligned. The live site centres several
 *    multi-line blocks, which gives the eye no consistent left edge to return
 *    to and measurably slows scanning.
 *  - One primary action rather than a menu of them.
 *
 * The headline face is Arial Bold, not a serif. The live site's h1 declares
 * Caudex, but every visible string sits in a span that overrides it with
 * Arial Bold, so the wrapper's font never renders. Reading the wrapper rather
 * than the rendered text is how the first version of this page got it wrong.
 */
export const metadata: Metadata = pageMetadata({
  title: landing.hero.headline,
  description:
    "Put a number on what an unresolved workplace conflict has already cost you, and what it costs over the next twelve months if nothing changes.",
  path: "/lp/b",
  noindex: true,
});

export default function LandingB() {
  return (
    <div className="lp-wix lp-lock bg-paper">
      {/* ---------------- Above the fold ---------------- */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <p className="label text-slate">{landing.hero.eyebrow}</p>
              <h1 className="display-wix mt-4 text-4xl text-charcoal sm:text-5xl">
                {landing.hero.headline}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal">
                {landing.hero.sub}
              </p>

              {/* The live site states these as blue pills. Kept, because they
                  are the clearest thing on that page. */}
              <div className="mt-8 flex flex-wrap gap-3">
                {proof.map((p) => (
                  <p
                    key={p.label}
                    className="rounded-sm bg-btn px-5 py-2.5 text-base font-bold text-btn-fg"
                  >
                    {p.figure} {p.label}
                  </p>
                ))}
              </div>

              <div className="mt-9">
                <a
                  href="#calculate"
                  className="inline-block rounded-sm bg-btn px-8 py-4 text-base font-bold tracking-wide text-btn-fg uppercase transition-colors hover:bg-btn-hover"
                >
                  {landing.hero.cta}
                </a>
                <p className="mt-3 text-sm text-muted">{landing.hero.ctaNote}</p>
              </div>
            </div>

            <div className="order-first lg:order-last">
              <Image
                src={portrait.src}
                width={portrait.width}
                height={portrait.height}
                alt={portrait.alt}
                priority
                /* Small on a phone so the headline, proof and button still
                    fit the first screen; full size once there is a column
                    beside it. */
                className="mx-auto h-auto w-36 sm:w-48 lg:w-full lg:max-w-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Credibility strip ---------------- */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-7">
          <p className="label text-slate">{credentials.title}</p>
          <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
            {credentials.panels.map((p) => (
              <li key={p.name} className="text-sm text-charcoal">
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- The tool: the primary conversion ---------------- */}
      <div id="calculate" className="scroll-mt-4">
        <ConflictCalculator
          className="border-b border-rule bg-cream"
          fontClass="display-wix"
          ctaHref="#talk"
          ctaLabel="Talk to Therese"
        />
      </div>

      {/* ---------------- The blue band, as the live site uses it --------- */}
      <section className="on-dark border-b border-rule bg-band">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <blockquote className="display-wix text-xl leading-relaxed text-band-fg sm:text-2xl">
            &ldquo;For genuine, deep, and lasting resolutions in any employment
            setting, Therese should be your first choice.&rdquo;
          </blockquote>
          <p className="label mt-6 text-band-muted">
            {endorsements.items[1].name} &mdash; nearly 50 years in conflict
            resolution
          </p>
        </div>
      </section>

      {/* ---------------- What the number means ---------------- */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="display-wix text-3xl text-heading">
            {calculator.understanding.title}
          </h2>
          <div className="mt-5 space-y-4">
            {calculator.understanding.body.map((para) => (
              <p key={para} className="text-base leading-relaxed text-charcoal">
                {para}
              </p>
            ))}
          </div>
          <ul className="mt-8 space-y-2.5">
            {calculator.understanding.considerations.map((point) => (
              <li
                key={point}
                className="border-l-2 border-rule-strong pl-4 text-base leading-relaxed text-charcoal"
              >
                {point}
              </li>
            ))}
          </ul>

          <h2 className="display-wix mt-16 text-3xl text-heading">
            {calculator.nextSteps.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal">
            {calculator.nextSteps.intro}
          </p>
          <dl className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {calculator.nextSteps.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-4">
                <dt className="display-wix text-lg text-heading">
                  {item.name}
                </dt>
                <dd className="mt-2 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Secondary path, deliberately quieter ---------- */}
      <section id="talk" className="scroll-mt-4 border-b border-rule bg-cream">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="display-wix text-3xl text-heading">
            {landing.talk.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal">
            {landing.talk.intro}
          </p>
          <div className="mt-9">
            <LandingContactForm source="lp-b" />
          </div>
        </div>
      </section>

      <footer className="on-dark bg-band text-band-fg">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="display-wix text-2xl text-band-fg">{contact.name}</p>
          <p className="label mt-2 text-band-muted">
            {contact.roles.join(" · ")}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <li>
              <a href={contact.phoneHref} className="hover:underline">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.emailHref} className="hover:underline">
                {contact.email}
              </a>
            </li>
          </ul>
          <p className="mt-8 border-t border-band-rule pt-6 text-xs leading-relaxed text-band-muted">
            {calculator.disclaimer.body}
          </p>
          <p className="mt-4 text-xs text-band-muted">
            Copyright {contact.name} {new Date().getFullYear()}.{" "}
            {landing.foot.note}
          </p>
        </div>
      </footer>
    </div>
  );
}
