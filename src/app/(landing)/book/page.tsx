import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Lora } from "next/font/google";
import { pageMetadata } from "@/lib/page-metadata";
import { BookSignupForm } from "@/components/book-signup-form";
import { book } from "@/content/book";
import { portrait } from "@/content/site";
import { IS_BOOK_SITE, PRIVACY_HREF } from "@/lib/site-config";

/**
 * The source of book.theresewhite.com: the free guide, From Meltdown to
 * Resolution, given in exchange for a first name and an email address.
 *
 * It is published exactly the way the calculator is. theresewhite.com is
 * still on Wix, so the deploy builds the site a second time with
 * NEXT_PUBLIC_SITE_URL=https://book.theresewhite.com, and
 * scripts/build-calculator-site.mjs publishes this one page from that build
 * as the subdomain's home page, with the PDF beside it. On the main site this
 * route is a noindex preview of the same page.
 *
 * No menu, on purpose. The page exists for links in LinkedIn posts, and it
 * has one job; every link off it is a way to lose the signup. The only links
 * out are the privacy policy and, after signup, her booking calendar.
 *
 * It wears the book's own look, not the live Wix site's (which the calculator
 * wears): the PDF's navy and light blue, in its typefaces, Lora and Inter, so
 * that the page and the download read as the same thing. The colors are the
 * `.lp-book` theme in globals.css.
 *
 * The LinkedIn card is a picture of the cover. On the subdomain the assembly
 * script publishes public/book/og.png as the site's og.png, so the shared
 * `/og.png` tag every page carries points at the cover there.
 */

const serif = Lora({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-book-serif",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-book-sans",
});

export const metadata: Metadata = pageMetadata({
  title: `${book.title}: a free guide`,
  description:
    "20 veteran mediator scripts for resolving emotion-driven workplace conflicts, from L. Therese White. Free, 24 pages, PDF.",
  path: IS_BOOK_SITE ? "/" : "/book",
  noindex: true,
});

export default function BookPage() {
  return (
    <div className={`lp-book lp-lock bg-paper ${serif.variable} ${sans.variable}`}>
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <p className="m-0 text-sm font-bold tracking-[0.2em] text-heading uppercase">
            L. Therese White
          </p>
        </div>
      </header>

      <section className="bg-[linear-gradient(180deg,#284a7a_0%,#1b2e52_100%)] text-white">
        {/* On a phone, which is where most LinkedIn visitors are, the form
            comes straight after the title so it is on the first screen; the
            quote and the cover follow it. From tablet width up the cover
            sits beside the text and the form, and the order is the natural
            one. */}
        <div className="mx-auto grid max-w-6xl gap-8 px-6 pt-10 pb-16 md:grid-cols-[1.15fr_0.85fr] md:gap-x-16 md:gap-y-10 md:pt-16 md:pb-20">
          <div className="order-1 md:col-start-1 md:row-start-1">
            <p className="label m-0 text-xs text-[#9cc3ea]">{book.hero.eyebrow}</p>
            <h1 className="book-serif mt-4 text-4xl text-white sm:text-6xl">{book.title}</h1>
            <p className="mt-4 text-lg leading-snug font-semibold text-[#dce6f3] sm:text-xl">
              {book.subtitle}
            </p>
            <p className="mt-3 text-sm tracking-wide text-[#9cc3ea]">
              {book.promises.join("  \u2022  ")}
            </p>
          </div>

          <div className="order-3 md:order-none md:col-start-1 md:row-start-2">
            <p className="book-serif m-0 border-l-2 border-[#5b9bd5] pl-5 text-lg leading-relaxed font-medium text-white italic">
              {book.hero.lede}
            </p>
            <p className="mt-5 mb-0 text-base leading-relaxed text-[#dce6f3]">{book.hero.body}</p>
          </div>

          <div className="order-2 md:order-none md:col-start-1 md:row-start-3">
            <BookSignupForm />
          </div>

          <div className="order-4 flex items-start justify-center md:order-none md:col-start-2 md:row-span-3 md:row-start-1">
            <Image
              src={book.cover.src}
              width={book.cover.width}
              height={book.cover.height}
              alt={book.cover.alt}
              priority
              className="h-auto w-[220px] shadow-[0_24px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-[#5b9bd5] sm:w-[280px] md:sticky md:top-8 md:w-full md:max-w-[400px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="book-serif m-0 text-3xl text-heading">Three of the twenty</h2>
          <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-3">
            {book.samples.map((s) => (
              <li key={s.number} className="border-t-4 border-accent-line bg-cream p-6">
                <p className="label m-0 text-xs text-muted">
                  {s.number} &middot; {s.category}
                </p>
                <p className="book-serif mt-3 mb-0 text-xl leading-snug text-heading">
                  {s.script}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="book-serif m-0 text-3xl text-heading">Inside the guide</h2>
          <ul className="mt-8 flex list-none flex-col gap-6 p-0">
            {book.inside.map((item) => (
              <li key={item.title} className="border-l-4 border-accent-line pl-5">
                <p className="m-0 text-lg font-semibold text-heading">{item.title}</p>
                <p className="mt-1 mb-0 text-base leading-relaxed text-charcoal">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-5xl items-start gap-10 px-6 py-16 md:grid-cols-[240px_1fr]">
          <Image
            src={portrait.src}
            width={portrait.width}
            height={portrait.height}
            alt={portrait.alt}
            className="aspect-square w-[180px] rounded-full border-4 border-heading object-cover object-top md:w-full"
          />
          <div>
            <h2 className="book-serif m-0 text-3xl text-heading">{book.about.heading}</h2>
            {book.about.paragraphs.map((p) => (
              <p key={p} className="mt-4 mb-0 text-base leading-relaxed text-charcoal">
                {p}
              </p>
            ))}
            <p className="mt-6 mb-0 font-semibold text-heading">{book.about.signature}</p>
            <p className="m-0 text-sm text-muted italic">{book.about.role}</p>
          </div>
        </div>
      </section>

      <section className="bg-band text-band-fg">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
          {book.endorsements.map((e) => (
            <figure key={e.name} className="m-0">
              <blockquote className="book-serif m-0 text-lg leading-relaxed font-medium italic">
                &ldquo;&hellip;{e.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-band-muted">
                <span className="font-semibold text-band-fg">{e.name}</span>, {e.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="book-serif m-0 text-3xl text-heading">{book.subtitle}</h2>
          <a
            href="#get-the-guide"
            className="mt-8 inline-block rounded-sm bg-btn px-8 py-4 text-base font-semibold text-btn-fg transition-colors hover:bg-btn-hover"
          >
            {book.form.heading}
          </a>
        </div>
      </section>

      <footer className="border-t-4 border-accent-line bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm leading-relaxed text-muted">
          <p className="m-0">{book.disclaimer}</p>
          <p className="mt-3 mb-0">
            {book.copyright} &middot;{" "}
            <a href={PRIVACY_HREF} className="underline underline-offset-2 hover:text-heading">
              Privacy policy
            </a>{" "}
            &middot;{" "}
            <a
              href="https://www.theresewhite.com"
              className="underline underline-offset-2 hover:text-heading"
            >
              ThereseWhite.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
