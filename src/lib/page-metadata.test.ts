import { describe, it, expect } from "vitest";
import { pageMetadata, OG_IMAGE } from "./page-metadata";

/**
 * These guard the two ways a link preview breaks silently. Both have already
 * happened once on this site, which is why they are here rather than in a
 * list of things that could theoretically go wrong.
 *
 * The page still returns 200 and still looks right in a browser either way —
 * the damage only shows up in someone else's chat window, days later, when
 * the link has already been sent.
 */

describe("pageMetadata", () => {
  it("gives the page its own og:title rather than inheriting the site's", () => {
    // The original bug: openGraph was set once in the root layout, and Next
    // merges shallowly per key, so every page shared the homepage's card.
    const meta = pageMetadata({
      title: "The Workplace Conflict Calculator",
      description: "Put a number on it.",
      path: "/conflict-calculator",
    });

    expect(meta.openGraph?.title).toBe("The Workplace Conflict Calculator");
    expect(meta.twitter?.title).toBe("The Workplace Conflict Calculator");
  });

  it("points og:url and the canonical at the page, with a trailing slash", () => {
    // next.config.ts sets trailingSlash: true. A canonical without the slash
    // names a URL that redirects, which Search Console reports as an error.
    const meta = pageMetadata({
      title: "Collaborate",
      description: "For allied professionals.",
      path: "/collaborate",
    });

    expect(meta.openGraph?.url).toBe("/collaborate/");
    expect(meta.alternates?.canonical).toBe("/collaborate/");
  });

  it("keeps the homepage at the bare root rather than doubling the slash", () => {
    const meta = pageMetadata({
      title: "Home",
      description: "Root.",
      path: "/",
    });

    expect(meta.openGraph?.url).toBe("/");
    expect(meta.alternates?.canonical).toBe("/");
  });

  it("uses an og:image path with a real image extension", () => {
    // Measured, not theorized: the generated file is emitted as
    // `out/opengraph-image` with no extension, and GitHub Pages served that
    // as application/octet-stream. The bytes were a valid PNG; LinkedIn and
    // Facebook check the Content-Type header and reject it anyway.
    //
    // `npm run build` copies it to out/og.png. If someone points this back at
    // the extensionless path, the preview loses its image on every platform
    // while every page still returns 200.
    expect(OG_IMAGE).toMatch(/\.(png|jpg|jpeg)$/);

    const meta = pageMetadata({
      title: "Anything",
      description: "Anything.",
      path: "/anything",
    });
    expect(meta.openGraph?.images).toEqual([OG_IMAGE]);
    expect(meta.twitter?.images).toEqual([OG_IMAGE]);
  });

  it("omits robots entirely unless the page asks to be hidden", () => {
    // The root layout sets robots from IS_PRODUCTION_SITE. Emitting
    // `index: true` here would override that and make staging crawlable —
    // the exact failure site-config.ts exists to prevent.
    const indexed = pageMetadata({
      title: "Services",
      description: "What she does.",
      path: "/services",
    });
    expect(indexed.robots).toBeUndefined();

    const hidden = pageMetadata({
      title: "Admin",
      description: "Internal.",
      path: "/admin",
      noindex: true,
    });
    expect(hidden.robots).toEqual({ index: false, follow: false });
  });

  it("lets a noindex page still pass link equity when it opts in", () => {
    const thanks = pageMetadata({
      title: "Thanks",
      description: "Received.",
      path: "/collaborate/thank-you",
      noindex: true,
      follow: true,
    });
    expect(thanks.robots).toEqual({ index: false, follow: true });
  });
});
