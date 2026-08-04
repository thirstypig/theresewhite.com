import Link from "next/link";
import { assessment, cta, contact } from "@/content/site";

/** The closing section on every page. Every page ends pointing somewhere. */
export function AssessmentCta() {
  return (
    <section className="on-dark bg-band text-sand">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_1fr] md:gap-0">
          <div className="md:pr-12">
            <h2 className="display text-3xl text-band-fg sm:text-4xl">
              {assessment.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-band-muted">
              {assessment.intro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={cta.href}
                className="rounded-sm bg-sand px-6 py-3.5 text-base font-medium text-deep transition-colors hover:bg-band-fg"
              >
                {cta.short}
              </Link>
              <a
                href={contact.phoneHref}
                className="text-base text-band-muted underline decoration-band-rule underline-offset-4 transition-colors hover:text-band-fg"
              >
                {contact.phone}
              </a>
            </div>
          </div>

          <div aria-hidden className="hidden w-px bg-band-rule md:block" />

          <div className="md:pl-12">
            <ul className="space-y-4">
              {assessment.questions.map((question) => (
                <li
                  key={question}
                  className="border-b border-band-rule pb-4 text-base text-sand"
                >
                  {question}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-band-muted">
              {assessment.outro}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
