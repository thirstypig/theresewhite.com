---
title: 'A password screen on a Next.js static export: three ways it looks locked or changeable and is not'
date: 2026-11-21
category: deployment-issues
problem_type: silent_misconfiguration
component: admin-gate / next-static-export / github-actions-variables
severity: medium
symptoms:
  - 'the password documented as changeable never changed: the old one kept working'
  - 'reloading /admin in an already-unlocked tab logs "Minified React error #418" and redraws the page'
  - 'a page meant to be private is published with its full text, because nothing checks the built HTML'
  - 'on /stylebible/compare, the embedded sample pages are cut off, or leave blank space after switching Phone then Desktop'
stack:
  - Next.js 16 (App Router), output: "export"
  - React 19, useSyncExternalStore
  - GitHub Actions repository variables passed as NEXT_PUBLIC_* at build time
time_to_diagnose: 'under an hour; each was found while adding the lock to /stylebible (PR #55)'
recurrence_risk: 'medium — all three fail silently, and the site keeps returning 200'
tags:
  - password-gate
  - hydration
  - next-public-env
  - verify-build
---

# A password screen on a Next.js static export

**Context.** On 2026-11-21 James asked for the style bible pages
(`/stylebible`, its two homepage samples and the comparison page) to be
locked. The site already had a password screen on `/admin`
(`src/components/admin-gate.tsx`). Reusing it turned up three problems that
had been there all along. Each one looked fine from the outside.

What the lock is, first, because it shapes everything below: the site has no
server, so every byte of a locked page is sent to the browser and the browser
hides it. That keeps visitors and search engines out. It cannot keep out
anyone determined, and nothing confidential belongs behind it.

## 1. The password could not be changed

**Symptom.** The admin page and the to-do list told James to save a new hash
as the `NEXT_PUBLIC_ADMIN_PASSWORD_HASH` repository variable. Doing that would
have changed nothing.

**Cause.** A repository variable reaches the build only if the workflow
passes it in. `.github/workflows/deploy.yml` passed the Web3Forms key but not
this one. `NEXT_PUBLIC_*` values are written into the JavaScript when the
site is built, so a value the build never saw does not exist.

**Second trap, same line.** A variable that has never been created arrives as
an empty string, not as "missing". The old code used `??`, which lets `""`
through, so the expected hash would have become `""` and nobody could log in.

**Fix.** The workflow passes the variable. `resolvePasswordHash()` in
`src/lib/admin-password.ts` treats empty as "use the built-in password" and
treats anything that is not a 64-character hash as an error that stops the
build. Stopping is deliberate: the alternative is keeping the old password
while James believes he changed it. `scripts/set-admin-password.sh` sets the
variable from James's own terminal, and `scripts/set-admin-password.test.ts`
runs that real script and feeds its output to the real check, so the two can
never hash differently.

**Measured.** A build with the variable set to `oops-not-a-hash` exits 1 and
names the variable. A build with a real hash rejects the built-in password
and accepts the new one (checked in a browser).

## 2. Reloading an unlocked page threw React error 418

**Symptom.** On the live site before PR #55: unlock `/admin`, reload, and the
console shows `Minified React error #418`. React threw away the built page
and redrew it.

**Cause.** The old gate read the browser's per-tab storage inside a
`useState` starter function. The build has no storage, so it drew the
password form. In an unlocked tab, the browser's first draw produced the admin
page instead. React found the two disagreeing and recovered by redrawing.

**Fix.** The unlock state lives in `src/lib/admin-session.ts`, read through
`useSyncExternalStore`. Its build-time answer is a third state, `checking`,
which draws neither the form nor the page. The browser switches straight to
`locked` or `unlocked` after it starts. Nothing disagrees, and the built HTML
holds no page content at all, which is what makes problem 3's check possible.

**Measured.** Same reload on the new build: no console errors.

## 3. Nothing checked that a locked page shipped locked

**Symptom.** A page placed outside the locking layout, or a gate changed to
draw the page underneath itself, would be published with its full text while
looking locked to anyone with JavaScript on.

**Fix.** `auditLock()` in `scripts/verify-built-output.mjs`, run by
`npm run verify:build` on every deploy, reads each built page under `admin/`
and `stylebible/`. Code inside `<script>` tags is ignored (that is the known
limit above). What remains inside `<main>` must carry `data-admin-gate` and no
more than 200 characters of text. The style bible lock is one file,
`src/app/(landing)/stylebible/layout.tsx`, so new pages there are covered
without anyone remembering.

**Measured.** Run against the site as it was before the lock, the audit
reported all four style bible pages (and both admin pages, which the old gate
drew as a form in the built HTML without the marker). After: "Lock audit
clean: 6 pages".

## Side effect: embedded locked pages need re-measuring

`/stylebible/compare` shows the two samples in frames sized to the page
inside. Locked pages draw their content a moment after loading, so a single
measurement at load caught the empty password screen. The old code also
re-measured at fixed delays, which was a guess. The frame now watches the
inner page with a `ResizeObserver` created from the frame's own window.

A separate, older bug turned up in the same check: the frame was keyed on the
inner `<iframe>` but its height state lived on the wrapper, and heights only
grow, so Phone then Desktop left about 3,000 pixels of blank space. The fix
was keying the whole `Sample` by screen size. Both were confirmed on the live
site before the change and gone after.

## How to apply

- Adding a `NEXT_PUBLIC_*` setting: pass it in `deploy.yml`, and decide what
  an empty string means.
- Anything drawn from browser storage on a static export: give the build its
  own state instead of guessing, or React will redraw the page.
- Any promise about what a published page contains: check the built HTML in
  `verify-built-output.mjs`, not the source. Same lesson as
  `link-previews-open-graph-inheritance-and-image-content-type.md`.
