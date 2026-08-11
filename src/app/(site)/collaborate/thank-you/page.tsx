import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { contact } from "@/content/site";

/**
 * DRAFT COPY: the prose on this page is drafted, not migrated — see the
 * `collaborate-voice` todo in src/content/todos.ts.
 */

export const metadata: Metadata = pageMetadata({
  title: "Thanks for reaching out",
  description:
    "Your introduction is with Therese. She answers these herself.",
  path: "/collaborate/thank-you",
  noindex: true,
  follow: true,
});

export default function CollaborateThankYouPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-28 sm:py-36">
        <p className="label text-muted">Received</p>
        <h1 className="display mt-4 text-4xl text-heading sm:text-5xl">
          Thanks for reaching out
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-charcoal">
          It goes straight to Therese, and she answers these herself. She&rsquo;ll
          be in touch to find a time to talk properly — no agenda, and nothing
          you need to prepare.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={contact.emailHref}
            className="rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
          >
            Email {contact.email}
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
