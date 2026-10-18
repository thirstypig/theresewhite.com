import Link from "next/link";

/**
 * A page that has moved, at its old address.
 *
 * The first rebuild used tidy addresses (/about, /faq, /privacy). On
 * 2026-10-18 the site switched to the Wix addresses (/about-therese,
 * /services-3, /privacy-policy), so links Wix has collected over the years
 * keep working after the move. These stubs keep the tidy addresses from
 * breaking for anyone who saved them from the test site.
 *
 * GitHub Pages cannot send a real redirect, so the page sends the browser on
 * with a refresh tag, which search engines also follow, and shows a plain
 * link for anything that ignores it. Each stub is noindex, so the old
 * address never competes with the new one in search.
 */
export function MovedPage({ to, label }: { to: string; label: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <section className="mx-auto max-w-[980px] px-4 py-24 text-center text-[18px]">
        <p>
          This page has moved to{" "}
          <Link href={to} className="text-[#0d63d1] underline">
            {label}
          </Link>
          .
        </p>
      </section>
    </>
  );
}
