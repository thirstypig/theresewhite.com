import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, it, expect } from "vitest";
import {
  expectedPath,
  parseMetaTags,
  metaContent,
  originFromHomepage,
  conflictingTags,
  builtPages,
  auditOgImageFile,
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

  // The two "absent tag" branches. Their sibling — a missing og:image — has
  // been covered since this file was written, and these two were left to lean
  // on the resemblance. "Correct because it looks like the tested one next to
  // it" is the reasoning that shipped the original bug; these close it.

  it("rejects a page with no og:title", () => {
    const html = `<html><head>
      <meta property="og:url" content="${ORIGIN}/contact/"/>
      <meta property="og:image" content="${ORIGIN}/og.png"/>
      <meta name="twitter:card" content="summary_large_image"/>
    </head></html>`;
    expect(audit(html)).toEqual(["contact/index.html: no og:title"]);
  });

  it("rejects a page with no og:url", () => {
    const html = `<html><head>
      <meta property="og:title" content="Contact"/>
      <meta property="og:image" content="${ORIGIN}/og.png"/>
      <meta name="twitter:card" content="summary_large_image"/>
    </head></html>`;
    expect(audit(html)).toEqual(["contact/index.html: no og:url"]);
  });
});

describe("conflicting duplicate tags", () => {
  /**
   * metaContent reads the FIRST matching tag. That is only safe while a key
   * appears once. If an audited key ever rendered twice with different values,
   * this checker would inspect one and a scraper might read the other — the
   * audit would pass while the card was wrong.
   *
   * That is the original bug's exact shape: correct from where we stand, wrong
   * from where it matters. It has never happened, and until now the tool would
   * have taught us nothing if it did.
   */

  it("rejects an audited key that appears twice with different values", () => {
    const html = `<html><head>
      <meta property="og:title" content="Contact"/>
      <meta property="og:title" content="Something else entirely"/>
      <meta property="og:url" content="${ORIGIN}/contact/"/>
      <meta property="og:image" content="${ORIGIN}/og.png"/>
      <meta name="twitter:card" content="summary_large_image"/>
    </head></html>`;
    const problems = audit(html);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^contact\/index\.html: og:title appears 2 times/);
  });

  it("accepts an audited key repeated with the same value", () => {
    // Untidy, but unambiguous — every reader gets the same answer, so there is
    // nothing here for a scraper to get wrong. Flagging it would be crying wolf.
    const html = `<html><head>
      <meta property="og:title" content="Contact"/>
      <meta property="og:title" content="Contact"/>
      <meta property="og:url" content="${ORIGIN}/contact/"/>
      <meta property="og:image" content="${ORIGIN}/og.png"/>
      <meta name="twitter:card" content="summary_large_image"/>
    </head></html>`;
    expect(audit(html)).toEqual([]);
  });

  it("ignores a duplicated tag it does not audit", () => {
    // This is the real out/404.html: the root layout emits one robots tag and
    // the page emits another. Harmless — nothing here reads robots, and search
    // engines take the more restrictive of the two. Guarding only the keys we
    // actually consume is what keeps this check honest instead of noisy.
    const html = `<html><head>
      <meta property="og:title" content="Page not found"/>
      <meta property="og:url" content="${ORIGIN}/404/"/>
      <meta property="og:image" content="${ORIGIN}/og.png"/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="robots" content="noindex"/>
      <meta name="robots" content="noindex, follow"/>
    </head></html>`;
    expect(audit(html, "404.html")).toEqual([]);
  });

  it("reports each conflicting key once, naming the file", () => {
    const html = `<html><head>
      <meta property="og:title" content="Contact"/>
      <meta property="og:title" content="Other"/>
      <meta property="og:url" content="${ORIGIN}/contact/"/>
      <meta property="og:url" content="${ORIGIN}/elsewhere/"/>
      <meta property="og:image" content="${ORIGIN}/og.png"/>
      <meta name="twitter:card" content="summary_large_image"/>
    </head></html>`;
    const problems = audit(html);
    expect(problems).toHaveLength(2);
    for (const p of problems) expect(p).toMatch(/^contact\/index\.html:/);
    expect(problems.join(" ")).toMatch(/og:title/);
    expect(problems.join(" ")).toMatch(/og:url/);
  });
});

describe("conflictingTags", () => {
  // Exercised through auditPage above; tested here directly because it is
  // exported and because the "same value twice" rule is the part most likely
  // to be tightened later into a false alarm.

  // Open Graph carries its key in `property`, Twitter in `name`. The return
  // type is stated rather than inferred: without it each branch infers the
  // other key as `undefined`, which does not satisfy Record<string, string>.
  const tags = (pairs: [string, string][]) =>
    pairs.map(([k, v]): Record<string, string> =>
      k.startsWith("og:") ? { property: k, content: v } : { name: k, content: v },
    );

  it("finds nothing when every audited key appears once", () => {
    expect(
      conflictingTags(
        tags([
          ["og:title", "Contact"],
          ["og:url", "https://example.com/contact/"],
          ["og:image", "https://example.com/og.png"],
          ["twitter:card", "summary_large_image"],
        ]),
      ),
    ).toEqual([]);
  });

  it("reports the key and both of its distinct values", () => {
    expect(
      conflictingTags(
        tags([
          ["og:title", "Contact"],
          ["og:title", "Other"],
        ]),
      ),
    ).toEqual([{ key: "og:title", values: ["Contact", "Other"] }]);
  });

  it("says nothing about keys outside the audited set", () => {
    // out/404.html really does render two robots tags. Nothing reads robots,
    // so widening this would fail a correct build.
    expect(
      conflictingTags(
        tags([
          ["robots", "noindex"],
          ["robots", "noindex, follow"],
        ]),
      ),
    ).toEqual([]);
  });
});

/** Temp directories built by fixture(), removed after each test. */
const tempDirs: string[] = [];

/** Writes a throwaway directory tree and returns its path. */
function fixture(files: Record<string, string | Buffer>): string {
  const dir = mkdtempSync(join(tmpdir(), "verify-built-output-"));
  tempDirs.push(dir);
  for (const [relPath, content] of Object.entries(files)) {
    const full = join(dir, relPath);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("builtPages", () => {
  it("finds every page, at any depth, as a path relative to the root", () => {
    const dir = fixture({
      "index.html": "",
      "404.html": "",
      "contact/index.html": "",
      "contact/thank-you/index.html": "",
      "lp/a/index.html": "",
    });

    expect(builtPages(dir)).toEqual([
      "404.html",
      "contact/index.html",
      "contact/thank-you/index.html",
      "index.html",
      "lp/a/index.html",
    ]);
  });

  it("returns paths in the exact shape expectedPath understands", () => {
    // The two functions have to agree or every page reports as an unrecognized
    // route. A leading "./", a backslash, or an absolute path would all break
    // that agreement while each function still looked correct alone.
    const dir = fixture({
      "index.html": "",
      "404.html": "",
      "_not-found/index.html": "",
      "conflict-calculator/index.html": "",
    });

    for (const relPath of builtPages(dir)) {
      expect(expectedPath(relPath), `expectedPath rejected ${relPath}`).not.toBeNull();
    }
  });

  it("skips _next, which holds assets rather than pages", () => {
    const dir = fixture({
      "index.html": "",
      "_next/static/chunk/index.html": "",
    });

    expect(builtPages(dir)).toEqual(["index.html"]);
  });

  it("ignores files that are not pages a visitor can land on", () => {
    const dir = fixture({
      "index.html": "",
      "sitemap.xml": "",
      "og.png": "",
      "robots.txt": "",
    });

    expect(builtPages(dir)).toEqual(["index.html"]);
  });

  it("returns an empty list for a tree with no pages at all", () => {
    // Recorded deliberately: on its own the walk is SILENT about finding
    // nothing, and "audited 0 pages" would otherwise read as a pass. What
    // stops that is main()'s separate check that out/index.html exists before
    // any walking starts. This test is the reminder that the guard lives
    // there, not here.
    expect(builtPages(fixture({ "readme.txt": "" }))).toEqual([]);
  });
});

describe("auditOgImageFile", () => {
  const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  it("accepts a file whose first bytes are a real PNG header", () => {
    const dir = fixture({ "og.png": Buffer.concat([PNG_HEADER, Buffer.from("...")]) });
    expect(auditOgImageFile(dir)).toEqual([]);
  });

  it("reports a missing og.png", () => {
    const problems = auditOgImageFile(fixture({ "index.html": "" }));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^og\.png: missing/);
  });

  it("rejects a file that is named .png but is not one", () => {
    // The whole reason this checks bytes rather than the filename. The original
    // failure was a file whose contents and name disagreed with the type it was
    // served as; trusting the name here would reproduce that blind spot.
    const dir = fixture({ "og.png": "<!doctype html><title>404</title>" });
    const problems = auditOgImageFile(dir);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/not a PNG/);
  });

  it("rejects a JPEG sitting where the PNG should be", () => {
    const dir = fixture({ "og.png": Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]) });
    expect(auditOgImageFile(dir).join(" ")).toMatch(/not a PNG/);
  });
});
