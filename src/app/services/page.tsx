import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AssessmentCta } from "@/components/assessment-cta";
import { services, reasons } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Mediation, one-on-one coaching, facilitated team discussions, fact-finding interviews, and prevention workshops — matched to the conflict rather than sold as a package.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="The fix fits the conflict"
        intro={services.intro}
      />

      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <dl className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {services.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-xl text-heading">{item.name}</dt>
                <dd className="mt-3 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 max-w-2xl border-l-2 border-rule-strong pl-5 text-base leading-relaxed text-charcoal">
            {services.remote}
          </p>
        </div>
      </section>

      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <p className="label text-muted">Why me</p>
          <h2 className="display mt-4 max-w-3xl text-3xl text-heading sm:text-4xl">
            Three very good reasons I belong on your shortlist
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {reasons.map((reason) => (
              <article key={reason.title}>
                <h3 className="display text-xl text-heading">{reason.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-charcoal">
                  {reason.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AssessmentCta />
    </>
  );
}
