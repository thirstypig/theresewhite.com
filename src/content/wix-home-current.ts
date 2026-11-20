import { wixHome } from "./wix-home";

/**
 * The live Wix homepage's words as of 2026-11-20, exactly as
 * www.theresewhite.com shows them, in the order a visitor scrolls past them.
 *
 * Who uses this: only the design sample at /stylebible/home/ (version 2 on
 * /stylebible/compare/). James's rule for that sample is that the words do
 * not change, only the design, so nothing here is edited: not the spaced
 * ellipses, not the Title Case, not "Click Here". Wix's invisible spacer
 * characters are the only thing removed.
 *
 * Why a second file: the test site's own homepage at `/` still copies the
 * October 18 version of Wix from `wix-home.ts`. Therese changed the live page
 * after that, so `/` is now out of date. Rebuilding `/` to match is a
 * separate job; until it happens, `/` keeps the October words and this file
 * holds today's.
 *
 * What changed on Wix between 2026-10-18 and 2026-11-20:
 *  - New opening: a short line above a new headline, and one sentence under
 *    it. The old question, the three bullets and the tagline are gone.
 *  - The "Where I Work . . ." box is gone.
 *  - The video now comes before the calculator.
 *  - The calculator heading is in sentence case, the quotation marks and the
 *    dashed divider are gone, and the fine print reads as two sentences.
 *  - "What To Know Before We Talk" is reworded in two places, and the
 *    "Basic pricing starts at $5,000." sentence is gone.
 *  - New section: the free guide, linking to book.theresewhite.com.
 *  - "3 Reasons" now comes before the panel memberships.
 *  - Blueprint step 3 ends "toward a solid working relationship" instead of
 *    "into the working relationship".
 *  - "Case Studies" is gone from the menu (already true in `site.ts`).
 *
 * Emphasis is marked the way the live page shows it: `em` is italic,
 * `strong` is bold italic.
 */
export const wixHomeCurrent = {
  capturedOn: "2026-11-20",

  hero: {
    eyebrow: "Mediation for the conflict beneath the conflict.",
    headline: "When two people you can’t afford to lose can’t work together . . .",
    lead: "I help them have the truly honest conversation they've been avoiding, put their agreement in writing, and stay with them until it holds.",
    stats: [
      { figure: "30+ Years", label: "Experience" },
      { figure: "1,100+", label: "Mediations" },
    ],
  },

  cta: {
    lines: ["Schedule Your", "Confidential Conflict Assessment"],
    button: "Click Here",
    href: "https://calendly.com/therese-white-meeting/assessment",
  },

  quoteBand: {
    lead: "The investigation ended. And nothing changed.",
    quote: "\"It's never about what they say it's about.\"",
    tail: "Your biggest expense is the conversation nobody knows how to have.",
    disclosure:
      "FULL DISCLOSURE: Yes, it's my AI avatar. But the words and the 30+ years of experience behind them are all me.",
    // Same video as October: Wix still plays file 807fad_c2b06430b28e4d7c97942b0f5f8b2cca.
    videoUrl: wixHome.quoteBand.videoUrl,
  },

  calculator: {
    costTitle: ["What is that", "unresolved workplace conflict", "really costing?"],
    tryLead: "Try my ",
    tryName: "Workplace Conflict Cost Calculator",
    body: [
      "Quantify the hidden costs so far",
      "and what they'll be if nothing changes.",
      "It's free and takes about 2 minutes.",
    ],
    button: "Click To See Your Numbers",
    href: "https://calculator.theresewhite.com",
    fineprint: "For planning purposes only. Not legal or financial advice.",
  },

  beforeWeTalk: {
    title: "What To Know Before We Talk",
    items: [
      { text: "As you just saw, I’m not the right mediator for every conflict . . . and that's by design." },
      {
        text: "Now I only take on a very small number of engagements each month. That way you’ll get all of me . . . fully at your service, not juggling a caseload.",
      },
      {
        before: "Our first conversation . . . ",
        strong: "a confidential conflict assessment",
        after: " . . . is \"real work\" . . .  no pitch, no pressure.",
      },
      { text: "We'll also decide if we're a fit. If not, I'll gladly refer you to someone who is." },
      { text: "My proposal will be customized to your specific situation. And you'll approve every step before we begin." },
    ],
  },

  guide: {
    label: "Free guide: ",
    name: "From Meltdown To Resolution . . .",
    subtitle: "20 Veteran Mediator Scripts for Resolving Emotion-Driven Workplace Conflicts",
    title: "How To Stop “Talking” on Eggshells",
    body: "The difference between difficult conversations that explode and those that resolve often comes down to a handful of carefully chosen and well-timed sentences.",
    button: "Send Me the Free Guide",
    href: "https://book.theresewhite.com",
    cover: {
      src: "/book/cover.webp",
      width: 680,
      height: 880,
      alt: "Cover of the free guide From Meltdown To Resolution, by L. Therese White",
    },
  },

  reasons: wixHome.reasons,

  panels: wixHome.panels,

  blueprint: {
    title: wixHome.blueprint.title,
    intro: wixHome.blueprint.intro,
    steps: [
      wixHome.blueprint.steps[0],
      wixHome.blueprint.steps[1],
      {
        number: "#3",
        title: "Written Agreement",
        body: "Every successful resolution gets documented in a signed agreement. Who does what. By when. What happens if it slips. Not a legal document, and not vague intentions. A mutual commitment.  The act of signing moves an agreement out of mere talk and toward a solid working relationship.",
      },
      wixHome.blueprint.steps[3],
    ],
  },
} as const;
