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
