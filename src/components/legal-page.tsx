import { PageHeader } from "@/components/page-header";
import { LAST_UPDATED } from "@/content/legal";

type LegalDoc = {
  title: string;
  intro: string;
  sections: readonly { heading: string; body: readonly string[] }[];
};

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={doc.title} intro={doc.intro} />

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl space-y-10">
            {doc.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="display text-xl text-heading">{section.heading}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-relaxed text-charcoal"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-14 max-w-2xl border-t border-rule pt-5 text-sm text-muted">
            Last updated {LAST_UPDATED}.
          </p>
        </div>
      </section>
    </>
  );
}
