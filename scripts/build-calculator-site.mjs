/**
 * Assembles calculator.theresewhite.com from a finished build.
 *
 * theresewhite.com is still on Wix, so the calculator is published on its own
 * subdomain, served free by GitHub Pages from a second repository
 * (thirstypig/theresewhite-calculator). The deploy workflow builds the site a
 * second time with NEXT_PUBLIC_SITE_URL=https://calculator.theresewhite.com,
 * runs this, and pushes the folder it writes to that repository.
 *
 * What goes in, and why each piece is needed:
 *  - out/calculator/index.html becomes the home page. Built with that site
 *    URL, its canonical and link-preview tags already say
 *    calculator.theresewhite.com/ (see src/app/(landing)/calculator/page.tsx).
 *  - out/_next is every script, stylesheet and font the page loads. The page
 *    addresses them from the site root, which is why the subdomain has to
 *    serve this folder at its root.
 *  - out/og.png is the link-preview image.
 *  - Every other file the page refers to from the site root, such as the
 *    logo and the tab icon, found by reading the page rather than listed
 *    here. A fixed list is how the logo would go missing: it shows in every
 *    local preview, which serves all of out/, and 404s only on the subdomain.
 *    A reference to something that is not a file in out/ (a link to /about,
 *    say) fails the build instead, because the subdomain has no other pages.
 *  - CNAME tells GitHub Pages which domain this repository answers for.
 *  - .nojekyll is essential. That repository publishes from a branch, and a
 *    branch publish runs Jekyll, which silently drops any folder whose name
 *    starts with an underscore — _next included. Without this file the page
 *    loads as unstyled text with a calculator that does nothing.
 *
 * The same steps publish book.theresewhite.com, the free-guide page, from
 * src/app/(landing)/book/page.tsx; see SITES below for what differs.
 *
 * Usage: node scripts/build-calculator-site.mjs [outDir] [siteDir] [site]
 * Defaults: out → calculator-site, site "calculator". For the book:
 * node scripts/build-calculator-site.mjs out book-site book
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CALCULATOR_HOST = "calculator.theresewhite.com";

/** The repository's root folder, where review/ lives. */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The one-page subdomains this script can publish. Each is a page from the
 * main build, published as the home page of its own address.
 *
 *  - `page`: the built page that becomes index.html.
 *  - `ogImage`: the built file published as og.png, the link-preview image
 *    every page names. The book uses a picture of its cover instead of the
 *    site's generic card.
 *  - `extras`: files the page needs that its HTML does not name, so the
 *    reference scan below cannot find them. The book's PDF is one: the
 *    download link only appears after someone signs up.
 */
export const SITES = {
  calculator: {
    host: CALCULATOR_HOST,
    page: "calculator/index.html",
    ogImage: "og.png",
    extras: [],
  },
  book: {
    host: "book.theresewhite.com",
    page: "book/index.html",
    ogImage: "book/og.png",
    extras: ["book/from-meltdown-to-resolution.pdf"],
  },
};

/**
 * Root-relative paths the page loads or links to, other than its own scripts
 * and styles under /_next/ and the home page itself. Query strings dropped.
 *
 * @param {string} html
 * @returns {string[]}
 */
export function localReferences(html) {
  const found = new Set();
  const pattern = /\b(?:src|href)="(\/(?!\/)[^"#?]*)/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const path = match[1];
    if (path === "/" || path.startsWith("/_next/")) continue;
    found.add(path);
  }
  return [...found].sort();
}

/**
 * Copies the calculator out of a finished build into siteDir.
 * Returns a list of problems; empty means the folder is ready to publish.
 *
 * @param {string} outDir
 * @param {string} siteDir
 * @returns {string[]}
 */
export function assembleCalculatorSite(outDir, siteDir) {
  return assembleSite(SITES.calculator, outDir, siteDir);
}

/**
 * Copies one subdomain's page out of a finished build into siteDir.
 * Returns a list of problems; empty means the folder is ready to publish.
 *
 * @param {{ host: string, page: string, ogImage: string, extras: string[] }} site
 * @param {string} outDir
 * @param {string} siteDir
 * @returns {string[]}
 */
export function assembleSite(site, outDir, siteDir) {
  const page = join(outDir, ...site.page.split("/"));
  const ogImage = join(outDir, ...site.ogImage.split("/"));
  const extras = site.extras.map((path) => join(outDir, ...path.split("/")));
  const required = [page, join(outDir, "_next"), ogImage, ...extras];
  const missing = required.filter((p) => !existsSync(p));
  if (missing.length > 0) {
    return missing.map((p) => `${p} not found. Run the build first.`);
  }

  // The page must have been built for the subdomain, not the main site.
  // Built for the main site, its canonical and link-preview URLs point at the
  // staging address, and every shared link would advertise that instead.
  const html = readFileSync(page, "utf8");
  if (!html.includes(`https://${site.host}/`)) {
    return [
      `${page} does not mention https://${site.host}/. Build with NEXT_PUBLIC_SITE_URL=https://${site.host}.`,
    ];
  }

  rmSync(siteDir, { recursive: true, force: true });
  mkdirSync(siteDir, { recursive: true });
  writeFileSync(join(siteDir, "index.html"), html);
  cpSync(join(outDir, "_next"), join(siteDir, "_next"), { recursive: true });
  cpSync(ogImage, join(siteDir, "og.png"));
  for (const path of site.extras) {
    mkdirSync(dirname(join(siteDir, path)), { recursive: true });
    cpSync(join(outDir, path), join(siteDir, path));
  }

  const problems = [];
  for (const path of localReferences(html)) {
    const source = join(outDir, path);
    if (!existsSync(source) || !statSync(source).isFile()) {
      problems.push(
        `The page refers to ${path}, which ${site.host} does not have. Link to the main site with a full address instead.`,
      );
      continue;
    }
    mkdirSync(dirname(join(siteDir, path)), { recursive: true });
    cpSync(source, join(siteDir, path));
  }
  if (problems.length > 0) {
    rmSync(siteDir, { recursive: true, force: true });
    return problems;
  }

  writeFileSync(join(siteDir, "CNAME"), `${site.host}\n`);
  writeFileSync(join(siteDir, ".nojekyll"), "");
  return [];
}

/**
 * Where reviewers' comments are stored: the theresewhite-review Worker in
 * workers/review/, on James's Cloudflare account.
 */
export const REVIEW_API = "https://theresewhite-review.jimmyc316.workers.dev";

/**
 * Puts the review password screen and the feedback panel (review/gate.js and
 * review/overlay.js) on an assembled one-page site.
 *
 * Runs after assembleSite, on the finished folder, so the two scripts never
 * reach the main site and the reference scan above never sees them. `hash` is
 * the SHA-256 of "theresewhite-review:" plus the lowercased password, made by
 * scripts/set-review-passphrase.sh; the password itself never reaches the
 * build. `thread` names the page's comment thread, such as "book:en:home".
 *
 * Returns a list of problems; empty means the page now asks for the password.
 *
 * @param {string} siteDir
 * @param {{ hash: string, api: string, thread: string }} review
 * @param {string} [reviewDir] where gate.js and overlay.js live
 * @returns {string[]}
 */
export function addReviewOverlay(siteDir, review, reviewDir = join(ROOT, "review")) {
  if (!/^[0-9a-f]{64}$/.test(review.hash)) {
    return ["REVIEW_PASSPHRASE_HASH is not a SHA-256 hash. Set it with scripts/set-review-passphrase.sh."];
  }
  // http is allowed only for a local copy of the Worker, when testing.
  if (!/^(https:\/\/[^\s"'<>]+|http:\/\/localhost(:\d+)?(\/[^\s"'<>]*)?)$/.test(review.api)) {
    return [`The review comments address "${review.api}" is not an https address.`];
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(review.thread)) {
    return [`"${review.thread}" is not a valid comment thread name.`];
  }
  const page = join(siteDir, "index.html");
  const html = readFileSync(page, "utf8");
  if (!/<head>/i.test(html)) return [`${page} has no <head> to put the password screen in.`];

  // The config is plain data, written as JSON with "<" escaped so nothing in it
  // can close the script tag. gate.js loads without `defer` so the page is
  // hidden before it is drawn; overlay.js waits for the page and the unlock.
  const config = JSON.stringify(review).replace(/</g, "\\u003c");
  const tags =
    `<script>window.TW_REVIEW=${config};</script>` +
    `<script src="/review/gate.js"></script>` +
    `<script src="/review/overlay.js" defer></script>`;
  writeFileSync(page, html.replace(/<head>/i, (m) => m + tags));

  mkdirSync(join(siteDir, "review"), { recursive: true });
  for (const name of ["gate.js", "overlay.js"]) {
    cpSync(join(reviewDir, name), join(siteDir, "review", name));
  }
  return [];
}

function main() {
  const outDir = process.argv[2] ?? "out";
  const siteDir = process.argv[3] ?? "calculator-site";
  const name = process.argv[4] ?? "calculator";
  const site = SITES[name];
  if (!site) {
    console.error(`::error::No site named "${name}". Known: ${Object.keys(SITES).join(", ")}.`);
    process.exit(1);
  }
  const problems = assembleSite(site, outDir, siteDir);
  if (problems.length > 0) {
    for (const problem of problems) console.error(`::error::${problem}`);
    process.exit(1);
  }
  console.log(`Site assembled in ${siteDir}/ for ${site.host}`);

  // The review password screen and feedback panel, while the page is under
  // review. Without the hash the page publishes open to everyone.
  const hash = (process.env.REVIEW_PASSPHRASE_HASH ?? "").trim();
  if (!hash) {
    console.log(
      `::warning::REVIEW_PASSPHRASE_HASH is not set, so ${site.host} has no review password or feedback panel.`,
    );
    return;
  }
  const reviewProblems = addReviewOverlay(siteDir, {
    hash,
    api: (process.env.REVIEW_API ?? "").trim() || REVIEW_API,
    thread: `${name}:en:home`,
  });
  if (reviewProblems.length > 0) {
    for (const problem of reviewProblems) console.error(`::error::${problem}`);
    process.exit(1);
  }
  console.log(`Review password and feedback panel added to ${site.host} (thread ${name}:en:home)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
