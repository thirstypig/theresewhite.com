/**
 * The live Wix legal pages' words, exactly as www.theresewhite.com shows
 * them: /privacy-policy, /terms-of-use, /cookie-preferences and
 * /accessibility, top to bottom.
 *
 * Captured from the rendered pages on 2026-10-18
 * (docs/wix-capture/<page>.json). Do not edit the words: James decided on
 * 2026-10-18 that the first build matches the Wix site word for word. Wix's
 * invisible spacer characters and empty lines are the only thing removed,
 * with one decided exception:
 *
 * - Privacy Policy, ruling 6 (2026-10-17): the drafting notes are removed.
 *   The live Wix list of service providers still carries three notes-to-self
 *   in parentheses: "(e.g. Kit, formerly ConvertKit)", "(e.g. Wix Analytics,
 *   PostHog, Google Analytics — list whatever is actually running)" and
 *   "(e.g. Calendly, Acuity)". They are left out below. Nothing else in the
 *   policy is changed.
 *
 * The other three pages still contain drafting leftovers on Wix. They are
 * kept here word for word, because only the Privacy Policy was ruled on;
 * each one is marked with a "Wix drafting leftover" comment where it occurs
 * so it is easy to find when the ruling comes.
 *
 * These are a different text from src/content/legal.ts, which is the earlier
 * rebuild's own policies and still serves /privacy and /terms.
 *
 * How the text is stored: each page is a list of blocks in reading order.
 * Any "Therese@ThereseWhite.com" in the text becomes an email link
 * automatically. A piece of text that Wix underlines or links is written as
 * an object, for example `{ text: "Cookie Policy", underline: true }`.
 */

/** A run of text inside a paragraph. Plain strings are ordinary text. */
export type LegalInline =
  | string
  | {
      text: string;
      /** A real link on Wix. */
      href?: string;
      /** Underlined on Wix but not a link there. */
      underline?: boolean;
      /** A link that Wix shows without an underline. */
      plain?: boolean;
    };

export type LegalBlock =
  /** A section heading. `minor` is a smaller sub-heading inside a section. */
  | { kind: "heading"; text: string; minor?: boolean }
  | {
      kind: "p";
      content: LegalInline[];
      /**
       * Sits directly under the block before it, with no blank line between
       * them, as it does on Wix. Text right under a heading is always tight.
       */
      tight?: boolean;
      /** Italic body text (one mis-formatted line in the Terms). */
      italic?: boolean;
    }
  | {
      kind: "ul";
      items: LegalInline[][];
      /**
       * Lists sit directly under their lead-in line on Wix, except where
       * this is set and a blank line comes first.
       */
      spaced?: boolean;
    };

export type LegalPage = {
  /** The page heading, in capitals as on Wix. */
  title: string;
  /** The dates under the heading, one entry per line. */
  dates: string[];
  /**
   * How the section headings look on Wix. The Privacy Policy and Terms use
   * italic headings; Cookie Policy and Accessibility use upright capitals
   * with a blank line above each.
   */
  headingStyle: "italic" | "caps";
  /** Width of the text column on Wix at desktop size, in pixels. */
  textWidth: number;
  blocks: LegalBlock[];
};

const h = (text: string, minor = false): LegalBlock => ({ kind: "heading", text, minor });
const p = (...content: LegalInline[]): LegalBlock => ({ kind: "p", content });
const pt = (...content: LegalInline[]): LegalBlock => ({ kind: "p", content, tight: true });
const ul = (...items: string[]): LegalBlock => ({ kind: "ul", items: items.map((i) => [i]) });

export const wixPrivacy: LegalPage = {
  title: "PRIVACY POLICY",
  dates: ["Effective date: August 1, 2026 Last updated: August 1, 2026"],
  headingStyle: "italic",
  textWidth: 935,
  blocks: [
    h("Overview"),
    p(
      'Kennedy White, Inc. ("we," "us," or "our") operates ThereseWhite.com (the "Site") and provides workplace mediation, conflict coaching, and related services. This Privacy Policy explains what information we collect through the Site, how we use it, and the choices you have.',
    ),
    p("By using the Site, you agree to the practices described here. If you do not agree, please do not use the Site."),

    h("An important note about confidentiality"),
    p(
      "Information you send through this website — including contact forms, email, and any tool or calculator on the Site — is not a confidential mediation communication and is not protected by mediation confidentiality, attorney-client privilege, or any similar protection. No confidential relationship is created by visiting this Site or submitting a form.",
    ),
    p(
      "Please do not send sensitive details about a dispute, employment matter, medical condition, or any other confidential subject through this website. If you would like to discuss a matter in confidence, contact us to arrange a conversation under an appropriate confidentiality agreement or engagement.",
    ),

    h("Information we collect"),
    p(
      "Information you provide directly. When you fill out a contact form, request materials, subscribe to updates, schedule a consultation, or email us, we may collect:",
    ),
    ul(
      "Your name",
      "Your email address",
      "Your phone number, if you provide one",
      "Your organization or job title, if you provide one",
      "The contents of any message you send us",
      "Any information you choose to enter into tools on the Site, including the workplace conflict cost calculator",
    ),
    p(
      "Information collected automatically. When you visit the Site, certain information is collected automatically by our website platform and analytics tools, including:",
    ),
    ul(
      "IP address and approximate location derived from it",
      "Browser type, device type, and operating system",
      "Pages viewed, time spent on pages, and links clicked",
      "The website or search that referred you to the Site",
      "Date and time of your visit",
    ),
    p(
      "This information is collected through cookies and similar technologies. See our ",
      { text: "Cookie Policy", underline: true },
      " for details and your choices.",
    ),

    h("How we use information"),
    p("We use the information we collect to:"),
    {
      kind: "ul",
      items: [
        ["Respond to your inquiries and communicate with you about our services"],
        ["Provide the materials, tools, or resources you request"],
        ["Send you emails or newsletters you have subscribed to"],
        ["Understand how visitors use the Site so we can improve it"],
        ["Maintain the security and proper functioning of the Site"],
        ["Comply with legal obligations and enforce our ", { text: "Terms of Use", underline: true }],
      ],
    },
    p(
      "We do not use your information to make automated decisions that produce legal or similarly significant effects about you.",
    ),

    h("How we share information"),
    p(
      "We do not sell your personal information, and we do not share it with third parties for their own marketing purposes.",
    ),
    p("We share information only in these circumstances:"),
    p(
      "Service providers. We use third-party companies to operate the Site and our business. These providers process information on our behalf and are permitted to use it only to provide services to us. They include:",
    ),
    {
      kind: "ul",
      items: [
        [
          "Wix.com Ltd. — website hosting and platform. See the ",
          { text: "Wix Privacy Policy", href: "https://www.wix.com/about/privacy" },
          ".",
        ],
        // Ruling 6: Wix adds "(e.g. Kit, formerly ConvertKit)" here.
        ["Wix.com Ltd. — email delivery and list management."],
        // Ruling 6: Wix adds "(e.g. Wix Analytics, PostHog, Google Analytics
        // — list whatever is actually running)" here.
        ["Wix Analytics — website analytics."],
        // Ruling 6: Wix adds "(e.g. Calendly, Acuity)" here. "if applicable"
        // is part of the sentence on Wix and stays.
        ["Calendly — appointment scheduling, if applicable."],
      ],
    },
    p(
      "Legal requirements. We may disclose information if required by law, subpoena, court order, or other legal process, or where we believe disclosure is necessary to protect our rights, your safety, or the safety of others.",
    ),
    p(
      "Business transfer. If the business is sold, merged, or transferred, information may be transferred as part of that transaction.",
    ),

    h("Data retention"),
    p(
      "We keep the information you provide for as long as needed to respond to you and to maintain business records. Inquiry and contact information is generally retained for 3 years. Email subscription information is retained until you unsubscribe. Analytics data is retained according to the settings of our analytics provider.",
    ),
    p('You may ask us to delete information about you at any time — see "Your choices" below.'),

    h("Your choices"),
    p(
      "Email. Every marketing email includes an unsubscribe link. You can also email us at Therese@ThereseWhite.com to be removed from our list. We may still send you transactional messages related to a service you have requested.",
    ),
    p(
      "Cookies. You can manage cookies through the Site's cookie banner and through your browser settings. See our ",
      { text: "Cookie Policy", underline: true },
      ".",
    ),
    p(
      "Access and deletion. You may request a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it. Email Therese@ThereseWhite.com and we will respond within a reasonable time. We may need to verify your identity before acting on the request.",
    ),

    h("California residents"),
    p(
      'California law gives residents certain rights regarding personal information, including the right to know what personal information is collected, to request deletion, to request correction, and not to be discriminated against for exercising those rights. California law also gives residents the right to opt out of the "sale" or "sharing" of personal information as those terms are defined by statute.',
    ),
    p("We do not sell or share your personal information as those terms are defined under California law."),
    p(
      'To exercise any of these rights, email Therese@ThereseWhite.com with the subject line "California Privacy Request."',
    ),

    h("Visitors outside the United States"),
    p(
      "The Site is operated in the United States and is intended for users in the United States. If you access the Site from another country, your information will be transferred to and processed in the United States, where data protection laws may differ from those in your country. By using the Site, you consent to that transfer.",
    ),

    h("Children"),
    p(
      "The Site is not directed to children and we do not knowingly collect personal information from anyone under 18. If you believe a child has provided us with personal information, contact us at Therese@ThereseWhite.com and we will delete it.",
    ),

    h("Security"),
    p(
      "We take reasonable measures to protect the information we collect. However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.",
    ),

    h("Links to other sites"),
    p(
      "The Site contains links to third-party websites, including scheduling tools, professional organizations, and social media. We are not responsible for the privacy practices of those sites. We encourage you to read their privacy policies.",
    ),

    h("Changes to this policy"),
    p(
      'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. Material changes will be announced on the Site. Your continued use of the Site after changes are posted constitutes acceptance of the revised policy.',
    ),

    h("Contact us"),
    p("Questions about this Privacy Policy or our handling of your information:"),
    pt("Email: Therese@ThereseWhite.com"),
  ],
};

export const wixTerms: LegalPage = {
  title: "TERMS OF USE",
  dates: ["Effective date: August 1, 2026 Last updated: August 1, 2026"],
  headingStyle: "italic",
  textWidth: 973,
  blocks: [
    h("1. Acceptance of these terms"),
    p(
      'These Terms of Use ("Terms") govern your access to and use of ThereseWhite.com (the "Site"), operated by Kennedy White, Inc. ("we," "us," or "our"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, do not use the Site.',
    ),
    p("You must be at least 18 years old to use the Site."),

    h("2. No professional advice and no professional relationship"),
    p(
      "The Site provides general information about workplace mediation, conflict resolution, and related topics. Nothing on the Site is legal advice, human resources advice, psychological or medical advice, or professional advice of any kind.",
    ),
    p(
      "Using the Site, reading its content, using any tool on it, or contacting us through it does not create an attorney-client relationship, a mediator-participant relationship, a coaching relationship, or any other professional or confidential relationship. A professional relationship is formed only through a signed written engagement agreement.",
    ),
    p(
      "Every workplace dispute involves specific facts. Do not act or refrain from acting based on anything you read here without consulting a qualified professional about your particular situation.",
    ),

    h("3. The workplace conflict cost calculator"),
    p("The Site includes a calculator that produces estimated figures for the cost of workplace conflict."),
    pt(
      "The calculator is an illustrative educational tool only. Its outputs are rough estimates generated from general assumptions and industry averages, and from the values you enter. They are not an appraisal, valuation, audit, accounting opinion, actuarial estimate, or professional assessment of your organization's actual costs or exposure.",
    ),
    p(
      "Do not rely on calculator outputs for budgeting, financial reporting, litigation, negotiation, or any decision with financial or legal consequences. We make no representation that the outputs are accurate for your organization.",
    ),

    h("4. Intellectual property"),
    p(
      "All content on the Site — including text, graphics, logos, images, video, audio, the calculator and its underlying logic, and the arrangement of all of it — is owned by L. Therese White or its licensors and is protected by copyright, trademark, and other laws.",
    ),
    p(
      "You may view, download, and print content from the Site for your own personal, non-commercial reference. You may not:",
    ),
    ul(
      "Reproduce, republish, or distribute Site content commercially",
      "Modify or create derivative works from Site content",
      "Remove copyright, trademark, or other proprietary notices",
      "Use Site content to train machine learning or artificial intelligence systems",
      "Frame or mirror any part of the Site without written permission",
    ),
    pt("Requests for permission: Therese@ThereseWhite.com."),

    h("5. Acceptable use"),
    p("You agree not to:"),
    ul(
      "Use the Site for any unlawful purpose or in violation of these Terms",
      "Attempt to gain unauthorized access to the Site, its servers, or any connected systems",
      "Interfere with or disrupt the Site's operation, including through malware, denial-of-service attacks, or excessive automated requests",
      "Use automated tools to scrape, crawl, or harvest content or contact information from the Site",
      "Submit false, misleading, or fraudulent information",
      "Impersonate any person or entity",
      "Send unsolicited commercial messages to any address obtained from the Site",
    ),

    h("6. Submissions"),
    p(
      "Anything you submit through the Site — including form entries, inquiries, and messages — is submitted on a non-confidential basis and is not privileged. See the confidentiality note in our ",
      { text: "Privacy Policy", underline: true },
      ".",
    ),
    p(
      "You are responsible for the accuracy and legality of anything you submit. Do not submit information you are not authorized to disclose, including your employer's confidential information or information about a third party who has not consented to its disclosure.",
    ),

    h("7. Third-party links and services"),
    p(
      "The Site links to third-party websites and uses third-party services for scheduling, email, analytics, and other functions. We do not control those sites and services and are not responsible for their content, availability, security, or practices. Links are provided for convenience and are not an endorsement.",
    ),

    // Wix drafting leftover: section 8 has lost its heading. Wix shows its
    // text in small italics, starting with a stray "1", where the heading
    // "8. ..." should be. Kept as Wix shows it; not ruled on.
    {
      kind: "p",
      italic: true,
      content: [
        "1We do not guarantee that the Site will be available without interruption, error-free, or free of harmful components. We may modify, suspend, or discontinue any part of the Site at any time without notice.",
      ],
    },

    h("9. Disclaimer of warranties"),
    p(
      'THE SITE AND ALL CONTENT AND TOOLS ON IT ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, AND ANY WARRANTY THAT SITE CONTENT IS ACCURATE, COMPLETE, CURRENT, OR RELIABLE.',
    ),

    h("10. Limitation of liability"),
    p(
      "TO THE FULLEST EXTENT PERMITTED BY LAW, KENNEDY WHITE, INC. AND ITS OWNERS, EMPLOYEES, AND CONTRACTORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATING TO YOUR USE OF THE SITE, WHETHER BASED IN CONTRACT, TORT, STATUTE, OR ANY OTHER THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
    ),
    pt(
      "OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE SITE WILL NOT EXCEED ONE HUNDRED U.S. DOLLARS ($100).",
    ),
    pt("Some jurisdictions do not allow certain limitations of liability, so some of the above may not apply to you."),

    h("11. Indemnification"),
    p(
      "You agree to indemnify and hold harmless Kennedy White, Inc. and its owners, employees, and contractors from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of your use of the Site, your violation of these Terms, or your violation of any law or third-party right.",
    ),

    h("12. Governing law and venue"),
    p(
      "These Terms are governed by the laws of the State of California, without regard to its conflict of laws rules. Any dispute arising out of or relating to these Terms or the Site will be brought exclusively in the state or federal courts located in Los Angeles County, California, and you consent to the personal jurisdiction of those courts.",
    ),

    h("13. Informal resolution first"),
    p(
      "Before filing any claim, you agree to contact us at Therese@ThereseWhite.com and attempt to resolve the dispute informally for at least thirty (30) days. Most concerns can be resolved this way.",
    ),

    h("14. Severability and waiver"),
    p(
      "If any provision of these Terms is found unenforceable, the remaining provisions remain in full force. Our failure to enforce any provision is not a waiver of our right to do so later.",
    ),

    h("15. Changes to these terms"),
    p(
      'We may update these Terms at any time. Changes take effect when posted, and we will update the "Last updated" date. Your continued use of the Site after changes are posted constitutes acceptance.',
    ),

    h("16. Contact"),
    p("Email: Therese@ThereseWhite.com"),
  ],
};

/**
 * Wix calls this page "Cookie Preferences" in the footer, but the page itself
 * is the written Cookie Policy. Wix has no button on it for changing cookie
 * choices (checked on the live page, 2026-10-18). This site's page adds one,
 * placed right after the "On this site" line; see
 * src/app/(site)/cookie-preferences/page.tsx.
 *
 * The cookie list describes cookies that Wix sets. This site does not run on
 * Wix and sets different ones, so the list will be inaccurate once this page
 * replaces the Wix one. Kept word for word for now; flagged for James.
 */
export const wixCookies: LegalPage = {
  title: "COOKIE POLICY",
  dates: ["Effective date: August 1, 2026", "Last updated: August 1, 2026"],
  headingStyle: "caps",
  textWidth: 980,
  blocks: [
    h("WHAT COOKIES ARE"),
    p(
      "Cookies are small text files that a website places on your browser. They let a site remember things between pages and visits, such as whether you are logged in, whether you dismissed a banner, or whether you have visited before. Similar technologies, including pixels, local storage, and tracking scripts, do comparable things. This policy covers all of them.",
    ),

    h("WHY WE USE THEM"),
    p("theresewhite.com uses cookies to:"),
    ul(
      "Keep the site secure and functioning correctly",
      "Remember your cookie preferences so we do not ask again on every page",
      "Understand how visitors use the site, including which pages are read and where visitors arrive from",
      "Measure whether the site is performing well technically",
    ),
    p(
      "We do not use cookies to build advertising profiles, and we do not permit third parties to use cookies on this site for their own advertising purposes.",
    ),

    h("COOKIES USED ON THIS SITE"),
    p("Strictly necessary cookies"),
    p(
      "These are required for the site to work and cannot be switched off. They handle security, load balancing, and basic session management. This site is built on the Wix platform, and Wix sets the following:",
    ),
    {
      kind: "ul",
      spaced: true,
      items: [
        ["XSRF-TOKEN (session): Security. Prevents cross-site request forgery."],
        ["hs (session): Security."],
        ["TS* (session): Security and fraud prevention."],
        ["SSR-caching (1 minute): Indicates how the page was rendered."],
        ["smSession (session): Identifies logged-in site members."],
        ["consent-policy (12 months): Stores your cookie banner choices."],
      ],
    },
    h("Functional cookies", true),
    p("These remember choices you have made so the site behaves consistently for you."),
    ul(
      "svSession (up to 2 years): Identifies unique visitors and tracks sessions across the site.",
      "wixLanguage (12 months): Remembers language preference on multilingual sites.",
    ),
    h("Analytics and performance cookies", true),
    p("These help us understand how the site is used and whether it is working properly. They are optional."),
    ul(
      "bSession (30 minutes): Measures site effectiveness.",
      "fedops.logger.* (12 months): Measures platform stability and performance.",
      "_wixCIDX (3 months): System monitoring and debugging.",
      "_wix_browser_sess (session): System monitoring and debugging.",
    ),
    h("Advertising cookies", true),
    p("We do not use advertising or targeting cookies on this site."),

    h("THIRD-PARTY CONTENT"),
    p(
      "Some pages include content provided by third parties, such as video players, scheduling tools, or social media. Those providers may set their own cookies when their content loads. We do not control those cookies, and their practices are governed by their own policies. You can review the Wix privacy policy at ",
      // On Wix the link's address ends in a stray period
      // (http://www.wix.com/about/privacy.). This points at the page itself.
      { text: "www.wix.com/about/privacy", href: "https://www.wix.com/about/privacy", plain: true },
      ".",
    ),

    h("MANAGING YOUR PREFERENCES"),
    p("On this site: Use the cookie banner that appears on your first visit to accept or decline optional cookies."),
    // Wix drafting leftover: a line holding only a period. Kept; not ruled on.
    pt("."),
    pt(
      "In your browser: Every major browser lets you block or delete cookies, usually under Settings, Privacy, or Preferences. Note that blocking all cookies will break parts of this and most other websites.",
    ),
    p(
      "Global Privacy Control: If your browser or a browser extension sends a Global Privacy Control signal, we treat it as a request to opt out of optional cookies.",
    ),

    h("CHANGES TO THIS POLICY"),
    p('We may update this policy as the site changes. The "Last updated" date above reflects the current version.'),

    h("QUESTIONS"),
    p("If you have questions about this policy, contact us at Therese@ThereseWhite.com."),
  ],
};

/** Index of the block after which the cookie page shows its settings button. */
export const wixCookiesButtonAfter = wixCookies.blocks.findIndex(
  (b) => b.kind === "p" && typeof b.content[0] === "string" && b.content[0].startsWith("On this site:"),
);

export const wixAccessibility: LegalPage = {
  title: "ACCESSIBILITY STATEMENT",
  dates: ["Effective date: August 1, 2026", "Last updated: August 1, 2026"],
  headingStyle: "caps",
  textWidth: 973,
  blocks: [
    h("OUR COMMITMENT"),
    p(
      "L. Therese White is committed to making theresewhite.com usable by as many people as possible, including people with disabilities. Accessible design is consistent with the work we do: making it possible for people to be heard and understood.",
    ),

    h("THE STANDARD WE WORK TOWARD"),
    p(
      "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines are the widely recognized standard for making web content perceivable, operable, understandable, and robust.",
    ),
    pt(
      "We describe this as a goal we are actively working toward rather than a completed state. Accessibility is ongoing work, and we review this site periodically.",
    ),

    h("WHAT WE HAVE DONE"),
    p("Measures we have taken to improve accessibility on this site include:"),
    ul(
      // Wix drafting leftover: the stray hyphen at the end of this line.
      "Using a clear heading structure so screen reader users can navigate by section-",
      "Providing text alternatives for images that carry meaning",
      "Working toward sufficient color contrast between text and background",
      "Supporting keyboard navigation throughout the site",
      "Writing link text that makes sense when read on its own",
      "Keeping the site usable across a range of screen sizes and zoom levels",
    ),

    h("KNOWN LIMITATIONS"),
    p("We want to be straightforward about the areas where this site does not yet meet our goal:"),
    ul(
      "Third-party content. Some features, including embedded video players, scheduling tools, and social media content, are provided by other companies. We do not control their accessibility, though we consider accessibility when choosing vendors.",
      // No longer true once this site replaces Wix. Kept word for word.
      "Platform constraints. This site is built on the Wix platform, and some of the underlying code is generated by the platform rather than written by us.",
    ),
    p("We are working to address these."),

    h("ALTERNATIVE WAYS TO GET WHAT YOU NEED"),
    p(
      "If any part of this site is not accessible to you, we will provide the information or service another way. We can:",
    ),
    pt(
      "- Send content by email in a format that works for you\n- Read information to you over the phone\n- Arrange a conversation directly rather than through the site",
    ),
    pt("There is no charge for this, and you do not need to explain why you need it."),

    h("TELL US ABOUT A PROBLEM"),
    p(
      "We welcome your feedback on the accessibility of this site. If you run into a barrier, please tell us.",
    ),
    pt("Email: Therese@ThereseWhite.com"),
    pt(
      "It helps if you can describe the page you were on, what you were trying to do, and what went wrong. If you know the browser and any assistive technology you were using, please include that as well.",
    ),
    // Wix drafting leftover: "[NUMBER]" is an unfilled placeholder.
    pt("We aim to respond to accessibility feedback within [NUMBER] business days."),

    h("IF YOU ARE NOT SATISFIED WITH OUR RESPONSE"),
    p(
      // Wix drafting leftover: "[EMAIL ADDRESS]" is an unfilled placeholder.
      'If you contact us about an accessibility barrier and are not satisfied with how we respond, you may escalate by emailing [EMAIL ADDRESS] with "Accessibility Escalation" in the subject line. You also retain any rights you have under the Americans with Disabilities Act, the California Unruh Civil Rights Act, and other applicable law.',
    ),

    h("HOW THIS STATEMENT WAS PREPARED"),
    p("This statement is based on a self-evaluation of the site. It was last reviewed on August 1, 2026."),
  ],
};
