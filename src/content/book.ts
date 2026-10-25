/**
 * The words on book.theresewhite.com, the free-guide page shared in LinkedIn
 * posts.
 *
 * Drafted on 2026-10-22 from the book itself (From-Meltdown-To-Resolution-v11
 * .pdf): its subtitle, its Welcome and Introduction pages, its contents, and
 * its cheat sheet. Nothing here is a claim the book does not make.
 *
 * Cut back on 2026-10-25 from reviewer comments left on the page itself
 * (the Feedback tab): the opening quote, the three sample scripts, "Inside
 * the guide", "From the author", the two endorsements and the closing
 * button were all removed, and the wording below is the reviewer's.
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
    body:
      "Twenty scripts, the exact words I reach for when a room is about to come apart, drawn from 30+ years and more than a thousand workplace mediations.",
  },

  /** Her photo, cropped from public/therese-white.webp to head and shoulders. */
  headshot: {
    src: "/book/therese-headshot.webp",
    width: 480,
    height: 480,
    alt: "L. Therese White",
  },

  form: {
    heading: "Get the free guide",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Best email",
    button: "Send me the guide",
    sending: "Sending…",
    note: "Free and confidential. You’ll get the guide instantly, plus occasional messages from me. Unsubscribe anytime.",
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

  /** Shown under the signup form. */
  scope:
    "These scripts are for everyday workplace friction. They are not for complaints of harassment, discrimination, retaliation, or safety concerns, etc. Start with HR or counsel for those. Nothing in this document is legal advice.",

  disclaimer:
    "For everyday workplace friction. These scripts are not for complaints of harassment, discrimination, retaliation, or safety concerns; start with HR or counsel. Not legal advice.",
  copyright: "© 2026 L. Therese White, Kennedy White, Inc.",
} as const;
