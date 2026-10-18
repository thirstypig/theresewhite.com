/**
 * The live Wix Contact page's words (www.theresewhite.com/contact), exactly
 * as the page shows them, top to bottom.
 *
 * Captured from the rendered page on 2026-10-18
 * (docs/wix-capture/contact.json). Do not edit the words: James decided on
 * 2026-10-18 that the first build matches the Wix site word for word, and the
 * copy gets its own review later. Wix's invisible spacer characters and empty
 * lines are the only thing removed.
 *
 * The Wix page has no form. Its one action is the "Schedule Your Assessment"
 * link to Calendly (decided 2026-10-17: Contact leads with Calendly and the
 * emailed contact form comes off this page).
 *
 * The urgent note is split around the phone number and email address so the
 * page can make each of them a link.
 */
export const wixContact = {
  title: "Contact",
  subtitle: "Schedule Your Confidential Conflict Assessment",
  reassurance: [
    "We’ll discuss your situation in depth. Don't worry.",
    "It's real work . . . No sales pitch or pressure . . . No charge.",
  ],
  questionsIntro: "In 30 to 45 minutes, I’ll help you answer:",
  questions: [
    "What's the least disruptive, lowest-risk path?",
    "Is mediation appropriate or is coaching enough?",
    "Who else needs to be involved, and who shouldn't?",
    "What’s the best way to get the parties to mediation?",
    "What will be included in my proposal?",
  ],
  closing: [
    "At the end, we'll brainstorm next steps . . . that may or may not include me.",
    "And that’s perfectly fine with me. I'll be happy to refer you to someone who’s a better fit.",
  ],
  scheduleLink: "Schedule Your Assessment",
  urgent: {
    before: "NOTE: If your situation is urgent, call me at ",
    phone: "323-291-4813",
    phoneHref: "tel:+13232914813",
    middle: " or email ",
    email: "Therese@ThereseWhite.com",
    emailHref: "mailto:Therese@ThereseWhite.com",
    after: ".",
  },
  urgentFollowUp:
    "I answer my own phone and read my own email. Say it's urgent and I'll treat it that way.",
  image: {
    src: "/wix/contact/plan-chalkboard.webp",
    // Cropped the way Wix crops it (547 × 400 from the 640 × 427 original).
    width: 547,
    height: 400,
    // Wix's alt text is the file name, "Unknown.png". This describes the picture.
    alt: "A chalkboard with the word PLAN in large letters, a light bulb standing in for the A, surrounded by words such as strategy, goals, teamwork, risks and costs.",
  },
} as const;
