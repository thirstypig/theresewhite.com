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
 *  - out/og.png is the link-preview image; favicon.ico the tab icon.
 *  - CNAME tells GitHub Pages which domain this repository answers for.
 *  - .nojekyll is essential. That repository publishes from a branch, and a
 *    branch publish runs Jekyll, which silently drops any folder whose name
 *    starts with an underscore — _next included. Without this file the page
 *    loads as unstyled text with a calculator that does nothing.
 *
 * Usage: node scripts/build-calculator-site.mjs [outDir] [siteDir]
 * Defaults: out → calculator-site
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CALCULATOR_HOST = "calculator.theresewhite.com";

/**
 * Copies the calculator out of a finished build into siteDir.
 * Returns a list of problems; empty means the folder is ready to publish.
 *
 * @param {string} outDir
 * @param {string} siteDir
 * @returns {string[]}
 */
export function assembleCalculatorSite(outDir, siteDir) {
  const page = join(outDir, "calculator", "index.html");
  const required = [page, join(outDir, "_next"), join(outDir, "og.png")];
  const missing = required.filter((p) => !existsSync(p));
  if (missing.length > 0) {
    return missing.map((p) => `${p} not found. Run the build first.`);
  }

  // The page must have been built for the subdomain, not the main site.
  // Built for the main site, its canonical and link-preview URLs point at the
  // staging address, and every shared link would advertise that instead.
  const html = readFileSync(page, "utf8");
  if (!html.includes(`https://${CALCULATOR_HOST}/`)) {
    return [
      `${page} does not mention https://${CALCULATOR_HOST}/. Build with NEXT_PUBLIC_SITE_URL=https://${CALCULATOR_HOST}.`,
    ];
  }

  rmSync(siteDir, { recursive: true, force: true });
  mkdirSync(siteDir, { recursive: true });
  writeFileSync(join(siteDir, "index.html"), html);
  cpSync(join(outDir, "_next"), join(siteDir, "_next"), { recursive: true });
  cpSync(join(outDir, "og.png"), join(siteDir, "og.png"));
  if (existsSync(join(outDir, "favicon.ico"))) {
    cpSync(join(outDir, "favicon.ico"), join(siteDir, "favicon.ico"));
  }
  writeFileSync(join(siteDir, "CNAME"), `${CALCULATOR_HOST}\n`);
  writeFileSync(join(siteDir, ".nojekyll"), "");
  return [];
}

function main() {
  const outDir = process.argv[2] ?? "out";
  const siteDir = process.argv[3] ?? "calculator-site";
  const problems = assembleCalculatorSite(outDir, siteDir);
  if (problems.length > 0) {
    for (const problem of problems) console.error(`::error::${problem}`);
    process.exit(1);
  }
  console.log(`Calculator site assembled in ${siteDir}/ for ${CALCULATOR_HOST}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
