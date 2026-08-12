/**
 * Audits the built static export before it is uploaded to GitHub Pages.
 *
 * This exists because of the link-preview failure of 2026-08-11, which shipped
 * for a week while every page returned 200, every <title> was correct, and the
 * build was green. The damage lived only in the Open Graph tags, which nobody
 * sees while browsing and every link scraper reads.
 *
 * It deliberately reads out/ rather than src/. The source looked correct at
 * three separate points during that fix while the output was wrong, and
 * src/app/page-metadata-coverage.test.ts already covers the source side.
 *
 * Post-mortem:
 * docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md
 */

/**
 * Built path relative to out/ → the URL path that file should advertise.
 * Returns null for anything unrecognized, which the caller treats as a
 * failure rather than a skip.
 *
 * @param {string} relPath
 * @returns {string | null}
 */
export function expectedPath(relPath) {
  if (relPath === "index.html") return "/";

  // src/app/not-found.tsx emits three artifacts; all three advertise /404/.
  if (relPath === "404.html") return "/404/";
  if (relPath === "404/index.html") return "/404/";
  if (relPath === "_not-found/index.html") return "/404/";

  const nested = /^(.+)\/index\.html$/.exec(relPath);
  return nested ? `/${nested[1]}/` : null;
}

/**
 * Every <meta> tag in the document as an attribute map with lowercased keys.
 * Attribute order is not assumed: Next's output order is an implementation
 * detail, and a parser that depends on it breaks on a Next upgrade rather
 * than on a real regression.
 *
 * @param {string} html
 * @returns {Record<string, string>[]}
 */
export function parseMetaTags(html) {
  const tags = [];
  const tagPattern = /<meta\b([^>]*)>/gi;
  let tag;
  while ((tag = tagPattern.exec(html)) !== null) {
    /** @type {Record<string, string>} */
    const attrs = {};
    const attrPattern = /([a-zA-Z:_-]+)\s*=\s*"([^"]*)"/g;
    let attr;
    while ((attr = attrPattern.exec(tag[1])) !== null) {
      attrs[attr[1].toLowerCase()] = attr[2];
    }
    tags.push(attrs);
  }
  return tags;
}

/**
 * Content of the meta tag identified by `property` or `name`. Open Graph uses
 * `property`, Twitter uses `name`, and this looks in both.
 *
 * @param {Record<string, string>[]} tags
 * @param {string} key
 * @returns {string | undefined}
 */
export function metaContent(tags, key) {
  const found = tags.find((t) => t.property === key || t.name === key);
  return found ? found.content : undefined;
}

/**
 * The site origin, read from the homepage's own og:url.
 *
 * Deliberately not read from NEXT_PUBLIC_SITE_URL: that is set in the workflow
 * job but not in a developer shell, and a check that only runs inside CI is a
 * check nobody runs before pushing.
 *
 * @param {string} homepageHtml
 * @returns {string | null}
 */
export function originFromHomepage(homepageHtml) {
  const url = metaContent(parseMetaTags(homepageHtml), "og:url");
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}
