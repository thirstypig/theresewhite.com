/**
 * PROPOSED COPY, NOT APPROVED. This is the rewritten homepage behind the
 * third column of /stylebible/compare/, at /stylebible/home-new/. Nobody has
 * signed off on a word of it: Therese and Bill have not seen it, and the
 * live Wix copy in `wix-home.ts` stays the copy of record until they do.
 *
 * The rule it was written under: same story, same offer, same facts as her
 * current site, in plainer and more direct words for the buyer described at
 * the top of the compare page. No fact here is new. Every figure, panel,
 * quote and promise comes from her live site:
 *
 *  - 30+ years, 1,100+ mediations, the $5,000 starting price, the small
 *    caseload and "I'm not an attorney": the Wix homepage (`wix-home.ts`).
 *  - Practicing since 1992 and Los Angeles as home base: the About page.
 *  - "30 to 45 minutes", "no charge", and the urgent-call line with her
 *    phone number: the Contact page.
 *  - Same-day strategy calls for urgent situations, and Zoom: the FAQ
 *    (docs/wix-capture/faq.json).
 *  - The two endorsement excerpts are word for word from the Endorsements
 *    page (docs/wix-capture/team-1-1.json), only shortened.
 *
 * What changed is wording and order: no "Click Here", no spaced ellipses,
 * sentence case instead of Title Case, and pricing moved up out of a bullet
 * list. The reasons for each change are on the compare page itself.
 */
export const homeNew = {
  header: {
    button: "Book an assessment",
  },

  hero: {
    eyebrow: "Employment mediator and workplace conflict coach",
    title: "When two people you can’t afford to lose can’t work together",
    lead: "I help them have the conversation they have been avoiding, put what they agree to in writing, and stay with them until it holds.",
    primary: "Book a confidential assessment",
    secondary: "See what it’s costing you",
    reassurance: "30 to 45 minutes. Confidential. No charge and no sales pitch.",
  },

  proof: [
    { figure: "30+", label: "years resolving workplace conflict" },
    { figure: "1,100+", label: "mediations, mostly hard ones" },
    { figure: "1992", label: "practicing since, based in Los Angeles" },
  ],

  symptoms: {
    eyebrow: "Sound familiar?",
    title: "The conflicts your usual process can’t close",
    items: [
      {
        title: "Two core contributors who can’t be in the same room",
        body: "Both are good at what they do. Together, they are slowing everyone down.",
      },
      {
        title: "A team that is taking sides, or checking out",
        body: "The dispute started between two people. It doesn’t stay there.",
      },
      {
        title: "An investigation that ended, and nothing changed",
        body: "The file is closed. The people involved still see each other every day.",
      },
    ],
  },

  cost: {
    title: "What is this conflict really costing you?",
    body: "My free calculator puts a number on the hidden costs so far, and on what they will be if nothing changes. It takes about two minutes.",
    button: "Open the cost calculator",
    fineprint: "For planning only. Not legal or financial advice.",
  },

  quote: {
    text: "It’s never about what they say it’s about.",
    body: "Your biggest expense is usually the conversation nobody knows how to have. In this short video I explain why, and how I work.",
    disclosure: "The presenter is an AI avatar of me. The words, and the 30 years behind them, are mine.",
  },

  blueprint: {
    eyebrow: "How it works",
    title: "My Working Peace Blueprint",
    intro: "Four steps that help the people in conflict write their own agreement for how they will talk, disagree and get the work done.",
    steps: [
      {
        title: "Confidential interviews",
        body: "I meet each person on their own, and sometimes others affected, to understand what everyone is really carrying. The stated problem is rarely the real one.",
      },
      {
        title: "The mediation",
        body: "The conversation they have been avoiding, sometimes for years. I don’t referee it and I don’t smooth it over. I guide it.",
      },
      {
        title: "A signed agreement",
        body: "Who does what, by when, and what happens if it slips. Not a legal document and not vague intentions: a commitment both people sign.",
      },
      {
        title: "Follow-up",
        body: "Agreements survive or fail back at work. I stay close with follow-up coaching in the weeks after, so you are not left alone once the dust settles.",
      },
    ],
  },

  reasons: {
    eyebrow: "Why organizations call me",
    title: "Three reasons I belong on your shortlist",
    items: [
      {
        title: "1,100+ mediations, mostly hard ones",
        body: "Thirty years of uncovering the emotional issues that drive irrational and sometimes explosive behavior. You get a conflict that is finished, not one that was quieted and filed and will surface again in two weeks.",
      },
      {
        title: "I’m not an attorney, on purpose",
        body: "Your conflict has a legal side, which is why counsel is involved. But two valued people can’t share a room because of ego, fear and something nobody will say out loud. I work where that problem lives.",
      },
      {
        title: "More than mediation",
        body: "Many two-person disputes are symptoms of something larger. I may recommend a mix of mediation, confidential interviews, one-on-one coaching and facilitated team discussions, so the fix fits the conflict.",
      },
    ],
  },

  endorsements: {
    eyebrow: "What colleagues say",
    items: [
      {
        quote: "For genuine, deep, and lasting resolutions in any employment setting, Therese should be your first choice.",
        name: "Kenneth Cloke",
        role: "Mediator, author, and her co-mediator and co-trainer for more than thirty years",
      },
      {
        quote: "The most exceptional thing about Therese is her quiet way of lighting the path to common ground.",
        name: "Joan Goldsmith",
        role: "Organizational consultant and co-author, with Warren Bennis, of Learning to Lead",
      },
    ],
    link: "Read the full endorsements",
  },

  panels: {
    title: "Mediation panel memberships",
  },

  expect: {
    eyebrow: "Before we talk",
    title: "What to expect, including the price",
    price: { figure: "$5,000", label: "Engagements start at", note: "Every proposal is built for your situation, and you approve every step before we begin." },
    items: [
      {
        title: "A small caseload, by design",
        body: "I take on very few engagements at a time, so you get all of me rather than a slice of a caseload.",
      },
      {
        title: "The first conversation is real work",
        body: "A confidential conflict assessment: no pitch and no pressure. We will also decide together whether I am the right fit.",
      },
      {
        title: "If I’m not the right fit, I’ll say so",
        body: "I’m not the right mediator for every conflict. If you need someone else, I will gladly refer you.",
      },
      {
        title: "Remote or in person",
        body: "Almost all of my work happens over Zoom, so location is rarely a barrier.",
      },
    ],
  },

  close: {
    title: "Start with one confidential conversation",
    body: "In 30 to 45 minutes we will look at the least disruptive path, whether mediation or coaching fits, and who needs to be involved.",
    button: "Book a confidential assessment",
    urgent: "Urgent? I offer same-day strategy calls. Call",
    phone: "323-291-4813",
    phoneHref: "tel:+13232914813",
  },
} as const;
