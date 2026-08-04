/**
 * Where this deployment lives, and whether it's the real thing.
 *
 * The staging site is a copy of theresewhite.com's content. If search engines
 * index it, it competes with the live Wix site for her own name and creates
 * duplicate content. So anything that isn't the production domain is set to
 * noindex — deliberately, not by accident.
 */

export const PRODUCTION_HOST = "www.theresewhite.com";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://theresewhite.bahtzang.com";

export const IS_PRODUCTION_SITE = new URL(SITE_URL).host === PRODUCTION_HOST;
