import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, it, expect } from "vitest";
import {
  addReviewOverlay,
  assembleCalculatorSite,
  assembleSite,
  localReferences,
  SITES,
} from "./build-calculator-site.mjs";

/**
 * calculator.theresewhite.com is published by copying one page out of a
 * build. Each test below is a way that copy can look successful and still
 * publish a broken site.
 */

const dirs: string[] = [];
afterEach(() => {
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

function fakeBuild(pageHtml: string): { out: string; site: string } {
  const root = mkdtempSync(join(tmpdir(), "calc-site-"));
  dirs.push(root);
  const out = join(root, "out");
  mkdirSync(join(out, "calculator"), { recursive: true });
  mkdirSync(join(out, "_next", "static"), { recursive: true });
  writeFileSync(join(out, "calculator", "index.html"), pageHtml);
  writeFileSync(join(out, "_next", "static", "app.js"), "// app");
  writeFileSync(join(out, "og.png"), "png");
  return { out, site: join(root, "site") };
}

const BUILT_FOR_SUBDOMAIN =
  '<meta property="og:url" content="https://calculator.theresewhite.com/">';

describe("assembleCalculatorSite", () => {
  it("publishes the page as the home page, with its scripts, image and domain", () => {
    const { out, site } = fakeBuild(BUILT_FOR_SUBDOMAIN);

    expect(assembleCalculatorSite(out, site)).toEqual([]);
    expect(readFileSync(join(site, "index.html"), "utf8")).toBe(BUILT_FOR_SUBDOMAIN);
    expect(existsSync(join(site, "_next", "static", "app.js"))).toBe(true);
    expect(existsSync(join(site, "og.png"))).toBe(true);
    expect(readFileSync(join(site, "CNAME"), "utf8")).toBe(
      "calculator.theresewhite.com\n",
    );
  });

  it("includes .nojekyll, without which the page loads with no styles or scripts", () => {
    // Regression guarded: the second repository publishes from a branch, so
    // GitHub runs Jekyll over it, and Jekyll drops every folder starting with
    // an underscore. That is _next — all of the page's CSS and JavaScript.
    const { out, site } = fakeBuild(BUILT_FOR_SUBDOMAIN);

    assembleCalculatorSite(out, site);
    expect(existsSync(join(site, ".nojekyll"))).toBe(true);
  });

  it("refuses a page built for the main site rather than the subdomain", () => {
    // Regression guarded: forgetting NEXT_PUBLIC_SITE_URL on the second build
    // still produces a working page — whose shared links all advertise the
    // staging address instead of calculator.theresewhite.com.
    const { out, site } = fakeBuild(
      '<meta property="og:url" content="https://theresewhite.bahtzang.com/calculator/">',
    );

    const problems = assembleCalculatorSite(out, site);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("NEXT_PUBLIC_SITE_URL");
    expect(existsSync(site)).toBe(false);
  });

  it("refuses to run before there is a build", () => {
    const root = mkdtempSync(join(tmpdir(), "calc-site-"));
    dirs.push(root);

    const problems = assembleCalculatorSite(join(root, "out"), join(root, "site"));
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.every((p) => p.includes("Run the build first"))).toBe(true);
  });

  it("copies every file the page refers to, such as the logo", () => {
    // Regression guarded: a fixed list of files to copy. The logo shows in
    // every local preview, which serves all of out/, and 404s only on the
    // subdomain, where nobody looks until a visitor does.
    const { out, site } = fakeBuild(
      `${BUILT_FOR_SUBDOMAIN}<img src="/brand/logo.webp"><link rel="icon" href="/favicon.ico?v=1">`,
    );
    mkdirSync(join(out, "brand"));
    writeFileSync(join(out, "brand", "logo.webp"), "webp");
    writeFileSync(join(out, "favicon.ico"), "ico");

    expect(assembleCalculatorSite(out, site)).toEqual([]);
    expect(existsSync(join(site, "brand", "logo.webp"))).toBe(true);
    expect(existsSync(join(site, "favicon.ico"))).toBe(true);
  });

  it("refuses a page that links to another page of the main site", () => {
    // The subdomain has one page, so a relative link to /about is a 404.
    const { out, site } = fakeBuild(`${BUILT_FOR_SUBDOMAIN}<a href="/about">About</a>`);
    mkdirSync(join(out, "about"));
    writeFileSync(join(out, "about", "index.html"), "<html>");

    const problems = assembleCalculatorSite(out, site);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("/about");
    expect(existsSync(site)).toBe(false);
  });
});

describe("assembleSite for book.theresewhite.com", () => {
  const BOOK_PAGE =
    '<meta property="og:url" content="https://book.theresewhite.com/">' +
    '<img src="/book/cover.webp">';

  function fakeBookBuild(pageHtml: string): { out: string; site: string } {
    const root = mkdtempSync(join(tmpdir(), "book-site-"));
    dirs.push(root);
    const out = join(root, "out");
    mkdirSync(join(out, "book"), { recursive: true });
    mkdirSync(join(out, "_next", "static"), { recursive: true });
    writeFileSync(join(out, "book", "index.html"), pageHtml);
    writeFileSync(join(out, "book", "cover.webp"), "webp");
    writeFileSync(join(out, "book", "og.png"), "book card");
    writeFileSync(join(out, "book", "from-meltdown-to-resolution.pdf"), "pdf");
    writeFileSync(join(out, "_next", "static", "app.js"), "// app");
    writeFileSync(join(out, "og.png"), "site card");
    return { out, site: join(root, "site") };
  }

  it("publishes the book page with its own domain and the cover as the link preview", () => {
    // Regression guarded: copying the site's generic card as og.png, which
    // would show a LinkedIn card with no book on it.
    const { out, site } = fakeBookBuild(BOOK_PAGE);

    expect(assembleSite(SITES.book, out, site)).toEqual([]);
    expect(readFileSync(join(site, "index.html"), "utf8")).toBe(BOOK_PAGE);
    expect(readFileSync(join(site, "og.png"), "utf8")).toBe("book card");
    expect(readFileSync(join(site, "CNAME"), "utf8")).toBe("book.theresewhite.com\n");
    expect(existsSync(join(site, ".nojekyll"))).toBe(true);
    expect(existsSync(join(site, "book", "cover.webp"))).toBe(true);
  });

  it("includes the PDF, even though the page's HTML never names it", () => {
    // Regression guarded: the download link only appears after signup, so a
    // scan of the built HTML cannot find it, and the button would 404.
    const { out, site } = fakeBookBuild(BOOK_PAGE);

    assembleSite(SITES.book, out, site);
    expect(
      readFileSync(join(site, "book", "from-meltdown-to-resolution.pdf"), "utf8"),
    ).toBe("pdf");
  });

  it("refuses to publish without the PDF", () => {
    const { out, site } = fakeBookBuild(BOOK_PAGE);
    rmSync(join(out, "book", "from-meltdown-to-resolution.pdf"));

    const problems = assembleSite(SITES.book, out, site);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("from-meltdown-to-resolution.pdf");
  });

  it("refuses the book page built for the calculator's address", () => {
    const { out, site } = fakeBookBuild(
      '<meta property="og:url" content="https://calculator.theresewhite.com/">',
    );

    const problems = assembleSite(SITES.book, out, site);
    expect(problems[0]).toContain("NEXT_PUBLIC_SITE_URL=https://book.theresewhite.com");
  });
});

describe("addReviewOverlay", () => {
  const HASH = "a".repeat(64);
  const REVIEW = { hash: HASH, api: "https://review.example.workers.dev", thread: "book:en:home" };

  function fakeSite(html = '<!DOCTYPE html><html><head><meta charSet="utf-8"/></head><body>page</body></html>') {
    const root = mkdtempSync(join(tmpdir(), "review-site-"));
    dirs.push(root);
    const site = join(root, "site");
    const review = join(root, "review");
    mkdirSync(site);
    mkdirSync(review);
    writeFileSync(join(site, "index.html"), html);
    writeFileSync(join(review, "gate.js"), "// gate");
    writeFileSync(join(review, "overlay.js"), "// overlay");
    return { site, review };
  }

  it("puts the password screen first in <head>, before anything is drawn", () => {
    // Regression guarded: a gate loaded late, or with `defer`, lets the page
    // flash on screen before it is hidden.
    const { site, review } = fakeSite();
    expect(addReviewOverlay(site, REVIEW, review)).toEqual([]);
    const html = readFileSync(join(site, "index.html"), "utf8");
    expect(html).toMatch(
      /^<!DOCTYPE html><html><head><script>window\.TW_REVIEW=\{[^<]*"thread":"book:en:home"\};<\/script><script src="\/review\/gate\.js"><\/script><script src="\/review\/overlay\.js" defer><\/script><meta/,
    );
    expect(existsSync(join(site, "review", "gate.js"))).toBe(true);
    expect(existsSync(join(site, "review", "overlay.js"))).toBe(true);
  });

  it("refuses anything that is not a hash, so a password typed in by mistake never ships", () => {
    const { site, review } = fakeSite();
    const problems = addReviewOverlay(site, { ...REVIEW, hash: "blue heron" }, review);
    expect(problems[0]).toContain("set-review-passphrase.sh");
    expect(readFileSync(join(site, "index.html"), "utf8")).not.toContain("blue heron");
  });

  it("refuses a thread name the comments service would reject", () => {
    const { site, review } = fakeSite();
    expect(addReviewOverlay(site, { ...REVIEW, thread: "Book:EN" }, review)).toHaveLength(1);
  });

  it("accepts a local copy of the comments service, but not a look-alike address", () => {
    const { site, review } = fakeSite();
    expect(addReviewOverlay(site, { ...REVIEW, api: "http://localhost:8787" }, review)).toEqual([]);
    const other = fakeSite();
    expect(
      addReviewOverlay(other.site, { ...REVIEW, api: "http://localhost.evil.example" }, other.review),
    ).toHaveLength(1);
  });

  it("refuses a comments address that could break out of the script tag", () => {
    const { site, review } = fakeSite();
    expect(
      addReviewOverlay(site, { ...REVIEW, api: 'https://x.dev/"</script><script>alert(1)' }, review),
    ).toHaveLength(1);
  });
});

describe("localReferences", () => {
  it("finds root-relative files, and skips scripts, the home page and other domains", () => {
    expect(
      localReferences(
        '<a href="/">Home</a><script src="/_next/static/a.js"></script>' +
          '<img src="/brand/logo.webp"><link href="/favicon.ico?x=1">' +
          '<a href="https://theresewhite.com">Wix</a><img src="//cdn.example/x.png">',
      ),
    ).toEqual(["/brand/logo.webp", "/favicon.ico"]);
  });
});
