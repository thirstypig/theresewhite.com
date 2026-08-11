import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/page-header";
import { AssessmentCta } from "@/components/assessment-cta";
import { endorsements } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Endorsements",
  description:
    "Endorsements from Candice Gottlieb-Clark, Kenneth Cloke, Joan Goldsmith, and a senior compliance officer at a 110,000-person organization.",
  path: "/endorsements",
});

export default function EndorsementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Endorsements"
        title="People who have watched me work"
        intro={endorsements.intro}
      />

      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
          <div className="space-y-16">
            {endorsements.items.map((person) => (
              <figure
                key={person.name}
                className="m-0 border-t border-rule pt-6"
              >
                <figcaption>
                  <p className="display text-2xl text-heading">{person.name}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {person.bio}
                  </p>
                </figcaption>
                <blockquote className="mt-6 border-l-2 border-rule-strong pl-6 text-lg leading-relaxed text-charcoal">
                  {person.quote}
                </blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <AssessmentCta />
    </>
  );
}
