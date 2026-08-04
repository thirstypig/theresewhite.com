/**
 * GENERIC TEMPLATE COPY — not legal advice, and not reviewed by a lawyer.
 *
 * These are conventional, good-faith policies that describe what this site
 * actually does. They are a reasonable starting point, not a substitute for
 * review by counsel — particularly the GDPR section, which assumes she has no
 * EU establishment and only occasionally encounters EU visitors.
 *
 * If any of the following changes, these need revisiting:
 *   - a form endpoint is added (a new processor joins the list)
 *   - analytics tools change
 *   - she starts marketing into the EU or UK
 */

export const LAST_UPDATED = "August 2026";

export const privacy = {
  title: "Privacy policy",
  intro:
    "This site is run by L. Therese White. It collects as little as it can, and nothing about your situation is shared with anyone.",
  sections: [
    {
      heading: "What this site collects",
      body: [
        "If you use the contact form, we receive what you type into it: your name, email, organization, role, phone number if you give one, how urgent the matter is, and your description of the situation. That goes to Therese and is used to respond to you and prepare for a conversation. Nothing more.",
      "The form is delivered by Web3Forms, which passes the message to Therese's inbox and acts as a processor on our behalf. It is not used to build a marketing list.",
        "If you email or call instead, we hold whatever you send us, for the same purpose.",
        "The site also collects anonymous usage data through the analytics tools described below. That data is about how pages are used, not about who you are.",
      ],
    },
    {
      heading: "Please don't send confidential details you don't have to",
      body: [
        "A first message never needs names. Describing roles and dynamics is enough to decide whether a conversation makes sense. If a matter proceeds, confidentiality is handled properly under a written engagement — not through a web form.",
      ],
    },
    {
      heading: "Analytics and cookies",
      body: [
        "With your consent, this site uses Microsoft Clarity and Google Analytics 4 to understand how visitors move through the pages. Both set cookies and both send data to their providers, who act as processors on our behalf. Clarity records anonymized session activity; the contact form is explicitly masked so its contents are never captured.",
        "Neither tool runs until you accept. If you decline, or ignore the banner, no analytics cookies are set and no data is sent. You can change your mind at any time from the link in the footer.",
        "No advertising, retargeting, or profiling cookies are used on this site, and nothing collected here is sold or shared for marketing.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Inquiries that don't lead to an engagement are deleted within twelve months. Records connected to an engagement are kept as long as professional and legal obligations require, then deleted. Analytics data follows each provider's own retention schedule.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can ask what we hold about you, ask for it to be corrected, or ask for it to be deleted. Email Therese@ThereseWhite.com and we'll respond promptly.",
        "If you're in the UK or European Economic Area, the GDPR gives you those rights formally, along with the right to object to processing, to request a portable copy of your data, and to complain to your national data protection authority. Where we rely on consent — analytics — you can withdraw it at any time without affecting anything done beforehand. Where we respond to an inquiry you sent us, we rely on our legitimate interest in answering you, and on taking steps at your request before entering a contract.",
        "If you're in California, the CCPA gives you comparable rights to know, delete, and correct. We don't sell personal information and never have.",
      ],
    },
    {
      heading: "Security and transfers",
      body: [
        "Reasonable technical and organizational measures protect the information we hold, though no method of transmission over the internet is completely secure. Our analytics providers are US-based, so data may be processed in the United States under their standard contractual clauses.",
      ],
    },
    {
      heading: "Changes and contact",
      body: [
        "If this policy changes materially, the date below changes with it. Questions go to Therese@ThereseWhite.com, or 10736 Jefferson Blvd., #363, Culver City, CA 90230.",
      ],
    },
  ],
} as const;

export const terms = {
  title: "Terms of use",
  intro:
    "The plain-language version: this site is information about a mediation practice. Reading it doesn't hire anyone, and nothing here is legal advice.",
  sections: [
    {
      heading: "No legal advice",
      body: [
        "L. Therese White is a mediator and conflict coach, not an attorney. Nothing on this site is legal advice, and reading it creates no attorney-client relationship. If your situation has a legal dimension — and most workplace conflicts do — consult qualified counsel.",
      ],
    },
    {
      heading: "No engagement until it's in writing",
      body: [
        "Using this site, submitting the form, or having an initial conversation does not create a professional engagement. An engagement begins only under a written agreement signed by both parties. Until then, no duty of confidentiality arises beyond the privacy commitments described in the privacy policy.",
      ],
    },
    {
      heading: "No guaranteed outcome",
      body: [
        "Mediation depends on the willingness of the people in the room. Descriptions of past work, endorsements, and figures on this site describe experience, not a promise about your matter. No particular outcome is guaranteed.",
      ],
    },
    {
      heading: "Content and intellectual property",
      body: [
        "The text, design, and materials on this site belong to L. Therese White unless stated otherwise, and may not be reproduced or republished without permission. Third-party names, seals, and marks that appear here belong to their owners and are used only to identify panels and affiliations.",
      ],
    },
    {
      heading: "Endorsements",
      body: [
        "Endorsements are published with the endorser's permission and reflect their own experience. One client account is published anonymously at that client's request. Individual experiences vary.",
      ],
    },
    {
      heading: "Availability and external links",
      body: [
        "This site is provided as-is. We aim to keep it accurate and available, but don't warrant that it will be uninterrupted or error-free. Links to other sites are for convenience; we're not responsible for their content.",
      ],
    },
    {
      heading: "Limitation of liability and governing law",
      body: [
        "To the fullest extent permitted by law, L. Therese White is not liable for any indirect or consequential loss arising from use of this site. These terms are governed by the laws of the State of California, and any dispute will be handled in the state or federal courts of Los Angeles County.",
      ],
    },
  ],
} as const;
