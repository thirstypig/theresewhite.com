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
npm run dev      # http://localhost:3160
npm test         # vitest, unit tests only
npm run build    # static export to ./out
npm run serve    # preview the built output on :3160
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
src/app/                One folder per route.
public/logos/           Panel and affiliation logos, normalized to uniform tiles.
```

## Tests

`npm test` — Vitest, node environment, 18 tests across three files. They run in
CI before the build, so a failure blocks the deploy.

| File | What it protects |
|---|---|
| `src/lib/conflict-cost.test.ts` | The calculator's arithmetic, pinned to a golden vector verified against the original HTML. These figures may already be in Therese's proposals — a "cleanup" that changes them is the regression this exists to catch. |
| `src/lib/site-config.test.ts` | The staging `noindex` switch. Fails in two directions: a crawlable duplicate competing with her live site, or the launched site shipping `noindex` and vanishing from search. |
| `src/app/sitemap.test.ts` | That every page reaches the sitemap or is on the documented exclusion list. A new page can ship, return 200, look fine, and never be submitted to a search engine — a failure with no symptom. The exclusion list is the durable part: it records *why* each absent route is absent. |

Deliberately **not** tested: page components and copy. Asserting that the copy
is the copy is a maintenance cost with no regression behind it. If you can't
name the failure a test prevents, don't add it.

## Documentation sweep

`/doc` keeps the docs in sync. Its surface for this project:

| File | Role |
|---|---|
| `README.md` | This file — update when top-level architecture changes |
| `DEPLOY.md` | Deploy steps, DNS, the Wix redirect map, cutover checklist |
| `src/content/todos.ts` | **Admin data.** Backs `/admin/todo`. Mark shipped items `done` rather than deleting them, add anything new, and bump `TODOS_UPDATED` |
| `src/app/admin/page.tsx` | Page inventory, palette, type and test reference — refresh when routes, tokens or test counts change |
| `docs/solutions/**` | Post-mortems, one per solved problem. **Append only** — never edit a past write-up; a new occurrence gets a new file |

There is no `CHANGELOG.md` or `ROADMAP.md`; the git log and `todos.ts` cover
both. Don't create them without asking.

**Copy is migrated verbatim** from the live Wix site, with two exceptions: the
About page and the Collaborate page are drafted, marked `DRAFT COPY` in
`site.ts`, and await Therese's own words. Nothing biographical was invented
for either.

## Content that still needs a human

- **Collaborate page** — the whole page is drafted, not migrated; the Wix site
  has no equivalent. Highest priority open content item — see `collaborate-voice`
  in `todos.ts`.
- **About page** — assembled from claims evidenced elsewhere on the site. Needs
  rewriting in her voice.
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

Static hosting means no server to receive a POST, so all three forms —
`/contact`, `/collaborate`, and the calculator's email gate — submit directly
to Web3Forms as plain HTML, with no JavaScript.

They share one repo variable, `NEXT_PUBLIC_WEB3FORMS_KEY`. Leave it unset and
each form renders contact details instead of a form that silently goes
nowhere. The key is public by design: it ships in the page HTML and only
identifies which verified inbox to deliver to.

Free tier is 250 submissions/month across all three. Mechanics and gotchas —
the absolute `redirect` URL, the `botcheck` honeypot name — are in `DEPLOY.md`
Step 5.

## Not in scope (yet)

Blog, newsletter, pricing plans, and booking were all dropped from the Wix site
by agreement. `workplace-conflict-calculator-COMPLETE.html` sits in the repo
root awaiting its own landing page — it is not part of the build.

The 15 Wix redirects can't run on GitHub Pages (no server to issue a 301).
They're preserved as a table in [DEPLOY.md](./DEPLOY.md) and must be restored
at cutover, or every existing link and search ranking breaks.
