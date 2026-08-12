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
 * Variant A — conventional high-converting landing page, in the rebuild's
 * palette (deep teal, cream, sand, Fraunces).
 *
 * Laid out the way a professional-services campaign page is supposed to be,
 * because the goal is conversion rather than novelty:
 *
 *  - Everything a cold visitor needs sits in the first screen: what this is,
 *    who is asking, why to trust her, and one button.
 *  - The hero is a single centered column — portrait, headline, proof and
 *    button on one vertical axis, so nothing competes for where the eye
 *    starts, and mobile is the same composition at a narrower width rather
 *    than a second layout.
 *  - Headings stay centered below the fold, but their body copy is
 *    left-aligned. Centered paragraphs give the eye no consistent left edge
 *    to return to on each line, which is fine for a headline and costly for
 *    a paragraph.
 *  - One primary action. The calculator already captures an email to unlock
 *    the projection, so it IS the conversion. The plain form sits lower and
 *    quieter for people who won't use a tool.
 *  - The call to action appears three times: above the fold, immediately
 *    after the result, and at the end.
 *
 * `lp-lock` pins the light palette. This is a brand-controlled campaign page,
 * so what Therese approves is what every visitor sees.
 */
export const metadata: Metadata = pageMetadata({
  title: landing.hero.headline,
  description:
    "Put a number on what an unresolved workplace conflict has already cost you, and what it costs over the next twelve months if nothing changes.",
  path: "/lp/a",
  noindex: true,
});

export default function LandingA() {
  return (
    <div className="lp-lock bg-paper">
      {/* ----------------------------------------------------------------
          Above the fold — a single centered column.

          Centering the hero puts the headline, the face and the button on one
          vertical axis, so there is no competition for where the eye starts.
          It also means the mobile and desktop compositions are the same thing
          at two widths rather than two different layouts.

          The centering stops at the hero. Section headings below stay
          centered, but their body copy is left-aligned: centered paragraphs
          give the eye no consistent left edge to return to on each line.
          ---------------------------------------------------------------- */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center sm:py-16">
          <Image
            src={portrait.src}
            width={portrait.width}
            height={portrait.height}
            alt={portrait.alt}
            priority
            className="mx-auto h-auto w-40 sm:w-52"
          />

          <p className="label mt-6 text-muted">{landing.hero.eyebrow}</p>
          <h1 className="display mt-3 text-[2rem] leading-[1.1] text-heading sm:text-5xl">
            {landing.hero.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-charcoal">
            {landing.hero.sub}
          </p>

          {/* Proof sits with the button, not in a band of its own. Its job is
              to answer "who is asking?" at the moment of the click. */}
          <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {proof.map((p) => (
              <p key={p.label} className="text-base text-charcoal">
                <span className="display text-xl text-heading">{p.figure}</span>{" "}
                {p.label.toLowerCase()}
              </p>
            ))}
          </div>

          <div className="mt-8">
            {/* Full-width on mobile: a thumb reaches the edges of a phone more
                reliably than the middle of a short button. */}
            <a
              href="#calculate"
              className="inline-block w-full rounded-sm bg-btn px-8 py-4 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover sm:w-auto"
            >
              {landing.hero.cta}
            </a>
            <p className="mt-3 text-sm text-muted">{landing.hero.ctaNote}</p>
          </div>
        </div>
      </section>

      {/* ---------------- Credibility strip ---------------- */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-7">
          <p className="label text-center text-muted">{credentials.title}</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-x-8 gap-y-2">
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
          ctaHref="#talk"
          ctaLabel="Talk to Therese"
        />
      </div>

      {/* ---------------- One endorsement, right after the number --------- */}
      <section className="on-dark border-b border-rule bg-band">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <blockquote className="display text-center text-xl leading-relaxed text-band-fg sm:text-2xl">
            &ldquo;For genuine, deep, and lasting resolutions in any employment
            setting, Therese should be your first choice.&rdquo;
          </blockquote>
          <p className="label mt-6 text-center text-band-muted">
            {endorsements.items[1].name} &mdash; nearly 50 years in conflict
            resolution
          </p>
        </div>
      </section>

      {/* ---------------- What the number means ---------------- */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="display text-center text-3xl text-heading">
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

          <h2 className="display mt-16 text-center text-3xl text-heading">
            {calculator.nextSteps.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal">
            {calculator.nextSteps.intro}
          </p>
          <dl className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {calculator.nextSteps.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-4">
                <dt className="display text-lg text-heading">{item.name}</dt>
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
          <h2 className="display text-center text-3xl text-heading">
            {landing.talk.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-charcoal">
            {landing.talk.intro}
          </p>
          <div className="mt-9">
            <LandingContactForm source="lp-a" />
          </div>
        </div>
      </section>

      <footer className="on-dark bg-band text-sand">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="display text-2xl text-band-fg">{contact.name}</p>
          <p className="label mt-2 text-band-muted">
            {contact.roles.join(" · ")}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <li>
              <a href={contact.phoneHref} className="hover:text-band-fg">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.emailHref} className="hover:text-band-fg">
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
