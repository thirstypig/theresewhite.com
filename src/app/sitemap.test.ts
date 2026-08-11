import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, afterEach, vi } from "vitest";

/**
 * The sitemap is hand-maintained, and nothing connects it to the app
 * directory. A new page reaches production, returns 200, looks completely
 * fine, and is never submitted to a search engine — a failure with no
 * symptom.
 *
 * Every exclusion below is a decision someone made on purpose. Recording the
 * reason here is the point: the alternative is a silent absence that the next
 * person has to reconstruct from git history.
 */

const APP_DIR = fileURLToPath(new URL(".", import.meta.url));

const NOT_IN_SITEMAP: Record<string, string> = {
  "/admin": "Password-gated. Nothing there should be discoverable.",
  "/admin/todo": "Password-gated. Nothing there should be discoverable.",
  "/conflict-calculator":
    "noindex until the ad campaign runs. Footer-linked, so it is reachable by browsing — but deliberately kept out of search until launch. Launching it is a todo.",
  "/contact/thank-you": "Post-submit confirmation. noindex.",
  "/collaborate/thank-you": "Post-submit confirmation. noindex.",
};

/**
 * Every route in the app directory, derived from the page files.
 *
 * The folder-name-to-URL mapping is not one-to-one, and getting it wrong
 * fails in the dangerous direction: a derived path that matches nothing in
 * the sitemap looks like a missing page, and the honest fix — adding it to
 * the exclusion list — would permanently hide a real page from this check.
 *
 * Route groups are the case that actually bit. Moving the site into
 * `(site)/` to give landing pages a chrome-free layout changed no URLs, but
 * turned every derived path into `/(site)/about` and failed all three
 * assertions at once.
 */
const PAGE_FILES = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);

function routesInAppDir(dir: string = APP_DIR, prefix = ""): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      // `_private` folders are opted out of routing by Next entirely.
      if (entry.name.startsWith("_")) continue;
      // Route groups `(name)` and parallel-route slots `@slot` organize files
      // without contributing a URL segment.
      const isTransparent =
        /^\(.+\)$/.test(entry.name) || entry.name.startsWith("@");
      const next = isTransparent ? prefix : `${prefix}/${entry.name}`;
      found.push(...routesInAppDir(join(dir, entry.name), next));
    } else if (PAGE_FILES.has(entry.name)) {
      found.push(prefix === "" ? "/" : prefix);
    }
  }
  return found;
}

/**
 * sitemap() returns [] unless the build is production, so the env has to be
 * stubbed before the module is imported — same pattern as site-config.test.ts.
 */
async function sitemapPaths(): Promise<string[]> {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.theresewhite.com");
  const [{ default: sitemap }, { SITE_URL }] = await Promise.all([
    import("./sitemap"),
    import("@/lib/site-config"),
  ]);
  return sitemap().map((entry) => entry.url.replace(SITE_URL, "") || "/");
}

describe("sitemap coverage", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("lists every page that isn't explicitly excluded", async () => {
    const listed = new Set(await sitemapPaths());
    const missing = routesInAppDir().filter(
      (route) => !listed.has(route) && !(route in NOT_IN_SITEMAP),
    );
    expect(missing).toEqual([]);
  });

  it("has no stale exclusions", () => {
    // An exclusion for a page that no longer exists is a lie about the site.
    const routes = new Set(routesInAppDir());
    const stale = Object.keys(NOT_IN_SITEMAP).filter((route) => !routes.has(route));
    expect(stale).toEqual([]);
  });

  it("excludes nothing that the sitemap also lists", async () => {
    // Contradictory intent: excluded for a reason, yet published anyway.
    const listed = new Set(await sitemapPaths());
    const both = Object.keys(NOT_IN_SITEMAP).filter((route) => listed.has(route));
    expect(both).toEqual([]);
  });
});
