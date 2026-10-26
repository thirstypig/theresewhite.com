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
        <p className="label text-sm! text-muted">{calculator.eyebrow}</p>
        <h1 className={`${fontClass} mt-4 max-w-3xl text-4xl text-heading sm:text-5xl`}>
          {calculator.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed font-bold text-charcoal sm:text-xl">
          {calculator.sub}
        </p>

        <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-3">
          {calculator.intro.map((item) => (
            <div key={item.title} className="border-t border-rule-strong pt-5">
              <dt className={`${fontClass} text-xl text-heading`}>{item.title}</dt>
              <dd className="mt-2 text-base leading-relaxed text-charcoal">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 border-t border-rule-strong pt-5">
          <h2 className={`${fontClass} m-0 text-xl text-heading`}>
            {calculator.howTo.lead}
          </h2>
          <p className="mt-2 mb-0 max-w-3xl text-base leading-relaxed text-charcoal">
            {calculator.howTo.body}
          </p>
        </div>
      </div>
    </section>
  );
}
