import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { WixLegalPage } from "@/components/wix-pages/legal-page";
import { CookiePreferencesButton } from "@/components/consent";
import { wixCookies, wixCookiesButtonAfter } from "@/content/wix/legal";

/**
 * The Wix Cookie Policy at its Wix address ("Cookie Preferences" in the
 * footer), word for word (see src/content/wix/legal.ts).
 *
 * One addition: Wix has no control on this page for changing cookie choices;
 * its text only points to the banner shown on a first visit. This site's
 * banner does not come back by itself once answered, so the page carries the
 * button that reopens it, right after the line about the banner.
 *
 * The button's own styling was written for the earlier design's dark footer,
 * so the wrapper makes it look like the underlined text links on this page
 * and keeps it dark when pointed at.
 */
export const metadata: Metadata = pageMetadata({
  title: "Cookie Preferences",
  description:
    "What cookies are, which ones ThereseWhite.com uses and why, and how to change your cookie choices on this site or in your browser.",
  path: "/cookie-preferences",
});

export default function CookiePreferencesPage() {
  return (
    <WixLegalPage
      page={wixCookies}
      afterBlock={{
        index: wixCookiesButtonAfter,
        node: (
          <p className="[&_button]:cursor-pointer [&_button]:underline [&_button]:underline-offset-2 [&_button:hover]:text-black">
            <CookiePreferencesButton />
          </p>
        ),
      }}
    />
  );
}
