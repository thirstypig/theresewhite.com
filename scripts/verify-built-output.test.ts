import { describe, it, expect } from "vitest";
import {
  expectedPath,
  parseMetaTags,
  metaContent,
  originFromHomepage,
} from "./verify-built-output.mjs";

describe("expectedPath", () => {
  it("maps the homepage to /", () => {
    expect(expectedPath("index.html")).toBe("/");
  });

  it("maps a nested route to its trailing-slash path", () => {
    expect(expectedPath("contact/index.html")).toBe("/contact/");
    expect(expectedPath("contact/thank-you/index.html")).toBe("/contact/thank-you/");
    expect(expectedPath("lp/a/index.html")).toBe("/lp/a/");
  });

  // One source file, src/app/not-found.tsx, produces three built artifacts.
  // out/404.html is the file GitHub Pages serves on an unmatched URL — a Pages
  // convention, not a Next route. The other two are Next's internal _not-found
  // segment and the /404/ route it exports alongside. All three legitimately
  // carry og:url /404/, so a naive path rule fails a correct build.
  it("maps all three 404 artifacts to /404/", () => {
    expect(expectedPath("404.html")).toBe("/404/");
    expect(expectedPath("404/index.html")).toBe("/404/");
    expect(expectedPath("_not-found/index.html")).toBe("/404/");
  });

  it("returns null for a path it does not recognize", () => {
    // Assertion 6: an unclassified route must fail loudly rather than be
    // skipped. The original bug survived an audit precisely because the
    // audit walked what it recognized and the 404 was not in that set.
    expect(expectedPath("some-stray-file.html")).toBeNull();
  });
});

describe("parseMetaTags", () => {
  it("reads attributes regardless of their order in the tag", () => {
    const html = `
      <meta property="og:title" content="First"/>
      <meta content="Second" name="twitter:card"/>
    `;
    const tags = parseMetaTags(html);
    expect(metaContent(tags, "og:title")).toBe("First");
    expect(metaContent(tags, "twitter:card")).toBe("Second");
  });

  it("returns undefined for a tag that is not present", () => {
    expect(metaContent(parseMetaTags("<meta name='x'>"), "og:image")).toBeUndefined();
  });

  it("leaves HTML entities encoded, so comparisons stay byte-for-byte", () => {
    // Next renders & as &amp; and ' as &#x27;. Both sides of every comparison
    // come from built HTML, so decoding would add risk without adding value.
    const tags = parseMetaTags(`<meta property="og:title" content="A &amp; B"/>`);
    expect(metaContent(tags, "og:title")).toBe("A &amp; B");
  });
});

describe("originFromHomepage", () => {
  it("extracts the origin from the homepage og:url", () => {
    const html = `<meta property="og:url" content="https://theresewhite.bahtzang.com/"/>`;
    expect(originFromHomepage(html)).toBe("https://theresewhite.bahtzang.com");
  });

  it("returns null when og:url is missing or not absolute", () => {
    expect(originFromHomepage("<html></html>")).toBeNull();
    expect(originFromHomepage(`<meta property="og:url" content="/"/>`)).toBeNull();
  });
});
