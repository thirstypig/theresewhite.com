/**
 * The live Wix "Endorsements" page's words (www.theresewhite.com/team-1-1),
 * exactly as the page shows them, in the order a visitor reads them.
 *
 * Captured from the rendered page on 2026-10-18 for the near-exact copy of
 * the Wix site (James's decision of 2026-10-18: the first build matches the
 * current site word for word, and the redesign comes later). Do not edit the
 * words here. That includes the mixed straight and curly quotation marks,
 * the quotation that opens with a straight mark and closes with a curly one,
 * and "businesses functionality". These are quotations from real people, and
 * changing them is a separate step that Therese signs off on. Only Wix's
 * invisible spacer characters and trailing spaces have been removed.
 *
 * A paragraph is either plain text or a list of pieces, where `{ em }` is
 * italic and `{ link }` is an underlined link that opens in a new tab, as on
 * Wix.
 */
export type WixRichPiece = string | { em: string } | { text: string; href: string };
export type WixRichParagraph = string | readonly WixRichPiece[];

export type WixEndorsement = {
  name: string;
  /** Only the anonymous client has this line under the name. */
  note?: string;
  photo: { src: string; width: number; height: number; alt: string };
  /** The anonymous client's one-line description, in gray rather than black on Wix. */
  lead?: string;
  /** Who they are, in normal type. */
  bio: readonly WixRichParagraph[];
  /** Their words about Therese, in italics. */
  quote: readonly WixRichParagraph[];
};

export const wixEndorsements = {
  meta: {
    /** The Wix page title is "Endorsements | Theresewhite". */
    title: "Endorsements",
    description:
      "What Candice Gottlieb-Clark, Kenneth Cloke, Joan Goldsmith and a recent client say about working with mediator L. Therese White.",
  },

  title: "Endorsements",
  intro: [
    "Below are ",
    { em: "\"top-of-the-field\"" },
    " professionals who are familiar with my work. I'm grateful for their support. Feel free to reach out to them.",
  ],

  /**
   * In reading order: Candice and Joan side by side, then Kenneth and the
   * recent client. On phones they stack in this same order.
   */
  people: [
    {
      name: "Candice Gottlieb-Clark",
      photo: {
        src: "/wix/endorsements/candice-gottlieb-clark.webp",
        width: 384,
        height: 384,
        alt: "Candice Gottlieb-Clark, smiling, in a dark blazer",
      },
      bio: [
        "Candice is a renowned business advisor, coach, conflict management specialist and the founder of Dynamic Team Solutions. She and her team of experts help organizations and leaders across all industries raise the level of their businesses functionality, teamwork, and productivity.",
      ],
      quote: [
        "\"Therese has provided mediation services for my clients over the past seven or eight years. My clients’ reason for using mediation is to address unresolved and rising conflict among individuals who work together (in person and remotely).",
        "\"I chose Therese to support these clients because of her skill in helping people repair damage to their relationships. Her approach to mediation is transformative (that is, both the mediation style and the outcome). Therese believes in educating people, which is an added gift. She carries that ideology into her sessions, allowing her to change not only the situation at hand but also to create new ways of looking at future situations, thereby bringing about lasting change.\"",
      ],
    },
    {
      name: "Joan Goldsmith",
      photo: {
        src: "/wix/endorsements/joan-goldsmith.webp",
        width: 730,
        height: 783,
        alt: "Joan Goldsmith, smiling, in front of a bookshelf",
      },
      bio: [
        [
          "Joan has been an organizational consultant, coach and educator for the past thirty-five years, specializing in leadership development, organizational change, conflict resolution, and team building. Joan has authored several books on leadership including (with Warren Bennis) ",
          { em: "Learning to Lead," },
          " and the soon to be published ",
          { em: "Women Leaders at the Grassroots: 9 Stories and 9 Strategies" },
          ".",
        ],
      ],
      quote: [
        "“. . . The most exceptional thing about Therese is her quiet way of lighting the path to common ground. Her understanding of how emotional intelligence impacts individuals and teams sets her apart from other mediators, especially when developing grassroots community leaders . . . Over the years, we’ve trained countless professionals in our conflict resolution methods, and I can confidently say she’s one of the best in the field.”",
      ],
    },
    {
      name: "Kenneth Cloke",
      photo: {
        src: "/wix/endorsements/kenneth-cloke.webp",
        width: 600,
        height: 600,
        alt: "Kenneth Cloke speaking, gesturing with both hands",
      },
      bio: [
        [
          "Ken is a world-recognized mediator, dialogue facilitator, conflict resolution systems designer, teacher, public speaker,  author of ",
          { text: "numerous books", href: "https://www.kencloke.com/books" },
          " and ",
          { text: "articles", href: "https://www.kencloke.com/articles" },
          ", and a pioneer and leader in the field of mediation and conflict resolution for nearly 50 years.",
        ],
      ],
      quote: [
        // On Wix the opening quotation mark is upright and the rest is italic.
        [
          "“",
          { em: "After more than thirty years of working with Therese White, both as a co-mediator and co-trainer, I can honestly say she is an extraordinary talent. We have tackled some very difficult and challenging cases together; many filled with raw emotion or revolving around deep-seated life experience issues. Therese is especially skilled in the transformational mediation model." },
        ],
        "\"Beyond mediation, she has been an invaluable co-teacher and assistant in several of my conflict resolution classes at Pepperdine University Law School and in my mediator certification trainings at the Center for Conflict Resolution.",
        "\"For genuine, deep, and lasting resolutions in any employment setting, Therese should be your first choice.”",
      ],
    },
    {
      name: "Recent Client",
      note: "Identity withheld for confidentiality",
      photo: {
        src: "/wix/endorsements/recent-client-silhouette.webp",
        width: 287,
        height: 270,
        alt: "A dark silhouette of a man in a suit, standing in for a client whose identity is withheld",
      },
      lead: "A senior deputy compliance officer in an organization with over 110,000 employees.",
      bio: [
        "Question:\nPlease share any specific examples of how you felt Therese met or exceeded your expectations.",
      ],
      quote: [
        // "Answer:" is upright on Wix; the answer under it is italic.
        [
          "Answer:\n",
          { em: "\"Therese handled an incredibly complex conflict involving numerous employees of various levels of employment positions (i.e., managers, supervisors, line staff). These situations involve a higher level of complexity due to the personal and professional relationships of the parties.\n\n\"The resolution process took place over months due to the significant amount of work required. Therese excelled at facilitating discussions among the parties, as well as coaching the supervisors . . . Ultimately, a very difficult conflict was resolved to the immense gratitude of the parties. Therese also provided numerous tools the parties could use if conflict arose in the future and to prevent the types of escalation that occurred in the past.\"" },
        ],
      ],
    },
  ] satisfies readonly WixEndorsement[],
} as const;
