import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Lora } from "next/font/google";
import { pageMetadata } from "@/lib/page-metadata";
import { BookSignupForm } from "@/components/book-signup-form";
import { book } from "@/content/book";
import { logo } from "@/content/site";
import { IS_BOOK_SITE, PRIVACY_HREF } from "@/lib/site-config";

/**
 * The source of book.theresewhite.com: the free guide, From Meltdown to
 * Resolution, given in exchange for a name and an email address.
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
      <section className="bg-[linear-gradient(180deg,#284a7a_0%,#1b2e52_100%)] text-white">
        {/* On a phone, which is where most LinkedIn visitors are, the form
            comes straight after the title so it is on the first screen; the
            cover, her photo and her logo follow it. From tablet width up
            they sit in a column beside the text and the form. */}
        <div className="mx-auto grid max-w-6xl gap-8 px-6 pt-10 pb-16 md:grid-cols-[1.15fr_0.85fr] md:gap-x-16 md:gap-y-10 md:pt-16 md:pb-20">
          <div className="order-1 md:col-start-1 md:row-start-1">
            <p className="label m-0 text-xs text-[#9cc3ea]">{book.hero.eyebrow}</p>
            <h1 className="book-serif mt-4 text-4xl text-white sm:text-6xl">{book.title}</h1>
            <p className="mt-4 text-lg leading-snug font-semibold text-[#dce6f3] sm:text-xl">
              {book.subtitle}
            </p>
            <p className="mt-3 text-base tracking-wide text-[#9cc3ea] sm:text-lg">
              {book.promises.join("  \u2022  ")}
            </p>
            <p className="mt-6 mb-0 text-base leading-relaxed text-[#dce6f3] sm:text-lg">
              {book.hero.body}
            </p>
          </div>

          <div className="order-2 md:order-none md:col-start-1 md:row-start-2">
            <BookSignupForm />
            <p className="mt-5 mb-0 text-sm leading-relaxed text-[#dce6f3]">{book.scope}</p>
          </div>

          <div className="order-3 flex flex-col items-center gap-8 md:order-none md:col-start-2 md:row-span-2 md:row-start-1">
            <Image
              src={book.cover.src}
              width={book.cover.width}
              height={book.cover.height}
              alt={book.cover.alt}
              priority
              className="h-auto w-[220px] shadow-[0_24px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-[#5b9bd5] sm:w-[280px] md:w-full md:max-w-[400px]"
            />
            {/* The photo is a cut-out with no background, so it sits on a
                light circle; on the navy it would lose her hair. */}
            <Image
              src={book.headshot.src}
              width={book.headshot.width}
              height={book.headshot.height}
              alt={book.headshot.alt}
              className="aspect-square w-[180px] rounded-full border-4 border-[#5b9bd5] bg-cream object-cover sm:w-[220px]"
            />
            <Image
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
              className="h-auto w-[240px] rounded-sm bg-white p-3"
            />
          </div>
        </div>
      </section>

      <footer className="bg-cream">
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
