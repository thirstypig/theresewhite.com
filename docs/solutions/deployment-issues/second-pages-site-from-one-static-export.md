---
title: 'Publishing one page of a Next.js static export as its own subdomain on GitHub Pages: four ways it looks done and is not'
date: 2026-10-16
category: deployment-issues
problem_type: deployment_misconfiguration
component: github-pages / next-static-export / custom-subdomain / dns
severity: medium
symptoms:
  - 'page loads as unstyled text at the new subdomain, with every /_next/ file returning 404'
  - 'logo or tab icon shows in every local preview and is missing only on the published subdomain'
  - 'https:// shows "Your connection is not private" (ERR_CERT_COMMON_NAME_INVALID) long after DNS is correct'
  - 'gh api .../pages/health reports is_https_eligible: true and caa_error: null, but https_certificate stays null'
  - '"Could not resolve host" on one machine while public DNS servers already answer correctly'
stack:
  - Next.js 16 (App Router), output: "export"
  - GitHub Pages, publishing from a branch (build_type legacy)
  - GitHub Actions pushing to a second repository with a deploy key
  - DNS hosted by Wix
time_to_diagnose: 'about an hour in total; the certificate stall was most of it'
recurrence_risk: 'medium — each failure is silent, and three of the four only show on the real domain'
tags:
  - github-pages
  - custom-subdomain
  - nojekyll
  - https-certificate
  - negative-dns-caching
  - cross-repo-deploy
  - repository-variables
updated: 2026-10-22
related:
  - './nextjs-static-export-github-pages-source-and-subpath.md'
  - '../../../DEPLOY.md'
---

# Publishing one page as its own subdomain

## What we did

theresewhite.com is still on Wix, so the conflict calculator needed its own
address, **calculator.theresewhite.com**, without moving the main site. Each
deploy of this repository now builds the site a second time with
`NEXT_PUBLIC_SITE_URL=https://calculator.theresewhite.com`, keeps only the
calculator page (`src/app/(landing)/calculator/page.tsx`), and force-pushes it
to the `gh-pages` branch of a second repository,
`thirstypig/theresewhite-calculator`, which GitHub Pages serves. The steps are
in `DEPLOY.md`, "The calculator's own address". This note is about the four
ways the setup looked finished while it was not.

## 1. Without `.nojekyll`, the page loads with no styles and no scripts

**What happens.** A repository that publishes from a branch runs Jekyll over
it, and Jekyll silently drops every folder whose name starts with an
underscore. `_next` holds all of the page's CSS and JavaScript. The HTML still
returns 200, so nothing reports an error.

**Fix.** `scripts/build-calculator-site.mjs` always writes an empty
`.nojekyll`, and `scripts/build-calculator-site.test.ts` fails if it stops.

**Related, opposite direction.** The *main* site publishes through GitHub
Actions, where Jekyll never runs. There, `actions/upload-pages-artifact` v4
and later leave out dot-files, so `out/.nojekyll` no longer ships, and that
is harmless. The same file is essential in one setup and irrelevant in the
other.

## 2. A fixed list of files to copy loses the logo on the live site only

**What happens.** The first version of the assembly script copied
`index.html`, `_next`, `og.png` and `favicon.ico` by name. Adding the logo
(`public/brand/therese-white-logo.webp`) put a file on the page that the list
did not include. Every local preview served all of `out/`, so the logo
appeared everywhere except on the published subdomain.

**Fix.** The script reads the page and copies every root-relative file it
refers to (`localReferences()`). If the page links to something that is not a
file in `out/`, such as `/about`, the deploy fails, because the subdomain has
no other pages. Both cases are tested.

## 3. The https certificate stalled, and nothing reported why

**What happens.** DNS was correct within minutes, and GitHub's own check
(`gh api repos/<owner>/<repo>/pages/health`) reported the domain valid,
eligible for https, with no CAA error. GitHub still had not requested a
certificate 40 minutes later. Until it does, GitHub presents its general
`*.github.io` certificate, and every browser shows a privacy warning.

**Fix.** Remove the custom domain and add it back:

```bash
gh api -X PUT repos/<owner>/<repo>/pages -F cname=null
# wait about 30 seconds
gh api -X PUT repos/<owner>/<repo>/pages -f cname=calculator.theresewhite.com
```

A certificate was issued within a minute. Re-saving the *same* domain, which
I tried several times first, did nothing. On a branch-published repository,
each of these calls commits to the branch ("Delete CNAME", "Create CNAME");
the next deploy replaces both. Only after the certificate exists will
`-F https_enforced=true` succeed.

## 4. Checking DNS too early makes one machine believe the address does not exist

**What happens.** I queried the new name before the record was added. The
"no such name" answer was cached on the Mac, and also on the home router
(`192.168.4.1`), for up to the zone's negative-caching time (one hour, from
Wix's SOA record). Public resolvers (`8.8.8.8`, `1.1.1.1`) already had the
right answer. Flushing the Mac's cache while the router's stale copy was still
alive simply re-cached the wrong answer.

**Fix.** Check with a public resolver (`dig +short <name> @8.8.8.8`) rather
than the machine's own. If the local answer is stale, wait for the router's
copy to expire. `dig <name> @<router>` shows the seconds remaining in the
AUTHORITY line. Flush the Mac after that
(`sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`), and stop
querying until it is done.

**A related false alarm.** After the certificate was issued, James still saw
"Not secure" in a tab opened before the certificate existed. A fresh tab
showed the page as secure. Tell a stale tab apart from a real problem by
checking the certificate directly
(`openssl s_client -connect <host>:443 -servername <host>`) on every address
the name resolves to, before changing anything.

## Added 2026-10-22: the third site, book.theresewhite.com

The same script now publishes the free-guide page, from a third repository
(`thirstypig/theresewhite-book`). The script's `SITES` table holds what
differs per site. Three new lessons, and one thing that went better:

- **A file the page only links to after a click is invisible to the
  reference scan.** The PDF's download button appears only after signup, so
  the built HTML never names it, and the scan in failure 2 would have left it
  out: a 404 on the one file the page exists to deliver. Such files are
  listed explicitly per site (`extras`), and a test fails if the PDF goes
  missing.
- **The link-preview image differs per site, but the tag does not.** Every
  page names `/og.png`. Rather than change that tag (and the checks built on
  it), the script publishes each site's own image *as* `og.png`; for the book
  that is the cover (`public/book/og.png`).
- **A repository variable changed after a deploy was queued is not seen by
  that deploy.** `REVIEW_PASSPHRASE_HASH` was set about 15 seconds after a
  merge queued a deploy. That deploy ran as if the variable were empty and
  published both pages without their password screen; its log said so
  (`REVIEW_PASSPHRASE_HASH is not set`). A deploy started afterwards picked
  it up. [Likely: variables are read when a run is queued, not when its jobs
  start. That fits the timestamps, but GitHub's docs weren't checked.] After
  changing a variable, start a new deploy (`gh workflow run deploy.yml`) and
  check its log, rather than trusting one that was already waiting.
- **Better this time: Pages and the certificate needed no help.** Pages
  switched itself on when the first push created the `gh-pages` branch (so
  `POST .../pages` answers 409 "already enabled"; set the domain with
  `PUT`), and https worked within a minute of setting the custom domain.
  Failure 3 can still happen, so its fix stays.

Not solved: `npm run build` sometimes fails to download a Google font
(`Can't resolve '@vercel/turbopack-next/internal/font/google/font'`); it did
in 2 of 5 deploys on 2026-10-22. Re-running the failed job
(`gh run rerun <id> --failed`) worked both times. The cause and a lasting fix
(a retry, or fonts stored in the repository) are open in `todos.ts`.

## Checklist for the next subdomain like this

1. Assemble with the script, never a hand-made list; confirm `.nojekyll` and
   `CNAME` are in the published branch.
2. Add the DNS record before querying the name from your own machine.
3. Turn on Pages for the branch and set the custom domain.
4. If `https_certificate` is still null after about 15 minutes while
   `/pages/health` says eligible, remove the domain and add it back.
5. Set `https_enforced`, then check the live page in a fresh browser tab.
6. List any file the page reaches only through a click or script in the
   site's `extras`, and give the site its own `og.png` if it needs one.
7. After changing a repository variable the deploy reads, start a fresh
   deploy and look for the variable's effect in its log.
