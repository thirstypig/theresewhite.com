# Deploying to theresewhite.bahtzang.com

Static site on GitHub Pages. The live Wix site at `theresewhite.com` is
untouched by everything below — no DNS record for `theresewhite.com` changes at
any point.

---

## Before you start

### DNS is managed in Squarespace — same as your other subdomains

`bahtzang.com`'s nameservers are `ns-cloud-b1..b4.googledomains.com` and its
SOA hostmaster is `cloud-dns-hostmaster.google.com`. That looks like Google
Cloud DNS, but it isn't a separate console you need to find: Squarespace
acquired Google Domains, and migrated domains kept those nameservers.
Squarespace operates the zone behind them. **Add the record in Squarespace,
exactly as you did for the others.**

The proof is already live — this is the identical setup we're about to repeat:

```
$ dig +short CNAME shengchangmd.bahtzang.com
thirstypig.github.io.

$ dig +short CNAME tip.bahtzang.com
fr52vqis.up.railway.app.
```

Do not change nameservers. `bahtzang.com` has live MX records on
`privateemail.com`; switching nameservers without recreating them stops your
email.

### The repo has to be public (or you need GitHub Pro)

GitHub Pages only serves from **private** repositories on paid plans (Pro,
Team, Enterprise). On the free plan the repo must be public.

This repo contains her business copy, draft About text, and legal pages — no
credentials, since everything sensitive is an environment variable. A public
repo is defensible, but it is a real decision. GitHub Pro is $4/month if you'd
rather keep it private.

---

## Step 1 — Push to GitHub

```bash
git add -A
git commit -m "Rebuild theresewhite.com as a static Next.js site"
```

Public repo (free Pages):

```bash
gh repo create theresewhite.com --public --source=. --remote=origin --push
```

Private repo (needs GitHub Pro):

```bash
gh repo create theresewhite.com --private --source=. --remote=origin --push
```

Check nothing sensitive shipped: `git ls-files | grep env` should return only
`.env.example`.

---

## Step 2 — Turn on Pages

1. Repo → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

That's all. `.github/workflows/deploy.yml` is already in the repo and runs on
every push to `main`. It builds the static export and publishes `out/`.

Watch the first run under the **Actions** tab. It takes about two minutes.

### What the build checks before it publishes

Six gates. The first five run before anything is uploaded and any of them
failing stops the deploy, which is the point — each exists because the
corresponding failure is otherwise silent. The sixth runs after publish and can
only raise the alarm.

1. **Pages source is `workflow`.** Queries the Pages API and fails if the
   source has been switched to "Deploy from a branch". Without this, that
   change breaks nothing until the *next* push, which then republishes the
   repo source as a Jekyll site while still returning 200.
2. **`npm run typecheck`.** Runs `tsc --noEmit` over the whole project. The
   tests and the build both pass straight through type errors — on 2026-08-12
   a manual run caught one that all 66 tests had missed — so this is the only
   automatic check on types. It takes about three seconds.
3. **`npm test`.** The unit suite. The calculator figures are pinned to a
   golden vector, the staging `noindex` switch is covered in both directions,
   every route is asserted to build its metadata through `pageMetadata()`, and
   the built-output auditor is itself tested against the broken shapes it has
   to catch.
4. **Asset paths.** Confirms `out/index.html` still addresses `/_next/*` from
   the site root. A stray `basePath` would 404 every stylesheet and script
   while the HTML kept returning 200.
5. **Link-preview cards.** `npm run verify:build` walks the built HTML and
   checks that every page names `/og.png`, advertises its own `og:url`, and
   carries its own `og:title` rather than the homepage's. A page that sets only
   a title and description inherits the whole homepage card, and nothing else
   in the toolchain notices.
6. **The served image header** *(post-deploy)*. Fetches `og.png` from the live
   URL and fails unless it comes back as `image/png`. Next emits the generated
   image with no file extension and GitHub Pages types files by extension, so
   it was served as `application/octet-stream` — a valid PNG that every
   scraper drops. This one runs after the artifact is live, so it reports
   rather than prevents.

Gate 5 is runnable locally: `npm run build && npm run verify:build`.

Background: `docs/solutions/deployment-issues/nextjs-static-export-github-pages-source-and-subpath.md`
and `docs/solutions/deployment-issues/link-previews-open-graph-inheritance-and-image-content-type.md`

---

## Step 3 — Point the subdomain at it

**In Squarespace** → Domains → `bahtzang.com` → DNS Settings → Add record.
Your `gh` CLI is authenticated as **thirstypig**, so this is byte-for-byte the
same record shape as `shengchangmd`:

```
Type:   CNAME
Host:   theresewhite
Data:   thirstypig.github.io.
TTL:    300 (or leave default)
```

The value is your GitHub **username**, not the repo name — always
`<owner>.github.io.` regardless of what the repo is called.

**In GitHub:** Settings → Pages → Custom domain → `theresewhite.bahtzang.com`.

This has to be set in Settings (or via the API). A `CNAME` file in the built
artifact does **not** set it — GitHub's docs are explicit that with a custom
Actions workflow, "no `CNAME` file is created, and any existing `CNAME` file is
ignored and is not required." The widespread `touch out/CNAME` advice applies to
branch-based deploys only.

`public/CNAME` is committed anyway, alongside `public/.nojekyll`: both are
harmless, and both are the safety net if the Pages source is ever flipped to
"Deploy from a branch", where the legacy pipeline *does* read them.

Wait for the DNS check to go green, then tick **Enforce HTTPS**. The
certificate is issued automatically and can take up to an hour.

```bash
dig +short theresewhite.bahtzang.com
```

---

## Step 4 — Verify

```bash
curl -sI https://theresewhite.bahtzang.com/ | head -3
curl -s  https://theresewhite.bahtzang.com/robots.txt
```

`robots.txt` **must** read `User-Agent: *` / `Disallow: /`. If it doesn't,
`NEXT_PUBLIC_SITE_URL` in the workflow is wrong and the staging site is
indexable — fix that before sharing the link anywhere.

Then click through by hand: all five nav links, the FAQ accordion, the video,
the cookie banner (accept, then reload, then reset it from the footer link),
and the legal pages.

---

## Step 5 — How the forms are wired

Already done — this section is reference, not a task.

A static site has no server to receive a POST, so all three forms submit
directly to **Web3Forms** (<https://web3forms.com>). The calculator used to
have a fourth, an email gate in front of its projections; the version that
replaced it on 2026-10-16 collects nothing.

| Form | Submits as | Subject line it sends |
|---|---|---|
| `/contact` | plain HTML POST | Assessment request from theresewhite.com |
| `/collaborate` | plain HTML POST | Partner inquiry from theresewhite.com |
| `/lp/a` and `/lp/b` | `fetch` | Landing page inquiry (lp-a / lp-b) |

The two plain-HTML forms need no JavaScript at all: they work before hydration
and with JS disabled, then redirect to a thank-you page.

The `fetch` form confirms in place instead. It sits on pages with no
navigation, where leaving ends the visit.

The subjects differ on purpose: all three land in the same inbox, and a peer
making an introduction should be distinguishable from an organization in
crisis without opening the mail. The landing form also stamps which variant
produced the lead, which is the only reason to run two.

### The access key

One repository variable, `NEXT_PUBLIC_WEB3FORMS_KEY`, read by all three forms.

Repo → Settings → Secrets and variables → **Actions** → **Variables** tab.
Changing it needs a re-run (Actions → Deploy → Run workflow) because it is
baked in at build time.

**The key is public by design.** It ships in the page HTML and only identifies
which verified inbox to deliver to — it is not a secret. It lives in a repo
variable so it can be rotated without a code change. Rotate it if it ever
starts attracting spam.

With the variable unset, the forms render contact details instead of a form
that silently goes nowhere. That fallback is deliberate; if you ever see phone
and email where a form should be, the key is missing.

### Things worth knowing

- The `redirect` field must be an **absolute** `https` URL ending in a slash —
  a relative path is ignored and the visitor lands on Web3Forms' own success
  page. It is built from `SITE_URL`, so it follows whichever domain the build
  targets. Only the two plain-HTML forms use it; the `fetch` ones never
  navigate.
- The honeypot field must be named exactly `botcheck`. A differently named
  decoy is submitted as ordinary form data and ignored.
- The free tier is **250 submissions/month, shared across all three forms**.
- Web3Forms is already listed as a processor in `src/content/legal.ts`.
  Changing providers means updating that disclosure too.

---

## The calculator's own address: calculator.theresewhite.com

theresewhite.com is still on Wix, and its DNS is run by Wix (its name servers
are `ns2.wixdns.net` and `ns3.wixdns.net`). So until the cutover, the conflict
calculator has its own address on a subdomain, served free by GitHub Pages
from a second repository, **thirstypig/theresewhite-calculator**.

Nothing is maintained in that repository by hand. Every deploy of this one
also runs the `calculator-site` job in `.github/workflows/deploy.yml`, which:

1. builds the site a second time with
   `NEXT_PUBLIC_SITE_URL=https://calculator.theresewhite.com`;
2. keeps only the calculator page (`src/app/(landing)/calculator/page.tsx`),
   its scripts and styles, the link-preview image and the tab icon, using
   `scripts/build-calculator-site.mjs`;
3. runs the same link-preview audit as the main site on that one page; and
4. replaces that repository's `gh-pages` branch with the result.

It runs after the main build's checks, so a type error or failing test stops
both. If it fails, the main site still deploys; only the subdomain stays on its
previous version.

Two differences from the main site, both deliberate:

- **That repository publishes from a branch**, not from GitHub Actions — the
  opposite of what gate 1 enforces here. A branch is simpler to push to from
  another repository. The cost is that GitHub runs Jekyll over it, which drops
  the `_next` folder holding every script and stylesheet unless a `.nojekyll`
  file is present. The assembly script always writes one, and
  `scripts/build-calculator-site.test.ts` fails if it ever stops.
- **It wears the live Wix site's look, not the rebuild's**: Arial with
  black Arial Bold headlines, the Wix gray and blues, pill buttons, and the
  live site's own header (her logo, `public/brand/therese-white-logo.webp`,
  and its menu) and footer, every link going to the live page of that name.
  It sits beside the Wix site until the cutover, so it should look like part
  of it. The colors are the `.lp-wix` theme in `globals.css`, shared with
  `/lp/b`; the header and footer are `src/components/live-site-chrome.tsx`.
  The one thing not matched exactly is the button lettering: the live site
  uses Lulo Clean, a font Wix licenses only for its own sites, so the buttons
  use bold capitals in Arial with wide spacing instead.
- **The page is `noindex`.** The subdomain is for links in ads and messages,
  not search; after the cutover, `/conflict-calculator` on the main site is the
  page meant to be found.

### One-time setup

| Step | Where | Who |
|---|---|---|
| Create the public repository `thirstypig/theresewhite-calculator` | GitHub | Done 2026-10-16 |
| Add a deploy key that can write to that repository only, and store its private half as the `CALCULATOR_DEPLOY_KEY` secret here | GitHub | Done 2026-10-16 |
| After the first deploy creates the `gh-pages` branch: Settings → Pages → Deploy from a branch → `gh-pages`, `/ (root)`; custom domain `calculator.theresewhite.com`; Enforce HTTPS | That repository | After the first deploy |
| Add a DNS record: type **CNAME**, host **`calculator`**, value **`thirstypig.github.io`** | Therese's Wix account → Domains → theresewhite.com → DNS records | James or Therese |
| Point the Wix home page's "Click To See Your Numbers" button at `https://calculator.theresewhite.com` (it opens the claude.ai artifact today) | Wix editor | James or Therese, once the address works |

Until the DNS record exists the page has no working address. It is not usable
at `thirstypig.github.io/theresewhite-calculator/` either, because the page
loads its files from the root of whatever domain serves it.

If the deploy key is ever lost or rotated: create a new key pair, add the public
half under that repository's Settings → Deploy keys with **write access**, and
replace the `CALCULATOR_DEPLOY_KEY` secret here with the private half.

### At cutover

The subdomain must keep working, because ads and messages will have linked to
it. Replace its contents with a page that redirects to
`https://www.theresewhite.com/conflict-calculator/`, then delete the
`calculator-site` job, the `(landing)/calculator` route and the assembly
script. Change the calculator's "Schedule Your Free Confidential Assessment"
button, which now goes to the Wix home page, only once the main site is live.

---

## Step 6 — Later: cutting over to theresewhite.com

Not yet — only when the design is approved.

1. Change `NEXT_PUBLIC_SITE_URL` in `.github/workflows/deploy.yml` to
   `https://www.theresewhite.com`. This flips indexing on and restores the
   sitemap.
2. Update `public/CNAME` to `www.theresewhite.com`.
3. `theresewhite.com`'s nameservers are `ns2/ns3.wixdns.net` today. Move DNS
   off Wix, or point the records at GitHub Pages. **Check for MX records
   first** — if her email runs through Wix, those must be recreated before the
   switch or her email stops.
4. **Restore the redirects.** GitHub Pages can't issue 301s, so the Wix URL map
   below has to be handled either by moving to a host that supports redirects,
   or by generating static meta-refresh pages. Either way it must happen, or
   every existing link and search ranking breaks:

   | Old | New |
   |---|---|
   | `/services-3` | `/faq` |
   | `/team-1-1` | `/endorsements` |
   | `/general-8`, `/newsletterontheway` | `/contact/thank-you` |
   | `/book-online`, `/service-page/*` | `/contact` |
   | `/newsletterarchive`, `/copy-of-newsletter` | `/` |
   | `/frommeltdowntoresolution`, `/product-page/*` | `/` |
   | `/pricing-plans/*`, `/challenges`, `/challenge-page/*` | `/services` |
   | `/blog`, `/post/*` | `/` |

5. Submit the site to Google Search Console and confirm the redirects resolve.
