import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AssessmentCta } from "@/components/assessment-cta";
import { process, beforeWeTalk } from "@/content/site";

export const metadata: Metadata = {
  title: "The process",
  description:
    "Interviews, mediation, a signed written agreement, and follow-up coaching in the weeks after. How a workplace conflict actually gets finished rather than quieted.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="The process"
        title="How a conflict actually gets finished"
        intro="Four stages. The first two are where the truth surfaces; the last two are what keeps it from resurfacing."
      />

      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <ol className="max-w-4xl space-y-14">
            {process.map((step, i) => (
              <li
                key={step.title}
                className="grid gap-x-8 gap-y-3 sm:grid-cols-[4rem_1fr]"
              >
                <span
                  className="label pt-2 text-slate"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="border-t border-rule pt-4">
                  <h2 className="display text-2xl text-heading">{step.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-charcoal">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display max-w-2xl text-3xl text-heading sm:text-4xl">
            {beforeWeTalk.title}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {beforeWeTalk.points.map((point) => (
              <p
                key={point}
                className="border-t border-rule-strong pt-5 text-base leading-relaxed text-charcoal"
              >
                {point}
              </p>
            ))}
          </div>
        </div>
      </section>

      <AssessmentCta />
    </>
  );
}
