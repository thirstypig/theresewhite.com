/**
 * Where this deployment lives, and whether it's the real thing.
 *
 * The staging site is a copy of theresewhite.com's content. If search engines
 * index it, it competes with the live site for her own name and creates
 * duplicate content. So anything that isn't a production host is set to
 * noindex — deliberately, not by accident.
 *
 * This flag can fail in two directions and both are bad: a crawlable staging
 * duplicate, or the launched site shipping `noindex` and vanishing from
 * search. Covered by site-config.test.ts.
 */

const STAGING_URL = "https://theresewhite.bahtzang.com";

/**
 * Both forms count. The cutover checklist asks a human to set this by hand,
 * and "theresewhite.com" is at least as likely to be typed as the www form —
 * treating the apex as non-production would deindex the live site.
 */
export const PRODUCTION_HOSTS = [
  "www.theresewhite.com",
  "theresewhite.com",
] as const;

function firstValidUrl(...candidates: (string | undefined)[]): string {
  for (const candidate of candidates) {
    // `||` not `??`: an unset GitHub Actions variable interpolates to an
    // empty string, which `??` would happily pass through to new URL().
    const value = candidate?.trim();
    if (!value) continue;
    try {
      new URL(value);
      return value;
    } catch {
      // Malformed — fall through to the next candidate rather than throwing
      // at module load and taking the whole build down.
    }
  }
  return STAGING_URL;
}

export const SITE_URL = firstValidUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  STAGING_URL,
);

export const IS_PRODUCTION_SITE = (
  PRODUCTION_HOSTS as readonly string[]
).includes(new URL(SITE_URL).host.toLowerCase());

/**
 * The calculator's own address while theresewhite.com is still on Wix.
 *
 * The CI workflow runs a second build with NEXT_PUBLIC_SITE_URL set to this,
 * and publishes only the calculator from it (scripts/build-calculator-site.mjs).
 * That build is not a production host by the rule above, so it ships noindex;
 * the main site's /conflict-calculator is the page meant for search.
 */
export const CALCULATOR_SITE_URL = "https://calculator.theresewhite.com";

export const IS_CALCULATOR_SITE =
  new URL(SITE_URL).host.toLowerCase() === new URL(CALCULATOR_SITE_URL).host;

/**
 * Where the cookie banner's privacy link goes. The calculator site is a
 * single page with no /privacy of its own, so it points at the policy on the
 * live Wix site instead. Revisit at cutover, when /privacy on the main site
 * becomes the real one.
 */
export const PRIVACY_HREF = IS_CALCULATOR_SITE
  ? "https://www.theresewhite.com/privacy-policy"
  : "/privacy";
