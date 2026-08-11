import type { Metadata } from "next";
import { contact } from "@/content/site";

/**
 * Builds a page's metadata so the tags that must agree cannot drift apart.
 *
 * The bug this exists to prevent: `openGraph` was declared once in the root
 * layout, and Next merges metadata shallowly per key. A page that set only
 * `title` and `description` inherited the parent's ENTIRE openGraph object
 * untouched — so every page on the site shared the homepage's og:title,
 * og:description and og:url. The `<title>` tag was correct the whole time,
 * which is why nobody noticed: browsers read `<title>`, but SMS, iMessage,
 * Slack and LinkedIn read Open Graph.
 *
 * Next does NOT derive og:title from the page title. It has to be set, and
 * setting it per page by hand is the thing everyone forgets. Hence one
 * function that emits all of it together.
 *
 * `og:title` is the page's own title WITHOUT her name appended, unlike the
 * `<title>` tag. A shared link gets about three lines in a chat app, and the
 * distinguishing words should be in them; her name is already carried by
 * `og:site_name` and the domain.
 *
 * `robots` is only set for noindex pages. Everything else must inherit the
 * root layout's production check — hardcoding `index: true` here would make
 * staging crawlable, which is the failure site-config.ts exists to prevent.
 */
/**
 * The card image. Resolved against `metadataBase` from the root layout, so it
 * becomes absolute in the rendered tag, which scrapers require.
 *
 * `.png`, and it has to be. src/app/opengraph-image.tsx emits the file as
 * `out/opengraph-image` with NO extension, and GitHub Pages sets Content-Type
 * from the extension — measured on staging, that path serves as
 * `application/octet-stream`. The bytes are a valid PNG, but LinkedIn and
 * Facebook check the header rather than the magic bytes and reject it.
 *
 * So `npm run build` copies the generated file to `out/og.png`, and this
 * points there. The copy is part of the build script, not a manual step; if
 * the generator ever stops emitting, `cp` fails and takes the build with it.
 *
 * Covered by page-metadata.test.ts, which fails if this loses its extension.
 */
export const OG_IMAGE = "/og.png";

/**
 * The site's own title and description, used by the root layout as the
 * fallback for any page that sets none, and by the homepage as its own.
 * Shared from here so the two cannot drift.
 */
export const SITE_TITLE = `${contact.name} — Employment Mediator & Workplace Conflict Coach`;
export const SITE_DESCRIPTION =
  "Employment mediation and workplace conflict coaching for organizations with a conflict internal processes can't resolve. 30+ years, 1,100+ mediations. Confidential assessment, no pitch.";

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  follow = false,
}: {
  title: string;
  description: string;
  /** Route path, no trailing slash. Use "/" for the homepage. */
  path: string;
  noindex?: boolean;
  /**
   * Only read when `noindex` is set. The confirmation pages allow following
   * so link equity still flows through them; `/admin` does not, because
   * nothing behind the gate should be discovered at all.
   */
  follow?: boolean;
}): Metadata {
  // trailingSlash: true — the canonical and og:url must match what is served.
  const url = path === "/" ? "/" : `${path}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: contact.name,
      locale: "en_US",
      type: "website",
      // Named explicitly, and it must be. The opengraph-image.tsx convention
      // injects itself into the root layout's openGraph object, but a page
      // that declares its own openGraph REPLACES the parent's rather than
      // merging into it — so every page below the root silently lost og:image
      // until this line existed. Verified in the built HTML, not assumed.
      images: [OG_IMAGE],
    },
    twitter: {
      // summary_large_image, not summary: LinkedIn and iMessage render a wide
      // card, and a link with no picture is a visibly weaker post.
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    ...(noindex ? { robots: { index: false, follow } } : {}),
  };
}
