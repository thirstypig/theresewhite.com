import Link from "next/link";
import { hero, proof, cta, contact } from "@/content/site";

/**
 * The signature element.
 *
 * The conflict accumulates in the left column, the resolution sits in the
 * right, and a hairline divide runs between them. On load the two sides settle
 * inward and the rule draws down — the layout performs the thing she does.
 * This is the page's one bold moment; everything below it stays quiet.
 */
export function Hero() {
  return (
    <section className="on-dark bg-band text-sand">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p
          className="label rise text-band-muted"
          style={{ animationDelay: "80ms" }}
        >
          {hero.eyebrow}
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto_1.1fr] md:gap-0">
          {/* The positions. Stacked, plain, cumulative. */}
          <ul className="space-y-5 md:pr-12">
            {hero.positions.map((position, i) => (
              <li
                key={position}
                className="settle-left text-lg leading-snug text-band-muted sm:text-xl"
                style={{ animationDelay: `${200 + i * 140}ms` }}
              >
                {position}
              </li>
            ))}
          </ul>

          {/* The divide. */}
          <div
            aria-hidden
            className="draw-rule hidden w-px bg-band-rule md:block"
            style={{ animationDelay: "180ms" }}
          />

          {/* The resolution. */}
          <div className="md:pl-12">
            <h1
              className="display settle-right text-4xl text-band-fg sm:text-5xl"
              style={{ animationDelay: "480ms" }}
            >
              {hero.resolution}
            </h1>
            <p
              className="display settle-right mt-4 text-3xl text-sand sm:text-4xl"
              style={{ animationDelay: "620ms" }}
            >
              {hero.resolutionTail}
            </p>
          </div>
        </div>

        <div
          className="rise mt-16 border-t border-band-rule pt-10"
          style={{ animationDelay: "820ms" }}
        >
          <p className="max-w-2xl text-lg text-balance text-sand sm:text-xl">
            {hero.question}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href={cta.href}
              className="rounded-sm bg-sand px-6 py-3.5 text-base font-medium text-deep transition-colors hover:bg-band-fg"
            >
              {cta.label}
            </Link>
            <a
              href={contact.phoneHref}
              className="text-base text-band-muted underline decoration-band-rule underline-offset-4 transition-colors hover:text-band-fg"
            >
              Or call {contact.phone}
            </a>
          </div>
        </div>

        {/* Proof, set as a record rather than a stat block. */}
        <dl
          className="rise mt-16 grid grid-cols-2 gap-6 border-t border-band-rule pt-8 sm:max-w-md"
          style={{ animationDelay: "960ms" }}
        >
          {proof.map((item) => (
            <div key={item.label}>
              <dt className="label text-band-muted">{item.label}</dt>
              <dd className="display mt-2 text-2xl text-band-fg sm:text-3xl">
                {item.figure}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
