# /collaborate Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/collaborate`, a reciprocal referral page addressed to allied professionals — HR leaders, fractional HR, ombuds, employment counsel, coaches, EAP providers — with a Web3Forms partner enquiry form.

**Architecture:** A static route following the existing page pattern exactly: all copy lives in a `collaborate` export in `src/content/site.ts`, the page component only lays it out, and the form posts directly to Web3Forms because there is no server. A shared `Field` primitive is extracted first so the new form does not duplicate the contact form's markup. A sitemap-coverage test is added before the page so the new route's absence from `sitemap.ts` is caught by a failing test rather than by nobody.

**Tech Stack:** Next.js 16.3 (App Router, `output: "export"`, Turbopack), React 19.2, Tailwind CSS v4, Vitest 4 (node environment), Web3Forms.

## Global Constraints

- **Static export.** `output: "export"` in `next.config.ts`. No Server Actions, no `redirects()`, no route handlers, no `next/image` optimization.
- **`trailingSlash: true`.** Every internal path that is written as a literal string ends with `/`. The Web3Forms `redirect` value is `${SITE_URL}/collaborate/thank-you/`.
- **All copy lives in `src/content/site.ts`.** Never write prose in a component. Therese is handed one file to edit.
- **Draft copy must be marked.** Nothing on this page is migrated from Wix. The `collaborate` export carries a header comment and a `TODO(therese)`, matching the existing `about` export.
- **Section backgrounds alternate** `bg-paper` and `bg-cream` down the page. Restored deliberately in commit `c73950e`; do not break it.
- **No money.** The page says nothing about fees, commissions, or referral payments in either direction. See the spec for the ethics reasoning.
- **First-person singular.** "I", never an editorial "we". Collaborative register comes from "work together" and second-person address.
- **Vitest only picks up `src/**/*.test.ts`** and runs in `environment: "node"`. No DOM, so no component tests.
- **Read `node_modules/next/dist/docs/` before writing route code**, per `AGENTS.md`. Already done for this plan: `export const metadata` with `robots` and `alternates.canonical` is current in 16.3; only `themeColor`, `colorScheme` and `viewport` in `metadata` are deprecated, and this site uses none of them.
- **Spec:** `docs/superpowers/specs/2026-08-11-collaborate-page-design.md`

## Before you start

**The working tree must be clean.** As of writing, four files carry uncommitted
changes from an earlier docs sync: `DEPLOY.md`, `README.md`,
`src/app/admin/page.tsx` and `src/content/todos.ts`.

Two of those are files Task 7 modifies. Its `git add src/app/admin/page.tsx
src/content/todos.ts` would sweep the unrelated pending edits into a commit
about `/collaborate`, mixing two changes under one message.

Commit or stash the docs sync first. Task 4 also assumes the `/contact/thank-you`
entry that pending diff adds to the admin `pages` array already exists.

Run `git status` and confirm it is clean before Task 1.

## File Structure

| File | Responsibility |
| --- | --- |
| `src/components/form-field.tsx` | **Create.** Shared `fieldClass` string and `Field` component, used by both forms. |
| `src/components/contact-form.tsx` | **Modify.** Import the shared primitives instead of defining them locally. |
| `src/app/sitemap.test.ts` | **Create.** Asserts every page in `src/app` is in the sitemap or on a documented exclusion list. |
| `src/content/site.ts` | **Modify.** Add the `collaborate` copy export and the `footerNav` export. |
| `src/app/collaborate/thank-you/page.tsx` | **Create.** Post-submit confirmation, noindex. |
| `src/components/partner-form.tsx` | **Create.** The partner enquiry form and its no-key fallback. |
| `src/app/collaborate/page.tsx` | **Create.** The page itself. |
| `src/components/site-footer.tsx` | **Modify.** Render the footer-only link. |
| `src/app/sitemap.ts` | **Modify.** Add `/collaborate`. |
| `src/app/admin/page.tsx` | **Modify.** Add both new routes to the page inventory. |
| `src/content/todos.ts` | **Modify.** Two new entries, bump `TODOS_UPDATED`. |

---

### Task 1: Extract the shared form field primitive

`contact-form.tsx` defines a `Field` component and a `fieldClass` string that the partner form needs verbatim. Extract them first so the new form imports rather than copies.

This is a pure refactor. It has no new test because it changes no behavior; the existing suite plus a successful build plus a visual check on `/contact/` is the verification.

**Files:**
- Create: `src/components/form-field.tsx`
- Modify: `src/components/contact-form.tsx` (remove lines 23-55, add an import)

**Interfaces:**
- Consumes: nothing
- Produces: `fieldClass: string` and `Field({ label, name, type?, required?, autoComplete? }): JSX.Element`, both exported from `@/components/form-field`

- [ ] **Step 1: Create the shared module**

Create `src/components/form-field.tsx`:

```tsx
/**
 * Shared form primitives.
 *
 * Both forms on this site post directly to Web3Forms and share their field
 * styling. Extracted so a styling change lands in one place rather than
 * drifting between the contact form and the partner form.
 *
 * `NoKeyFallback` is deliberately NOT shared: each form's fallback copy says
 * something different, and one component with a `variant` prop would be worse
 * than two short functions.
 */

export const fieldClass =
  "mt-2 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-base text-charcoal outline-none transition-colors focus:border-btn";

export function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <p className="m-0">
      <label htmlFor={name} className="label text-muted">
        {label}
        {required ? "" : " (optional)"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={fieldClass}
      />
    </p>
  );
}
```

- [ ] **Step 2: Update the contact form to import them**

In `src/components/contact-form.tsx`, add to the imports at the top:

```tsx
import { Field, fieldClass } from "@/components/form-field";
```

Then delete the local `fieldClass` constant and the local `Field` function — everything from `const fieldClass =` through the closing brace of `function Field(...)`, which is lines 23-55 in the current file. Leave `NoKeyFallback` and `ContactForm` untouched.

- [ ] **Step 3: Verify nothing broke**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: 15 tests pass, no type errors, build completes.

Then open http://localhost:3160/contact/ and confirm the form still renders with identical styling.

- [ ] **Step 4: Commit**

```bash
git add src/components/form-field.tsx src/components/contact-form.tsx
git commit -m "refactor: extract the shared form field primitive

The partner form on /collaborate needs the same field markup and the same
styling string. Extracting them now means the next styling change lands in
one place instead of drifting between two forms.

NoKeyFallback stays duplicated on purpose - each form's fallback says
something different, and one component with a variant prop would be worse
than two short functions."
```

---

### Task 2: Add the sitemap coverage test

Nothing today connects `src/app/**/page.tsx` to the hand-maintained list in `sitemap.ts`. Adding a route makes the two drift for the first time. Write the guard before the route exists, so Task 6 gets a genuine red-to-green cycle.

The exclusion list is most of the value. "Why isn't `/conflict-calculator` in the sitemap?" is currently answered only by a comment on a todo item, nowhere near `sitemap.ts`.

**Files:**
- Create: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: the default export of `src/app/sitemap.ts`, which is `sitemap(): MetadataRoute.Sitemap`
- Produces: nothing imported elsewhere. Task 4 and Task 6 both edit the `NOT_IN_SITEMAP` map inside this file.

- [ ] **Step 1: Write the test**

Create `src/app/sitemap.test.ts`:

```ts
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, afterEach, vi } from "vitest";

/**
 * The sitemap is hand-maintained, and nothing connects it to the app
 * directory. A new page reaches production, returns 200, looks completely
 * fine, and is never submitted to a search engine — a failure with no
 * symptom.
 *
 * Every exclusion below is a decision someone made on purpose. Recording the
 * reason here is the point: the alternative is a silent absence that the next
 * person has to reconstruct from git history.
 */

const APP_DIR = fileURLToPath(new URL(".", import.meta.url));

const NOT_IN_SITEMAP: Record<string, string> = {
  "/admin": "Password-gated. Nothing there should be discoverable.",
  "/admin/todo": "Password-gated. Nothing there should be discoverable.",
  "/conflict-calculator":
    "Unlinked and noindex until the ad campaign runs. Launching it is a todo.",
  "/contact/thank-you": "Post-submit confirmation. noindex.",
};

/** Every route in the app directory, derived from the page.tsx files. */
function routesInAppDir(dir: string = APP_DIR, prefix = ""): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      found.push(...routesInAppDir(join(dir, entry.name), `${prefix}/${entry.name}`));
    } else if (entry.name === "page.tsx") {
      found.push(prefix === "" ? "/" : prefix);
    }
  }
  return found;
}

/**
 * sitemap() returns [] unless the build is production, so the env has to be
 * stubbed before the module is imported — same pattern as site-config.test.ts.
 */
async function sitemapPaths(): Promise<string[]> {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.theresewhite.com");
  const [{ default: sitemap }, { SITE_URL }] = await Promise.all([
    import("./sitemap"),
    import("@/lib/site-config"),
  ]);
  return sitemap().map((entry) => entry.url.replace(SITE_URL, "") || "/");
}

describe("sitemap coverage", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("lists every page that isn't explicitly excluded", async () => {
    const listed = new Set(await sitemapPaths());
    const missing = routesInAppDir().filter(
      (route) => !listed.has(route) && !(route in NOT_IN_SITEMAP),
    );
    expect(missing).toEqual([]);
  });

  it("has no stale exclusions", () => {
    // An exclusion for a page that no longer exists is a lie about the site.
    const routes = new Set(routesInAppDir());
    const stale = Object.keys(NOT_IN_SITEMAP).filter((route) => !routes.has(route));
    expect(stale).toEqual([]);
  });

  it("excludes nothing that the sitemap also lists", async () => {
    // Contradictory intent: excluded for a reason, yet published anyway.
    const listed = new Set(await sitemapPaths());
    const both = Object.keys(NOT_IN_SITEMAP).filter((route) => listed.has(route));
    expect(both).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `npm test`
Expected: 18 tests pass — the 15 that existed plus these 3. If "lists every page that isn't explicitly excluded" fails, the reported route is a real gap in the current sitemap; add it to `sitemap.ts` or to `NOT_IN_SITEMAP` with a reason before continuing.

- [ ] **Step 3: Prove the test actually fails when it should**

A guard that cannot fail is worse than no guard, because it is believed. Temporarily delete the `/faq` line from the `routes` array in `src/app/sitemap.ts`.

Run: `npm test`
Expected: FAIL, with `missing` reported as `["/faq"]`.

Now restore the `/faq` line and run `npm test` again.
Expected: 18 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.test.ts
git commit -m "test: assert every page reaches the sitemap or says why not

Nothing connected src/app/**/page.tsx to the hand-maintained list in
sitemap.ts. A new page could ship, return 200, look completely fine and
never be submitted to a search engine - a failure with no symptom.

The exclusion list carries most of the value. Why /conflict-calculator is
absent was previously recorded only in a comment on a todo item, nowhere
near sitemap.ts. Now it fails a test if someone quietly reverses it, and
two further cases catch an exclusion that outlives its page or one that
contradicts the sitemap."
```

---

### Task 3: Add the copy

All prose for the page, in one export. No component in this task.

**Files:**
- Modify: `src/content/site.ts` (append two exports)

**Interfaces:**
- Consumes: nothing
- Produces: two exports from `@/content/site`:
  - `collaborate` — object with `eyebrow`, `title`, `lede`, `boundaries`, `partnerTypes`, `ways`, `reciprocal`, `form`. Each of `boundaries`, `partnerTypes` and `ways` is `{ title: string, items: readonly { name: string, body: string }[] }`. `reciprocal` is `{ title: string, body: string }`. `form` is `{ title: string, intro: string, otherLabel: string }`.
  - `footerNav` — `readonly { label: string, href: string }[]`

- [ ] **Step 1: Append the copy export**

Add to the end of `src/content/site.ts`:

```ts
/**
 * DRAFT COPY — like `about`, none of this is migrated from the live Wix site,
 * which has no equivalent page.
 *
 * The page addresses allied professionals rather than clients, and says
 * nothing about money in either direction. That is deliberate: mediator
 * ethics codes — including the Model Standards of Conduct for Mediators,
 * which govern the AAA/ICDR panel she sits on — restrict fees for referrals,
 * and lawyers cannot split fees with non-lawyers at all. A paid model needs
 * her to check her own panel rules first.
 *
 * Reasoning in full:
 * docs/superpowers/specs/2026-08-11-collaborate-page-design.md
 *
 * TODO(therese): rewrite in your own voice. The six handoff descriptions
 * under `partnerTypes` matter most — they describe other people's
 * professional boundaries, so they need to be right rather than plausible.
 */
export const collaborate = {
  eyebrow: "Collaborate",
  title: "Your client stays your client",
  lede: "I take the conflict, resolve it, and hand the working relationship back to you. I'm not looking for your retainer, your HR work, or your seat at the table.",

  boundaries: {
    title: "What I don't do",
    items: [
      {
        name: "I don't practice HR.",
        body: "No policy work, no investigations-for-cause, no restructures. When the fix is procedural, it's yours.",
      },
      {
        name: "I don't give legal advice.",
        body: "I'm not an attorney — deliberately. Counsel stays counsel.",
      },
      {
        name: "I don't pitch adjacent work.",
        body: "One conflict, scoped and quoted. If I spot something outside it, I tell you, not your client.",
      },
      {
        name: "I leave.",
        body: "Follow-up runs a few weeks past the agreement, then I'm gone.",
      },
    ],
  },

  partnerTypes: {
    title: "Who I work with",
    items: [
      {
        name: "HR leaders and People teams",
        body: "You own the policy, the record, and the relationship afterwards. I take the conversation you can't be neutral in, because you're also the person who has to manage both of them next quarter.",
      },
      {
        name: "Fractional and interim HR",
        body: "You're often the only HR in the building, and a live conflict eats the engagement you were actually hired for. I take it off your critical path.",
      },
      {
        name: "Ombuds and internal neutrals",
        body: "Your confidentiality is yours. I don't ask you to breach it and I don't report back to the organization through you. When a matter needs a documented resolution your office can't produce, I can.",
      },
      {
        name: "Employment counsel, in-house and outside",
        body: "You stay lead on the matter. I don't give legal advice and I don't touch strategy. I work the part that isn't legal, which is usually the part blocking settlement.",
      },
      {
        name: "Executive and leadership coaches",
        body: "Coaching one party rarely resolves a two-party conflict. I can take the joint conversation while your coaching relationship stays intact and uncompromised.",
      },
      {
        name: "EAP and workplace wellbeing providers",
        body: "You're supporting the individual. I'm resolving the dispute between them. Different work, and neither substitutes for the other.",
      },
    ],
  },

  ways: {
    title: "Four ways to work together",
    items: [
      {
        name: "Refer a matter out",
        body: "Send the whole thing to me. I scope it, quote it, resolve it, and tell you when it's finished.",
      },
      {
        name: "Bring me in alongside you",
        body: "Your engagement, your client, your name on it. I do the mediation as part of your programme.",
      },
      {
        name: "Co-deliver a workshop",
        body: "Conflict prevention training for managers, built with you and taught together.",
      },
      {
        name: "Send me your hard one",
        body: "The conflict that's stopped responding to everything you've tried. That's the one I want.",
      },
    ],
  },

  reciprocal: {
    title: "What comes back",
    body: "I refer out constantly. When the problem turns out to be policy, or legal, or clinical, I say so and name someone — and I'd rather name someone I've actually met.",
  },

  form: {
    title: "Introduce yourself",
    intro: "No obligation and no follow-up sequence. I'd rather know who you are before either of us has a live matter.",
    otherLabel: "Something else",
  },
} as const;

/**
 * Footer-only links.
 *
 * Kept out of `nav` on purpose. The header is a buying path — every item
 * there answers "should I hire her?" — while /collaborate answers "should I
 * work with her?", asked by a peer. Adding it to `nav` would put it in the
 * header, since the footer builds its list from `nav`.
 */
export const footerNav = [
  { label: "Collaborate", href: "/collaborate" },
] as const;
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors, 18 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/content/site.ts
git commit -m "content: add the /collaborate copy

Drafted, not migrated - the Wix site has no equivalent page - so it carries
the same DRAFT/TODO(therese) header the about export does. Marked draft copy
is fine to ship. Unmarked draft copy quietly passing as her own words is not.

The page says nothing about money in either direction, and the header
comment records why: the Model Standards that govern her AAA/ICDR panel
restrict fees for referrals, and lawyers cannot split fees with non-lawyers
at all.

footerNav is separate from nav because the footer builds its list from nav,
so adding it there would have put a peer-facing page in a buyer-facing
header."
```

---

### Task 4: Add the thank-you page

Its own page rather than reusing `/contact/thank-you/`, whose copy reads "If the situation is moving faster than that, call — she keeps time open for same-day strategy calls." That is crisis framing, and it lands oddly on an ombuds who has just offered to send work her way.

Built before the form, because the form's `redirect` field points at it.

**Files:**
- Create: `src/app/collaborate/thank-you/page.tsx`
- Modify: `src/app/sitemap.test.ts` (add one exclusion entry)

**Interfaces:**
- Consumes: `contact` from `@/content/site`
- Produces: the route `/collaborate/thank-you/`, which Task 5's form redirects to

- [ ] **Step 1: Create the page**

Create `src/app/collaborate/thank-you/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Thanks for reaching out",
  robots: { index: false, follow: true },
};

export default function CollaborateThankYouPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-28 sm:py-36">
        <p className="label text-muted">Received</p>
        <h1 className="display mt-4 text-4xl text-heading sm:text-5xl">
          Thanks for reaching out
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-charcoal">
          It goes straight to Therese, and she answers these herself. She&rsquo;ll
          be in touch to find a time to talk properly — no agenda, and nothing
          you need to prepare.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={contact.emailHref}
            className="rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
          >
            Email {contact.email}
          </a>
          <Link
            href="/"
            className="text-base text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
          >
            Back to the homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Watch the sitemap test catch it**

Run: `npm test`
Expected: FAIL. "lists every page that isn't explicitly excluded" reports `["/collaborate/thank-you"]`.

This is the guard from Task 2 doing its job on a real change.

- [ ] **Step 3: Record the exclusion**

In `src/app/sitemap.test.ts`, add to `NOT_IN_SITEMAP`:

```ts
  "/collaborate/thank-you": "Post-submit confirmation. noindex.",
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: 18 tests pass.

- [ ] **Step 5: Check it renders**

Open http://localhost:3160/collaborate/thank-you/ and confirm the page renders with the site header and footer.

- [ ] **Step 6: Commit**

```bash
git add src/app/collaborate/thank-you/page.tsx src/app/sitemap.test.ts
git commit -m "feat: add the /collaborate confirmation page

Not reusing /contact/thank-you. Its copy offers a same-day strategy call for
a situation that is moving fast, which is right for a client in crisis and
wrong for an ombuds who has just offered to send work over.

noindex, and recorded as such in the sitemap exclusion list."
```

---

### Task 5: Build the partner form

**Files:**
- Create: `src/components/partner-form.tsx`

**Interfaces:**
- Consumes: `Field`, `fieldClass` from `@/components/form-field`; `collaborate`, `contact` from `@/content/site`; `SITE_URL` from `@/lib/site-config`
- Produces: `PartnerForm(): JSX.Element`, default-exported as a named export from `@/components/partner-form`

- [ ] **Step 1: Create the component**

Create `src/components/partner-form.tsx`:

```tsx
import { collaborate, contact } from "@/content/site";
import { Field, fieldClass } from "@/components/form-field";
import { SITE_URL } from "@/lib/site-config";

/**
 * Partner enquiry form, posting to Web3Forms.
 *
 * Same mechanics as the contact form — a static host has no server to receive
 * a POST, so the form submits directly to Web3Forms with no JavaScript.
 *
 * The `subject` differs on purpose. These land in the same inbox as client
 * enquiries, and Therese needs to tell a peer making an introduction apart
 * from an organization in crisis without opening the mail.
 */

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

function NoKeyFallback() {
  return (
    <div className="border-l-2 border-rule-strong pl-6">
      <h2 className="display text-2xl text-heading">{collaborate.form.title}</h2>
      <p className="mt-4 text-base leading-relaxed text-charcoal">
        Email or call. Tell me what you do and the kind of work you come
        across, and we&rsquo;ll find a time to talk.
      </p>
      <ul className="mt-6 space-y-3 text-lg">
        <li>
          <a
            href={contact.emailHref}
            className="text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
          >
            {contact.email}
          </a>
        </li>
        <li>
          <a
            href={contact.phoneHref}
            className="text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
          >
            {contact.phone}
          </a>
        </li>
      </ul>
    </div>
  );
}

export function PartnerForm() {
  if (!ACCESS_KEY) return <NoKeyFallback />;

  return (
    /* Clarity records sessions. The note field invites "I have a client
       where...", so it is masked explicitly rather than trusting the default
       masking mode — same reasoning as the contact form. */
    <form
      action={ENDPOINT}
      method="POST"
      data-clarity-mask="True"
      className="flex flex-col gap-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        {/* Web3Forms uses the field literally named `email` as the reply-to,
            so replying to the notification reaches the sender directly. */}
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          label="Firm or practice"
          name="organization"
          required
          autoComplete="organization"
        />

        <p className="m-0">
          <label htmlFor="practice" className="label text-muted">
            What you do (optional)
          </label>
          <select id="practice" name="practice" className={fieldClass}>
            <option value="">Select one</option>
            {collaborate.partnerTypes.items.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
            <option value={collaborate.form.otherLabel}>
              {collaborate.form.otherLabel}
            </option>
          </select>
        </p>
      </div>

      <p className="m-0">
        <label htmlFor="note" className="label text-muted">
          How you&rsquo;d like to work together
        </label>
        <textarea
          id="note"
          name="note"
          rows={5}
          required
          aria-describedby="note-hint"
          className={fieldClass}
        />
        <span id="note-hint" className="mt-1.5 block text-xs text-muted">
          A sentence is plenty. No client details needed.
        </span>
      </p>

      <input type="hidden" name="access_key" value={ACCESS_KEY} />
      <input
        type="hidden"
        name="subject"
        value="Partner enquiry from theresewhite.com"
      />
      <input type="hidden" name="from_name" value="theresewhite.com" />
      {/* Web3Forms requires an absolute https URL here; a relative path is
          ignored and the visitor lands on Web3Forms' own success page. The
          trailing slash matters — next.config.ts sets trailingSlash: true. */}
      <input
        type="hidden"
        name="redirect"
        value={`${SITE_URL}/collaborate/thank-you/`}
      />

      {/* Web3Forms' honeypot. Must be named exactly `botcheck` — a differently
          named decoy field is submitted as ordinary form data and ignored. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
        >
          Send an introduction
        </button>
        <span className="text-xs text-muted">
          Goes straight to Therese. Nothing is shared with anyone else.
        </span>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors, 18 tests pass. The component is not rendered anywhere yet, so there is nothing to look at in the browser.

- [ ] **Step 3: Commit**

```bash
git add src/components/partner-form.tsx
git commit -m "feat: add the partner enquiry form

Same Web3Forms mechanics as the contact form: no JavaScript, so it works
before hydration and with JS disabled, and it falls back to contact details
rather than rendering a form that quietly goes nowhere.

Two deliberate differences. The subject line is distinct so a peer making an
introduction is distinguishable from an organization in crisis without
opening the mail. And the note field has no minLength - a client describing
a crisis has plenty to say anyway, while making a colleague write a
paragraph to introduce themselves is just friction.

The select is built from collaborate.partnerTypes so the options cannot
drift from the section above them on the page."
```

---

### Task 6: Build the page, link it, and add it to the sitemap

**Files:**
- Create: `src/app/collaborate/page.tsx`
- Modify: `src/components/site-footer.tsx:43`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `collaborate`, `footerNav` from `@/content/site`; `PageHeader` from `@/components/page-header`; `PartnerForm` from `@/components/partner-form`
- Produces: the route `/collaborate/`

- [ ] **Step 1: Create the page**

Sections alternate `bg-paper` and `bg-cream`. The header is already `bg-cream`, so the first section below it is `bg-paper`.

Create `src/app/collaborate/page.tsx`:

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PartnerForm } from "@/components/partner-form";
import { collaborate } from "@/content/site";

export const metadata: Metadata = {
  title: "Collaborate",
  description:
    "For HR leaders, fractional HR, ombuds, employment counsel and coaches who come across conflicts they can't take on themselves. I resolve the conflict and hand the relationship back.",
  alternates: { canonical: "/collaborate" },
};

export default function CollaboratePage() {
  return (
    <>
      <PageHeader
        eyebrow={collaborate.eyebrow}
        title={collaborate.title}
        intro={collaborate.lede}
      />

      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.boundaries.title}
          </h2>
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {collaborate.boundaries.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-xl text-heading">{item.name}</dt>
                <dd className="mt-3 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.partnerTypes.title}
          </h2>
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {collaborate.partnerTypes.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-xl text-heading">{item.name}</dt>
                <dd className="mt-3 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.ways.title}
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-2">
            {collaborate.ways.items.map((item, index) => (
              <li key={item.name} className="border-t border-rule pt-5">
                <p className="label text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-2 text-xl text-heading">{item.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-charcoal">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.reciprocal.title}
          </h2>
          <p className="mt-6 max-w-2xl border-l-2 border-rule-strong pl-5 text-lg leading-relaxed text-charcoal">
            {collaborate.reciprocal.body}
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {collaborate.form.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal">
            {collaborate.form.intro}
          </p>
          <div className="mt-10">
            <PartnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Watch the sitemap test catch the missing entry**

Run: `npm test`
Expected: FAIL. "lists every page that isn't explicitly excluded" reports `["/collaborate"]`.

This is the red half of the cycle Task 2 was written for. Do not add an exclusion — this page belongs in the sitemap.

- [ ] **Step 3: Add it to the sitemap**

In `src/app/sitemap.ts`, add to the `routes` array, after the `/faq` line:

```ts
    { path: "/collaborate", priority: 0.5 },
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: 18 tests pass.

- [ ] **Step 5: Add the footer link**

In `src/components/site-footer.tsx`, change the import on line 2:

```tsx
import { contact, nav, legalNav, footerNav, cta } from "@/content/site";
```

Then change the map on line 43 from:

```tsx
            {[...nav, { label: "Contact", href: cta.href }].map((item) => (
```

to:

```tsx
            {[...nav, { label: "Contact", href: cta.href }, ...footerNav].map((item) => (
```

- [ ] **Step 6: Check it in the browser**

Open http://localhost:3160/collaborate/ and confirm:
- Sections alternate cream, paper, cream, paper, cream, paper down the page.
- The form renders (the access key is set as a repo variable; if it is missing locally you will see the contact-details fallback, which is also correct).
- The "What you do" select lists all six partner types plus "Something else".
- "Collaborate" appears in the footer's Pages column and **not** in the header nav.
- Check it at a narrow width too — the two-column `md:grid-cols-2` lists should stack.

- [ ] **Step 7: Verify the build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors, and the build output lists `/collaborate` and `/collaborate/thank-you` as static routes.

- [ ] **Step 8: Commit**

```bash
git add src/app/collaborate/page.tsx src/app/sitemap.ts src/components/site-footer.tsx
git commit -m "feat: add /collaborate, a referral page for allied professionals

The site spoke to one reader: an HR buyer with a conflict on their desk. It
had nothing for the people who send mediators work, and no page Therese
could send to someone she just met at a conference.

It opens on the objection nobody says out loud - will this person take my
client - because a page that ducks that gets read politely and closed. Same
move as 'I'm not an attorney, and that's a good thing' on the homepage: a
limitation turned into the reason to pick her.

Footer, not header. The header nav is a buying path; this page is aimed at
peers. It is still indexed and in the sitemap, so it can be found cold.

The sitemap test written earlier caught the missing entry before this
commit, which is what it was for."
```

---

### Task 7: Update the admin inventory and the todo list

The README makes `admin/page.tsx` and `todos.ts` part of the definition of done for any route change, not optional follow-up.

**Files:**
- Modify: `src/app/admin/page.tsx` (the `pages` array)
- Modify: `src/content/todos.ts` (append two todos, bump `TODOS_UPDATED`)

**Interfaces:**
- Consumes: the `Todo` type already exported from `@/content/todos`
- Produces: nothing

- [ ] **Step 1: Add both routes to the admin page inventory**

In `src/app/admin/page.tsx`, in the `pages` array, after the `/contact/thank-you` entry:

```tsx
  { path: "/collaborate", note: "Referral page for allied professionals. Footer-linked, not in the header nav." },
  { path: "/collaborate/thank-you", note: "Post-submit confirmation. noindex." },
```

- [ ] **Step 2: Add the two todos**

In `src/content/todos.ts`, append to the `todos` array:

```ts
  {
    id: "collaborate-voice",
    title: "Rewrite the /collaborate copy in Therese's voice",
    detail:
      "The whole page is drafted, not migrated — the Wix site has no equivalent, so there was nothing to copy. The six handoff descriptions under `partnerTypes` matter most: they assert things about other people's professional boundaries, including whether an ombuds keeps confidentiality over what they learn and whether outside counsel stays lead on the matter. Those need to be right rather than plausible. Copy lives in the `collaborate` export in src/content/site.ts.",
    status: "open",
    owner: "Therese",
    priority: "high",
    area: "Content",
    added: "2026-08-11",
  },
  {
    id: "referral-compensation",
    title: "Decide whether to offer paid referrals",
    detail:
      "The page currently says nothing about money in either direction, which was the safe launch position. Before adding any fee, commission or affiliate arrangement, check it against the panel rules Therese is bound by. The Model Standards of Conduct for Mediators govern the AAA/ICDR panel and restrict giving or receiving commissions for referrals, and lawyers cannot split fees with non-lawyers at all — so a paid scheme aimed at employment counsel is the riskiest version. If it goes ahead it likely needs disclosure to clients as well. Reasoning in docs/superpowers/specs/2026-08-11-collaborate-page-design.md.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Business",
    added: "2026-08-11",
  },
```

- [ ] **Step 3: Bump the updated date**

In `src/content/todos.ts`, change line 13:

```ts
export const TODOS_UPDATED = "2026-08-11";
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: no type errors, 18 tests pass, build completes.

Open http://localhost:3160/admin/todo/ and confirm both new items appear with the updated date.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/page.tsx src/content/todos.ts
git commit -m "docs: record /collaborate in the admin inventory and todos

Two open items. Therese rewrites the copy in her own voice - particularly
the six handoff descriptions, which assert things about other people's
professional boundaries and need to be right rather than plausible.

And the deferred decision on paid referrals, with the panel-rule constraint
written down next to it so whoever picks it up doesn't have to rediscover
why it was deferred."
```

---

## Self-Review

**Spec coverage.** Walked each spec section against the plan:

| Spec section | Task |
| --- | --- |
| Route `/collaborate`, footer not header | 6 |
| Header, boundaries, partner types, ways, reciprocal copy | 3 |
| Copy provenance / draft marking | 3, 7 |
| The form, all fields and hidden fields | 5 |
| No-key fallback, Clarity masking | 5 |
| `form-field.tsx` refactor, `NoKeyFallback` deliberately not shared | 1 |
| `/collaborate/thank-you/` | 4 |
| `sitemap.ts` entry at 0.5 | 6 |
| Admin page inventory | 7 |
| Two todos plus `TODOS_UPDATED` | 7 |
| Sitemap coverage test with exclusion list | 2, 4, 6 |
| Out of scope: no schema, no header nav change, no named partner bench | Not implemented anywhere — correct |

No gaps.

**Placeholder scan.** No TBD, no "add error handling", no "similar to Task N". Every code step carries the actual code. The one thing the plan defers to a human — refining the six `partnerTypes` bodies — ships with complete drafted copy and is tracked as todo `collaborate-voice`, so no task is blocked on it.

**Type consistency.** Checked across tasks:
- `Field` and `fieldClass` are defined in Task 1 and consumed with matching signatures in Task 5.
- `collaborate.partnerTypes.items[].name` is defined in Task 3 and used in Task 5's select and Task 6's list.
- `collaborate.form.otherLabel` is defined in Task 3 and used in Task 5.
- `footerNav` is defined in Task 3 and spread in Task 6.
- `PartnerForm` is exported in Task 5 and imported in Task 6 under the same name.
- `NOT_IN_SITEMAP` is created in Task 2 and extended in Task 4 only.
- Test counts: 15 before, 18 after Task 2, stable thereafter. Task 1 says 15, Tasks 3-7 say 18.

**One ordering note.** Task 4 and Task 6 each deliberately run `npm test` while it is expected to FAIL, then fix it. A worker who treats any red test as a stop condition will get stuck; the step text says the failure is expected and names the exact message.
