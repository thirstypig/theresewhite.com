/**
 * The words of the live Wix Case Studies page and its three follow-on pages,
 * exactly as www.theresewhite.com shows them.
 *
 * Captured from the rendered pages on 2026-10-18 (docs/wix-capture/
 * case-studies.json, case-study-extension.json, finding-came-back.json and
 * the-medical-leave.json, checked against the live pages the same day).
 *
 * Do not edit the words. James's rule for the first build is that it matches
 * the current Wix site word for word; the copy gets its own review later. That
 * includes the things a copy editor would change: "while she was out" in a
 * story about a man, the mix of straight and curly quotation marks, the spaced
 * ellipses, the Title Case on the follow-on subtitles, and the main page's
 * subtitle for Case Study #3 saying "legal questions" where its own page says
 * "legal question". Wix's invisible spacer characters are the only thing
 * removed.
 *
 * One special character is kept on purpose: the non-breaking space in "&
 * Worldviews" (written   below). On Wix it keeps the ampersand on the
 * same line as "Worldviews", so the heading breaks as "When Life Experience /
 * & Worldviews Collide".
 */

export type TextCaseStudy = {
  label: string;
  title: string;
  subtitle: string;
  situationHeading: string;
  paragraphs: string[];
  /** The underlined words inside the parentheses at the end of the last paragraph. */
  continueLabel: string;
  continueHref: string;
};

export type VideoCaseStudy = {
  label: string;
  /** Each item is one line, as Wix breaks it. */
  titleLines: string[];
  video: {
    src: string;
    poster: string;
    /** The poster's real size in pixels. */
    width: number;
    height: number;
    /** Describes the poster frame, for people who cannot see it. */
    posterAlt: string;
  };
};

export const wixCaseStudies = {
  hero: {
    title: "Case Studies",
    intro:
      "The following case studies are composites. Details and identifying circumstances have been changed. The dynamics and outcomes are drawn from my personal experience. No client is identifiable, and no client has ever been asked to be.",
  },

  one: {
    label: "Case Study #1",
    title: "The Outside Hire Is Having Trouble",
    subtitle: "(Her team had already chosen someone else)",
    situationHeading: "THE SITUATION",
    paragraphs: [
      "A non-profit hired a director of operations from the outside. She was the only Black person at the director level. Everyone reporting to her had been there forever . . . including the internal candidate who was told he came in a close second.",
      "Five months in, the CHRO called me. No complaint, no incident, no performance issue. But then she started asking for meetings to be documented in writing, and she was the only director doing that.",
    ],
    continueLabel: "Click Here To Continue",
    continueHref: "/case-study-extension",
  } satisfies TextCaseStudy,

  two: {
    label: "Case Study #2",
    titleLines: ["Mistaken", "Discrimination", "Complaint"],
    video: {
      src: "/wix/case-studies/mistaken-discrimination-complaint.mp4",
      poster: "/wix/case-studies/mistaken-discrimination-complaint-poster.webp",
      width: 960,
      height: 540,
      posterAlt:
        "Opening frame of the video: a young man in a dark long-sleeved shirt stands in front of an abandoned concrete building.",
    },
  } satisfies VideoCaseStudy,

  three: {
    label: "Case Study #3",
    title: "The Finding Came Back As “Unsubstantiated”.",
    subtitle: "The investigation answered the legal questions. The people questions weren’t.",
    situationHeading: "THE SITUATION",
    paragraphs: [
      "A complaint against a senior manager. Outside investigator, six weeks, twenty-two interviews, a careful report. Findings: Unsubstantiated.",
      "Both people saw each other every day. She felt nothing had been found because nothing was looked for. He felt that just being investigated already cost him something no finding could ever give back. Their department had quietly sorted into camps.",
      "The general counsel called me. His words: “The file is closed, but the problem isn't.”",
    ],
    continueLabel: "Click Here To Continue",
    continueHref: "/finding-came-back",
  } satisfies TextCaseStudy,

  four: {
    label: "Case Study #4",
    titleLines: ["When Life Experience & Worldviews Collide"],
    video: {
      src: "/wix/case-studies/when-worldviews-collide.mp4",
      poster: "/wix/case-studies/when-worldviews-collide-poster.webp",
      width: 960,
      height: 540,
      posterAlt:
        "Opening frame of the video: a shopping mall decorated with Christmas lights, a tall tree and light-up angels, with the caption “It was close to Christmas . . . about 27 years ago.”",
    },
  } satisfies VideoCaseStudy,

  five: {
    label: "Case Study #5",
    title: "The Medical Leave Was Handled Perfectly. His Return Was Not.",
    subtitle: "(He came back to a job that had been quietly divided up while he was gone.)",
    situationHeading: "THE SITUATION",
    paragraphs: [
      "A senior analyst returned from four months of medical leave. Every accommodation was approved, and every form was filed on time. HR had done this correctly and had the file to prove it.",
      "His two largest accounts had been reassigned while she was out. Nobody reassigned them back. When he asked, his manager told him he was being protected from taking on too much too soon.",
      "Nine weeks later, he asked HR to put a second copy of his original accommodation letter in his file. What was he thinking? That’s when they called me.",
    ],
    continueLabel: "Click Here To Continue",
    continueHref: "/the-medical-leave",
  } satisfies TextCaseStudy,
} as const;

/**
 * A paragraph on a follow-on page. Most are plain strings. The one exception
 * is on /the-medical-leave, where Wix underlines the closing sentence "That’s
 * why it kept going." for emphasis (it is not a link).
 */
export type StoryParagraph = string | { before: string; underlined: string };

export type CaseStudyStory = {
  title: string;
  subtitle: string;
  sections: { heading: string; paragraphs: StoryParagraph[] }[];
};

/** The closing lines shared by all three follow-on pages. */
export const wixCaseStudyStoryEnd = {
  assessment: "Schedule Your Confidential Conflict Assessment",
  assessmentLink: "Click Here",
  assessmentHref: "/contact",
  back: "Return to Main Case Studies Page",
  backLink: "Click Here",
  backHref: "/case-studies",
} as const;

/** /case-study-extension, which continues Case Study #1. */
export const wixOutsideHireStory: CaseStudyStory = {
  title: "The Outside Hire Is Having Trouble",
  subtitle: "(Her Team Had Already Chosen Someone Else)",
  sections: [
    {
      heading: "THE SITUATION",
      paragraphs: [
        "A non-profit hired a director of operations from the outside. She was the only Black person at the director level. Everyone reporting to her had been there forever . . . including the internal candidate who was told he came in a close second.",
        "Five months in, the CHRO called me. No complaint, no incident, no performance issue. But the new director started asking for meetings to be documented in writing, and she was the only director doing that.",
      ],
    },
    {
      heading: "WHAT I FOUND",
      paragraphs: [
        "She described a team that answered her questions completely but volunteered nothing. Twice she made important decisions and learned afterward why no one else would have made it.",
        "The runner-up was being a good soldier. Never insubordinate . . . that was the honest part. On the other hand, he was holding back eleven years of history because no one softened the blow of his losing the promotion. So, he waited to be asked about everything. And only answered exactly what he was asked.",
        "Neither of them was acting improperly. They almost never are, which is exactly why nobody upstairs could find anything to fix.",
      ],
    },
    {
      heading: "WHAT WAS ACTUALLY HAPPENING",
      paragraphs: [
        "The outside hire arrives with a title and no credit. Everyone else in that building had years of deposits. She had a résumé and a start date.",
        "And she could not tell whether the resistance was about being new or about something ugly. So, she said nothing and started building a case file instead of relationships.",
        "That’s when a workable situation becomes a case. Not when someone does something wrong. But when someone decides they are on their own.",
      ],
    },
    {
      heading: "THE WORK",
      paragraphs: [
        "Six coaching sessions with her, two interviews with him, and two half-days with both on Zoom.",
        "With her, the work was not communication skills. It was the fear that she had been hired as a symbol and would be blamed when it didn't take.",
        "With him, one question nobody asked in five months: What did he think was going to happen to him next? He assumed he was out. So, he held back.",
        "The two joint conversations were uncomfortable. They were supposed to be.",
      ],
    },
    {
      heading: "WHERE IT LANDED",
      paragraphs: [
        "She stopped documenting. He got a defined scope of his own. She began openly routing the history questions to him, in front of the team. This changed what the entire team understood about who had authority and who had standing. After that, nobody went to him without her knowing why. Five months later, he told me she was good at the job.",
      ],
    },
  ],
};

/** /finding-came-back, which continues Case Study #3. */
export const wixFindingStory: CaseStudyStory = {
  title: "The Finding Came Back: “Claim Unsubstantiated.”",
  subtitle: "The Investigation Answered The Legal Question. The People Questions Weren’t.",
  sections: [
    {
      heading: "THE SITUATION",
      paragraphs: [
        "A complaint against a senior manager. Outside investigator, six weeks, twenty-two interviews, a careful report. Findings: Unsubstantiated.",
        "Both people saw each other every day. She felt nothing had been found because nothing was looked for. He felt that just being investigated already cost him something no finding could ever give back. Their department had quietly sorted into camps.",
        "The general counsel called me. His words: “The file is closed, but the problem isn't.”",
      ],
    },
    {
      heading: "WHAT I FOUND",
      paragraphs: [
        "She never wanted him fired. She said so in every interview, and nobody recorded it as significant. She wanted him to understand what the last two years had been like for her. She needed someone to make him sit still and finally listen.",
        "He spent six weeks answering questions he was afraid to answer without a lawyer. When it ended, he stopped speaking to her entirely, which he understood as compliance. And she saw it as punishment.",
        "They had not spoken directly in fourteen months.",
      ],
    },
    {
      heading: "WHAT WAS ACTUALLY HAPPENING",
      paragraphs: [
        "An investigation asks whether a policy was violated. That is a real question, and it deserved the careful answer it got. But it almost never answers the questions the people at odds have.",
        "She wanted acknowledgment. He wanted his name and reputation back. Neither is available from a finding. So, the report closed the legal matter but not the interpersonal, human one.",
        "My experience has taught me that “unsubstantiated” and “untrue” are not the same word, and everybody in the building knows it.",
      ],
    },
    {
      heading: "THE WORK",
      paragraphs: [
        "Two individual sessions with each of them, then one mediated conversation together.",
        "One ground rule: The investigation’s findings were not on the table. We were not relitigating. He was not being asked to admit anything. She was not being asked to withdraw anything. That rule is what made the honest conversation possible. Without it, both would have spent the time attacking a verdict neither had any control over.",
        "The mediation ran a short ninety minutes. She said what she came to say. He heard it and responded, for the first time, without a company representative present.",
      ],
    },
    {
      heading: "WHERE IT LANDED",
      paragraphs: [
        "They signed a short, written agreement about specific behavior going forward. Not an apology. Not a finding. Both could live with it because neither had been asked to surrender the thing they had been protecting most.",
        "He kept his role. She withdrew nothing and did not need to. No second complaint was filed, and the camps in that department dissolved within a quarter . . . which surprised the general counsel more than anything else.",
        "So, the investigation was correct. But it was finished before the actual conversation had started.",
      ],
    },
  ],
};

/** /the-medical-leave, which continues Case Study #5. */
export const wixMedicalLeaveStory: CaseStudyStory = {
  title: "The Medical Leave Was Handled Perfectly. His Return Was Not.",
  subtitle: "He Came Back To A Job That Had Been Quietly Divided Up.",
  sections: [
    {
      heading: "THE SITUATION",
      paragraphs: [
        "A senior analyst returned from four months of medical leave. Every accommodation was approved, and every form was filed on time. HR had done this correctly and had the file to prove it.",
        "His two largest accounts had been reassigned while she was out. Nobody reassigned them back. When he asked, his manager told him he was being protected from taking on too much too soon.",
        "Nine weeks later, he asked HR to put a second copy of his original accommodation letter in his file. What was he thinking? That’s when they called me.",
      ],
    },
    {
      heading: "WHAT I FOUND",
      paragraphs: [
        "He described being misused. Meetings he used to run happened without him. He was told to take it slow so many times it started sounding like a psychiatric assessment.",
        "He began to wonder whether four months away had ended his career at that company without anyone ever deciding it had.",
        "On the other hand, his manager was proud of how he handled the leave. He covered for him without complaining about the disruption it cost the team. And, in his mind, he was not “performing” kindness. He really meant it.",
      ],
    },
    {
      heading: "WHAT WAS ACTUALLY HAPPENING",
      paragraphs: [
        {
          before:
            "Nobody “decided” to demote him. His manager made a series of adjustments, each defensible on its own. But the sum of them was a demotion no one authorized. There was no decision to reverse, no policy to enforce, and nobody to hold responsible. ",
          underlined: "That’s why it kept going.",
        },
        "I already knew that the leave wasn't the problem. The problem was coming back and discovering how easily the work moved on without him... and then watching everyone call that being considerate.",
        "So, he was building a case with the duplicate letter. But that’s not what he’d call it.",
      ],
    },
    {
      heading: "THE WORK",
      paragraphs: [
        "Three sessions with him, two with his manager, and one conversation together.",
        "With his manager, one question: \"What did you think would happen if you simply gave the accounts back when he returned?\" He said he was afraid there would be a relapse and that it would be his fault. He had never said that to anyone before.",
        "With him, the work was deciding what he really wanted. And that’s harder than knowing what he is owed, and considerably more useful. A list of what was taken can only be agreed with. A request can be answered.",
      ],
    },
    {
      heading: "WHERE IT LANDED",
      paragraphs: [
        "One account returned within two weeks. The second at ninety days, on a schedule he wrote himself. And his manager stopped deciding what he could carry. He started asking instead.",
        "No complaint was filed. He was there two years later.",
        "Nobody in this story was a bad actor. That’s precisely what made it so confusing. The best moment for the company was the week he came back, when nobody thought to ask him what HE wanted.",
      ],
    },
  ],
};
