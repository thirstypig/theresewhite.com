import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/page-header";
import { AssessmentCta } from "@/components/assessment-cta";
import { faq } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Straight answers on cost, urgency, toxic high performers, legal exposure, and what to tell your bottom-line bosses about investing in conflict resolution.",
  path: "/faq",
});

/** FAQPage markup — one of the few schema types Google still surfaces. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="The questions people actually ask"
        intro="Mostly from HR leaders and general counsel deciding whether to bring someone in from outside."
      />

      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl divide-y divide-rule border-y border-rule">
            {faq.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start gap-4 text-lg leading-snug text-heading marker:content-none">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 shrink-0 text-slate transition-transform group-open:rotate-45"
                  >
                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 fill-current">
                      <path d="M6 0h2v14H6z" />
                      <path d="M0 6h14v2H0z" />
                    </svg>
                  </span>
                  <span className="display">{item.q}</span>
                </summary>
                <p className="mt-4 pl-[1.875rem] text-base leading-relaxed text-charcoal">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <AssessmentCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
