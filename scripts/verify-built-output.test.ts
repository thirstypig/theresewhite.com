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

import { auditPage } from "./verify-built-output.mjs";

const ORIGIN = "https://theresewhite.bahtzang.com";
const HOME_TITLE = "L. Therese White — Employment Mediator";

/** A correct non-homepage page, as a base for mutation in each test. */
function page({
  title = "Contact",
  url = `${ORIGIN}/contact/`,
  image = `${ORIGIN}/og.png`,
  card = "summary_large_image",
} = {}) {
  return `<html><head>
    <meta property="og:title" content="${title}"/>
    <meta property="og:url" content="${url}"/>
    <meta property="og:image" content="${image}"/>
    <meta name="twitter:card" content="${card}"/>
  </head></html>`;
}

const audit = (html: string, relPath = "contact/index.html") =>
  auditPage({ relPath, html, origin: ORIGIN, homepageTitle: HOME_TITLE });

describe("auditPage", () => {
  it("accepts a correct page", () => {
    expect(audit(page())).toEqual([]);
  });

  it("accepts the homepage carrying the homepage title", () => {
    const html = page({ title: HOME_TITLE, url: `${ORIGIN}/` });
    expect(auditPage({
      relPath: "index.html", html, origin: ORIGIN, homepageTitle: HOME_TITLE,
    })).toEqual([]);
  });

  it("accepts out/404.html advertising /404/", () => {
    const html = page({ title: "Page not found", url: `${ORIGIN}/404/` });
    expect(audit(html, "404.html")).toEqual([]);
  });

  it("accepts the three 404 artifacts sharing a title with each other", () => {
    // They are one page wearing three hats. The uniqueness check is only ever
    // against the homepage's title, never across pages generally.
    const html = page({ title: "Page not found", url: `${ORIGIN}/404/` });
    for (const p of ["404.html", "404/index.html", "_not-found/index.html"]) {
      expect(audit(html, p)).toEqual([]);
    }
  });

  // --- the shapes that actually shipped ---

  it("rejects a page carrying the homepage's card (the original bug)", () => {
    const html = page({ title: HOME_TITLE, url: `${ORIGIN}/` });
    const problems = audit(html);
    expect(problems).toHaveLength(2);
    expect(problems.join(" ")).toMatch(/og:title/);
    expect(problems.join(" ")).toMatch(/og:url/);
  });

  it("rejects the extensionless og:image path", () => {
    const html = page({ image: `${ORIGIN}/opengraph-image` });
    expect(audit(html).join(" ")).toMatch(/og:image/);
  });

  it("rejects a missing og:image altogether", () => {
    const html = `<html><head>
      <meta property="og:title" content="Contact"/>
      <meta property="og:url" content="${ORIGIN}/contact/"/>
      <meta name="twitter:card" content="summary_large_image"/>
    </head></html>`;
    expect(audit(html).join(" ")).toMatch(/no og:image/);
  });

  it("rejects the small twitter card", () => {
    expect(audit(page({ card: "summary" })).join(" ")).toMatch(/twitter:card/);
  });

  it("rejects a page on a different origin from the homepage's", () => {
    const html = page({ url: "https://example.com/contact/" });
    expect(audit(html).join(" ")).toMatch(/og:url/);
  });

  it("rejects an unrecognized route path without checking its tags", () => {
    const problems = audit(page(), "stray.html");
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/unrecognized/);
  });

  it("names the file in every problem it reports", () => {
    // A CI failure that does not say which file it means costs a build to
    // find out. Every message is prefixed with the path.
    const html = page({ title: HOME_TITLE, card: "summary" });
    const problems = audit(html);
    expect(problems.length).toBeGreaterThan(0);
    for (const p of problems) expect(p).toMatch(/^contact\/index\.html:/);
  });
});
