import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * IS_PRODUCTION_SITE decides whether the site is indexable. Get it wrong in
 * one direction and a staging copy of Therese's own words competes with her
 * live site for her own name; get it wrong in the other and the real site
 * ships `noindex` and disappears from search.
 *
 * The module reads process.env at import time, so each case needs a fresh
 * module registry.
 */
async function loadWith(url: string | undefined) {
  vi.resetModules();
  if (url === undefined) {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  } else {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", url);
  }
  return import("./site-config");
}

describe("IS_PRODUCTION_SITE", () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllEnvs());

  it("is true for the production domain", async () => {
    const { IS_PRODUCTION_SITE } = await loadWith("https://www.theresewhite.com");
    expect(IS_PRODUCTION_SITE).toBe(true);
  });

  it("is true for the apex domain without www", async () => {
    // The cutover checklist tells someone to set this by hand. Rejecting the
    // apex form would silently ship the launched site as noindex — the exact
    // failure this flag exists to prevent, in reverse.
    const { IS_PRODUCTION_SITE } = await loadWith("https://theresewhite.com");
    expect(IS_PRODUCTION_SITE).toBe(true);
  });

  it("is false for the staging subdomain", async () => {
    const { IS_PRODUCTION_SITE } = await loadWith(
      "https://theresewhite.bahtzang.com",
    );
    expect(IS_PRODUCTION_SITE).toBe(false);
  });

  it("is false for a GitHub Pages preview URL", async () => {
    const { IS_PRODUCTION_SITE } = await loadWith(
      "https://thirstypig.github.io/theresewhite.com",
    );
    expect(IS_PRODUCTION_SITE).toBe(false);
  });

  it("is false for localhost", async () => {
    const { IS_PRODUCTION_SITE } = await loadWith("http://localhost:3160");
    expect(IS_PRODUCTION_SITE).toBe(false);
  });

  it("falls back to staging — never production — when unset", async () => {
    // Failing closed matters: an unset variable must not accidentally
    // publish a crawlable duplicate.
    const { IS_PRODUCTION_SITE, SITE_URL } = await loadWith(undefined);
    expect(IS_PRODUCTION_SITE).toBe(false);
    expect(SITE_URL).toContain("bahtzang.com");
  });

  it("is not fooled by a lookalike host that merely contains the domain", async () => {
    const { IS_PRODUCTION_SITE } = await loadWith(
      "https://www.theresewhite.com.evil.example",
    );
    expect(IS_PRODUCTION_SITE).toBe(false);
  });
});
