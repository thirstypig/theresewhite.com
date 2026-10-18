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

/**
 * The homepage's pictures, in the order they appear, for the Wix copy of the
 * homepage at `/`.
 *
 * Each file is the full-size original downloaded from static.wixstatic.com on
 * 2026-10-18 and converted to WebP, saved in public/wix/home/. The comment
 * on each entry names the Wix original, so it can be fetched again.
 * `width` and `height` are the saved file's own size in pixels.
 *
 * The alt text is ours, not Wix's. On Wix nearly every picture's alt text is
 * its upload filename, such as "Screenshot 2025-09-19 at 9.35.28 PM.png",
 * which tells a screen-reader user nothing. The panel logos reuse the
 * descriptions already written in `wixHome.panels.logos` above. The icons,
 * the frame and the background are decoration, so they have no alt text and
 * screen readers skip them.
 */
export const wixHomeImages = {
  /** 1d1667_190762470e274a2eabea3f712c1b4546~mv2.png, "Therese Blouse High.png" */
  portrait: {
    src: "/wix/home/therese-portrait-red-jacket.webp",
    width: 960,
    height: 1088,
    alt: "L. Therese White, smiling, in a red jacket",
  },

  /** 807fad_c2b06430b28e4d7c97942b0f5f8b2ccaf000.jpg, the video's opening frame */
  videoPoster: { src: "/wix/home/video-poster-bookshelf.webp", width: 960, height: 540 },

  /** 11062b_8480e50c5d1841b3b1829214389b1253~mv2_d_4500_2530_s_4_2.png, "Blue Gradient", shrunk to 1,920 wide */
  panelBackground: { src: "/wix/home/panel-band-blue-gradient.webp", width: 1920, height: 1080 },

  /**
   * Wix draws each panel logo inside its "iron" picture frame: a textured
   * white border with a screw in each corner. The texture and the screw are
   * Wix's own files: ironpatern.bb7ea6a2.png from static.parastorage.com, and
   * a 15-pixel screw picture written into the page itself.
   */
  tileFrame: {
    texture: "/wix/home/tile-frame-iron-texture.webp",
    screw: "/wix/home/tile-frame-screw.png",
  },

  /**
   * The six panel logos in reading order on desktop: left then right, row by
   * row. `drawnWidth` and `drawnHeight` are the size Wix draws each logo at
   * on a 1,440-pixel screen, not counting its frame.
   */
  panelLogos: [
    // 1d1667_3f4435d4d74f4c63b6dd6d84d423806c~mv2.png
    { src: "/wix/home/panel-usps-redress.webp", width: 357, height: 135, drawnWidth: 373, drawnHeight: 123, alt: wixHome.panels.logos[0].alt },
    // 1d1667_5500f3dbf8d84e7cb5f39a1d278cea23~mv2.png
    { src: "/wix/home/panel-la-county-hr.webp", width: 356, height: 149, drawnWidth: 350, drawnHeight: 131, alt: wixHome.panels.logos[1].alt },
    // 1d1667_3e73bd01155a453f9966cef312aa354e~mv2.png
    { src: "/wix/home/panel-eeoc-seal.webp", width: 254, height: 255, drawnWidth: 192, drawnHeight: 194, alt: wixHome.panels.logos[2].alt },
    // 1d1667_520c1e540cbe478bb107c658e3b1a31e~mv2.png
    { src: "/wix/home/panel-aaa-icdr-2025.webp", width: 304, height: 271, drawnWidth: 254, drawnHeight: 223, alt: wixHome.panels.logos[3].alt },
    // 1d1667_b70be322f4c94b358a73f17931458349~mv2.png
    { src: "/wix/home/panel-dynamic-team-solutions.webp", width: 241, height: 92, drawnWidth: 366, drawnHeight: 117, alt: wixHome.panels.logos[4].alt },
    // 1d1667_39804ef35b6e4e7cba8f8927aa64aaa2~mv2.png
    { src: "/wix/home/panel-ken-cloke.webp", width: 417, height: 124, drawnWidth: 373, drawnHeight: 98, alt: wixHome.panels.logos[5].alt },
  ],

  /**
   * On Wix the Ken Cloke logo's second line is live text laid over the
   * bottom of the picture, not part of the picture. Caudex, bold, 16 pixels.
   */
  clokeCaption: "The Center For Dispute Resolution",

  /** The round blue icons on the three reasons cards, in card order. */
  reasonIcons: [
    // 1d1667_d30d28f0ec88425ab0d44c208c0ded78~mv2.png
    { src: "/wix/home/icon-briefcase.webp", width: 119, height: 107 },
    // 1d1667_c06a2648dbbd4cef95d5d860d1f189b4~mv2.png
    { src: "/wix/home/icon-thumbs-up.webp", width: 115, height: 98 },
    // 1d1667_ea0b852bff894ed49e513483e3b8f2d2~mv2.png
    { src: "/wix/home/icon-pencil-ruler.webp", width: 120, height: 100 },
  ],

  /** The round blue icons over the four blueprint steps, in desktop order. */
  stepIcons: [
    // 1d1667_a78617fb1a54487e89506e5f10713e6e~mv2.png
    { src: "/wix/home/step-1-interviews-people.webp", width: 113, height: 105 },
    // 1d1667_dabcce72c622447e97967db92d781126~mv2.png
    { src: "/wix/home/step-2-mediation-heart.webp", width: 125, height: 103 },
    // 1d1667_c78c38ffa34d405b896dfa46f555e528~mv2.png
    { src: "/wix/home/step-3-agreement-pencil.webp", width: 120, height: 100 },
    // 1d1667_03d4d22c47b54f4f863457805b94e58c~mv2.png
    { src: "/wix/home/step-4-follow-up-phone.webp", width: 142, height: 123 },
  ],
} as const;
