import Link from "next/link";
import { Hero } from "@/components/hero";
import { VideoPlayer } from "@/components/video-player";
import { AssessmentCta } from "@/components/assessment-cta";
import { Credentials } from "@/components/credentials";
import { pullQuote, beforeWeTalk, reasons, process } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* The thesis, then the person delivering it. */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-24 md:grid-cols-2 md:items-center">
          <div>
            <blockquote className="display text-3xl text-heading sm:text-4xl">
              &ldquo;{pullQuote.quote}&rdquo;
            </blockquote>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-charcoal">
              {pullQuote.subhead}
            </p>
          </div>
          <VideoPlayer />
        </div>
      </section>

      <Credentials />

      {/* Qualification before persuasion — unusual, and the strongest thing
          on the page. It stays near the top for that reason. */}
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

      {/* Three reasons. Not a sequence, so no numbers. */}
      <section className="border-b border-rule bg-paper">
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

      {/* A real ordered sequence, so it earns its numbers. */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <p className="label text-muted">The process</p>
          <h2 className="display mt-4 max-w-3xl text-3xl text-heading sm:text-4xl">
            How a conflict actually gets finished
          </h2>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2">
            {process.map((step, i) => (
              <li key={step.title} className="border-t border-rule-strong pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="label text-slate">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display text-xl text-heading">{step.title}</h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-charcoal">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <Link
            href="/process"
            className="mt-10 inline-block text-base text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
          >
            More about the process
          </Link>
        </div>
      </section>

      <AssessmentCta />
    </>
  );
}
