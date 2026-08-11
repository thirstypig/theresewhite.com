import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { LandingContactForm } from "@/components/landing-contact-form";
import { Credentials } from "@/components/credentials";
import { pageMetadata } from "@/lib/page-metadata";
import { calculator, contact, landing, pullQuote } from "@/content/site";

/**
 * Variant B — theresewhite.com's own design language, with the nav and
 * footer removed.
 *
 * Same components the site uses (PageHeader, Credentials), same Fraunces
 * display face, same cream/paper alternation. Someone arriving here from her
 * LinkedIn post should not be able to tell it is a different template.
 *
 * The only departures are the ones a landing page requires: no header nav or
 * site footer, the calculator's post-result CTA points at the form on this
 * page rather than /contact, and a minimal contact strip stands in for the
 * footer so the page still says who she is.
 *
 * Copy is the same `calculator` export the /conflict-calculator page uses.
 */
export const metadata: Metadata = pageMetadata({
  title: "The Workplace Conflict Calculator",
  description:
    "Put a number on what an unresolved workplace conflict has already cost you, and what it costs over the next twelve months if nothing changes.",
  path: "/lp/b",
  noindex: true,
});

export default function LandingB() {
  return (
    <>
      {/* cream */}
      <PageHeader
        eyebrow="Cost of conflict"
        title={pullQuote.subhead}
        intro="Two people who can't be in the same room is not a personality problem. It's a line item. This puts a number on it."
      />

      {/* paper */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {calculator.whatItDoes.title}
          </h2>
          <div className="mt-6 max-w-3xl space-y-5">
            {calculator.whatItDoes.body.map((para) => (
              <p key={para} className="text-base leading-relaxed text-charcoal">
                {para}
              </p>
            ))}
          </div>

          <dl className="mt-14 grid gap-x-12 gap-y-8 md:grid-cols-3">
            {calculator.benefits.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-lg text-heading">{item.name}</dt>
                <dd className="mt-2 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* cream — the steps are a genuine sequence, so they keep their numbers */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {calculator.howToUse.title}
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {calculator.howToUse.steps.map((step, index) => (
              <li key={step.name} className="border-t border-rule pt-5">
                <p className="label text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-2 text-lg text-heading">
                  {step.name}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-charcoal">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* paper — the component's own default surface */}
      <ConflictCalculator ctaHref="#talk" ctaLabel="Talk to Therese" />

      {/* cream */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {calculator.understanding.title}
          </h2>
          <div className="mt-6 max-w-3xl space-y-5">
            {calculator.understanding.body.map((para) => (
              <p key={para} className="text-base leading-relaxed text-charcoal">
                {para}
              </p>
            ))}
          </div>
          <h3 className="label mt-12 text-slate">
            {calculator.understanding.considerationsTitle}
          </h3>
          <ul className="mt-5 max-w-3xl space-y-3">
            {calculator.understanding.considerations.map((point) => (
              <li
                key={point}
                className="border-b border-rule pb-3 text-base leading-relaxed text-charcoal"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* paper */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {calculator.nextSteps.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-charcoal">
            {calculator.nextSteps.intro}
          </p>
          <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {calculator.nextSteps.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-lg text-heading">{item.name}</dt>
                <dd className="mt-2 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-3xl border-l-2 border-rule-strong pl-5 text-base leading-relaxed text-charcoal">
            {calculator.nextSteps.outro}
          </p>
        </div>
      </section>

      {/* cream — the site's own credentials block, for the same reassurance
          the nav bar would otherwise carry */}
      <Credentials />

      {/* paper */}
      <section id="talk" className="border-b border-rule bg-paper scroll-mt-4">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {landing.talk.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal">
            {landing.talk.intro}
          </p>
          <div className="mt-10">
            <LandingContactForm source="lp-b" />
          </div>
        </div>
      </section>

      {/* Minimal foot. Stands in for the site footer without its nav. */}
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
    </>
  );
}
