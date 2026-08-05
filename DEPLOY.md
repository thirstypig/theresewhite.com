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

## Step 5 — Wiring up the contact form

Right now `/contact` shows phone and email rather than a form, because a static
site has no server to receive a POST and a form that goes nowhere is worse than
no form.

To turn the form on, pick a service that accepts a plain HTML form submission:

- **Formspree** — <https://formspree.io>, 50 submissions/month free
- **Web3Forms** — <https://web3forms.com>, 250/month free, no account needed

Then add the endpoint as a repository variable:

1. Repo → Settings → Secrets and variables → **Actions** → **Variables** tab.
2. New variable: `NEXT_PUBLIC_FORM_ENDPOINT`, value = the URL the service gives
   you.
3. Re-run the workflow (Actions → Deploy → Run workflow).

The form already posts `_next` and `redirect` fields pointing at
`/contact/thank-you/`, which both services understand.

Note this sends inquiry details through a third party. Given people describe
confidential workplace conflicts here, check the provider's data handling, and
add them to the processor list in `src/content/legal.ts` when you choose one.

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
