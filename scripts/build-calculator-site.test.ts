import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, it, expect } from "vitest";
import { assembleCalculatorSite } from "./build-calculator-site.mjs";

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
});
