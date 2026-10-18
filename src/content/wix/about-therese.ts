/**
 * The live Wix "About Therese" page's words (www.theresewhite.com/about-therese),
 * exactly as the page shows them, in the order a visitor scrolls past them.
 *
 * Captured from the rendered page on 2026-10-18 for the near-exact copy of
 * the Wix site (James's decision of 2026-10-18: the first build matches the
 * current site word for word, and the redesign comes later). Do not edit the
 * words here, not even obvious oddities such as the double space in
 * "Facilitated  Team Discussions" or "Teacher of the Year, 2026" sitting next
 * to an award image that says "Educator of the Year". Wording changes are a
 * separate, later step that Therese signs off on. Only Wix's invisible spacer
 * characters have been removed.
 *
 * The closing "Schedule Your Confidential Conflict Assessment" band is shared
 * with other pages and lives in src/content/wix/chrome.ts.
 */
export const wixAboutTherese = {
  meta: {
    /** The Wix page title is "About Therese | Theresewhite". */
    title: "About Therese",
    description:
      "L. Therese White has guided difficult workplace conversations since 1992: more than 1,100 mediations, coaching and facilitated team discussions, with her panels, certifications, teaching and publications.",
  },

  /** The title is set on two lines on Wix: "About" over "Therese". */
  title: ["About", "Therese"],

  images: {
    award: {
      src: "/wix/about/scma-award.webp",
      width: 786,
      height: 442,
      alt: "Statewide California Mediation Association (SCMA) award: L. Therese White, The L. Randolph Lowry 2026 Educator of the Year",
    },
    portrait: {
      src: "/wix/about/therese-with-dog.webp",
      width: 928,
      height: 696,
      alt: "Therese smiling at home on her sofa, hugging her small orange Pomeranian",
    },
    /** The sand-dune photo behind the right half of the title band. Decorative. */
    dune: { src: "/wix/about/sand-dune.webp", width: 1442, height: 1030 },
    /** Wix's "Center Gradient Transparent": soft gray edges behind the three columns. Decorative. */
    gradient: { src: "/wix/about/gray-center-gradient.webp", width: 1280, height: 800 },
  },

  /** The three columns under the title band, left to right. */
  columns: [
    {
      heading: "My Calling",
      paragraphs: [
        "You did everything right . . . the investigation, the policy review, the carefully worded warning that took four drafts. And the conflict is still sitting there, bigger and angrier than it was in March.",
        "Why? Because the process addressed the behavior and left the hurt exactly where it was.",
        "I've been guiding difficult conversations since 1992. Most of them emotionally charged, where termination or legal threats were real, and the human damage was worse.",
        "I don't just put out fires. I get people to have the honest conversation they've been avoiding.",
        "So they can at least work together productively.",
      ],
    },
    {
      heading: "What I Believe",
      paragraphs: [
        "Two senior executives. Twelve years of friendship between them. Family holiday gatherings together.",
        "Now they’re seriously competing for the same promotion. And things were said, and actions taken, that can’t be undone.",
        "They’re told to fix it themselves. Two grown, reasonable men. Closed-door meetings. “Let’s just talk it out.” And it only gets worse.",
        "“Leave your emotions at the door.” That is some of the worst advice in business. They can’t. They’re human. They shouldn’t.",
        "You see, emotions aren’t blocking the resolution. They’re the roadmap to it.",
        "Beneath every conflict are unspoken (or misspoken) desires that were never fully addressed.",
      ],
    },
    {
      heading: "How I Work",
      paragraphs: [
        "During pre-mediation interviews, I sit down with the people one-on-one, the way I'd sit down with you over coffee. Warm, but fiercely precise about what's really going on.",
        "In the mediation with both parties, I strip away the careful and hurtful language and get underneath it . . . to the fear and ego, because that's what's actually in the room.",
        "I assume good intent from everyone at the table, yet I hold every person accountable for their behavior anyway. Clear is kind. Unclear is unkind.",
        "And, if successful, there's a signed written agreement defining how they’ll work together going forward. But it holds only because of what happened before they signed it.",
      ],
    },
  ],

  services: {
    title: "My Services",
    subtitle: "When Both People Are Too Important To Lose",
    items: [
      {
        heading: "Mediation",
        body: "The conversation two people have been avoiding . . . sometimes for months, sometimes for years. I meet with each of them first, then bring them into it. I don't referee it or smooth it over. I guide it. What they agree to gets written down and signed, and because they built it themselves, it holds.",
      },
      {
        heading: "Coaching",
        body: "For the person at the center of it . . . often the high performer everyone has learned to work around, other times a new leader who can't find their footing with the team. Sometimes it's the work one person, or both, still have to do after a mediation. It's not about changing them. It's about helping them want to change themselves.",
      },
      {
        // The double space is on Wix. Rendered as a non-breaking space plus a space.
        heading: "Facilitated  Team Discussions",
        body: "Sometimes a conflict between two people turns out to be a symptom of something the whole team is carrying. So the repair has to happen among all of them. This isn't a retreat, and it isn't a reset. I talk with people individually first, then bring everyone into a discussion where the hard things can finally be said . . . and heard.",
      },
    ],
  },

  record: {
    title: "My Record",
    subtitle: "Practicing Since 1992 · 1,100+ Mediations · Homebase: Los Angeles, CA",
    /**
     * Each group is a small red heading followed by either paragraphs or a
     * bulleted list, in the order Wix shows them.
     */
    groups: [
      {
        heading: "My Specialization",
        paragraphs: [
          "The most expensive conflicts in any organization are between teammates who must keep working together. You can't investigate or fire your way out of them. And every month they sit there, they cost you productivity, retention, and the confidence of everyone watching. Conventional mediators go after an agreement. I go after the thing that’s broken between them — which is why my agreements hold.",
        ],
      },
      {
        heading: "Mediation Panels",
        list: [
          "American Arbitration Association, National Registry of Mediators",
          "Equal Employment Opportunity Commission (EEOC)",
          "United States Postal Service, REDRESS EEO Program",
          "County of Los Angeles, Dispute Resolution Mediation Services, Dept. of Human Resources",
          "The Center for Dispute Resolution (Kenneth Cloke), Santa Monica, CA",
          "Dynamic Team Solutions",
        ],
      },
      {
        heading: "Certifications",
        list: [
          "Transformative Mediation — Institute for the Study of Conflict Transformation, Hofstra Law School",
          "Advanced Mediation — The Center for Dispute Resolution (Kenneth Cloke), Santa Monica, CA",
          "Basic Mediation — Center for Civic Mediation (formerly Los Angeles County Bar Association/DRS)",
          "Sharpening Your Mediation and Negotiation Skills — Pepperdine University School of Law",
          "Workplace Harassment Prevention — Parallax Education",
        ],
      },
      {
        heading: "Teaching & Training",
        paragraphs: [
          "The Statewide California Mediation Association (SCMA), L. Randolph Lowry Teacher of the Year, 2026",
          "Through the Los Angeles County Bar Association, The Center for Dispute Resolution, and my private practice, trained hundreds of attorneys, corporate, educational, and community leaders and their staff in mediation, workplace conflict resolution, and valuing diversity and inclusion.",
          "Taught Mediating Claims Under the Americans with Disabilities Act at UC Riverside School of Continuing Education. Facilitator for the Institute for Non-Violence in Los Angeles' Days of Dialogue since 1995.",
        ],
      },
      {
        heading: "Selected Publications",
        list: [
          "\"Managing Client Emotions: How a Mediator Can Help\" — AAA Handbook on Mediation, 2015",
          "\"Resolving the Emotions-Driven Employment Case\" — The Advocate, Journal of the Consumer Attorneys Association for Southern California, 2014",
        ],
      },
      {
        heading: "Professional Service",
        /** On Wix these two lines sit directly under each other, with no gap. */
        lines: [
          "State of California Mediation Association (SCMA), 1992 to present, Board of Directors, 2009–2012.",
          "Advisory Board, Mediation and Conflict Resolution Program, California State Univ, Northridge, 2010–2014.",
        ],
      },
      {
        heading: "Education",
        paragraphs: ["B.S., Business Management, University of Redlands"],
      },
    ],
  },
} as const;
