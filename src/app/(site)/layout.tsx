import { WixHeader } from "@/components/wix/wix-header";
import { WixFooter } from "@/components/wix/wix-footer";
import { wixFontVariables } from "@/components/wix/wix-fonts";

/**
 * The chrome every browsable page carries: the Wix header, the Wix footer,
 * and a skip link.
 *
 * Since 2026-10-18 this is a near-exact copy of the live Wix site's chrome
 * (James's decision: the first build matches the current site, and the
 * redesign comes later). The earlier modern header and footer are still in
 * src/components/site-header.tsx and site-footer.tsx, unused.
 *
 * `lp-lock` pins the light palette, because the Wix site has no dark mode.
 * Text defaults to Arial, which sets nearly everything on Wix.
 *
 * This lives in a route group rather than the root layout so landing pages
 * can opt out of it. Route groups don't appear in URLs.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`lp-lock ${wixFontVariables} flex min-h-full flex-1 flex-col bg-white font-[Arial,Helvetica,sans-serif] text-[#414141]`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-sm focus:bg-[#0d63d1] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <WixHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <WixFooter />
    </div>
  );
}
