/**
 * The words on book.theresewhite.com, the free-guide page shared in LinkedIn
 * posts.
 *
 * Drafted on 2026-10-22 from the book itself (From-Meltdown-To-Resolution-v11
 * .pdf): its subtitle, its Welcome and Introduction pages, its contents, and
 * its cheat sheet. Nothing here is a claim the book does not make. Therese
 * has not reviewed this page yet; that review is a to-do in todos.ts.
 *
 * The two endorsements are quoted exactly as the book prints them, cut with
 * an ellipsis rather than reworded. Do not tidy their wording.
 */

export const book = {
  title: "From Meltdown to Resolution",
  subtitle: "20 Veteran Mediator Scripts for Resolving Emotion-Driven Workplace Conflicts",
  /** The three promises on the cover, in the cover's order. */
  promises: ["Repair Relationships", "Gain Control", "Lead with Compassion"],

  /** The file in public/book/, compressed from the 8.4 MB original to 0.8 MB. */
  pdfHref: "/book/from-meltdown-to-resolution.pdf",
  pdfFileName: "From-Meltdown-To-Resolution.pdf",
  pages: 24,

  cover: {
    src: "/book/cover.webp",
    width: 680,
    height: 880,
    alt: "Cover of From Meltdown to Resolution by L. Therese White",
  },

  hero: {
    eyebrow: "Free guide",
    lede:
      "The difference between conflicts that escalate into emotional firestorms and those that turn into collaborative resolutions often comes down to a handful of carefully chosen and well-timed sentences.",
    body:
      "Twenty of those sentences, the ones Therese reaches for when a room is about to come apart, collected from more than thirty years and over a thousand workplace mediations.",
  },

  /** What the guide covers, in the order of its contents page. */
  inside: [
    {
      title: "8 foundational scripts",
      detail:
        "Listening deeply, prioritizing empathy, building rapport and trust, appealing to higher selves, regulating your own emotions, separating the person from the problem, finding common ground, and being vulnerable.",
    },
    {
      title: "3 bonus scripts",
      detail:
        "Self-talk for managing your own stress, making the case for outside help, and introducing outside assistance to the people in conflict.",
    },
    {
      title: "When the scripts are not the right tool",
      detail:
        "The line between everyday friction and a complaint that needs HR or counsel first, so a well-meant conversation does not make things worse.",
    },
    {
      title: "Do you need an outside mediator?",
      detail: "Six situations where bringing someone in is the better call.",
    },
    {
      title: "A one-page cheat sheet",
      detail: "All twenty scripts on a single page. Print it, pin it, share it.",
    },
  ],

  /** Three of the twenty, verbatim from the cheat sheet. */
  samples: [
    { number: 1, category: "Listening Deeply", script: "“I hear you.”" },
    {
      number: 12,
      category: "Regulating Your Own Emotions",
      script: "“Hey, let’s take a break and catch our breath.”",
    },
    {
      number: 15,
      category: "Finding Common Ground",
      script:
        "“Let’s clarify what we agree on and what we still see differently.”",
    },
  ],

  about: {
    heading: "From the author",
    paragraphs: [
      "Since 1992, I’ve been repairing severely broken workplace relationships by helping people work together in genuine collaborative peace . . . not just “stopping the fighting.”",
      "Most workplace conflicts aren’t really about the easily seen surface issues. They’re about unaddressed and often hidden personal dynamics that no one knows how to talk about.",
      "These scripts I’m sharing in this short booklet will help you navigate those moments when everything’s about to explode, and you don’t know what to say or do.",
    ],
    signature: "L. Therese White",
    role: "Employment Mediator • Workplace Conflict Coach",
  },

  endorsements: [
    {
      quote:
        "Therese is highly empathetic and an outstanding creative problem solver, with deep knowledge and unstinting dedication to our work. For genuine, deep, lasting resolutions in any employment setting, Therese should be your first choice.",
      name: "Kenneth Cloke",
      role: "Mediator, Author, Educator, and Co-Founder of Mediators Beyond Borders",
    },
    {
      quote:
        "I chose Therese to support these clients because of her skill in helping people repair damage to their relationships. Her approach to mediation is transformative — both the style and the outcome.",
      name: "Candace Gottlieb-Clark",
      role: "Founder/CEO, Dynamic Team Solutions",
    },
  ],

  form: {
    heading: "Get the free guide",
    firstNameLabel: "First name",
    emailLabel: "Work email",
    button: "Send me the guide",
    sending: "Sending…",
    note: "Free, 24 pages, PDF. Unsubscribe from Therese’s emails any time.",
    error:
      "That didn’t go through. Check your email address and try again.",
  },

  thanks: {
    heading: "It’s yours.",
    body: "Download it now, and keep it somewhere you can reach before your next hard conversation.",
    button: "Download the guide (PDF)",
    /**
     * Only shown once Kit is set to email a copy. Saying it before that is
     * true would send people looking for an email that never comes.
     */
    emailCopy: "A copy is on its way to your inbox too.",
    nextStep: {
      text: "Sitting with a conflict you can’t get traction on? Book a free, confidential 30-minute call.",
      button: "Book a call",
    },
  },

  disclaimer:
    "For everyday workplace friction. These scripts are not for complaints of harassment, discrimination, retaliation, or safety concerns; start with HR or counsel. Not legal advice.",
  copyright: "© 2026 L. Therese White, Kennedy White, Inc.",
} as const;
