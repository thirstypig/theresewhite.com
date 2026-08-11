import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * The chrome every browsable page carries: header nav, footer, skip link.
 *
 * This lives in a route group rather than the root layout so landing pages
 * can opt out of it. Route groups don't appear in URLs — `(site)/about` is
 * still served at `/about` — so moving the pages in here changed no paths.
 *
 * The root layout keeps everything a landing page still needs: the document
 * shell, fonts, the pre-paint theme script, JSON-LD, and the cookie banner.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-sm focus:bg-btn focus:px-4 focus:py-2 focus:text-btn-fg"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
