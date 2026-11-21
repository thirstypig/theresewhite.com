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
 *
 * Since 2026-11-21 it also checks, for the same reason and in the same
 * place, that the pages meant to sit behind the admin password (/admin and
 * /stylebible) ship only their password screen. See auditLock below.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

/** The keys auditPage reads. Only these are guarded against conflicts. */
const AUDITED_KEYS = ["og:title", "og:url", "og:image", "twitter:card"];

/**
 * Audited keys that appear more than once with more than one distinct value.
 *
 * metaContent returns the FIRST match, which is only safe while a key appears
 * once. A key rendered twice with different values means this checker inspects
 * one value and a scraper may read another — the audit would pass while the
 * card was wrong. That is the original failure's exact shape: correct from
 * where we stand, wrong from where it matters.
 *
 * Repeats carrying the same value are not reported. Every reader gets the same
 * answer, so there is nothing to get wrong, and flagging it would be noise.
 *
 * Only audited keys are guarded, on purpose. out/404.html legitimately renders
 * two `robots` tags — one from the root layout, one from the page — and nothing
 * here reads robots. Widening this to every key would fail a correct build.
 *
 * @param {Record<string, string>[]} tags
 * @returns {{ key: string, values: string[] }[]}
 */
export function conflictingTags(tags) {
  return AUDITED_KEYS.map((key) => ({
    key,
    values: [
      ...new Set(
        tags
          .filter((t) => t.property === key || t.name === key)
          .map((t) => t.content),
      ),
    ],
  })).filter((c) => c.values.length > 1);
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

/**
 * Audits one built page. Returns every problem found rather than throwing on
 * the first, so a single CI run reports all of them.
 *
 * @param {{ relPath: string, html: string, origin: string, homepageTitle: string }} input
 * @returns {string[]}
 */
export function auditPage({ relPath, html, origin, homepageTitle }) {
  const path = expectedPath(relPath);
  if (path === null) {
    return [
      `${relPath}: unrecognized route path. Add a rule to expectedPath() — ` +
        `a route that is silently skipped is how the 404 shipped a broken card.`,
    ];
  }

  const problems = [];
  const tags = parseMetaTags(html);
  const ogTitle = metaContent(tags, "og:title");
  const ogUrl = metaContent(tags, "og:url");
  const ogImage = metaContent(tags, "og:image");
  const twitterCard = metaContent(tags, "twitter:card");

  // 1. The image must be the one with a file extension. GitHub Pages serves
  //    the extensionless out/opengraph-image as application/octet-stream, and
  //    scrapers drop it.
  const wantImage = `${origin}/og.png`;
  if (!ogImage) {
    problems.push(`${relPath}: no og:image`);
  } else if (ogImage !== wantImage) {
    problems.push(`${relPath}: og:image is "${ogImage}", want "${wantImage}"`);
  }

  // 2. og:url must name this page, on this origin. An inherited card always
  //    shows the homepage's "/" here, so this catches inheritance too.
  const wantUrl = `${origin}${path}`;
  if (!ogUrl) {
    problems.push(`${relPath}: no og:url`);
  } else if (ogUrl !== wantUrl) {
    problems.push(`${relPath}: og:url is "${ogUrl}", want "${wantUrl}"`);
  }

  // 3. The bug that started all this: a page that sets only title and
  //    description inherits the root layout's entire openGraph object, so its
  //    og:title is the homepage's, verbatim.
  if (!ogTitle) {
    problems.push(`${relPath}: no og:title`);
  } else if (relPath !== "index.html" && ogTitle === homepageTitle) {
    problems.push(
      `${relPath}: og:title is the homepage's ("${ogTitle}") — ` +
        `this card is inherited, not its own. Route the page through pageMetadata().`,
    );
  }

  // 4. summary is a small square thumbnail. A correct title with a weak card
  //    is still a weak post.
  if (twitterCard !== "summary_large_image") {
    problems.push(
      `${relPath}: twitter:card is "${twitterCard ?? "<none>"}", want "summary_large_image"`,
    );
  }

  // 5. Everything above read the first matching tag. If a key carries two
  //    different values, the checks above are answering a question a scraper
  //    might answer differently — so the audit could pass on a broken card.
  for (const { key, values } of conflictingTags(tags)) {
    problems.push(
      `${relPath}: ${key} appears ${values.length} times with different values ` +
        `(${values.map((v) => `"${v}"`).join(", ")}). This audit reads the first; ` +
        `a scraper may read another. Emit it once.`,
    );
  }

  return problems;
}

/**
 * Sections published behind the admin password screen
 * (src/components/admin-gate.tsx): /admin, and the style bible with its
 * sample pages, which criticizes the current design in plain terms.
 * Each ends in a slash so "admin/" does not also match "administration/".
 */
const LOCKED_SECTIONS = ["admin/", "stylebible/"];

/**
 * The most text a locked page may show before the password is entered. The
 * password screen ships one short sentence for visitors with JavaScript off;
 * the smallest real page in these sections is several thousand characters.
 */
const PASSWORD_SCREEN_TEXT_LIMIT = 200;

/** @param {string} relPath */
function isLockedPage(relPath) {
  return LOCKED_SECTIONS.some((section) => relPath.startsWith(section));
}

/**
 * Checks that a page in a locked section ships only the password screen.
 *
 * The lock is drawn by the browser, so the risk is a page whose words are
 * already in the HTML before any password is entered: a visitor with
 * JavaScript off, or a crawler, would read them. That happens if a page is
 * added outside the layout that applies the lock, or if the lock is changed
 * to draw the page underneath itself.
 *
 * What this does NOT check, on purpose: the words still travel with the page
 * as data inside <script> tags, ready for when the password is right. That
 * is the known limit of a lock on a site with no server, and it is why
 * nothing confidential belongs on these pages.
 *
 * Pages outside the locked sections return no problems.
 *
 * @param {{ relPath: string, html: string }} input
 * @returns {string[]}
 */
export function auditLock({ relPath, html }) {
  if (!isLockedPage(relPath)) return [];

  const withoutCode = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

  // From the first <main> to the LAST </main>. The sample homepages carry a
  // <main> of their own inside the layout's, and stopping at the first
  // closing tag would skip everything after it.
  const main = /<main\b[^>]*>([\s\S]*)<\/main>/i.exec(withoutCode);
  if (!main) {
    return [
      `${relPath}: no <main> found, so this check cannot tell whether the page is locked. ` +
        `Locked pages are expected to draw inside the layout's <main>.`,
    ];
  }

  if (!/\bdata-admin-gate\b/.test(main[1])) {
    return [
      `${relPath}: is not behind the password screen, so it would be published open. ` +
        `Pages under /stylebible are locked by src/app/(landing)/stylebible/layout.tsx; ` +
        `pages under /admin wrap themselves in <AdminGate>.`,
    ];
  }

  const text = main[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length > PASSWORD_SCREEN_TEXT_LIMIT) {
    return [
      `${relPath}: has the password screen but also ships ${text.length} characters of readable text ` +
        `before any password is entered, starting "${text.slice(0, 120)}". ` +
        `Only the password screen's own sentence should be there.`,
    ];
  }

  return [];
}

/** Filenames Next emits for a page a visitor can land on. */
const PAGE_FILES = new Set(["index.html", "404.html"]);

/**
 * Every built page under `dir`, as paths relative to it.
 *
 * @param {string} dir
 * @param {string} [root]
 * @returns {string[]}
 */
export function builtPages(dir, root = dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_next") continue; // assets, no pages
      found.push(...builtPages(full, root));
    } else if (PAGE_FILES.has(entry.name)) {
      found.push(relative(root, full));
    }
  }
  return found.sort();
}

/** The eight bytes every PNG starts with. */
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * @param {string} outDir
 * @returns {string[]}
 */
export function auditOgImageFile(outDir) {
  const file = join(outDir, "og.png");
  if (!existsSync(file)) {
    return [
      `og.png: missing. The build script copies out/opengraph-image to it — ` +
        `did next build stop emitting the generator?`,
    ];
  }
  const head = readFileSync(file).subarray(0, 8);
  return head.equals(PNG_MAGIC)
    ? []
    : [`og.png: not a PNG (first bytes ${head.toString("hex")})`];
}

function main() {
  // A folder can be named, so the deploy can audit the calculator site too:
  // node scripts/verify-built-output.mjs calculator-site
  const outDir = process.argv[2] ?? "out";

  if (!existsSync(join(outDir, "index.html"))) {
    console.error(`::error::${outDir}/index.html not found. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const homepageHtml = readFileSync(join(outDir, "index.html"), "utf8");
  const origin = originFromHomepage(homepageHtml);
  if (!origin) {
    console.error(
      `::error::Could not read an absolute og:url from ${outDir}/index.html. ` +
        "metadataBase in src/app/layout.tsx is what makes these absolute.",
    );
    process.exit(1);
  }
  const homepageTitle = metaContent(parseMetaTags(homepageHtml), "og:title") ?? "";

  const pages = builtPages(outDir);
  /** @param {string} relPath */
  const read = (relPath) => readFileSync(join(outDir, relPath), "utf8");

  const problems = pages.flatMap((relPath) =>
    auditPage({ relPath, html: read(relPath), origin, homepageTitle }),
  );
  problems.push(...auditOgImageFile(outDir));

  const lockedPages = pages.filter(isLockedPage);
  const lockProblems = lockedPages.flatMap((relPath) => auditLock({ relPath, html: read(relPath) }));

  // Both audits report before either one stops the deploy, so a single run
  // shows everything that is wrong.
  if (problems.length > 0) {
    for (const p of problems) console.error(`  ${p}`);
    console.error(
      `::error::${problems.length} link-preview problem(s) in ${pages.length} built pages. ` +
        `See docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md`,
    );
  }
  if (lockProblems.length > 0) {
    for (const p of lockProblems) console.error(`  ${p}`);
    console.error(
      `::error::${lockProblems.length} of the ${lockedPages.length} page(s) under /admin and /stylebible ` +
        `would be published without their password screen. See src/components/admin-gate.tsx.`,
    );
  }
  if (problems.length > 0 || lockProblems.length > 0) process.exit(1);

  console.log(`Link-preview audit clean: ${pages.length} pages on ${origin}`);
  // The calculator and book sites are one public page each, with nothing to lock.
  if (lockedPages.length > 0) {
    console.log(
      `Lock audit clean: ${lockedPages.length} pages under /admin and /stylebible ship only the password screen`,
    );
  }
}

// Only run when invoked directly, so the test file can import the pure parts
// without the walk firing. Compared as resolved absolute paths — a filename
// comparison matches any file with the same basename.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
