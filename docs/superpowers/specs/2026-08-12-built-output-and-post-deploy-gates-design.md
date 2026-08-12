# Two CI gates for the link-preview card: built-output audit and served Content-Type

**Date:** 2026-08-12
**Status:** approved, ready for implementation planning

## Problem

The link-preview failure of 2026-08-11 shipped for a week and was invisible from
every angle anyone normally looks from. Every page returned 200, every `<title>`
was correct, the build was green, and the damage only existed in someone else's
chat window after a link had been sent. The post-mortem is at
`docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md`.

It was fixed in two halves:

1. **Inheritance** — a single `openGraph` block in the root layout is not a
   default. Next merges metadata shallowly, per key, so every page that set only
   `title` and `description` shipped the homepage's entire card. Fixed by
   routing every route through `pageMetadata()`.
2. **Content-Type** — Next's `opengraph-image.tsx` convention emits
   `out/opengraph-image` with no file extension, and GitHub Pages serves an
   extensionless file as `application/octet-stream`. The bytes were a valid PNG
   and the response was a 200, but scrapers dispatch on the header, so the image
   was dropped. Fixed by `cp out/opengraph-image out/og.png` in the build script.

Both fixes are in place. **Neither is verified by CI.**

The three existing gates in `.github/workflows/deploy.yml` are all pre-deploy
and none of them fetch a URL:

| Gate | Catches |
|---|---|
| Pages source is `workflow` | Settings flipped to branch-deploy |
| `npm test` | Unit-level regressions, including metadata coverage |
| `grep '"/_next/' out/index.html` | A stray `basePath` 404-ing every asset |

There is a fourth thing worth naming. `src/app/page-metadata-coverage.test.ts`
greps **source** for `export const metadata = pageMetadata(`, while the
post-mortem's own headline lesson is the opposite:

> Grep the built output, never the source. The source looked correct at three
> separate points in this fix while the output was wrong.

The source check is a good proxy and should stay. It is not the same thing as
checking what actually got built.

## Decisions

### 1. Two gates, not one

The todo (`og-image-content-type-gate`) names only the post-deploy header check.
That check cannot prevent anything — the artifact is live by the time it runs.
It is an alarm.

So the design adds a second, pre-deploy gate that reads `out/` and *can* fail
the build before the upload. The split is by what each side controls:

- **Gate 4 (pre-deploy)** covers everything our code determines: which image
  each page references, whether the card is inherited, whether the card is the
  large variant. A regression here is caused by a commit, so it should block
  that commit.
- **Gate 5 (post-deploy)** covers only how GitHub chooses to type a file. The
  post-mortem is explicit that this behavior is *observed, not documented*. It
  can change with no commit on our side, which is precisely the thing a
  pre-deploy check cannot see.

### 2. The audit reads built HTML, not source

Gate 4 walks `out/`, parses the rendered `<meta>` tags, and compares them to
what the route should have produced. This is the check the post-mortem asked
for and the one that would have caught the 404 — a route whose source looked
finished because it had no metadata to look wrong.

### 3. A Node script, not inline bash, and not a second vitest run

The three existing gates are inline `grep` because each is one line. This one
cross-compares files (every page's `og:title` against the homepage's) and
derives expected URLs from paths. In bash that is forty lines of `awk` that
nobody can run without pushing.

A second vitest run over `out/` was considered and rejected: `npm test` runs
before `npm run build`, so the suite would have to split into two invocations
with an `exclude` to keep the post-build file out of the pre-build run, and the
file fails confusingly for anyone who runs the suite without building first.

`scripts/verify-built-output.mjs`, wired as `npm run verify:build`, is runnable
locally after any build and keeps unit tests as unit tests.

### 4. The checker is itself unit-tested

A verifier that silently passes is worse than no verifier. The script's logic
lives in exported pure functions with a thin CLI wrapper, and the tests assert
it **rejects** the exact shapes that shipped.

## Architecture

```
npm test              →  unit tests, incl. the checker's own logic   (pre-build)
npm run build         →  next build && cp out/opengraph-image out/og.png
npm run verify:build  →  GATE 4: audit out/                          ← new
upload-pages-artifact
deploy-pages
curl page_url/og.png  →  GATE 5: served Content-Type                 ← new
```

### Gate 4 — `scripts/verify-built-output.mjs`

Walks `out/` for `index.html` and `404.html`, collecting **every** violation
before exiting 1, so one CI run reports all of them. This matches the
`expect(offenders).toEqual([])` habit already used in
`page-metadata-coverage.test.ts`: a failure names the files.

**Route → expected `og:url`.** Derived from the built path, with one documented
equivalence class:

| Built file | Expected path |
|---|---|
| `out/index.html` | `/` |
| `out/<segments>/index.html` | `/<segments>/` |
| `out/404.html` | `/404/` |
| `out/404/index.html` | `/404/` |
| `out/_not-found/index.html` | `/404/` |

The three 404 artifacts come from one source file, `src/app/not-found.tsx`.
`out/404.html` is the artifact GitHub Pages serves on an unmatched URL — a Pages
convention, not a Next route. The other two are Next's internal `_not-found`
segment and the `/404/` route it exports alongside. Only one is ever reached in
production, but all three ship, so a filesystem walk has to know they are the
same page wearing three hats. A naive path rule would derive `/404.html` for the
first and fail a correct build.

**Per-file assertions** (20 files at time of writing):

1. `og:image` is present, absolute, on the site origin, and ends in `/og.png`.
2. `og:url` equals the site origin + the derived path above.
3. `og:title` is present, non-empty, and **differs from the homepage's** unless
   the file is the homepage.
4. `twitter:card` is `summary_large_image`.

**The site origin is read from `out/index.html`'s own `og:url`, not from the
environment.** Coupling the script to `NEXT_PUBLIC_SITE_URL` would make
`npm run verify:build` fail on a developer machine, where that variable is
unset and `metadataBase` falls back to a different origin — a check that only
works inside CI is a check nobody runs before pushing. Reading the origin from
the homepage and asserting every other page agrees with it also catches a real
failure the env-var version would miss: a build where pages disagree about
which host they are on.

**Whole-output assertions:**

5. `out/og.png` exists and begins with the PNG magic number.
6. Every walked file matched a known path rule. An unclassified route fails
   rather than being skipped, so a new route group cannot silently escape the
   audit.

Assertion 3 is the one that would have caught the original bug: an inherited
card renders the homepage's `og:title` verbatim. The three 404 artifacts share a
title *with each other*, which is correct — the comparison is only against the
homepage's.

Assertion 6 is the lesson of the 404 generalized. The first audit missed that
route because the audit walked what existed and the route did not. A check that
skips what it does not recognize will always report clean.

### Gate 5 — post-deploy step in the `deploy` job

It has to live in the `deploy` job, because that is the only place
`steps.deployment.outputs.page_url` exists.

```yaml
- name: Assert the link-preview image is served as an image
  run: |
    url="${{ steps.deployment.outputs.page_url }}og.png?ci=${{ github.run_id }}"
    for attempt in 1 2 3 4 5; do
      ct=$(curl -sI "$url" | tr -d '\r' \
           | awk -F': ' 'tolower($1)=="content-type"{print tolower($2)}')
      case "$ct" in image/png*) echo "og.png served as $ct"; exit 0 ;; esac
      echo "attempt $attempt: content-type was '${ct:-<none>}', retrying in 10s"
      sleep 10
    done
    echo "::error::og.png is served as '${ct:-<none>}', not image/png. Link previews will drop the image on LinkedIn, Facebook and iMessage. See docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md"
    exit 1
```

Three choices worth keeping:

- **The retry loop.** `deploy-pages` returns when GitHub reports the deployment
  complete, which is not the instant the CDN serves it everywhere. Without
  backoff this gate flakes, and a flaky gate gets ignored or deleted — worse
  than not having one.
- **`?ci=<run_id>`.** GitHub Pages ignores query strings for static files, so
  this fetches the same bytes while guaranteeing a cache miss. Without it the
  check can read a response cached from before this deploy and pass on stale
  evidence.
- **`page_url`, not a hardcoded domain.** It is the URL this run published to,
  so the check follows the site through the Wix cutover without an edit.

## Testing

`scripts/verify-built-output.test.ts`, running inside the existing `npm test`
step. It tests the checker's logic against fixture HTML, so it needs no `out/`
and stays in the pre-build run.

The tests assert the checker **rejects** the shapes that actually shipped:

| Fixture | Rejected by |
|---|---|
| A page carrying the homepage's `og:title` and an `og:url` of `/` | Assertion 3 |
| `og:image` pointing at extensionless `/opengraph-image` | Assertion 1 |
| `twitter:card` of `summary` | Assertion 4 |
| A missing `og:image` altogether | Assertion 1 |
| A page whose `og:url` is on a different origin from the homepage's | Assertion 2 |

And that it **accepts** what is correct:

- A well-formed page under a nested path.
- `out/404.html` mapping to `/404/` rather than `/404.html`.
- The three 404 artifacts sharing a title with each other.

Plus assertion 6 directly: an unrecognized built path fails rather than passing
silently.

`vitest.config.mts` needs its `include` widened, since tests currently only
resolve under `src/`:

```diff
- include: ["src/**/*.test.ts"],
+ include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
```

## Files

| File | Change |
|---|---|
| `scripts/verify-built-output.mjs` | **New.** Pure functions plus CLI wrapper. |
| `scripts/verify-built-output.test.ts` | **New.** Rejects the historical bug shapes. |
| `.github/workflows/deploy.yml` | **Modify.** Gate 4 after build, Gate 5 after deploy. |
| `package.json` | **Modify.** Add `verify:build`. |
| `vitest.config.mts` | **Modify.** Widen `include` to `scripts/`. |
| `DEPLOY.md` | **Modify.** The "What the build checks" section says three gates; it becomes five, and Gate 5 is post-deploy so the framing "any of them failing stops the deploy" needs correcting. |
| `src/content/todos.ts` | **Modify.** Mark `og-image-content-type-gate` done, bump `TODOS_UPDATED`. |

## Out of scope

- **A broader post-deploy smoke suite.** Checking `robots.txt` still reads
  `Disallow: /` on staging, or that key pages return 200, was considered. Both
  are real silent failures, but each added post-deploy fetch is another source
  of flake on a gate that cannot prevent anything. Revisit at the Wix cutover,
  when `robots.txt` flipping the wrong way becomes an indexing event rather than
  a staging annoyance.
- **Internal dead-link crawling** of the built output. Useful, unrelated to the
  link-preview problem, and better as its own piece of work.
- **Auto-rollback on Gate 5.** GitHub Pages has no rollback primitive worth
  building on here, and the failure it detects is not caused by our deploy.

## Observed but not addressed

The three 404 artifacts each render **two** `robots` meta tags — `noindex` and
`noindex, follow` — one from the root layout's staging check and one from
`pageMetadata`. Search engines take the most restrictive directive, so this is
harmless today, and on production the root layout stops emitting its tag. Noted
here because it is the kind of duplicate that looks like a bug during a future
investigation. No assertion covers it.
