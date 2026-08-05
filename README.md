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

## Documentation sweep

`/doc` keeps the docs in sync. Its surface for this project:

| File | Role |
|---|---|
| `README.md` | This file — update when top-level architecture changes |
| `DEPLOY.md` | Deploy steps, DNS, the Wix redirect map, cutover checklist |
| `src/content/todos.ts` | **Admin data.** Backs `/admin/todo`. Mark shipped items `done` rather than deleting them, add anything new, and bump `TODOS_UPDATED` |
| `src/app/admin/page.tsx` | Page inventory, palette and type reference — refresh when routes or tokens change |

There is no `CHANGELOG.md` or `ROADMAP.md`; the git log and `todos.ts` cover
both. Don't create them without asking.

**Copy is migrated verbatim** from the live Wix site, with one exception: the
About page is drafted, marked `DRAFT COPY` in `site.ts`, and awaits Therese's
own words. Nothing biographical was invented.

## Content that still needs a human

- **About page** — assembled from claims evidenced elsewhere on the site. Needs
  rewriting in her voice.
- **Privacy and terms** — generic templates, not reviewed by a lawyer.
- **EEOC and Kenneth Cloke** entries in `credentials` — read off cropped logo
  images, so worth confirming.

## Design notes

Palette is carried over from the live Wix theme (`color_36`–`color_65`): deep
teal `#22495A`, slate `#486573`, sand `#D8C7BD`, cream `#F4EFEB`, charcoal
`#414141`. Dark mode is derived from the same hues rather than inverted.

Tokens in `globals.css` are named for their **role**, not their colour —
`heading`, `btn-fg`, `band-fg` — because the colour flips between themes and
the role doesn't. Using colour names here is how you end up with dark text on
dark buttons.

## Analytics and consent

Microsoft Clarity (`xxajqpw2g7`) and GA4 (`G-4QVRMZJVWS`) are both gated behind
the cookie banner and only load in production builds. Nothing fires in `npm run
dev`, and nothing fires until a visitor accepts — so GA4 will under-report
compared to an ungated install. That is deliberate.

The contact form carries `data-clarity-mask="True"`: visitors describe
confidential workplace conflicts there, and session replay must never capture
it.

## Contact form

Static hosting means no server to receive a POST. Set
`NEXT_PUBLIC_FORM_ENDPOINT` to a Formspree or Web3Forms URL to enable the form;
leave it unset and `/contact` shows phone and email instead, rather than a form
that silently goes nowhere.

## Not in scope (yet)

Blog, newsletter, pricing plans, and booking were all dropped from the Wix site
by agreement. `workplace-conflict-calculator-COMPLETE.html` sits in the repo
root awaiting its own landing page — it is not part of the build.

The 15 Wix redirects can't run on GitHub Pages (no server to issue a 301).
They're preserved as a table in [DEPLOY.md](./DEPLOY.md) and must be restored
at cutover, or every existing link and search ranking breaks.
