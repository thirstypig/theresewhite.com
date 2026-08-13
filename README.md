# theresewhite.com

Marketing site for **L. Therese White** — employment mediator and workplace
conflict coach, Culver City CA. A rebuild of her live Wix site as a static
Next.js export.

The site has one job: get an HR leader or general counsel with a live,
emotionally-charged conflict to book a confidential assessment.

| | |
|---|---|
| **Dev port** | **3160** (block 3160–3169 — see [PORTS.md](./PORTS.md)) |
| **Stack** | Next.js 16 (App Router), Tailwind v4, TypeScript, static export |
| **Staging** | https://theresewhite.bahtzang.com (GitHub Pages, `noindex`) |
| **Production** | https://www.theresewhite.com — still on Wix, not yet cut over |
| **Deploy** | Push to `main` → GitHub Actions → Pages. See [DEPLOY.md](./DEPLOY.md) |

```bash
npm install
npm run dev           # http://localhost:3160
npm test              # vitest, unit tests only
npm run build         # static export to ./out
npm run verify:build  # audit the built pages' link-preview cards (needs a build first)
npm run serve         # preview the built output on :3160
```

There is no `npm start`: `output: "export"` produces static files with no Node
server to run.

---

## Where things live

```
src/content/site.ts     All page copy. Edit here, never in components.
src/content/legal.ts    Privacy and terms text.
src/content/todos.ts    Outstanding work. Backs /admin/todo.
src/lib/site-config.ts  Deployment URL + the staging noindex switch.
src/lib/conflict-cost.ts  Calculator maths, ported verbatim from the original.
src/components/         Shared UI.
src/app/                One folder per route, inside two route groups:
                        (site) carries the header and footer, (landing)
                        renders bare. Parentheses never appear in a URL.
scripts/                Build-time checks that are not part of the app.
                        verify-built-output.mjs reads ./out and fails the
                        deploy if any page's link-preview card is wrong.
public/logos/           Panel and affiliation logos, normalized to uniform tiles.
```

## Tests

`npm test` — Vitest, node environment, 66 tests across six files. They run in
CI before the build, so a failure blocks the deploy.

Every one of them guards a failure that returns 200 and looks correct in a
browser. That is the bar here: if a person would notice it, a test is not what
catches it.

| File | What it protects |
|---|---|
| `src/lib/conflict-cost.test.ts` | The calculator's arithmetic, pinned to a golden vector verified against the original HTML. These figures may already be in Therese's proposals — a "cleanup" that changes them is the regression this exists to catch. |
| `src/lib/site-config.test.ts` | The staging `noindex` switch. Fails in two directions: a crawlable duplicate competing with her live site, or the launched site shipping `noindex` and vanishing from search. |
| `src/app/sitemap.test.ts` | That every page reaches the sitemap or is on the documented exclusion list. A new page can ship, return 200, look fine, and never be submitted to a search engine — a failure with no symptom. The exclusion list is the durable part: it records *why* each absent route is absent. |
| `src/lib/page-metadata.test.ts` | What `pageMetadata()` produces: a page's own `og:title` rather than the site's, a canonical and `og:url` carrying the trailing slash, an `og:image` path with a real image extension, and `robots` omitted unless a page opts out. |
| `src/app/page-metadata-coverage.test.ts` | That the helper is actually *used*. A page setting only `title` inherits the root layout's entire card — the homepage's title, the homepage's URL, and an image GitHub Pages serves as `application/octet-stream`. Shipped twice before this existed. |
| `scripts/verify-built-output.test.ts` | The checker that reads the built site before it is published (`npm run verify:build`). Its own tests are written backwards: the examples fed to it are the broken pages that actually shipped, so if it ever stops catching them, it fails its own suite. Also covers the two ways a checker can lie — finding no pages and calling that a pass, and trusting a file named `.png` instead of reading its first bytes. |

Deliberately **not** tested: page components and copy. Asserting that the copy
is the copy is a maintenance cost with no regression behind it. If you can't
name the failure a test prevents, don't add it.

## Documentation sweep

`/doc` keeps the docs in sync. Its surface for this project:

| File | Role |
|---|---|
| `README.md` | This file — update when top-level architecture changes |
| `CLAUDE.md` | How to write for James: plain English, consequences before mechanisms. Applies to commit messages, code comments, specs and post-mortems as well as conversation. `AGENTS.md` is rewritten by `next dev`, so put conventions here instead |
| `DEPLOY.md` | Deploy steps, DNS, the Wix redirect map, cutover checklist |
| `src/content/todos.ts` | **Admin data.** Backs `/admin/todo`. Mark shipped items `done` rather than deleting them, add anything new, and bump `TODOS_UPDATED` |
| `src/app/(site)/admin/page.tsx` | Page inventory, palette, type and test reference — refresh when routes, tokens or test counts change |
| `docs/solutions/**` | Post-mortems, one per solved problem. **Append only** — never edit a past write-up; a new occurrence gets a new file |

There is no `CHANGELOG.md` or `ROADMAP.md`; the git log and `todos.ts` cover
both. Don't create them without asking.

**Copy is migrated verbatim** from the live Wix site, with three exceptions:
the About page, the Collaborate page, and the campaign landing pages are
drafted, marked `DRAFT COPY` or `TODO(therese)` in `site.ts`, and await
Therese's own words. Nothing biographical was invented for any of them.

The conflict calculator is the opposite case — its copy is migrated, but from
`workplace-conflict-calculator-COMPLETE.html` in the repo root rather than
from Wix.

## Content that still needs a human

- **Collaborate page** — the whole page is drafted, not migrated; the Wix site
  has no equivalent. Highest priority open content item — see `collaborate-voice`
  in `todos.ts`.
- **About page** — assembled from claims evidenced elsewhere on the site. Needs
  rewriting in her voice.
- **Landing pages** (`/lp/a`, `/lp/b`) — the hero and contact copy in the
  `landing` export is drafted. The bulk of both pages is her own calculator
  copy and needs nothing.
- **Privacy and terms** — generic templates, not reviewed by a lawyer.
- **EEOC and Kenneth Cloke** entries in `credentials` — read off cropped logo
  images, so worth confirming.

## Design notes

Palette is carried over from the live Wix theme (`color_36`–`color_65`): deep
teal `#22495A`, slate `#486573`, sand `#D8C7BD`, cream `#F4EFEB`, charcoal
`#414141`. Dark mode is derived from the same hues rather than inverted.

Tokens in `globals.css` are named for their **role**, not their color —
`heading`, `btn-fg`, `band-fg` — because the color flips between themes and
the role doesn't. Using color names here is how you end up with dark text on
dark buttons.

## Analytics and consent

Microsoft Clarity (`xxajqpw2g7`) and GA4 (`G-4QVRMZJVWS`) are both gated behind
the cookie banner and only load in production builds. Nothing fires in `npm run
dev`, and nothing fires until a visitor accepts — so GA4 will under-report
compared to an ungated install. That is deliberate.

Both the contact form and the Collaborate partner form carry
`data-clarity-mask="True"`: visitors describe confidential workplace
conflicts there, and session replay must never capture it.

## Forms

Static hosting means no server to receive a POST, so all four forms submit to
Web3Forms. They split into two kinds:

- **`/contact` and `/collaborate`** post as plain HTML with no JavaScript, so
  they work before hydration and with JS disabled, then redirect to a
  thank-you page.
- **The calculator's email gate and the landing-page form** submit with
  `fetch` and confirm in place. Both live on pages where navigating away ends
  the visit, and the gate has to reveal a result rather than leave.

They share one repo variable, `NEXT_PUBLIC_WEB3FORMS_KEY`. Leave it unset and
each renders contact details instead of a form that silently goes nowhere. The
key is public by design: it ships in the page HTML and only identifies which
verified inbox to deliver to.

Each stamps a distinct subject line, so the four are filterable in one inbox —
and the landing form also stamps which variant it came from, which is the only
way to tell which design converted.

Free tier is 250 submissions/month shared across all four. Mechanics and
gotchas — the absolute `redirect` URL, the `botcheck` honeypot name — are in
`DEPLOY.md` Step 5.

## Not in scope (yet)

Blog, newsletter, pricing plans, and booking were all dropped from the Wix site
by agreement.

`workplace-conflict-calculator-COMPLETE.html` in the repo root is Therese's
standalone version of the tool. It is not part of the build — it is the source
the `/conflict-calculator` page was rebuilt from. The calculator itself and its
supporting copy have both been carried across, so the file is now reference
only. Treat it as the provenance record for the `calculator` export in
`src/content/site.ts`, not as something still awaiting a home.

The 15 Wix redirects can't run on GitHub Pages (no server to issue a 301).
They're preserved as a table in [DEPLOY.md](./DEPLOY.md) and must be restored
at cutover, or every existing link and search ranking breaks.
