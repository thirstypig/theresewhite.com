import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

/**
 * Every route must build its metadata through pageMetadata().
 *
 * This is the guard for a failure that has now happened twice, and shipped
 * both times, because it is invisible from every angle a person normally
 * looks from.
 *
 * A page that sets only `title` and `description` still renders a correct
 * <title>, still returns 200, and still looks right in a browser. But Next
 * merges metadata shallowly per key, so that page inherits the root layout's
 * ENTIRE openGraph object — the homepage's title, the homepage's description,
 * an og:url pointing at "/", and the extensionless image path that GitHub
 * Pages serves as application/octet-stream. The damage only appears in
 * someone else's chat window, after the link has been sent.
 *
 * It caught nobody the first time because there was nothing to catch it.
 * The homepage had no metadata export at all; the 404 had no file at all.
 *
 * `src/lib/page-metadata.test.ts` covers what the helper produces. This
 * covers that the helper is actually used, which is the part that regressed.
 */

const APP_DIR = fileURLToPath(new URL(".", import.meta.url));

/**
 * Routes allowed to skip the helper, each with the reason. Empty on purpose:
 * there is currently no page that should opt out, and adding one should
 * require writing down why.
 */
const MAY_SKIP_PAGE_METADATA: Record<string, string> = {};

/** Files Next treats as a rendered route that a visitor can land on. */
const ROUTE_FILES = new Set([
  "page.tsx",
  "page.ts",
  "page.jsx",
  "page.js",
  "not-found.tsx",
  "not-found.ts",
  "not-found.jsx",
  "not-found.js",
]);

function routeFiles(dir: string = APP_DIR, prefix = ""): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_")) continue;
      found.push(...routeFiles(join(dir, entry.name), `${prefix}/${entry.name}`));
    } else if (ROUTE_FILES.has(entry.name)) {
      found.push(`${prefix}/${entry.name}`.replace(/^\//, ""));
    }
  }
  return found;
}

/** Source with block and line comments removed, so prose can't satisfy a check. */
function code(relativePath: string): string {
  return readFileSync(join(APP_DIR, relativePath), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

describe("page metadata coverage", () => {
  it("routes every page through pageMetadata()", () => {
    const offenders = routeFiles()
      .filter((f) => !(f in MAY_SKIP_PAGE_METADATA))
      .filter((f) => !/export const metadata[^=]*=\s*pageMetadata\(/.test(code(f)));

    // Asserting on the list rather than a count so a failure names the file.
    expect(offenders).toEqual([]);
  });

  it("has a root not-found page, because a missing file cannot be audited", () => {
    // The 404 shipped a broken card for a week not because its metadata was
    // wrong but because the file did not exist, so every check that walks
    // existing routes passed. An unmatched URL resolves to the ROOT
    // not-found; one inside a route group only covers that group.
    expect(existsSync(join(APP_DIR, "not-found.tsx"))).toBe(true);
  });

  it("keeps openGraph out of individual pages", () => {
    // A page that hand-rolls its own openGraph is how the tags drift apart
    // again: it is easy to set title and description there and forget
    // og:image, which is exactly the state this site shipped in. The helper
    // is the only place that block should be written.
    const offenders = routeFiles().filter((f) => /openGraph\s*:/.test(code(f)));

    expect(offenders).toEqual([]);
  });

  it("has no stale entries in the opt-out list", () => {
    const present = new Set(routeFiles());
    const stale = Object.keys(MAY_SKIP_PAGE_METADATA).filter(
      (f) => !present.has(f),
    );

    expect(stale).toEqual([]);
  });
});
