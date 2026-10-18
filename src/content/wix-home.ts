/**
 * The live Wix homepage's words, exactly as www.theresewhite.com shows them,
 * in the order a visitor scrolls past them.
 *
 * Captured from the rendered page on 2026-10-18 for the design sample at
 * /stylebible/home/. James's rule for that sample is that the copy does not
 * change, only the design, so nothing here is edited: not the spaced
 * ellipses, not the Title Case, not "Click Here". Wix's invisible spacer
 * characters are the only thing removed. The words get their own review
 * later, as a separate step.
 *
 * Emphasis is marked the way the live page shows it: `em` is italic,
 * `strong` is bold italic. This file is separate from `site.ts` because the
 * rebuild's own homepage copy there has already been edited and differs.
 */
export const wixHome = {
  hero: {
    question:
      "Is an unresolved, emotion-driven conflict putting valuable people, productivity, and your peace of mind at risk?",
    bullets: [
      { before: "Two ", em: "\"Core Contributors\"", after: " who can't be in the same room." },
      { before: "Other team members taking sides . . . or checking out." },
      { before: "A conflict your internal processes can't fix." },
    ],
    tagline:
      "I enable the conversations that resolve those conflicts. Then I stay until they hold.",
    stats: ["30+ Years Experience", "1,100+ Mediations"],
  },

  cta: {
    lines: ["Schedule Your", "Confidential Conflict Assessment"],
    button: "Click Here",
  },

  whereIWork: {
    title: "Where I Work . . .",
    body: "Two people who are exceptionally good at what they do . . . but exceptionally bad at working together.",
  },

  calculator: {
    costTitle: ["What Is That", "Unresolved Workplace Conflict", "Really Costing?"],
    tryLead: "Try My ",
    tryName: "\"Workplace Conflict Cost Calculator\"",
    divider: "- - - - - - -",
    body: [
      "Quantify the hidden costs so far and",
      "what they'll be if nothing changes.",
      "It's free and takes about 2 minutes.",
    ],
    button: "Click To See Your Numbers",
    href: "https://calculator.theresewhite.com",
    fineprint: "For planning purposes only, not legal or financial advice.",
  },

  quoteBand: {
    lead: "The investigation ended. And nothing changed.",
    quote: "\"It's never about what they say it's about.\"",
    tail: "Your biggest expense is the conversation nobody knows how to have.",
    disclosure:
      "FULL DISCLOSURE: Yes, it's my AI avatar. But the words and the 30+ years of experience behind them are all me.",
    videoUrl: "https://youtu.be/6DDxPMJ6L-Q",
  },

  beforeWeTalk: {
    title: "What To Know Before We Talk",
    items: [
      { text: "As you just saw, I’m not the right mediator for every conflict . . . by design." },
      {
        text: "I take on a very small number of engagements at a time. That way you’ll get all of me . . . fully at your service, not juggling a caseload.",
      },
      {
        before: "Our first conversation . . . ",
        strong: "a confidential conflict assessment",
        after: " . . . is \"real work\" . . .  no pitch, no pressure.",
      },
      { text: "We'll also decide if we're a fit. If not, I'll gladly refer you to someone who is." },
      {
        before: "My proposal will be customized to your specific situation. ",
        strong: "Basic pricing starts at $5,000.",
        after: " And you'll approve every step before we begin.",
      },
    ],
  },

  panels: {
    title: "Mediation Panel Memberships",
    logos: [
      { src: "/logos/usps.png", alt: "United States Postal Service Redress Program" },
      { src: "/logos/lacounty.png", alt: "Los Angeles County Human Resources" },
      { src: "/logos/eeoc.png", alt: "U.S. Equal Employment Opportunity Commission" },
      { src: "/logos/aaa.png", alt: "American Arbitration Association ICDR panel member" },
      { src: "/logos/dts.png", alt: "Dynamic Team Solutions" },
      { src: "/logos/cloke.png", alt: "Ken Cloke, The Center for Dispute Resolution" },
    ],
  },

  reasons: {
    title: ["3 Very Good Reasons I Belong On Your", "\"Go-To\" Employment Mediator Shortlist"],
    cards: [
      {
        icon: "briefcase",
        title: ["Over 1,100 Mediations.", "Mostly Hard Ones."],
        paragraphs: [
          "With 30+ years of experience, I've become expert at uncovering and helping unpack the hidden emotional issues that force irrational, difficult, and sometimes explosive behavior.",
          "This allows everyone to focus on a mutually beneficial resolution with minimal trauma and regret. Less insightful mediators tend to overlook emotional concerns or are at a loss when forced to deal with them.",
          "With me, you'll get a conflict that's finished — not one that's been quieted, filed, and left to resurface in two weeks.",
        ],
      },
      {
        icon: "thumb",
        title: ["I'm Not An Attorney.", "(And That's A Good Thing)"],
        paragraphs: [
          "I'm not an attorney, and I don't give legal advice. That's precisely why organizations like yours call me.",
          "Your conflict has a legal dimension — that's why counsel is involved. But the reason two valued employees can't be in the same room isn't legal. It's ego, fear, humiliation, and something that happened eighteen months ago that nobody will name out loud.",
          "No amount of legal maneuvering resolves that. It just documents it.",
          "I work where the actual problem lives.",
        ],
      },
      {
        icon: "tools",
        title: ["Much More Than A", "\"One-Trick Pony\""],
        paragraphs: [
          "Many mediators only have mediation in their toolbelt. So, don't be surprised if I recommend a multi-dimensional approach to the conflict you're managing.",
          "You see, many two-party disputes are symptoms of much larger, systemic problems. So, my recommendation might entail a customized combination of mediation, confidential interviews with others who are affected, 1-on-1 coaching, and/or facilitated team discussions . . . instead of a one-size-fits-all mediation.",
          "Which means the fix fits the conflict, and you don't end up with the same dispute wearing a different name.",
        ],
      },
    ],
  },

  blueprint: {
    title: "My Working Peace Blueprint",
    intro:
      "This process helps teammates in conflict write their own agreement for how they'll talk, disagree, and get the work done.",
    steps: [
      {
        number: "#1",
        title: "Interviews",
        body: "Confidential one-on-one conversations and coaching with the two people involved . . . and maybe others who are also impacted. Not to build a case . . . but to understand what everyone is really carrying. The stated problems are rarely the real ones.",
      },
      {
        number: "#2",
        title: "Mediation",
        body: "This is the conversation they have been avoiding . . . sometimes for months, even years. I don't referee it. And I don't smooth it over. I guide it. It's the hardest part of the process, and it's where everything changes . . . or not.",
      },
      {
        number: "#3",
        title: "Written Agreement",
        body: "Every successful resolution gets documented in a signed agreement. Who does what. By when. What happens if it slips. Not a legal document, and not vague intentions. A mutual commitment.  The act of signing moves an agreement out of mere talk and into the working relationship.",
      },
      {
        number: "#4",
        title: "Follow-Up",
        body: "Agreements are made on paper. They survive . . . or don't . . . back at work. So I stay close: Follow-up coaching and crisis management in the weeks after. I can't guarantee 100% success; no honest mediator can. I can guarantee I won't disappear once the dust settles.",
      },
    ],
  },
} as const;
