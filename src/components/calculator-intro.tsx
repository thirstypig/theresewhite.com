import { calculator } from "@/content/site";

/**
 * The calculator's opening: who it is from, what it is for, and how to use
 * it. Shared by /conflict-calculator on the main site and by the standalone
 * calculator site, so the two cannot drift. The landing pages have their own
 * hero and skip this.
 *
 * Laid out like PageHeader, whose cream band opens every other page, with the
 * three intro paragraphs in the ruled-column pattern used across the site.
 */
export function CalculatorIntro({
  fontClass = "display",
}: {
  /**
   * Face for the headings. The site's display serif by default; the
   * standalone calculator site passes the live site's Arial Bold.
   */
  fontClass?: string;
} = {}) {
  return (
    <section className="border-b border-rule bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="label text-muted">{calculator.eyebrow}</p>
        <h1 className={`${fontClass} mt-4 max-w-3xl text-4xl text-heading sm:text-5xl`}>
          {calculator.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal">
          {calculator.sub}
        </p>

        <dl className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-3">
          {calculator.intro.map((item) => (
            <div key={item.title} className="border-t border-rule-strong pt-5">
              <dt className={`${fontClass} text-xl text-heading`}>{item.title}</dt>
              <dd className="mt-2 text-base leading-relaxed text-charcoal">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-12 max-w-3xl border-l-2 border-rule-strong pl-5 text-base leading-relaxed text-charcoal">
          <strong className="font-semibold text-heading">
            {calculator.howTo.lead}
          </strong>{" "}
          {calculator.howTo.body}
        </p>
      </div>
    </section>
  );
}
