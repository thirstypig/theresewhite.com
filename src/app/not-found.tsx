import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";
import { contact } from "@/content/site";

/**
 * The 404 page, and the last route that was still shipping a broken link
 * preview.
 *
 * Every other page goes through pageMetadata(), which names /og.png
 * explicitly. This one had no metadata export at all, so it fell through to
 * the root layout — where the opengraph-image.tsx file convention outranks
 * whatever the layout sets and re-injects the extensionless /opengraph-image
 * path that GitHub Pages serves as application/octet-stream.
 *
 * The fix is the same one every other page already had: declare its own
 * openGraph, which replaces the parent's rather than merging into it. Found
 * by an independent check of the built output, not by looking at the source —
 * the source looks fine.
 *
 * It sits at the app root rather than inside (site), because an unmatched URL
 * resolves to the ROOT not-found; one inside a route group only covers that
 * group's segments. That means no header or footer here, which is also true
 * of the Next default this replaces.
 */
export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "That page doesn't exist. The mediation practice does.",
  path: "/404",
  noindex: true,
  follow: true,
});

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-28 sm:py-36">
        <p className="label text-muted">404</p>
        <h1 className="display mt-4 text-4xl text-heading sm:text-5xl">
          That page doesn&rsquo;t exist
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-charcoal">
          It may have moved, or the link may be wrong. The practice is still
          here.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/"
            className="rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
          >
            Back to the homepage
          </Link>
          <a
            href={contact.phoneHref}
            className="text-base text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
          >
            {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
