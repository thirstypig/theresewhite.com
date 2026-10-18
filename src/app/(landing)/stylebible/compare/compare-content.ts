/**
 * The words on /stylebible/compare/: who the homepage is for, and why each
 * of the two redesigns is built the way it is.
 *
 * Every claim carries a `source`: "site" when it is stated or directly
 * implied by her own Wix copy (the page it comes from is named), "judgment"
 * when it is our design opinion and has not been tested on her visitors.
 * The page shows that label next to each claim, so nobody mistakes a guess
 * for a finding.
 */
export type Source = "site" | "judgment";

export const audience = {
  title: "Who this homepage is for",
  intro:
    "Every choice in columns two and three is judged against one person and one job. The person is the leader who owns a workplace conflict that will not resolve. The job is to make that person confident enough to book a confidential assessment.",
  groups: [
    {
      label: "Who the buyer is",
      items: [
        {
          text: "An HR director, head of people or chief HR officer at an organization large enough to have a process, and a conflict that process cannot fix.",
          source: "site",
          note: "Her FAQ speaks to HR professionals and their bosses; the case studies start with a call from a CHRO.",
        },
        {
          text: "A general counsel or outside employment lawyer, once the legal side is handled but the people side is not.",
          source: "site",
          note: "Case Study #3: “The file is closed, but the problem isn’t.”",
        },
        {
          text: "An executive director or owner of a smaller organization or non-profit, with little or no HR department to lean on.",
          source: "judgment",
          note: "Case Study #1 is a non-profit; the rest is our inference from a $5,000 starting price.",
        },
        {
          text: "Based in Southern California or anywhere in the United States, because almost all of her work happens over Zoom.",
          source: "site",
          note: "About page: “Homebase: Los Angeles.” FAQ: “I conduct almost all my work via Zoom.”",
        },
      ],
    },
    {
      label: "What is at stake for them",
      items: [
        {
          text: "Losing one or both of two valuable people, and the team’s productivity while the conflict drags on.",
          source: "site",
          note: "Homepage headline and hero bullets.",
        },
        {
          text: "Legal exposure if the conflict turns into a complaint, a lawsuit or a resignation with a story attached.",
          source: "site",
          note: "Homepage reason #2; FAQ on legal issues.",
        },
        {
          text: "Their own standing. They have to justify an outside spend to bosses who watch the bottom line.",
          source: "site",
          note: "FAQ: “How do I talk to my bottom-line bosses…” and “How do I prove to my bosses…”",
        },
      ],
    },
    {
      label: "What they are afraid of",
      items: [
        {
          text: "That an outsider makes it worse, or quiets it for two weeks before it comes back.",
          source: "site",
          note: "Homepage reason #1: “not one that’s been quieted, filed, and left to resurface.”",
        },
        { text: "That anything they share will not stay confidential.", source: "judgment", note: "Why “confidential” leads every call to action." },
        { text: "Being sold to on the first call, and getting an open-ended bill.", source: "judgment", note: "Why “no pitch” and the price appear early." },
      ],
    },
    {
      label: "What they need to see before they book",
      items: [
        { text: "Their own situation, described in their words, in the first screen.", source: "judgment", note: "" },
        { text: "Proof she is credible: years, number of mediations, panels, peers who vouch for her.", source: "judgment", note: "" },
        { text: "What happens after they call, what it costs, and that the first step is free and low-risk.", source: "judgment", note: "" },
        { text: "A way to make the case to their bosses: the cost calculator.", source: "judgment", note: "" },
      ],
    },
    {
      label: "How they arrive",
      items: [
        {
          text: "A referral from a lawyer, colleague or panel, then a quick check of her site, often on a phone, before deciding to call.",
          source: "judgment",
          note: "Typical for professional services; not measured on her site.",
        },
        { text: "Her LinkedIn posts and Triple Take Tuesdays newsletter, which link to the site and the calculator.", source: "site", note: "Blog and newsletter archive." },
        { text: "Searching for an employment or workplace mediator in Los Angeles.", source: "judgment", note: "Not measured; her search data was not reviewed." },
      ],
    },
  ],
} as const satisfies {
  title: string;
  intro: string;
  groups: readonly { label: string; items: readonly { text: string; source: Source; note: string }[] }[];
};

export const columns = [
  {
    key: "wix",
    title: "1. Wix today",
    note: "Screenshot of www.theresewhite.com, October 16, 2026.",
  },
  {
    key: "same",
    title: "2. Recommended design, same words",
    note: "Every word and section from Wix, in the same order. Only the design changes.",
  },
  {
    key: "new",
    title: "3. Recommended design, new words",
    note: "A proposal: new copy and a modern layout. Not approved by Therese.",
  },
] as const;

export type ColumnKey = (typeof columns)[number]["key"];

export const reasoning = {
  same: {
    title: "Why column 2 is better than Wix, with the words unchanged",
    intro:
      "Column 2 tests one question: how much better does the page work with a cleaner design alone? Each reason is tied to a finding in the style bible’s red team chapter.",
    items: [
      {
        lead: "The page looks like one established practice, not several.",
        body: "Wix uses 22 colors, seven of them blues, and about 90 text styles. Column 2 uses six colors, two typefaces and six sizes everywhere. Visitors do not count colors, but they sense inconsistency, and consistency is a large part of looking established.",
        finding: "Red team 2 and 4",
      },
      {
        lead: "It reads properly on a phone.",
        body: "Wix shows phones a shrunken desktop layout with homepage text around 12 pixels. Column 2 is built for the phone, with reading text at 16 to 17 pixels. A visitor who has to pinch to read usually leaves instead of booking.",
        finding: "Red team 5",
      },
      {
        lead: "The booking button stands out, and stays calm.",
        body: "Six heavy blue menu tabs compete with the call to action, and every button flashes red. Column 2 uses quiet text links with one blue Contact button in the header, and buttons deepen to a darker blue instead of alarm red.",
        finding: "Red team 3 and 8",
      },
      {
        lead: "Everyone can read every line.",
        body: "Five color pairings on Wix fail the accessibility standard, including the main button label. Every pairing in column 2 passes, which also removes an easy target for accessibility claims in California.",
        finding: "Red team 9",
      },
      {
        lead: "What is hers stays.",
        body: "The pill button, her blue, the cream and warm backgrounds, her portrait, the panels and every word of her voice carry over.",
        finding: "Red team 10",
      },
    ],
    limit:
      "What column 2 cannot fix: the words. “Click Here” still does not say what happens, the proof still sits halfway down, and the price is still a bullet in a list. That is what column 3 is for.",
  },
  new: {
    title: "Why column 3 changes the words and the layout",
    intro:
      "Column 3 keeps the same story, the same offer and the same facts. No figure, quote or promise on it is new. It changes the order and the wording so the buyer above finds, in order, the answers to the questions they arrive with.",
    items: [
      {
        lead: "Opening: “Is this my problem?” answered in the first line.",
        body: "Wix opens with a 16-word question about risk. Column 3 opens with the situation itself, “When two people you can’t afford to lose can’t work together,” then one sentence on what she does about it. Both are her ideas, from her own hero bullets and tagline.",
        finding: "Copy change",
      },
      {
        lead: "Buttons say what happens.",
        body: "“Click Here” becomes “Book a confidential assessment,” and the calculator becomes a second, quieter button, “See what it’s costing you.” A button that names its outcome lowers hesitation at the moment of decision, and screen readers can announce it.",
        finding: "Red team 1",
      },
      {
        lead: "The first call feels safe to make.",
        body: "Right under the buttons: “30 to 45 minutes. Confidential. No charge and no sales pitch.” Each phrase is from her Contact page, moved to where the decision happens.",
        finding: "Copy change",
      },
      {
        lead: "Proof comes before the pitch.",
        body: "30+ years, 1,100+ mediations, practicing since 1992, then the six panel logos, all directly under the opening. On Wix the logos come after the video, about halfway down the page.",
        finding: "Red team 6",
      },
      {
        lead: "The visitor recognizes their own situation.",
        body: "Three short cards: two core contributors who can’t share a room, a team taking sides, an investigation that closed while nothing changed. These are her hero bullets and her quote band, given room to land.",
        finding: "Copy change",
      },
      {
        lead: "The business case gets its own moment.",
        body: "The calculator is framed as the answer to the question their bosses will ask. It is the second way in for a buyer who is not ready to call.",
        finding: "Copy change",
      },
      {
        lead: "Peers vouch for her on the homepage.",
        body: "One line each from Kenneth Cloke and Joan Goldsmith, word for word from her Endorsements page. Wix keeps all endorsements on a separate page most visitors never open.",
        finding: "Copy change",
      },
      {
        lead: "The price is stated plainly, as a figure.",
        body: "“Engagements start at $5,000,” in large type next to what to expect. Her public price is unusual candor that filters out poor-fit inquiries; on Wix it is bold text inside the fifth bullet of a list.",
        finding: "Red team 10",
      },
      {
        lead: "Urgent buyers get a direct line.",
        body: "The closing band offers same-day strategy calls and her phone number, both from her own FAQ and Contact page. A leader in the middle of a crisis should not have to hunt for that.",
        finding: "Copy change",
      },
      {
        lead: "The writing is easier to scan.",
        body: "Sentence case instead of Title Case, plain punctuation instead of spaced ellipses, and short paragraphs. Her voice stays: “I don’t referee it and I don’t smooth it over. I guide it.”",
        finding: "Copy change",
      },
    ],
    limit:
      "Still Therese’s call: the AI avatar video (red team 7) stays, with a plainer disclosure line. Every word in column 3 is a draft for her and Bill to change.",
  },
} as const;
