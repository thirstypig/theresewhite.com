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

export const TODOS_UPDATED = "2026-10-29";

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
    id: "deploy-font-flake",
    title: "Stop deploys failing when a Google font won't download",
    detail:
      "Fixed 2026-10-28 (PR #41): the site now keeps its own copies of its 11 fonts in src/fonts/ and loads them with next/font/local, so the build no longer downloads anything from Google. All three builds passed with Google Fonts blocked, the first deploy afterward (run 40794650270) passed every job on the first try, and the live main, book and calculator sites load no Google Fonts addresses. Watch the next few deploys to confirm; if a build still fails with a font error, reopen this. Background: on 2026-10-22, 2 of 5 deploys failed in npm run build with \"Can't resolve '@vercel/turbopack-next/internal/font/google/font'\": the build fetches the site's typefaces (next/font/google) from Google, and sometimes that fetch fails. Nothing breaks for visitors, since a failed deploy leaves the previous version online, but the change doesn't go out until someone re-runs the failed job (gh run rerun <id> --failed), which has worked every time. Two fixes, neither started: retry the build step once in .github/workflows/deploy.yml (small, treats the symptom), or store the font files in the repository with next/font/local so the build never downloads them (removes the cause, touches every font declaration). The cause is not confirmed beyond the error text. It is not specific to GitHub's build machines: the same error stopped a local preview (npm run dev) on 2026-10-25, and restarting the preview cleared it, which points at the download from Google rather than at the deploy setup.",
    status: "done",
    owner: "Dev",
    priority: "normal",
    area: "Deploy",
    added: "2026-10-22",
  },
  {
    id: "wix-remove-triple-take",
    title: "Remove Triple Take Tuesdays from the Wix site",
    detail:
      "James decided on 2026-10-28 to drop the name \"Triple Take Tuesdays\"; Therese's newsletter is now Therese's Field Notes. Already done through the Wix connection: the Triple Take Tuesdays pages, the newsletter pages, the empty /cost-of-concflict-calculator page, the old /frommeltdowntoresolution form and /challenges are hidden from Google, and every page that stays has its own Google title and description. James is doing the rest by hand from Wix-Page-Cleanup-Guide.pdf (in his Downloads; it replaces the earlier Remove-Triple-Take-Tuesdays-Guide.pdf): delete 12 pages; remove the Wix Pricing Plans app first, because /pricing-plans/plans-pricing sells Wix sample plans (\"Weekly Consulting\" at $70 a month, \"New Client Trial\" at $50) that a real visitor could buy; remove the Wix Online Programs app (sample programs such as \"Green Smoothies Diet\" at $80); and ask Therese whether the $0 \"From Meltdown to Resolution\" Wix Stores product is still used. No Wix API deletes Editor pages or removes apps, so this has to be done in the Editor or dashboard. Then tell Claude \"pages deleted\" so it adds redirects (old issues and newsletter pages to /blog, the calculator page to calculator.theresewhite.com, the free-guide pages to book.theresewhite.com, /challenges and the pricing page to the home page). The old issues stay as unpublished Wix blog drafts, which is effectively an archive. The same guide lists the Editor-only search fixes: home-page image descriptions, a social-share picture, and the home page's http:// calculator link.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Wix site",
    added: "2026-10-28",
  },
  {
    id: "review-password",
    title: "Set the review password for the book and calculator pages",
    detail:
      "Done 2026-10-22. Both pages ask for the review password (James has it and shares it with reviewers privately; it is never written into this repository) and show the yellow Feedback tab; checked on the live calculator in a fresh browser. To change it, run scripts/set-review-passphrase.sh in your own terminal (it asks for at least 8 characters), then start a fresh deploy.",
    status: "done",
    owner: "James",
    priority: "high",
    area: "Review",
    added: "2026-10-22",
  },
  {
    id: "review-overlay-remove",
    title: "Take the review password and Feedback tab off before either page goes public",
    detail:
      "Done 2026-10-26: James called both pages ready, so the REVIEW_PASSPHRASE_HASH repository variable was deleted and the site redeployed. book.theresewhite.com and calculator.theresewhite.com now open with no password screen and no Feedback tab. The last comments were saved locally first; the only one still open, the Calendly link in the PDF, is its own to-do (book-pdf-calendly). The comments service, theresewhite-review on Cloudflare, is still running and costs nothing; it can be deleted whenever nobody needs the old comments. To turn the review tools back on, see DEPLOY.md, \"Reviewer feedback\".",
    status: "done",
    owner: "James",
    priority: "high",
    area: "Review",
    added: "2026-10-22",
  },
  {
    id: "book-site-setup",
    title: "Finish the one-time setup for book.theresewhite.com",
    detail:
      "Done 2026-10-22. The page is live at https://book.theresewhite.com with HTTPS, published from thirstypig/theresewhite-book with its own deploy key; the `book` CNAME record is in Therese's Wix DNS; and NEXT_PUBLIC_KIT_FORM_ID points at Kit form 10084320. A local test signup reached Kit with the source fields written.",
    status: "done",
    owner: "James",
    priority: "high",
    area: "Book page",
    added: "2026-10-22",
  },
  {
    id: "book-kit-email-copy",
    title: "Rewrite the book's Kit email",
    detail:
      "Done 2026-10-28. The email every book signup gets now carries James's final copy: subject \"Your “From Meltdown to Resolution” scripts, plus one more tool\", a mention of Therese's Field Notes (her occasional newsletter, sent by hand from Kit as a broadcast), a greeting with the reader's first name (or \"there\"), \"Click here\" links plus full copy-and-paste addresses for the PDF and the calculator, and the calculator sentence in bold. It comes from \"Therese White\" (it used to show therese@theresewhite.com) with her Culver City address in the footer instead of Kit's Seattle one; both of those are account-wide Kit settings, so every future Kit email uses them too. Two things Kit will not let us change on the free plan: the blue button (Kit requires it; it now says \"Download book\" and downloads the same guide) and the footer's \"Update your profile\" link. James signed up himself and the email arrived. James decided not to turn on the page's \"A copy is on its way to your inbox too.\" line (the NEXT_PUBLIC_KIT_SENDS_COPY repository variable stays unset), because the thank-you message already offers the download. To change the email's words: Kit → form 10084320 → Settings → Confirmation email → Edit Email Contents → Save, then Save & Publish.",
    status: "done",
    owner: "James",
    priority: "high",
    area: "Book page",
    added: "2026-10-22",
  },
  {
    id: "book-kit-last-name",
    title: "Create the last_name field in Kit so the book page keeps last names",
    detail:
      "Done 2026-10-28. Therese's Kit account now has a custom field labeled \"Last name\" whose key is last_name (Kit field 1412484), which matches the fields[last_name] the book page's form sends, so new signups keep their last name. It was added with Add Custom Field on a subscriber's record in Kit. Signups before 2026-10-28 have no last name, and there is no way to recover them.",
    status: "done",
    owner: "James",
    priority: "high",
    area: "Book page",
    added: "2026-10-26",
  },
  {
    id: "book-pdf-calendly",
    title: "Add the Calendly booking link to the guide's cheat sheet",
    detail:
      "A reviewer asked for Therese's Calendly booking address at the bottom of the cheat sheet page in the PDF itself. That needs the guide's original design file (the book was From-Meltdown-To-Resolution-v11.pdf), which is not in this repository; only the compressed public/book/from-meltdown-to-resolution.pdf is. Whoever holds the design file adds the link and exports a new PDF; then replace the file in public/book/, keeping its name, and Kit's download (form Settings, Confirmation email, Download) needs the new file uploaded too. This is the one comment still open in the book page's Feedback tab.",
    status: "open",
    owner: "Therese",
    priority: "normal",
    area: "Book page",
    added: "2026-10-26",
  },
  {
    id: "book-page-review",
    title: "Have Therese read the book page's words",
    detail:
      "The page was cut down to one screen on 2026-10-25 and 2026-10-26 from reviewer comments in the Feedback tab (PRs #33 and #34), and the intro, the form's wording and the scope line under the form are now the reviewer's own words. If Therese was not that reviewer, she should still read it once: every word is in src/content/book.ts.",
    status: "open",
    owner: "Therese",
    priority: "normal",
    area: "Book page",
    added: "2026-10-22",
  },
  {
    id: "web3forms-key",
    title: "Set the Web3Forms access key",
    detail:
      "Done 2026-08-05. NEXT_PUBLIC_WEB3FORMS_KEY is set as a repo variable and verified live: the contact form renders with the key, the redirect points at /contact/thank-you/, and the fallback is gone. The same key powered the calculator's email gate until that calculator was replaced on 2026-10-16. The key is public by design — it ships in the page HTML and only routes mail to the verified address, so rotate it if it ever attracts spam.",
    status: "done",
    owner: "James",
    priority: "blocker",
    area: "Forms",
    added: "2026-08-04",
  },
  {
    id: "web3forms-live-test",
    title: "Confirm the test submission reached Therese",
    detail:
      "The contact form came off /contact on 2026-10-17 (Contact leads with Calendly), so the only emailed form left on the site is the referral-partner form at /collaborate/. James sent a test through it on 2026-10-28 and is checking with Therese whether it arrived. Confirm three things: the form lands on /collaborate/thank-you/, the email reaches the inbox Web3Forms delivers to, and hitting Reply reaches the sender rather than a noreply address.",
    status: "in-progress",
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
      "Replaced on 2026-10-16 with Therese's second version, which is also live on its own at calculator.theresewhite.com once the DNS record in calculator-subdomain-dns exists. Either address can go in the ads now. Both are noindex. To let /conflict-calculator appear in search: remove the noindex line in its page metadata, add it to src/app/sitemap.ts, and remove its entry from NOT_IN_SITEMAP in src/app/sitemap.test.ts. The new calculator collects no email, so ad traffic no longer uses up the Web3Forms allowance; leads arrive only through the referral-partner form on /collaborate, Calendly, and Therese's email and phone.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Marketing",
    added: "2026-08-04",
  },
  {
    id: "calculator-subdomain-dns",
    title: "Point the Wix home page's calculator button at calculator.theresewhite.com",
    detail:
      "Done 2026-10-16. calculator.theresewhite.com is live over https, and the live home page's \"Click To See Your Numbers\" button opened it in a new tab instead of the claude.ai artifact (checked on www.theresewhite.com). By 2026-10-22 that link was gone: the live home page no longer links to the calculator, so nobody arrives there from Wix, which is why it was put behind the review password. At cutover, the subdomain should redirect to /conflict-calculator on the main site rather than go dark; DEPLOY.md, \"At cutover\", has the steps.",
    status: "done",
    owner: "James",
    priority: "high",
    area: "Deploy",
    added: "2026-10-16",
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
  {
    id: "collaborate-voice",
    title: "Rewrite the /collaborate copy in Therese's voice",
    detail:
      "The whole page is drafted, not migrated — the Wix site has no equivalent, so there was nothing to copy. Review covers the whole `collaborate` export in src/content/site.ts, plus the drafted prose living outside it in src/app/collaborate/thank-you/page.tsx and src/components/partner-form.tsx. The six handoff descriptions under `partnerTypes` matter most: they assert things about other people's professional boundaries, including whether an ombuds keeps confidentiality over what they learn and whether outside counsel stays lead on the matter. Those need to be right rather than plausible. One line needs an explicit yes or no, not just a wording pass: under `ways`, \"Bring me in alongside you\" says \"Your engagement, your client, your name on it\" — that describes white-label subcontracting, a business model nothing else on the site supports, and it sits next to the mediator-impartiality reasoning in the `collaborate` export's own header comment.",
    status: "open",
    owner: "Therese",
    priority: "high",
    area: "Content",
    added: "2026-08-11",
  },
  {
    id: "landing-page-winner",
    title: "Pick a landing page and give it a real URL",
    detail:
      "Done 2026-10-28: James retired both test designs. calculator.theresewhite.com is the landing page in use for the LinkedIn post, so /lp/a, /lp/b, their contact form (src/components/landing-contact-form.tsx) and their draft copy (the `landing` export in src/content/site.ts) were deleted. Before that, /lp/a was a conventional layout in the rebuild's palette and /lp/b wore the live theresewhite.com look; both carried the same calculator and were noindex.",
    status: "done",
    owner: "James",
    priority: "high",
    area: "Marketing",
    added: "2026-08-12",
  },
  {
    id: "og-image-content-type-gate",
    title: "Add a post-deploy check that the link-preview image is served as an image",
    detail:
      "Done. Two gates now cover this, not one. npm run verify:build walks the built HTML before upload and fails if any page names the wrong image, advertises the wrong og:url, or carries the homepage's og:title instead of its own — that last one is the inheritance bug that started this, checked in the output rather than the source. A post-deploy step then fetches og.png from the live URL and fails unless it is served as image/png. The post-deploy half cannot prevent a bad deploy, only report it, which is acceptable because it covers the one thing our code does not control: GitHub types files by extension, and that behaviour is observed rather than documented. Plan: docs/superpowers/plans/2026-08-12-built-output-and-post-deploy-gates.md.",
    status: "done",
    owner: "Dev",
    priority: "normal",
    area: "Deploy",
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
  {
    id: "typecheck-gate",
    title: "Run the TypeScript check somewhere on the way to production",
    detail:
      "Done 2026-10-16. `npm run typecheck` (which runs `npx tsc --noEmit`) is now a step in .github/workflows/deploy.yml, placed before `npm test` so a type error stops the deploy before anything slower starts. It takes about three seconds. Before this, nothing between a commit and the live site checked types: on 2026-08-12 a manual run caught a real type error that all 66 tests had passed straight through.",
    status: "done",
    owner: "Dev",
    priority: "normal",
    area: "Deploy",
    added: "2026-08-12",
  },
  {
    id: "actions-node20-deprecation",
    title: "Update the GitHub Actions that still target Node 20",
    detail:
      "Done 2026-10-16. The deploy now uses actions/checkout@v7, actions/setup-node@v7, actions/upload-pages-artifact@v5 and actions/deploy-pages@v5, all of which run on Node 24. GitHub had already been forcing the old versions onto Node 24 and warning on every run, so nothing was broken yet; the risk was that the date it stopped working was GitHub's to choose. One side effect: upload-pages-artifact v4 and later leave out files whose names start with a dot, so out/.nojekyll no longer ships. That is harmless, because the deploy already refuses to run unless Pages publishes the artifact as-is, which never involves Jekyll.",
    status: "done",
    owner: "Dev",
    priority: "normal",
    area: "Deploy",
    added: "2026-08-12",
  },
  {
    id: "first-build-direction",
    title: "Decide whether the first build is the exact Wix copy or the simplified design",
    detail:
      "The style bible at /stylebible describes two designs: the Wix site as measured (22 colors, about 90 text styles) and a simplified Recommended system (6 colors, 6 text sizes, one button style). Building the exact copy first and simplifying later means building the site twice. Building the simplified design first means Therese sees design changes before she has agreed to leave Wix. The homepage sample at /stylebible/compare shows the two side by side, with identical words, to help make the call. Done 2026-10-18: James chose the near-exact Wix copy for the first build, and it is now the test site. The simplified design waits for phase two.",
    status: "done",
    owner: "James",
    priority: "high",
    area: "Design",
    added: "2026-10-18",
  },
  {
    id: "copy-review",
    title: "Review the site's words with Therese, as a separate step from the design",
    detail:
      "The design sample at /stylebible/home keeps every word of the Wix homepage unchanged, on purpose, so the design can be judged alone. Copy gets its own page and its own conversation later. Items already raised by the style bible's red team: replacing \"Click Here\" with labels that name the outcome, such as \"Book a confidential assessment\"; moving the panel logos and the 30+ years and 1,100+ mediations figures up to just under the headline; and whether to keep leading with the AI avatar video. Column 3 of /stylebible/compare (/stylebible/home-new, words in src/content/home-new.ts) is a full proposal for the homepage words, for this conversation.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Content",
    added: "2026-10-18",
  },
  {
    id: "referral-partner-page",
    title: "Turn /collaborate into a clear referral-partner page",
    detail:
      "A partner page already exists at /collaborate (built 2026-08-11, linked in the footer as \"Collaborate\"). It covers six partner types, four ways to work together, reciprocal referrals and an email form. Compared with best practice for professional referral pages, it is missing: a label that says \"referrals\" (the footer link and heading say only \"Collaborate\"); a plain statement of how money works, since partners will ask and silence looks evasive (see the paid-referrals item: mediator ethics rules restrict referral fees, so the safe default is \"no referral fees in either direction\"); what happens after someone writes in, with a reply time and a first step such as a short intro call; a fast lane for a partner with a live matter now; what Therese reports back to the person who referred a client, given confidentiality, which is a referring lawyer's or HR leader's first worry; proof aimed at peers, such as panel memberships and endorsements from Kenneth Cloke and Joan Goldsmith; a short partner FAQ (remote work, neutrality and conflicts of interest, who pays); and a one-page partner sheet they can forward.",
    status: "open",
    owner: "James",
    priority: "normal",
    area: "Business",
    added: "2026-10-18",
  },
  {
    id: "stylebible-before-cutover",
    title: "Take /stylebible down, or put it behind /admin, before the move to theresewhite.com",
    detail:
      "The style bible and its samples (/stylebible, /stylebible/home, /stylebible/home-new, /stylebible/compare) are unlinked and noindex on the test site, but anyone with the address can open them, and the bible criticizes the current design in plain terms. They should not go live on Therese's real domain. The source is docs/style-bible/index.html and src/app/(landing)/stylebible/.",
    status: "open",
    owner: "Dev",
    priority: "normal",
    area: "Deploy",
    added: "2026-10-18",
  },
  {
    id: "wix-placeholders",
    title: "Fix the unfinished placeholders copied word for word from Wix",
    detail:
      "The rebuild copies the Wix pages exactly, so it also copies text that was never finished there. Each one needs Therese's wording, and each fix should be made on Wix too while Wix is still live. Accessibility: \"within [NUMBER] business days\", \"escalate by emailing [EMAIL ADDRESS]\", and \"This site is built on the Wix platform\". Cookie Preferences: a line that is only \".\", and a list of cookies that Wix sets, which stops being true when the site leaves Wix. Terms of Use: section 8 has lost its heading and starts with a stray \"1\". Privacy Policy: it names Wix Analytics and Wix email delivery, which may not be what the new site uses. Blog posts: \"Add subtitle.\" and an unlinked \"Click here to learn more.\" in two. (The \"[Link: .XXX/TripleTakeTuesdays/Date]\" line in every post and the ThereseWhite.com/back-issues link were removed on 2026-10-28, when the Triple Take Tuesdays name was retired.) Words live in src/content/wix/legal.ts and content/posts/.",
    status: "open",
    owner: "Therese",
    priority: "normal",
    area: "Content",
    added: "2026-10-18",
  },
  {
    id: "contact-page-redesign",
    title: "Redesign the Contact page: an email form on top, the Calendly button just below",
    detail:
      "James asked for this on 2026-10-29. The top of /contact becomes an email form, and directly under it sits a \"Schedule Your Assessment\" button that opens Therese's Calendly page (calendlyUrl in src/content/wix/chrome.ts). This reverses the 2026-10-17 decision that Contact leads with Calendly and has no form, so update the note at the top of src/content/wix/contact.ts when it ships. The old form is still in the code (src/components/contact-form.tsx, sent through Web3Forms, landing on /contact/thank-you/), so the work is mostly layout, not a new form. Still to decide before building: where the rest of the current page goes (the \"In 30 to 45 minutes, I'll help you answer\" list, the urgent phone-and-email note, and the chalkboard picture), and whether the form needs any fields beyond name, email and message. Finish the Web3Forms delivery check first (web3forms-live-test), so the new form is known to reach Therese.",
    status: "open",
    owner: "Dev",
    priority: "normal",
    area: "Forms",
    added: "2026-10-29",
  },
];
