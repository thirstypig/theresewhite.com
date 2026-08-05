---
title: 'Next.js static export on GitHub Pages: unstyled at the github.io URL, and a Pages source change that broke nothing until the next push'
date: 2026-08-05
category: deployment-issues
problem_type: deployment_misconfiguration
component: github-pages / next-static-export / custom-domain
severity: high
symptoms:
  - 'site returns 200 at <user>.github.io/<repo>/ but renders with no CSS, no JS and no images'
  - 'every /_next/static/* request 404s while the same file 200s under the repo subpath'
  - 'HTML is correct and complete; only the assets are missing'
  - 'switching Pages source to "Deploy from a branch" appears to work — the site keeps serving'
  - 'gh api repos/{o}/{r}/pages reports build_type: legacy while an Actions deploy workflow exists'
  - 'no error anywhere: build green, deploy green, site up'
stack:
  - Next.js 16 (App Router)
  - output: "export"
  - GitHub Pages
  - GitHub Actions (actions/deploy-pages@v4)
  - Squarespace-managed DNS
time_to_diagnose: '~15 minutes for the asset 404s; the Pages-source problem was invisible and only found by querying the API'
recurrence_risk: 'high — the UI offers "Deploy from a branch" as the default-looking option, and choosing it produces no error and no immediate breakage'
tags:
  - github-pages
  - nextjs-static-export
  - output-export
  - basepath
  - asset-404
  - custom-domain
  - cname
  - build-type-legacy
  - silent-misconfiguration
  - stale-artifact
related:
  - '../../../shengchangmd/docs/runbooks/domain-migration-to-shengchangmd-com.md'
  - '../../../jameschang.co/docs/solutions/integration-issues/cross-repo-admin-via-github-contents-api.md'
  - '../../../Vouch/docs/solutions/integration-issues/resend-sending-domain-not-verifying.md'
---

# Next.js static export on GitHub Pages

> **Category note.** Filed under `deployment-issues` rather than `build-errors`
> because nothing errored. `next build` exited 0, the Actions run was green, and
> the site returned 200 throughout. Both defects lived in the gap between a
> correct build and how GitHub chose to serve it.

## Symptom

Two related failures, neither of which announced itself.

**1. Unstyled site at the project-page URL.** After the first successful
deploy, `https://thirstypig.github.io/theresewhite.com/` returned 200 and the
HTML was complete and correct — right `<title>`, all copy present. But nothing
was styled, no JavaScript ran, and none of the seven logo images appeared.

**2. A Pages source change that broke nothing — yet.** The custom domain was
configured through Settings → Pages with the source set to **Deploy from a
branch**. The site continued to serve correctly. Everything looked fine. The
API told a different story:

```
$ gh api repos/thirstypig/theresewhite.com/pages --jq '{build_type,cname,status}'
{"build_type":"legacy","cname":"theresewhite.bahtzang.com","status":"built"}
```

`build_type: legacy` means GitHub was configured to build the site itself from
the `main` branch — a branch containing Next.js **source**, not the built `out/`
directory.

## Investigation

### The asset 404s

The HTML referenced root-absolute paths:

```
$ curl -sSL https://thirstypig.github.io/theresewhite.com/ | grep -oE '(href|src)="/[^"]*"' | sort -u | head -3
href="/_next/static/chunks/0jvhpaew_uadu.js"
href="/_next/static/chunks/1s3pc_4f74ko3.css"
href="/_next/static/media/03bda585a99c6450-s.p.32sris142tqlb.woff2"
```

The decisive test — same file, two paths:

```
$ CSS=/_next/static/chunks/1s3pc_4f74ko3.css
$ curl -o /dev/null -w '%{http_code}\n' https://thirstypig.github.io$CSS
404
$ curl -o /dev/null -w '%{http_code}\n' https://thirstypig.github.io/theresewhite.com$CSS
200
```

The file exists. The browser was asking for it in the wrong place.

### Why the Pages source change appeared harmless

Because a failed or absent deployment does not un-publish anything. **The last
successful deployment keeps serving until a new one succeeds.** The site
visitors saw was still the artifact from the earlier Actions run — the new
`legacy` setting had simply not been exercised yet.

## Root cause

### 1. Root-absolute paths versus subpath serving

`output: "export"` inlines root-absolute URLs (`/_next/static/...`) into every
emitted HTML file. A **project page** serves from `https://<user>.github.io/<repo>/`,
so those URLs resolve to `<user>.github.io/_next/...` — outside the repo's
namespace entirely.

This is exactly what `basePath` exists for. The catch is that `basePath` must be
`/<repo>` for the project-page URL and `""` once a custom domain serves from
root — so **hardcoding either value breaks the other**.

In this project the custom domain was always the destination, so no `basePath`
was the correct end state. The github.io URL was never going to work, and that
is fine — but only if you know it, otherwise you spend an hour debugging a
staging URL that was never meant to function.

### 2. "Deploy from a branch" versus "GitHub Actions"

| UI label | API `build_type` | What it does |
|---|---|---|
| Deploy from a branch | `legacy` | GitHub builds from a branch + folder, running Jekyll unless `.nojekyll` is present |
| GitHub Actions | `workflow` | Your workflow uploads an artifact and `actions/deploy-pages` publishes it |

With `legacy` set and `main` as the source, the *next* push would have published
Jekyll's interpretation of the repository source — `README.md` rendered as a
home page, no `out/` directory anywhere — replacing the site with something
that still returns 200.

The trap is the ordering. The damage is deferred to the next push, so the change
that caused it is long out of view by the time anything looks wrong.

### 3. The CNAME misconception

`public/CNAME` was committed on the assumption that shipping it in the artifact
would persist the custom domain across deploys. **That is false for
Actions-based deploys.** From GitHub's documentation:

> If you are publishing from a custom GitHub Actions workflow, no `CNAME` file
> is created, and any existing `CNAME` file is ignored and is not required.

The Settings value (`PUT /repos/{o}/{r}/pages` with `cname`) is the only thing
that governs. A request to make `actions/deploy-pages` honour an artifact CNAME
was closed as *not planned*.

The widespread `touch out/CNAME` advice is correct for **branch-based** deploys
(`peaceiris`, `JamesIves`, or pushing to `gh-pages`), where the legacy pipeline
does read it — and a no-op for `actions/deploy-pages`. Both patterns appear in
blog posts without distinguishing between them.

## Solution

**Restore the Actions source:**

```bash
gh api -X PUT repos/<owner>/<repo>/pages -f 'build_type=workflow'
gh api repos/<owner>/<repo>/pages --jq '{build_type,cname,https_enforced}'
# → {"build_type":"workflow","cname":"theresewhite.bahtzang.com","https_enforced":true}
```

**For the asset paths, pick one and be explicit about it:**

*If a custom domain is the destination* (this project) — no `basePath`, and
accept that the `github.io` URL will render unstyled. Verify only against the
custom domain.

*If the project page URL must work* — derive the base path at build time rather
than hardcoding it, which is what the official Vercel template does:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES_BASE_PATH,
};
```

```yaml
- uses: actions/configure-pages@v5
  id: setup_pages
- run: npm run build
  env:
    PAGES_BASE_PATH: ${{ steps.setup_pages.outputs.base_path }}
```

`configure-pages` derives `base_path` from the live Pages `html_url`: `/<repo>`
for a project page, and `""` once a custom domain exists. The build becomes
self-correcting across the cutover.

> Do **not** use `configure-pages`' `static_site_generator: next` mode to do
> this. Its file rewriter only handles `.js`, `.cjs` and `.mjs`, so it silently
> cannot rewrite the `next.config.ts` that Next 15/16 defaults to.

**Set the custom domain through Settings or the API, not a file.** Keep
`public/CNAME` and `public/.nojekyll` anyway — they cost nothing and are the
safety net for exactly the scenario above, where someone flips the source to a
branch and the legacy pipeline *does* read them.

## Prevention

**Assert the Pages source in CI.** Nothing in the toolchain checks this;
`actions/configure-pages` deliberately does not. Three lines converts an
invisible misconfiguration into a build failure that explains itself:

```yaml
- name: Assert Pages is on the Actions source
  env:
    GH_TOKEN: ${{ github.token }}
  run: |
    build_type=$(gh api "repos/${{ github.repository }}/pages" --jq '.build_type')
    if [ "$build_type" != "workflow" ]; then
      echo "::error::Pages source is '$build_type', expected 'workflow'."
      echo "Settings → Pages → Source must be 'GitHub Actions', not 'Deploy from a branch'."
      exit 1
    fi
```

**Smoke-test an asset, not just the page.** A 200 on `/` proves almost nothing
here — the HTML was always fine. Scrape a stylesheet URL out of the served HTML
and fetch it:

```bash
BASE=https://theresewhite.bahtzang.com
CSS=$(curl -sSL $BASE/ | grep -oE '/_next/static/chunks/[^"]*\.css' | head -1)
curl -fsS -o /dev/null "$BASE$CSS" || { echo "asset 404 — basePath mismatch"; exit 1; }
```

**Grep the build output for path leakage.** If a basePath is expected, fail when
`out/index.html` still contains `"/_next/`; if deploying to a custom domain, fail
when it contains `/<repo>/_next/`.

**Know which URL you are testing.** Write down, in the deploy doc, whether the
`github.io` URL is expected to work. Half of this incident was time spent
debugging a URL that was never part of the plan.

## Also worth knowing

- **`output: "export"` in Next 16 disables:** Server Actions, Route Handlers
  that read `Request`, cookies, rewrites, redirects, headers, Proxy (renamed
  from Middleware in 16), ISR, Draft Mode, Intercepting Routes, and image
  optimization with the default loader. `next build` will not warn you that a
  `redirects()` block is being ignored — it simply does nothing.
- **`middleware.ts` is silently ignored in Next 16** — it was renamed to
  `proxy.ts`. Leftover auth or redirect logic stops running with no error.
  Codemod: `npx @next/codemod@canary middleware-to-proxy`.
- **`sitemap.ts` and `robots.ts` need `export const dynamic = "force-static"`**
  under `output: "export"`, or the build fails with
  `export const dynamic = "force-static"/export const revalidate not configured on route "/sitemap.xml"`.
- **`trailingSlash: true` is worth setting**, though not strictly required.
  GitHub Pages does resolve extensionless URLs to `.html`, so `/about` works
  either way — but `/about/` 404s unless `trailingSlash` emits
  `out/about/index.html`. Inbound links and search engines both append slashes.
- **Once a custom domain is set**, GitHub 301s `<user>.github.io/<repo>` to it
  automatically and provisions a Let's Encrypt certificate. Enforce HTTPS.

## Sources

- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) — "A `CNAME` file in your repository file does not automatically add or remove a custom domain."
- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) — CNAME ignored on custom workflows
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports) — unsupported features list
- [Next.js `basePath`](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath) — and why not `assetPrefix` for subpaths
- [nextjs/deploy-github-pages](https://github.com/nextjs/deploy-github-pages) — the `PAGES_BASE_PATH` pattern
- [actions/deploy-pages#304](https://github.com/actions/deploy-pages/issues/304) — artifact CNAME support closed as not planned
- [Pages REST API](https://docs.github.com/en/rest/pages/pages) — `build_type` values
