import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { contact } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Your note is on the way",
  description:
    "Your message is with Therese. Expect a reply within one business day.",
  path: "/contact/thank-you",
  noindex: true,
  follow: true,
});

export default function ThankYouPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-28 sm:py-36">
        <p className="label text-muted">Received</p>
        <h1 className="display mt-4 text-4xl text-heading sm:text-5xl">
          Your note is on the way
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-charcoal">
          It goes straight to Therese, and she answers these herself. Expect a
          reply within one business day. If the situation is moving faster than
          that, call — she keeps time open for same-day strategy calls.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={contact.phoneHref}
            className="rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
          >
            Call {contact.phone}
          </a>
          <Link
            href="/"
            className="text-base text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
          >
            Back to the homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
