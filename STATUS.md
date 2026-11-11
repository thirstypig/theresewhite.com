# STATUS — theresewhite.com

**Last updated:** 2026-11-11

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

## In progress
- Confirming the `/collaborate` form submission reached Therese.
- Contact redesign: needs wording approval, button names, field list, thank-you promises.

## Open bugs / known issues
- Placeholders copied verbatim from Wix ("[NUMBER] business days", "Add subtitle.").
- Privacy and terms not lawyer-reviewed.
- `/stylebible` public on staging; must come down before cutover.
- Admin password still needs changing.
- Kit confirmation email likely never test-delivered.

## Next phases (in order)
1. Finish the form delivery check, then ship the Contact redesign.
2. Content with Therese: About and `/collaborate` in her voice, book page, full copy review, Kit email edits.
3. Calendly link in the guide's cheat sheet; homepage video to her YouTube.
4. Launch the calculator with the ad campaign.
5. Cut over from Wix (handle unbuilt Wix URLs per DEPLOY.md).
6. Later: redesign; paid referrals and referral-partner page.

## Decisions changed recently
- First build switched from simplified rebuild to exact Wix copy (2026-10-18).
- Calculator v2 replaced v1; email gate removed (2026-10-16).
- Contact form removed from `/contact` in favor of Calendly (2026-10-17); redesign proposes restoring it.
- Review gate off; both subdomains public (2026-10-26).
- Test landing pages retired for calculator.theresewhite.com (2026-10-28).
- Calendly URL changed (2026-11-07).
