# Built-Output Audit and Post-Deploy Content-Type Gate — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two CI gates so the 2026-08-11 link-preview failure cannot return silently — one that audits the built HTML before upload and can block the deploy, one that checks the deployed image's `Content-Type` header after.

**Architecture:** A dependency-free Node script, `scripts/verify-built-output.mjs`, splits into pure functions (path derivation, meta parsing, per-page audit) plus a thin `main()` that walks `out/`. The pure functions are unit-tested against fixture HTML reproducing the exact shapes that shipped broken. The workflow calls the script via `npm run verify:build` between `npm run build` and the artifact upload; a separate `curl` step in the `deploy` job checks the served header.

**Tech Stack:** Node 22 (ESM, `.mjs` — `package.json` has no `"type": "module"`), Vitest 4, GitHub Actions, Next.js 16 static export.

Full spec: `docs/superpowers/specs/2026-08-12-built-output-and-post-deploy-gates-design.md`

## Global Constraints

- **No new dependencies.** The script uses only `node:fs`, `node:path`, `node:url`. This site is deliberately zero-cost and minimal-dependency.
- **The site origin is read from `out/index.html`'s own `og:url`** — never from `NEXT_PUBLIC_SITE_URL`. That variable is set in the workflow job but not in a developer shell, and a check that only works inside CI is a check nobody runs before pushing.
- **Collect all violations, then fail once.** Every audit function returns an array of problem strings rather than throwing on the first. This matches `expect(offenders).toEqual([])` in `src/app/page-metadata-coverage.test.ts`: a failure names the files.
- **The three 404 artifacts all expect `/404/`:** `out/404.html`, `out/404/index.html`, `out/_not-found/index.html`. One source file, `src/app/not-found.tsx`, produces all three.
- **Baseline before starting:** `npm test` → 28 tests, 5 files, all passing.
- **Comment style:** this repo's tests and workflow steps carry a comment explaining *why the check exists* — what silently broke without it. Match that. See `.github/workflows/deploy.yml:34-38` and `src/app/page-metadata-coverage.test.ts:6-26`.

---

## File Structure

| File | Responsibility |
|---|---|
| `scripts/verify-built-output.mjs` | **New.** Pure functions: `expectedPath`, `parseMetaTags`, `metaContent`, `originFromHomepage`, `auditPage`. Plus `main()` doing fs walk, PNG check, reporting, exit code. |
| `scripts/verify-built-output.test.ts` | **New.** Unit tests for the pure functions, using fixture HTML of the historical bug shapes. |
| `vitest.config.mts` | **Modify.** Widen `include` so `scripts/` tests are discovered. |
| `package.json` | **Modify.** Add `verify:build` script. |
| `.github/workflows/deploy.yml` | **Modify.** Gate 4 after `npm run build`; Gate 5 after `deploy-pages`. |
| `DEPLOY.md` | **Modify.** "What the build checks" — three gates becomes five, and the "any of them failing stops the deploy" framing needs correcting since Gate 5 is post-deploy. Also fix the stale "15 unit tests". |
| `src/content/todos.ts` | **Modify.** Mark `og-image-content-type-gate` done, bump `TODOS_UPDATED`. |

---

## Task 1: Path derivation and meta-tag parsing

The pure core. No filesystem, no audit logic yet.

**Files:**
- Create: `scripts/verify-built-output.mjs`
- Create: `scripts/verify-built-output.test.ts`
- Modify: `vitest.config.mts:9`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `expectedPath(relPath: string): string | null` — built file path relative to `out/` → expected URL path, or `null` if unrecognized.
  - `parseMetaTags(html: string): Record<string, string>[]` — every `<meta>` tag as a lowercased-key attribute map.
  - `metaContent(tags: Record<string, string>[], key: string): string | undefined` — content of the tag whose `property` or `name` is `key`.
  - `originFromHomepage(html: string): string | null` — origin parsed from the homepage's `og:url`, e.g. `https://theresewhite.bahtzang.com`.

- [ ] **Step 1: Widen the vitest include so `scripts/` tests are found**

In `vitest.config.mts`, line 9:

```diff
-    include: ["src/**/*.test.ts"],
+    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
```

- [ ] **Step 2: Write the failing tests**

Create `scripts/verify-built-output.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  expectedPath,
  parseMetaTags,
  metaContent,
  originFromHomepage,
} from "./verify-built-output.mjs";

describe("expectedPath", () => {
  it("maps the homepage to /", () => {
    expect(expectedPath("index.html")).toBe("/");
  });

  it("maps a nested route to its trailing-slash path", () => {
    expect(expectedPath("contact/index.html")).toBe("/contact/");
    expect(expectedPath("contact/thank-you/index.html")).toBe("/contact/thank-you/");
    expect(expectedPath("lp/a/index.html")).toBe("/lp/a/");
  });

  // One source file, src/app/not-found.tsx, produces three built artifacts.
  // out/404.html is the file GitHub Pages serves on an unmatched URL — a Pages
  // convention, not a Next route. The other two are Next's internal _not-found
  // segment and the /404/ route it exports alongside. All three legitimately
  // carry og:url /404/, so a naive path rule fails a correct build.
  it("maps all three 404 artifacts to /404/", () => {
    expect(expectedPath("404.html")).toBe("/404/");
    expect(expectedPath("404/index.html")).toBe("/404/");
    expect(expectedPath("_not-found/index.html")).toBe("/404/");
  });

  it("returns null for a path it does not recognize", () => {
    // Assertion 6: an unclassified route must fail loudly rather than be
    // skipped. The original bug survived an audit precisely because the
    // audit walked what it recognized and the 404 was not in that set.
    expect(expectedPath("some-stray-file.html")).toBeNull();
  });
});

describe("parseMetaTags", () => {
  it("reads attributes regardless of their order in the tag", () => {
    const html = `
      <meta property="og:title" content="First"/>
      <meta content="Second" name="twitter:card"/>
    `;
    const tags = parseMetaTags(html);
    expect(metaContent(tags, "og:title")).toBe("First");
    expect(metaContent(tags, "twitter:card")).toBe("Second");
  });

  it("returns undefined for a tag that is not present", () => {
    expect(metaContent(parseMetaTags("<meta name='x'>"), "og:image")).toBeUndefined();
  });

  it("leaves HTML entities encoded, so comparisons stay byte-for-byte", () => {
    // Next renders & as &amp; and ' as &#x27;. Both sides of every comparison
    // come from built HTML, so decoding would add risk without adding value.
    const tags = parseMetaTags(`<meta property="og:title" content="A &amp; B"/>`);
    expect(metaContent(tags, "og:title")).toBe("A &amp; B");
  });
});

describe("originFromHomepage", () => {
  it("extracts the origin from the homepage og:url", () => {
    const html = `<meta property="og:url" content="https://theresewhite.bahtzang.com/"/>`;
    expect(originFromHomepage(html)).toBe("https://theresewhite.bahtzang.com");
  });

  it("returns null when og:url is missing or not absolute", () => {
    expect(originFromHomepage("<html></html>")).toBeNull();
    expect(originFromHomepage(`<meta property="og:url" content="/"/>`)).toBeNull();
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./verify-built-output.mjs`.

- [ ] **Step 4: Write the minimal implementation**

Create `scripts/verify-built-output.mjs`:

```js
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
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — 5 files, 28 prior tests plus 8 new.

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-built-output.mjs scripts/verify-built-output.test.ts vitest.config.mts
git commit -m "feat: add path derivation and meta parsing for the built-output audit

The three 404 artifacts are the wrinkle worth naming: one not-found.tsx
produces out/404.html, out/404/index.html and out/_not-found/index.html,
and all three correctly advertise /404/. A naive path rule derives
/404.html for the first and fails a good build.

Unrecognized paths return null rather than being skipped. The original
bug survived an audit because the audit walked what it recognized."
```

---

## Task 2: The per-page audit

The assertions themselves, tested against the exact shapes that shipped broken.

**Files:**
- Modify: `scripts/verify-built-output.mjs` (append `auditPage`)
- Modify: `scripts/verify-built-output.test.ts` (append a describe block)

**Interfaces:**
- Consumes: `expectedPath`, `parseMetaTags`, `metaContent` from Task 1.
- Produces: `auditPage({ relPath, html, origin, homepageTitle }): string[]` — array of human-readable problem strings, empty when the page is correct. `relPath` is relative to `out/`; `origin` has no trailing slash; `homepageTitle` is the raw `og:title` content of `out/index.html`.

- [ ] **Step 1: Write the failing tests**

Append to `scripts/verify-built-output.test.ts`:

```ts
import { auditPage } from "./verify-built-output.mjs";

const ORIGIN = "https://theresewhite.bahtzang.com";
const HOME_TITLE = "L. Therese White — Employment Mediator";

/** A correct non-homepage page, as a base for mutation in each test. */
function page({
  title = "Contact",
  url = `${ORIGIN}/contact/`,
  image = `${ORIGIN}/og.png`,
  card = "summary_large_image",
} = {}) {
  return `<html><head>
    <meta property="og:title" content="${title}"/>
    <meta property="og:url" content="${url}"/>
    <meta property="og:image" content="${image}"/>
    <meta name="twitter:card" content="${card}"/>
  </head></html>`;
}

const audit = (html: string, relPath = "contact/index.html") =>
  auditPage({ relPath, html, origin: ORIGIN, homepageTitle: HOME_TITLE });

describe("auditPage", () => {
  it("accepts a correct page", () => {
    expect(audit(page())).toEqual([]);
  });

  it("accepts the homepage carrying the homepage title", () => {
    const html = page({ title: HOME_TITLE, url: `${ORIGIN}/` });
    expect(auditPage({
      relPath: "index.html", html, origin: ORIGIN, homepageTitle: HOME_TITLE,
    })).toEqual([]);
  });

  it("accepts out/404.html advertising /404/", () => {
    const html = page({ title: "Page not found", url: `${ORIGIN}/404/` });
    expect(audit(html, "404.html")).toEqual([]);
  });

  it("accepts the three 404 artifacts sharing a title with each other", () => {
    // They are one page wearing three hats. The uniqueness check is only ever
    // against the homepage's title, never across pages generally.
    const html = page({ title: "Page not found", url: `${ORIGIN}/404/` });
    for (const p of ["404.html", "404/index.html", "_not-found/index.html"]) {
      expect(audit(html, p)).toEqual([]);
    }
  });

  // --- the shapes that actually shipped ---

  it("rejects a page carrying the homepage's card (the original bug)", () => {
    const html = page({ title: HOME_TITLE, url: `${ORIGIN}/` });
    const problems = audit(html);
    expect(problems).toHaveLength(2);
    expect(problems.join(" ")).toMatch(/og:title/);
    expect(problems.join(" ")).toMatch(/og:url/);
  });

  it("rejects the extensionless og:image path", () => {
    const html = page({ image: `${ORIGIN}/opengraph-image` });
    expect(audit(html).join(" ")).toMatch(/og:image/);
  });

  it("rejects a missing og:image altogether", () => {
    const html = `<html><head>
      <meta property="og:title" content="Contact"/>
      <meta property="og:url" content="${ORIGIN}/contact/"/>
      <meta name="twitter:card" content="summary_large_image"/>
    </head></html>`;
    expect(audit(html).join(" ")).toMatch(/no og:image/);
  });

  it("rejects the small twitter card", () => {
    expect(audit(page({ card: "summary" })).join(" ")).toMatch(/twitter:card/);
  });

  it("rejects a page on a different origin from the homepage's", () => {
    const html = page({ url: "https://example.com/contact/" });
    expect(audit(html).join(" ")).toMatch(/og:url/);
  });

  it("rejects an unrecognized route path without checking its tags", () => {
    const problems = audit(page(), "stray.html");
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/unrecognized/);
  });

  it("names the file in every problem it reports", () => {
    // A CI failure that does not say which file it means costs a build to
    // find out. Every message is prefixed with the path.
    const html = page({ title: HOME_TITLE, card: "summary" });
    const problems = audit(html);
    expect(problems.length).toBeGreaterThan(0);
    for (const p of problems) expect(p).toMatch(/^contact\/index\.html:/);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `auditPage` is not exported.

- [ ] **Step 3: Write the minimal implementation**

Append to `scripts/verify-built-output.mjs`:

```js
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

  return problems;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all new `auditPage` tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-built-output.mjs scripts/verify-built-output.test.ts
git commit -m "feat: audit each built page's Open Graph card

Four assertions per page, each tied to a failure that shipped: the
extensionless og:image GitHub Pages typed as octet-stream, an og:url
still pointing at /, an og:title inherited verbatim from the homepage,
and the small twitter card that renders a bare line of text.

Tested by rejection — the fixtures are the broken shapes themselves, so
a checker that stops catching them fails its own suite."
```

---

## Task 3: The CLI wrapper

Walks `out/`, checks the PNG, reports, sets the exit code.

**Files:**
- Modify: `scripts/verify-built-output.mjs` (append fs walk and `main()`)
- Modify: `package.json:8` (add `verify:build`)

**Interfaces:**
- Consumes: `auditPage`, `originFromHomepage` from Tasks 1–2.
- Produces: `npm run verify:build` — exits 0 when the output is clean, 1 with a listed report otherwise.

- [ ] **Step 1: Add the imports at the top of the file**

ES module `import` statements are hoisted, so appending them would work — but put them at the top of `scripts/verify-built-output.mjs`, above the file's doc comment's closing, where anyone reading the file expects them:

```js
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
```

- [ ] **Step 2: Append the walk, the PNG check, and main()**

Append to the end of `scripts/verify-built-output.mjs`:

```js
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
  const outDir = "out";

  if (!existsSync(join(outDir, "index.html"))) {
    console.error(`::error::${outDir}/index.html not found. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const homepageHtml = readFileSync(join(outDir, "index.html"), "utf8");
  const origin = originFromHomepage(homepageHtml);
  if (!origin) {
    console.error(
      "::error::Could not read an absolute og:url from out/index.html. " +
        "metadataBase in src/app/layout.tsx is what makes these absolute.",
    );
    process.exit(1);
  }
  const homepageTitle = metaContent(parseMetaTags(homepageHtml), "og:title") ?? "";

  const pages = builtPages(outDir);
  const problems = pages.flatMap((relPath) =>
    auditPage({
      relPath,
      html: readFileSync(join(outDir, relPath), "utf8"),
      origin,
      homepageTitle,
    }),
  );
  problems.push(...auditOgImageFile(outDir));

  if (problems.length > 0) {
    for (const p of problems) console.error(`  ${p}`);
    console.error(
      `::error::${problems.length} link-preview problem(s) in ${pages.length} built pages. ` +
        `See docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md`,
    );
    process.exit(1);
  }

  console.log(`Link-preview audit clean: ${pages.length} pages on ${origin}`);
}

// Only run when invoked directly, so the test file can import the pure parts
// without the walk firing. Compared as resolved absolute paths — a filename
// comparison matches any file with the same basename.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
```

- [ ] **Step 3: Add the npm script**

In `package.json`, after the `build` line:

```diff
     "build": "next build && cp out/opengraph-image out/og.png",
+    "verify:build": "node scripts/verify-built-output.mjs",
     "serve": "npx serve out -l 3160",
```

- [ ] **Step 4: Run it against the real built output**

Run: `npm run build && npm run verify:build`
Expected: PASS — `Link-preview audit clean: 20 pages on https://theresewhite.bahtzang.com`

If it reports problems, they are real: read them before changing the checker. The current `out/` was verified clean by hand during design.

- [ ] **Step 5: Prove it actually fails on a broken build**

The checker has to be shown failing against real output, not only fixtures.

```bash
cp out/contact/index.html /tmp/contact-backup.html
sed -i '' 's|og:image" content="[^"]*"|og:image" content="https://theresewhite.bahtzang.com/opengraph-image"|' out/contact/index.html
npm run verify:build; echo "exit=$?"
cp /tmp/contact-backup.html out/contact/index.html
```

Expected: exit=1, with a line naming `contact/index.html` and `og:image`.
Then re-run `npm run verify:build` and expect exit 0 again.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: PASS, all files.

- [ ] **Step 7: Commit**

```bash
git add scripts/verify-built-output.mjs package.json
git commit -m "feat: wire the built-output audit as npm run verify:build

Walks out/ for index.html and 404.html, reads the origin from the
homepage's own og:url rather than the environment so the check runs
locally as well as in CI, and verifies out/og.png is really a PNG by its
magic bytes rather than its name.

Verified both directions against real output: clean on 20 pages, and
exit 1 naming the file when an og:image is reverted to the
extensionless path."
```

---

## Task 4: Wire both gates into the workflow

**Files:**
- Modify: `.github/workflows/deploy.yml` (one step after line 57, one step after line 82)

**Interfaces:**
- Consumes: `npm run verify:build` from Task 3.
- Produces: a `build` job that fails before upload on a bad card, and a `deploy` job that fails after publish on a bad `Content-Type`.

- [ ] **Step 1: Add Gate 4 to the build job**

In `.github/workflows/deploy.yml`, immediately after `- run: npm run build` (line 57) and before the "Assert assets are addressed from the site root" step:

```yaml
      # Every page's link-preview card, checked in the built HTML rather than
      # the source. The source looked correct at three separate points while
      # the output was wrong — that is the whole lesson of the 2026-08-11
      # failure, which shipped for a week with every page returning 200.
      # See docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md
      - name: Assert every page ships its own link-preview card
        run: npm run verify:build
```

- [ ] **Step 2: Add Gate 5 to the deploy job**

In the same file, append to the `deploy` job's `steps:`, after the `- id: deployment` step:

```yaml
      # The other half of the same failure, and the half no pre-deploy check
      # can see: Next emits out/opengraph-image with no extension, GitHub
      # Pages types files by extension, and an extensionless PNG is served as
      # application/octet-stream. Valid bytes, 200 response, and LinkedIn,
      # Facebook and iMessage all drop the image because they dispatch on the
      # header. The build copies it to og.png, which fixes it; this proves the
      # fix is still true on the wire.
      #
      # This cannot block the deploy — the artifact is live by the time it
      # runs. It is an alarm, and it covers the one thing our code does not
      # control: GitHub's typing behaviour, which the post-mortem records as
      # observed rather than documented.
      - name: Assert the link-preview image is served as an image
        run: |
          url="${{ steps.deployment.outputs.page_url }}og.png?ci=${{ github.run_id }}"
          for attempt in 1 2 3 4 5; do
            ct=$(curl -sI "$url" | tr -d '\r' \
                 | awk -F': ' 'tolower($1)=="content-type"{print tolower($2)}')
            case "$ct" in
              image/png*) echo "og.png served as $ct"; exit 0 ;;
            esac
            echo "attempt $attempt: content-type was '${ct:-<none>}', retrying in 10s"
            sleep 10
          done
          echo "::error::og.png is served as '${ct:-<none>}', not image/png. Link previews will drop the image on LinkedIn, Facebook and iMessage. See docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md"
          exit 1
```

Three details that are load-bearing and must not be simplified away:

- The **retry loop**: `deploy-pages` returns when GitHub reports the deployment complete, which is not the instant the CDN serves it everywhere. Without backoff this flakes, and a flaky gate gets deleted.
- **`?ci=<run_id>`**: Pages ignores query strings for static files, so this fetches the same bytes with a guaranteed cache miss. Without it the check can read a response cached from before this deploy.
- **`page_url`, not a hardcoded domain**: it follows the site through the Wix cutover with no edit.

- [ ] **Step 3: Check the YAML parses**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml')); print('valid')"`
Expected: `valid`

- [ ] **Step 4: Confirm the step order is right**

Run: `grep -n 'name:\|- run:\|- uses:\|- id:' .github/workflows/deploy.yml`
Expected: in the `build` job, `npm run build` comes before `verify:build`, which comes before `upload-pages-artifact`. In the `deploy` job, the curl step comes after `deploy-pages`.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: gate the deploy on the link-preview card, and alarm on its header

Gate 4 runs after the build and before the upload, so a regression in
any page's card fails the run instead of shipping. Gate 5 runs after
deploy-pages, because that is the only place page_url exists, and
checks the one half no pre-deploy step can see — how GitHub chooses to
type the file it is serving.

The retry loop and the ?ci= cache-buster are both load-bearing: without
backoff the check flakes on CDN propagation, and without the buster it
can pass on a response cached from before this deploy."
```

---

## Task 5: Update the docs and the todo list

**Files:**
- Modify: `DEPLOY.md` (the "What the build checks before it publishes" section)
- Modify: `src/content/todos.ts` (the `og-image-content-type-gate` entry, and `TODOS_UPDATED` on line 13)

- [ ] **Step 1: Rewrite the DEPLOY.md gate section**

Replace the "### What the build checks before it publishes" section and its numbered list with:

```markdown
### What the build checks before it publishes

Five gates. The first four run before anything is uploaded and any of them
failing stops the deploy, which is the point — each exists because the
corresponding failure is otherwise silent. The fifth runs after publish and can
only raise the alarm.

1. **Pages source is `workflow`.** Queries the Pages API and fails if the
   source has been switched to "Deploy from a branch". Without this, that
   change breaks nothing until the *next* push, which then republishes the
   repo source as a Jekyll site while still returning 200.
2. **`npm test`.** The unit suite. The calculator figures are pinned to a
   golden vector, the staging `noindex` switch is covered in both directions,
   every route is asserted to build its metadata through `pageMetadata()`, and
   the built-output auditor is itself tested against the broken shapes it has
   to catch.
3. **Asset paths.** Confirms `out/index.html` still addresses `/_next/*` from
   the site root. A stray `basePath` would 404 every stylesheet and script
   while the HTML kept returning 200.
4. **Link-preview cards.** `npm run verify:build` walks the built HTML and
   checks that every page names `/og.png`, advertises its own `og:url`, and
   carries its own `og:title` rather than the homepage's. A page that sets only
   a title and description inherits the whole homepage card, and nothing else
   in the toolchain notices.
5. **The served image header** *(post-deploy)*. Fetches `og.png` from the live
   URL and fails unless it comes back as `image/png`. Next emits the generated
   image with no file extension and GitHub Pages types files by extension, so
   it was served as `application/octet-stream` — a valid PNG that every
   scraper drops. This one runs after the artifact is live, so it reports
   rather than prevents.

Gate 4 is runnable locally: `npm run build && npm run verify:build`.

Background: `docs/solutions/deployment-issues/nextjs-static-export-github-pages-source-and-subpath.md`
and `docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md`
```

The old text said "Three gates" and "15 unit tests". Both are stale — the suite is well past 15, so the count is deliberately not restated.

- [ ] **Step 2: Mark the todo done**

In `src/content/todos.ts`, in the `og-image-content-type-gate` entry, change `status: "open"` to `status: "done"` and replace the `detail` string with:

```ts
    detail:
      "Done. Two gates now cover this, not one. npm run verify:build walks the built HTML before upload and fails if any page names the wrong image, advertises the wrong og:url, or carries the homepage's og:title instead of its own — that last one is the inheritance bug that started this, checked in the output rather than the source. A post-deploy step then fetches og.png from the live URL and fails unless it is served as image/png. The post-deploy half cannot prevent a bad deploy, only report it, which is acceptable because it covers the one thing our code does not control: GitHub types files by extension, and that behaviour is observed rather than documented. Plan: docs/superpowers/plans/2026-08-12-built-output-and-post-deploy-gates.md.",
```

- [ ] **Step 3: Check TODOS_UPDATED reads today's date**

Run: `date +%F && grep -n TODOS_UPDATED src/content/todos.ts`

`src/content/todos.ts:13` currently reads `"2026-08-12"`. If that matches today, leave it — the admin page shows it as the date of the last sweep, and rewriting it to the same value is noise. If today is later, set it to today.

- [ ] **Step 4: Verify the admin page still builds**

Run: `npm run build && npm run verify:build && npm test`
Expected: all pass. `/admin/todo` renders the todo list, so a malformed entry breaks the build.

- [ ] **Step 5: Commit**

```bash
git add DEPLOY.md src/content/todos.ts
git commit -m "docs: describe the two new gates and close the todo

DEPLOY.md said three gates and 15 unit tests; both were stale. It now
distinguishes the four that stop a deploy from the fifth that can only
report one, since that difference decides what you do when it goes red."
```

---

## Verification

After all five tasks:

```bash
npm test                              # every unit test, incl. the auditor's own
npm run build && npm run verify:build # the gate, against real output
npm run lint                          # eslint
git log --oneline -5                  # five commits, one per task
```

The workflow changes cannot be verified locally. On the first push to `main`, watch the Actions run and confirm:

- The "Assert every page ships its own link-preview card" step appears in the `build` job and passes.
- The "Assert the link-preview image is served as an image" step appears in the `deploy` job, and either passes on the first attempt or passes on a retry.

If Gate 5 exhausts all five attempts on a green deploy, the propagation window is longer than 50 seconds — raise the attempt count rather than deleting the gate.
