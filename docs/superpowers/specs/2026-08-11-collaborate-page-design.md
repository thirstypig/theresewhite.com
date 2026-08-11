# /collaborate — a reciprocal referral page for allied professionals

**Date:** 2026-08-11
**Status:** approved, ready for implementation planning

## Problem

The site speaks to one reader: an HR buyer with a conflict on their desk. It has
nothing for the other group that sends mediators work — fractional HR
consultants, ombuds, employment counsel, coaches — and no page Therese can send
to someone she has just met at a conference.

## Decisions

Four decisions were taken during brainstorming and everything below follows from
them.

### 1. Reciprocal now, paid model deferred

No money changes hands. The page describes mutual professional referrals and
says nothing about fees in either direction.

This is not only a simplicity choice. Most mediator ethics codes — including the
Model Standards of Conduct for Mediators, which govern the AAA/ICDR panel
Therese sits on — restrict giving or receiving commissions in return for
referrals, and lawyers cannot split fees with non-lawyers at all. A paid
affiliate scheme aimed at employment counsel could put her panel memberships at
risk.

**Deferred, not rejected.** If a paid model is wanted later it needs Therese to
check her panel rules first. Tracked in `todos.ts`.

### 2. Warm-link first, SEO as a bonus

The page is written for someone who already knows her and was sent the URL. It
also gets clean metadata, a canonical URL, and a sitemap entry, so it can be
found cold. Writing for the warm case does not cost the cold case anything.

### 3. "We" means Therese and the reader

The site is first-person singular throughout, deliberately — "you get all of me,
not a slice of a caseload" is load-bearing positioning on the homepage. An
editorial "we" would imply associates and undercut it.

So "we" on this page means Therese *and the professional reading it*: "here's
how we'd work together." In practice the drafted copy below carries this
through "work together" and second-person address rather than a literal "we" in
body copy — the collaborative register comes from what the sentences offer, not
from the pronoun. Every sentence about Therese herself stays first-person
singular.

### 4. Lead with the reassurance

The unspoken objection to referring a client to anyone is *will this person take
my client?* A page that does not answer it gets read politely and closed. So the
page opens on that answer and everything else follows.

This mirrors `reasons[1]` on the homepage — "I'm not an attorney. And that's a
good thing." — turning a limitation into the reason to pick her. Reusing an
established rhetorical move keeps the new page sounding like the same author.

## Route and placement

**`/collaborate`.**

Rejected `/referrals` as ambiguous — half of readers would assume it is where
clients get referred *to* her, which is a different page. Rejected `/affiliates`
because it promises money and decision 1 defers that. "Collaborate" covers
referral, co-delivery, and being brought in alongside someone, which is the
actual scope.

**Footer only, not the header nav.** The header is a buyer's path — About,
Services, Process, Endorsements, FAQ all answer "should I hire her?" This page
answers "should I work with her?", asked by a different person. A sixth header
item aimed at peers dilutes the buying path for no gain.

Note `site-footer.tsx:43` builds its list from `nav` plus Contact, so this needs
its own footer entry rather than an addition to `nav` — adding to `nav` would
put it in the header too.

Indexable, and in `sitemap.ts` at priority 0.5.

## Content

All copy lives in a new `collaborate` export in `src/content/site.ts`. No prose
in components — the existing separation exists so Therese can be handed one
file.

Sections alternate `bg-paper` / `bg-cream` down the page, the convention
restored in commit `c73950e`.

### Header

Eyebrow `Collaborate`. Title **"Your client stays your client"**. Lede:

> I take the conflict, resolve it, and hand the working relationship back to
> you. I'm not looking for your retainer, your HR work, or your seat at the
> table.

### What I don't do — `bg-paper`

- **I don't practice HR.** No policy work, no investigations-for-cause, no
  restructures. When the fix is procedural, it's yours.
- **I don't give legal advice.** I'm not an attorney — deliberately. Counsel
  stays counsel.
- **I don't pitch adjacent work.** One conflict, scoped and quoted. If I spot
  something outside it, I tell you, not your client.
- **I leave.** Follow-up runs a few weeks past the agreement, then I'm gone.

### Who I work with — `bg-cream`

Six entries. Each names the handoff rather than flattering the reader.

1. **HR leaders and People teams** — You own the policy, the record, and the
   relationship afterwards. I take the conversation you can't be neutral in,
   because you're also the person who has to manage both of them next quarter.
2. **Fractional and interim HR** — You're often the only HR in the building, and
   a live conflict eats the engagement you were actually hired for. I take it
   off your critical path.
3. **Ombuds and internal neutrals** — Your confidentiality is yours. I don't ask
   you to breach it and I don't report back to the organization through you.
   When a matter needs a documented resolution your office can't produce, I can.
4. **Employment counsel, in-house and outside** — You stay lead on the matter. I
   don't give legal advice and I don't touch strategy. I work the part that
   isn't legal, which is usually the part blocking settlement.
5. **Executive and leadership coaches** — Coaching one party rarely resolves a
   two-party conflict. I can take the joint conversation while your coaching
   relationship stays intact and uncompromised.
6. **EAP and workplace wellbeing providers** — You're supporting the individual.
   I'm resolving the dispute between them. Different work, and neither
   substitutes for the other.

These six bodies are drafted so the spec is complete and implementable. James
has offered to refine them at implementation time, since the accuracy of each
handoff is Therese's domain knowledge, not the author's. Treat them as a
starting point to overwrite, not as final copy.

### Four ways to work together — `bg-paper`

1. **Refer a matter out** — Send the whole thing to me. I scope it, quote it,
   resolve it, and tell you when it's finished.
2. **Bring me in alongside you** — Your engagement, your client, your name on
   it. I do the mediation as part of your programme.
3. **Co-deliver a workshop** — Conflict prevention training for managers, built
   with you and taught together.
4. **Send me your hard one** — The conflict that's stopped responding to
   everything you've tried. That's the one I want.

### What comes back — `bg-cream`

The reciprocal half. Without it the page is a lead-generation form wearing the
word "collaborate".

> I refer out constantly. When the problem turns out to be policy, or legal, or
> clinical, I say so and name someone — and I'd rather name someone I've
> actually met.

### Form — `bg-paper`

## Copy provenance

Every word above is drafted. None of it is migrated from the Wix site, which has
no equivalent page.

This is the same category as the `about` export, which carries a
`TODO(therese)`. The `collaborate` export gets a header comment saying the same,
and a matching `todos.ts` entry. Marked draft copy is acceptable to ship;
unmarked draft copy quietly passing as her own words is not.

## The form

New component `src/components/partner-form.tsx`, modeled on `contact-form.tsx`.

| Field | Name | Required | Notes |
| --- | --- | --- | --- |
| Your name | `name` | yes | `autoComplete="name"` |
| Email | `email` | yes | `type="email"`. Web3Forms uses the field literally named `email` as reply-to |
| Firm or practice | `organization` | yes | `autoComplete="organization"` |
| What you do | `practice` | no | `<select>` — the six partner types plus "Something else" |
| How you'd like to work together | `note` | yes | `<textarea>`, no `minLength`; hint reads "A sentence is plenty" |

`note` is required but carries no `minLength`, unlike the contact form's
`situation` field. A peer making an introduction should not be made to write a
paragraph; a client describing a crisis has something to say anyway.

Hidden fields, following `contact-form.tsx`:

- `access_key` — `NEXT_PUBLIC_WEB3FORMS_KEY`
- `from_name` — `theresewhite.com`
- `subject` — **"Partner enquiry from theresewhite.com"**, so these are
  filterable in her inbox and never mistaken for a client in crisis
- `redirect` — `${SITE_URL}/collaborate/thank-you/`, absolute; a relative path
  is ignored and the visitor lands on Web3Forms' own success page
- `botcheck` — the honeypot, which must be named exactly that

Two behaviours carried over deliberately:

- **No-key fallback.** With `NEXT_PUBLIC_WEB3FORMS_KEY` unset, render her
  contact details instead of a form that silently goes nowhere.
- **`data-clarity-mask="True"`.** The note field will attract "I have a client
  where…", so it gets the same masking as the contact form.

**Quota.** Web3Forms' free tier is 250 submissions/month, shared across the
contact form, the calculator's email gate, and now this. Partner enquiries will
be a rounding error. Noted, no action.

## Refactor

`contact-form.tsx` defines a `Field` component and a `fieldClass` string that
the partner form needs verbatim. Duplicating them means the next styling change
gets made in one file and missed in the other.

Extract both into `src/components/form-field.tsx`; both forms import them.

`NoKeyFallback` is **not** extracted. Its copy is contact-specific and the
partner version needs to say something different. Two similar functions with
different copy beat one function with a `variant` prop.

## Supporting changes

- **`/collaborate/thank-you/`** — its own page, `robots: { index: false }`. Not
  reusing `/contact/thank-you/`, whose copy reads "If the situation is moving
  faster than that, call — she keeps time open for same-day strategy calls."
  That is crisis framing, and it lands oddly on an ombuds who has just offered
  to send work her way.
- **`sitemap.ts`** — add `/collaborate` at priority 0.5.
- **`admin/page.tsx`** — add `/collaborate` and `/collaborate/thank-you` to the
  page inventory, per the README rule that it is refreshed when routes change.
- **`todos.ts`** — two new entries, and bump `TODOS_UPDATED`:
  1. Therese to rewrite the `/collaborate` copy in her own voice (high, Therese)
  2. Decide whether to offer paid referrals — needs checking against her
     AAA/ICDR and EEOC panel rules first (normal, James)

## Testing

The README's rule is: name the failure a test prevents, or don't add it.

**One test.** A new page that never reaches the sitemap. Nothing today connects
`src/app/**/page.tsx` to the hand-maintained list in `sitemap.ts`, and this
change makes the two drift for the first time.

The test walks the app directory and asserts every route is either present in
the sitemap or on an explicit exclusion list. The exclusion list lives in the
test file, each entry paired with its reason — `sitemap.ts` is a Next route
module and should not carry test scaffolding:

| Excluded | Why |
| --- | --- |
| `/admin`, `/admin/todo` | Password-gated; nothing there should be discoverable |
| `/conflict-calculator` | Unlinked and noindex until the ad campaign runs |
| `/contact/thank-you`, `/collaborate/thank-you` | Post-submit confirmations, noindex |

The exclusion list is most of the value. Today, "why isn't `/conflict-calculator`
in the sitemap?" is answered only by a comment on a todo item, nowhere near
`sitemap.ts`. Naming each exclusion turns a silent absence into a documented
decision, and tells the next person who adds a page via a failing test rather
than via git history.

`site-config.test.ts` already establishes the `vi.stubEnv` + `vi.resetModules()`
pattern this needs, since `sitemap()` returns `[]` unless
`IS_PRODUCTION_SITE` is true.

**No test for the form markup.** A snapshot of JSX prevents no failure anyone
will have.

## Constraints carried in

- Static export on GitHub Pages. No server, no database, no Server Actions.
- Forms go through Web3Forms.
- `AGENTS.md` pins Next 16.3 and warns that conventions may differ from training
  data. Read the relevant guide in `node_modules/next/dist/docs/` before writing
  the route.

## Out of scope

- Any paid or commission-based arrangement (see decision 1).
- Naming Candice Gottlieb-Clark, Kenneth Cloke or Joan Goldsmith as partners.
  They appear on `/endorsements` as endorsers; presenting them as a referral
  bench is a different claim and needs each person's permission.
- Structured data for the page. No schema type fits, and none would earn a rich
  result.
- Any change to the header nav.
