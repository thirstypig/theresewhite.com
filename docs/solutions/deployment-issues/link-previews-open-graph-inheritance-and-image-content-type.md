---
title: 'Link previews on a Next.js static export: every page shared the homepage card, and the generated image was served as application/octet-stream'
date: 2026-08-11
category: deployment-issues
problem_type: metadata_inheritance / static_file_content_type
component: next-metadata / opengraph-image / github-pages
severity: high
symptoms:
  - 'pasting any page URL into SMS, iMessage, Slack or LinkedIn shows the homepage title and the homepage description'
  - 'the browser tab title is correct on every page, so nothing looks wrong while browsing'
  - 'og:url is https://host/ on every page, not the page that was pasted'
  - 'the shared card has no image at all'
  - 'after adding an image, only the homepage gets one and every other page still has none'
  - 'after every page gets one, the image still does not render in a real card'
  - 'curl -sI on the image returns 200 with content-type: application/octet-stream'
  - 'no error anywhere: build green, deploy green, every URL 200'
stack:
  - Next.js 16 (App Router)
  - 'output: "export"'
  - next/og ImageResponse via the opengraph-image.tsx file convention
  - GitHub Pages
  - GitHub Actions (actions/deploy-pages@v4)
time_to_diagnose: 'the inheritance half took minutes once the built HTML was compared page to page; the Content-Type half was invisible until the deployed file was fetched with curl -I, and would not have been found by any amount of reading the source'
recurrence_risk: 'high — a page added later that sets only title and description silently inherits the whole parent card again, and nothing in the build or the browser complains'
tags:
  - open-graph
  - og-image
  - link-preview
  - nextjs-metadata
  - opengraph-image
  - static-export
  - github-pages
  - content-type
  - silent-failure
related:
  - './nextjs-static-export-github-pages-source-and-subpath.md'
  - './github-actions-default-shell-errexit-and-pipefail.md'
---

# Link previews on a Next.js static export

> **Category note.** Filed under `deployment-issues` rather than `build-errors`
> for the same reason as its sibling: nothing errored. `next build` exited 0,
> CI was green, every URL returned 200, and every page looked right in a
> browser. Half of this defect lived in Next's metadata merge and half lived in
> how GitHub chose to serve a file. Neither half is visible from the source.

## Symptom

Pasting a URL from the site into any chat app showed the wrong card.

```
/conflict-calculator  →  "L. Therese White — Employment Mediator & Workplace Conflict Coach"
/collaborate          →  "L. Therese White — Employment Mediator & Workplace Conflict Coach"
/contact              →  "L. Therese White — Employment Mediator & Workplace Conflict Coach"
```

Every page shared the homepage's title, the homepage's description, and an
`og:url` pointing at `/`.

The `<title>` tag was correct on all of them the whole time. That is why it
went unreported for so long: browsers read `<title>`, and link scrapers read
Open Graph. Nobody browsing the site could see the bug, and nobody pasting a
link could see anything else.

There was also no `og:image` at all, and `twitter:card` was `summary`, so even
a correct card would have rendered as a bare line of text.

## Investigation

### The inheritance

Comparing the built HTML page to page separated the two tag families
immediately:

```bash
grep -o '<title>[^<]*</title>'            out/collaborate/index.html
# → <title>Collaborate — L. Therese White</title>        correct

grep -o 'og:title" content="[^"]*"'       out/collaborate/index.html
# → og:title" content="L. Therese White — Employment…"   the homepage's
```

`openGraph` was declared exactly once in the whole app:

```bash
git grep -n "openGraph" b8160a8^ -- 'src/app/**/*.tsx'
# → src/app/layout.tsx:41      (one hit, the root layout)
```

### Three false summits

Each fix revealed the next problem, and each intermediate state looked
plausible enough to ship.

**Per-page `openGraph` fixed the title and killed the image.** Giving every
page its own `openGraph` object corrected `og:title`, `og:description` and
`og:url` — and left `og:image` present on the homepage and absent everywhere
else.

**Naming the image fixed every page except the homepage.** With
`images: [...]` set inside the helper, all pages carried one — except `/`,
which kept advertising a different path.

**A valid PNG still would not render.** After deploy:

```bash
curl -sI https://theresewhite.bahtzang.com/opengraph-image
# HTTP/2 200
# content-type: application/octet-stream

curl -s https://theresewhite.bahtzang.com/opengraph-image | file -
# /dev/stdin: PNG image data, 1200 x 630, 8-bit/color RGBA, non-interlaced
```

Correct bytes, wrong header. Scrapers check the header.

### The route that was still broken after the fix shipped

An independent pass over the built output — not the source — found one page
still pointing at the extensionless path:

```bash
curl -s https://theresewhite.bahtzang.com/definitely-not-a-page/ | grep -o 'og:image[^>]*'
# → og:image" content="https://theresewhite.bahtzang.com/opengraph-image?21cc8822567a3d57"
```

The 404. It has no `metadata` export, so it fell through to the root layout,
where the file convention wins. The source looked finished; the output did not.

## Root cause

### 1. Metadata merges shallowly, per key

Next merges the metadata objects down the segment tree **one key at a time**.
A page that exports only `title` and `description` does not merge into the
parent's `openGraph` — it leaves the parent's entire `openGraph` object in
place, untouched, including its `url`.

So a single `openGraph` block in the root layout is not a default. It is the
value every page below it ships, unless a page replaces the whole object.

### 2. Next does not derive `og:title` from `title`

There is no relationship between them. Setting a page title does nothing to
the card. `og:title` has to be set per page, and setting it per page by hand
is precisely the thing everyone forgets.

The real defect was therefore not a missing tag. It was a design in which
forgetting was the default.

### 3. The file convention outranks the layout, but a page outranks the convention

`src/app/opengraph-image.tsx` attaches its generated image to the **root
segment**. That injection beats anything the root layout itself sets in
`openGraph.images` — which is why the homepage kept advertising
`/opengraph-image` even after the layout named `/og.png`.

But a **page** that declares its own `openGraph` replaces the parent's object
wholesale, convention injection included. That is why:

- pages using the helper got `/og.png` correctly,
- the homepage did not, until it was given its own `metadata` export,
- and the 404 did not, because it has no page-level metadata at all.

Same mechanism, three different outcomes, depending only on whether a route
declares metadata.

### 4. GitHub Pages types files by extension, and the convention emits none

`opengraph-image.tsx` writes `out/opengraph-image`. No extension.

```bash
file out/opengraph-image
# out/opengraph-image: PNG image data, 1200 x 630
```

GitHub Pages serves that as `application/octet-stream`. The bytes are a valid
PNG and the response is a 200, so nothing in the toolchain objects — but
LinkedIn, Facebook and Twitter dispatch on the `Content-Type` header, not on
the magic bytes, and drop the image.

This is the same shape as the sibling post-mortem: correct locally, 200 on the
wire, silently wrong only once GitHub is the one serving it.

## Solution

**One helper builds all of it together**, so the tags that must agree cannot
drift apart — `src/lib/page-metadata.ts`:

```ts
export function pageMetadata({ title, description, path, noindex, follow }) {
  const url = path === "/" ? "/" : `${path}/`;   // trailingSlash: true
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url,
      siteName: contact.name,
      locale: "en_US",
      type: "website",
      images: [OG_IMAGE],      // must be named; see root cause 3
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      images: [OG_IMAGE],
    },
    ...(noindex ? { robots: { index: false, follow } } : {}),
  };
}
```

`og:title` is deliberately the page's own title **without** the site name
appended, unlike `<title>`. A shared link gets about three lines in a chat
app; the distinguishing words should be in them, and the site name is already
carried by `og:site_name` and the domain.

`robots` is emitted only for noindex pages. Hardcoding `index: true` here
would override the root layout's production check and make staging crawlable.

**Every route goes through it — including the two that look like exceptions.**
The homepage (`src/app/(site)/page.tsx`) and the 404 (`src/app/not-found.tsx`)
both need their own `metadata` export purely to displace the file convention.

**The image gets a real extension at build time**, in `package.json`:

```json
"build": "next build && cp out/opengraph-image out/og.png"
```

In the build script rather than as a manual step: if the generator ever stops
emitting, `cp` fails and takes the build down instead of shipping a dead image
reference.

**The generator needs `force-static`.** Without it, `next build` fails under
`output: "export"` — `export const dynamic … not configured on route
/opengraph-image` — because Next treats the generator as a route handler it
cannot prove is static. `sitemap.ts` already carries the same declaration.

## Prevention

**Grep the built output, never the source.** The source looked correct at
three separate points in this fix while the output was wrong. Every claim in
this document that turned out to be true was checked against `out/` or a live
`curl`; every claim that turned out to be false came from reading code.

```bash
# every page carries a working image, not merely an image
for f in $(find out -name "index.html" -o -name "404.html"); do
  v=$(grep -o 'og:image" content="[^"]*"' "$f" | head -1)
  case "$v" in *"/og.png\"") : ;; *) echo "BAD: $f -> $v" ;; esac
done
```

**Check the header, not the file.** `file out/og.png` says PNG regardless of
how it will be served. Only the deployed response answers the question:

```bash
curl -sI https://theresewhite.bahtzang.com/og.png | grep -i content-type
# want: content-type: image/png
```

**Both halves now have a CI gate.** *(Added 2026-08-12; when this document was
first written there were none, and the section below described what was still
needed.)*

The inheritance half is caught before anything is published.
`npm run verify:build` runs `scripts/verify-built-output.mjs`, which reads the
built HTML in `out/` and fails if any page points at the wrong image, advertises
someone else's address, carries the homepage's title instead of its own, or uses
the small preview card. It also fails if a page names any of those four things
twice with two different values — because everything above reads the first one,
and a scraper might read the other. It runs after `npm run build` and before the
files are uploaded, so a bad card stops the deploy rather than shipping.

The Content-Type half is caught after publishing, because that is the only place
it can be seen:

```yaml
- name: Assert the link-preview image is served as an image
  run: |
    url="${{ steps.deployment.outputs.page_url }}og.png?ci=${{ github.run_id }}"
    for attempt in 1 2 3 4 5; do
      ct=$(curl -sI --max-time 10 "$url" | tr -d '\r' \
           | awk -F': ' 'tolower($1)=="content-type"{print tolower($2)}')
      case "$ct" in image/png*) echo "og.png served as $ct"; exit 0 ;; esac
      ...
    done
    exit 1
```

Three details in it are load-bearing. It retries, because the image takes a
moment to reach every server after a deploy and a check that fails at random
gets deleted. It adds `?ci=<run_id>` so the request cannot be answered from a
cache holding the *previous* deploy's response. And it uses the deploy's own
published address rather than a hardcoded domain, so it keeps working through
the move to `theresewhite.com`.

This one cannot prevent a bad deploy — the files are already live when it runs.
That is accepted, because it covers the one thing this codebase does not
control: how GitHub decides to label a file it is serving.

Writing that step produced two confident and incorrect claims about how bash
behaves inside GitHub Actions, both of which would have made the check worse.
Recorded separately in
`./github-actions-default-shell-errexit-and-pipefail.md`.

**Unit-test the shape, since the shape is what regresses.**
`src/lib/page-metadata.test.ts` covers the two failure modes that actually
happened: a page inheriting the site's `og:title`, and an `og:image` path
without an image extension.

```ts
expect(OG_IMAGE).toMatch(/\.(png|jpg|jpeg)$/);
```

**Remember that the 404 is a page.** It has no metadata unless given some, it
is the most likely URL to be shared by accident, and it is the one route that
no page-level convention reaches by default.

## Also worth knowing

- **`twitter:card` defaults to `summary`**, a small square thumbnail. LinkedIn
  and iMessage render `summary_large_image` much larger. A card with the right
  title and no image is still a weak post.

- **`og:url` must agree with `trailingSlash`.** With `trailingSlash: true` a
  canonical or `og:url` without the slash names a URL that redirects, which
  Search Console reports as an error.

- **`metadataBase` in the root layout** is what turns `/og.png` into an
  absolute URL in the rendered tag. Scrapers require absolute; without
  `metadataBase` the relative path ships as-is and resolves nowhere.

- **The extensionless-file behavior is observed, not documented.** It was
  measured on this deployment. GitHub could change how it types unknown files;
  the `cp` to `og.png` does not depend on that behavior either way, which is
  part of why it is the right fix.

- **The same "declared versus rendered" trap appeared twice more in one
  session.** The live Wix site's `<h1>` declares Caudex while every visible
  span overrides it with Arial Bold, so reading the wrapper gave the wrong
  font. And `m-0` on a `<fieldset>` silently cancelled the `space-y-10` on its
  parent, measured at 0px where 40px was intended. In all three cases the
  markup declared one thing and the rendered result was another, and only
  measurement told them apart.

## Sources

- [generate-metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — the Metadata API and its field-by-field merge behavior. Shipped locally at `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`.
- [opengraph-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — the file convention, its exports, and the generated route it produces.
- [Static Exports](https://nextjs.org/docs/app/guides/static-exports) — the unsupported-feature list for `output: "export"`. Shipped locally at `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`.
- `./nextjs-static-export-github-pages-source-and-subpath.md` — the sibling failure of the same shape: a correct build served wrongly by GitHub Pages, with no error anywhere.
