# STATUS — theresewhite.com

**Last updated:** 2026-11-21

## One-line description
Static Next.js rebuild of the Wix marketing site for L. Therese White, employment mediator and workplace conflict coach, plus a calculator subdomain and a free-guide signup subdomain.

## Scope / positioning
- One job: get an HR leader or general counsel with a live conflict to book a confidential assessment.
- First build copies the live Wix site in design and words, at the Wix URLs (since 2026-10-18); redesign is a later phase.
- Collaborate and landing copy are drafts awaiting Therese's own words.

## Stack & hosting
- Next.js 16 (static export), React 19, Tailwind v4, TypeScript, Vitest.
- GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.
- Web3Forms (forms), Kit (guide signups), Calendly (booking), consent-gated analytics.
- Cloudflare Worker (`workers/review`) for reviewer comments; currently off.

## URLs
- Staging: https://theresewhite.bahtzang.com (`noindex`)
- Production: https://www.theresewhite.com — still on Wix
- https://calculator.theresewhite.com
- https://book.theresewhite.com
- Repo: https://github.com/thirstypig/theresewhite.com

## Shipped (last 60 days)
- Calculator replaced with Therese's v2 and published at calculator.theresewhite.com in the live site's look (2026-10-16).
- CI typechecks before deploy; actions off Node 20.
- Word-for-word Wix copy: homepage, About, Endorsements, Case Studies, FAQ, Contact, legal, blog (ten posts), Wix header/footer, old URLs forwarded (2026-10-18).
- Style bible at `/stylebible` with a redesign homepage sample.
- book.theresewhite.com guide signup feeding Kit with per-post source tagging (2026-10-22).
- Two reviewer rounds applied to book and calculator pages; review gate then switched off (2026-10-26).
- Deploys survive Google Fonts outages; test landing pages retired; "Triple Take Tuesdays" removed from blog (2026-10-28).
- Contact redesign drafted on staging (2026-10-29).
- Booking buttons repointed to a new Calendly page after the old one died (2026-11-07).
- Book signups also join "Therese's Field Notes", the monthly Kit newsletter, and get a separate welcome email from a second Kit form (10215781) (2026-11-19).
- Homepage comparison at `/stylebible/compare` refreshed to Therese's November Wix changes; version 2 (`/stylebible/home`, same words) redesigned in the style bible's second-edition rules (2026-11-20). Same day, after James's review: version 2's panel logos became one grey row and its calculator a two-part card; version 3's calculator band now lists what the calculator adds up.
- Style bible locked (2026-11-21): every page under `/stylebible` opens only with the `/admin` password, and the deploy stops if one of those pages would be published without its password screen. The password can now be changed with `scripts/set-admin-password.sh`; before this, the deploy ignored the setting. Same change: on `/stylebible/compare`, switching Phone then Desktop no longer leaves blank space under columns 2 and 3.

## In progress
- Version 2 homepage design: next is turning on comment pins on `/stylebible` so Bill (mainly) and Therese can review and approve it. Those pages are locked since 2026-11-21, so the reviewers need a password first (the admin one, or one of their own: undecided). Once approved, the rest of the site gets built in that design.
- Field Notes issue #1 drafted in Kit for Tuesday 2026-12-01; awaiting a test send and James's approval. Still to test: whether the welcome email reaches someone already on the list.
- Field Notes monthly draft job runs on James's Mac (`scripts/field-notes/draft.sh`, every Thursday 9 a.m.; acts only on the Thursday before a first Tuesday). It saves a Kit draft and never sends; a safety check blocks any scheduling. Needs a long-lived Claude Code token in the Keychain to keep working past 2026-11-22.
- Confirming the `/collaborate` form submission reached Therese.
- Contact redesign: needs wording approval, button names, field list, thank-you promises.

## Open bugs / known issues
- Test site homepage `/` still shows the October 18 Wix words; Therese changed the live Wix homepage since (new headline, free-guide section, price removed). Must be updated before cutover.
- Placeholders copied verbatim from Wix ("[NUMBER] business days", "Add subtitle.").
- Privacy and terms not lawyer-reviewed.
- The lock on `/admin` and `/stylebible` keeps visitors and search engines out, but it is not real security: it runs in the browser and this repo is public. Nothing confidential belongs on those pages.
- The admin password is still the one the site was built with, which is in the public repo. It now guards `/stylebible` too. James changes it by running `scripts/set-admin-password.sh`.
- Kit confirmation email likely never test-delivered.

## Next phases (in order)
1. Finish the form delivery check. The Contact redesign is on hold until the move to Cal.com (James, 2026-11-21).
2. Content with Therese: About and `/collaborate` in her voice, book page, full copy review, Kit email edits. Set aside for now (James, 2026-11-21).
3. Homepage video to her YouTube. The Calendly link in the guide's cheat sheet is on hold until the move to Cal.com.
4. Launch the calculator with the ad campaign.
5. Cut over from Wix (handle unbuilt Wix URLs per DEPLOY.md).
6. Later: redesign; paid referrals and referral-partner page.

## Decisions changed recently
- First build switched from simplified rebuild to exact Wix copy (2026-10-18).
- Calculator v2 replaced v1; email gate removed (2026-10-16).
- Monthly newsletter is "Therese's Field Notes" on the first Tuesday; Triple Take Tuesdays name dropped; every issue needs James's OK (2026-11-19).
- Contact form removed from `/contact` in favor of Calendly (2026-10-17); redesign proposes restoring it.
- Review gate off; both subdomains public (2026-10-26).
- Test landing pages retired for calculator.theresewhite.com (2026-10-28).
- Calendly URL changed (2026-11-07).
- Style bible locked behind the admin password instead of being taken down before cutover (2026-11-21).
- To-dos about Therese's own words set aside for now; Calendly left as it is until the planned move to Cal.com (2026-11-21).
