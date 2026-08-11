import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PartnerForm } from "@/components/partner-form";
import { collaborate } from "@/content/site";

export const metadata: Metadata = {
  title: "Collaborate",
  description:
    "For HR leaders, fractional HR, ombuds, employment counsel and coaches who come across conflicts they can't take on themselves. I resolve the conflict and hand the relationship back.",
  alternates: { canonical: "/collaborate" },
};

export default function CollaboratePage() {
  return (
    <>
      <PageHeader
        eyebrow={collaborate.eyebrow}
        title={collaborate.title}
        intro={collaborate.lede}
      />

      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.boundaries.title}
          </h2>
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {collaborate.boundaries.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-xl text-heading">{item.name}</dt>
                <dd className="mt-3 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.partnerTypes.title}
          </h2>
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {collaborate.partnerTypes.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-xl text-heading">{item.name}</dt>
                <dd className="mt-3 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Four options, not a sequence — no numbers. Same dl treatment as the
          two sections above. */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.ways.title}
          </h2>
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {collaborate.ways.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-xl text-heading">{item.name}</dt>
                <dd className="mt-3 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.reciprocal.title}
          </h2>
          <p className="mt-6 max-w-2xl border-l-2 border-rule-strong pl-5 text-lg leading-relaxed text-charcoal">
            {collaborate.reciprocal.body}
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.form.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal">
            {collaborate.form.intro}
          </p>
          <div className="mt-10">
            <PartnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
