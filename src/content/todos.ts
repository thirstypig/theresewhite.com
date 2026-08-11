/**
 * Outstanding work — the single source of truth.
 *
 * Rendered at /admin/todo, and picked up by the `/doc` documentation sweep,
 * which globs for `todos.ts`. Update this file rather than editing the admin
 * page; the page just renders whatever is here.
 *
 * When `/doc` runs: mark shipped items `done` (keep them, don't delete —
 * the record of what was decided is useful), add anything new the recent
 * commits introduced, and refresh `updated`.
 */

export const TODOS_UPDATED = "2026-08-05";

export type TodoStatus = "open" | "in-progress" | "done";
export type TodoOwner = "Therese" | "James" | "Dev";
export type TodoPriority = "blocker" | "high" | "normal" | "low";

export type Todo = {
  id: string;
  title: string;
  detail: string;
  status: TodoStatus;
  owner: TodoOwner;
  priority: TodoPriority;
  area: string;
  added: string;
};

export const todos: Todo[] = [
  {
    id: "web3forms-key",
    title: "Set the Web3Forms access key",
    detail:
      "Done 2026-08-05. NEXT_PUBLIC_WEB3FORMS_KEY is set as a repo variable and verified live: the contact form renders with the key, the redirect points at /contact/thank-you/, and the fallback is gone. The same key powers the calculator's email gate. The key is public by design — it ships in the page HTML and only routes mail to the verified address, so rotate it if it ever attracts spam.",
    status: "done",
    owner: "James",
    priority: "blocker",
    area: "Forms",
    added: "2026-08-04",
  },
  {
    id: "web3forms-live-test",
    title: "Send one real test submission",
    detail:
      "Everything is verified up to the point of actually sending — that last step delivers a real email to Therese's inbox, so it needs a person to decide when. Submit the form at /contact/, confirm you land on /contact/thank-you/, that the mail arrives, and that hitting reply reaches the sender rather than a noreply address.",
    status: "open",
    owner: "James",
    priority: "high",
    area: "Forms",
    added: "2026-08-05",
  },
  {
    id: "youtube-account",
    title: "Move the homepage video to Therese's YouTube account",
    detail:
      "The video (6DDxPMJ6L-Q) is published on The Thirsty Pig channel (@thethirstypig3601), confirmed via YouTube's oEmbed. That channel name is visible to visitors — it shows in the player chrome and on 'Watch on YouTube' — which reads oddly on a mediator's site, and it means the asset lives in an account she doesn't control. YouTube cannot transfer a video between accounts, so this means re-uploading from her own channel, which produces a NEW video ID. Update `video.id` in src/content/site.ts when that happens; the thumbnail URL and the click-to-load facade derive from it automatically.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Content",
    added: "2026-08-05",
  },
  {
    id: "about-voice",
    title: "Rewrite the About page in Therese's voice",
    detail:
      "The live Wix site had no bio page, so there was nothing to migrate. The current copy is assembled only from claims evidenced elsewhere on the site — nothing biographical was invented. Gaps worth filling: how she came into this work, what she did before it, and what transformative mediation means to her in plain language. Marked DRAFT COPY in src/content/site.ts.",
    status: "open",
    owner: "Therese",
    priority: "high",
    area: "Content",
    added: "2026-08-04",
  },
  {
    id: "legal-review",
    title: "Have a lawyer read the privacy policy and terms",
    detail:
      "Both are generic good-faith templates that accurately describe what the site does, but neither has been reviewed. Worth 30 minutes of counsel's time before cutover, particularly the GDPR section — it assumes no EU establishment and only incidental EU visitors. Also confirm the confidentiality language now that a form collects conflict descriptions.",
    status: "open",
    owner: "Therese",
    priority: "high",
    area: "Legal",
    added: "2026-08-04",
  },
  {
    id: "admin-password",
    title: "Change the admin password",
    detail:
      "Still on the default. Generate a hash with `printf %s 'new-password' | shasum -a 256` and set NEXT_PUBLIC_ADMIN_PASSWORD_HASH as a repo variable. Remember the gate is obfuscation, not security — never put anything confidential behind it.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Admin",
    added: "2026-08-04",
  },
  {
    id: "calculator-launch",
    title: "Launch the conflict calculator with the ad campaign",
    detail:
      "Built and styled at /conflict-calculator, currently unlinked and noindex. To launch: remove the robots block in the page metadata, add it to src/app/sitemap.ts, and point the ads at it. Watch the Web3Forms cap — ad traffic and the contact form share the same 250 submissions a month.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Marketing",
    added: "2026-08-04",
  },
  {
    id: "wix-cutover",
    title: "Cut over from Wix to theresewhite.com",
    detail:
      "Four steps, in order: flip NEXT_PUBLIC_SITE_URL to the production domain (either https://www.theresewhite.com or the apex https://theresewhite.com — both are accepted, and this turns indexing on and restores the sitemap); set the custom domain in Settings → Pages, which is what actually governs it, not the CNAME file; move DNS off Wix, checking for MX records first so her email doesn't stop; and restore the 15 Wix redirects, which GitHub Pages cannot serve. The full redirect table is in DEPLOY.md. Then submit to Search Console.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Deploy",
    added: "2026-08-04",
  },
  {
    id: "panel-logos",
    title: "Confirm the panel and affiliation logos",
    detail:
      "The EEOC and Kenneth Cloke logos were read off cropped Wix renderings. Therese confirmed both are correct on 2026-08-04.",
    status: "done",
    owner: "Therese",
    priority: "normal",
    area: "Content",
    added: "2026-08-04",
  },
];
