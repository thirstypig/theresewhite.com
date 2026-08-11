/**
 * Single source of truth for all site copy.
 *
 * Migrated verbatim from the live Wix site (crawled 4 Aug 2026) so the rebuild
 * is a like-for-like replacement. Edit copy here, never in components.
 */

export const contact = {
  name: "L. Therese White",
  roles: ["Employment Mediator", "Workplace Conflict Coach"],
  phone: "(323) 291-4813",
  phoneHref: "tel:+13232914813",
  email: "Therese@ThereseWhite.com",
  emailHref: "mailto:Therese@ThereseWhite.com",
  street: "10736 Jefferson Blvd., #363",
  city: "Culver City",
  region: "CA",
  postalCode: "90230",
  country: "USA",
} as const;

export const nav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Endorsements", href: "/endorsements" },
  { label: "FAQ", href: "/faq" },
] as const;

export const legalNav = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
] as const;

export const cta = {
  label: "Schedule your confidential conflict assessment",
  short: "Schedule an assessment",
  href: "/contact",
} as const;

/** The homepage video — her AI avatar delivering the positioning. */
export const video = {
  id: "6DDxPMJ6L-Q",
  url: "https://youtu.be/6DDxPMJ6L-Q",
  title: "L. Therese White — what to know before we talk",
  disclosure:
    "Full disclosure: yes, it's my AI avatar. But the voice, the words, and the 30+ years of experience behind them are all me.",
} as const;

export const hero = {
  eyebrow: "30+ years experience",
  positions: [
    "Two valued teammates who can't be in the same room.",
    "Other teammates taking sides — or checking out.",
    "A conflict your internal processes can't resolve.",
  ],
  resolution: "I enable the conversation that resolves it.",
  resolutionTail: "Then I stay until it holds.",
  question:
    "Is an unresolved, emotion-driven conflict costing you good people, productivity, and legal exposure?",
} as const;

export const proof = [
  { figure: "30+", label: "Years experience" },
  { figure: "1,100+", label: "Mediations" },
] as const;

/**
 * Read off the logo images on the live Wix homepage, which carried no alt text
 * — the filenames were all "Screenshot 2025-09-19 at 9.35.28 PM.png".
 *
 * Set as text rather than logos: the source images are low-resolution Wix
 * screenshots, and reproducing federal seals and trademarks needs the real
 * assets and usually permission. Names alone still carry the credential.
 *
 * The EEOC and Kenneth Cloke logos were cropped in Wix's rendering and so were
 * read with less certainty; Therese confirmed both on 2026-08-04.
 */
export const credentials = {
  title: "Panels and affiliations",
  panels: [
    {
      name: "U.S. Postal Service — REDRESS Program",
      logo: "/logos/usps.png",
    },
    {
      name: "U.S. Equal Employment Opportunity Commission",
      logo: "/logos/eeoc.png",
    },
    {
      name: "American Arbitration Association / ICDR — Panel Member",
      logo: "/logos/aaa.png",
    },
    {
      name: "Los Angeles County Human Resources",
      logo: "/logos/lacounty.png",
    },
  ],
  affiliations: [
    {
      name: "Loyola Law School, Loyola Marymount University",
      logo: "/logos/loyola.png",
    },
    {
      name: "Center for Conflict Resolution — co-trainer with Kenneth Cloke",
      logo: "/logos/cloke.png",
    },
    {
      name: "Dynamic Team Solutions",
      logo: "/logos/dts.png",
    },
  ],
} as const;

export const portrait = {
  src: "/therese-white.webp",
  width: 749,
  height: 900,
  alt: "L. Therese White",
} as const;

export const pullQuote = {
  quote: "It's never about what they say it's about.",
  subhead: "Your biggest expense is the conversation nobody knows how to have.",
} as const;

export const beforeWeTalk = {
  title: "What to know before we talk",
  points: [
    "I'm not the right mediator for every conflict — by design. I take on a very small number of engagements at a time, so you get all of me, not a slice of a caseload.",
    "Our first conversation is a confidential conflict assessment. It's real work: no pitch, no pressure. We'll also decide whether we're a fit. If we aren't, I'll gladly refer you to someone who is.",
    "Your proposal will be customized to your situation. Basic pricing starts at $5,000, and you'll approve every step before we begin.",
  ],
} as const;

/** The three arguments for the shortlist. Homepage + /services. */
export const reasons = [
  {
    title: "Over 1,100 mediations. Mostly hard ones.",
    body: "With 30+ years of experience, I've become expert at uncovering and unpacking the hidden emotional issues that drive irrational, difficult, and sometimes explosive behavior. That lets everyone focus on a mutually beneficial resolution with minimal trauma and regret. Less insightful mediators overlook emotional concerns, or are at a loss when forced to deal with them. With me, you get a conflict that's finished — not one that's been quieted, filed, and left to resurface in two weeks.",
  },
  {
    title: "I'm not an attorney. And that's a good thing.",
    body: "I don't give legal advice — which is precisely why organizations like yours call me. Your conflict has a legal dimension; that's why counsel is involved. But the reason two valued employees can't be in the same room isn't legal. It's ego, fear, humiliation, and something that happened eighteen months ago that nobody will name out loud. No amount of legal maneuvering resolves that. It just documents it. I work where the actual problem lives.",
  },
  {
    title: "Much more than a one-trick pony.",
    body: "Many mediators have only mediation in the toolbelt, so don't be surprised if I recommend a multi-dimensional approach. Many two-party disputes are symptoms of larger, systemic problems. My recommendation might combine mediation, broader fact-finding interviews, one-on-one coaching, and team workshops instead of a one-size-fits-all mediation — so the fix fits the conflict, and you don't end up with the same dispute wearing a different name.",
  },
] as const;

/**
 * Services. Assembled from her own words on the live site — the "one-trick
 * pony" section and the FAQ answer about services beyond mediation. No copy
 * invented.
 */
export const services = {
  intro:
    "Don't think of me like an emergency room doctor who only shows up after the damage is done, patches you up, and sends you home hoping it won't happen again. I offer interrelated services covering all stages of treatment.",
  items: [
    {
      name: "Mediation",
      body: "The conversation the parties have been avoiding — sometimes for months, even years. I don't referee it and I don't smooth it over. I guide it. Transformative in both style and outcome, and documented in a signed agreement.",
    },
    {
      name: "One-on-one coaching",
      body: "For individuals whose behavior is driving the conflict, including the toxic high performers everyone is afraid to confront. It's not about changing them. It's about helping them want to change themselves.",
    },
    {
      name: "Facilitated team discussions",
      body: "When a two-party dispute turns out to be a symptom of something the whole team is carrying, the repair has to happen in the room where the damage happened.",
    },
    {
      name: "Fact-finding interviews",
      body: "Confidential one-on-one conversations with the parties and others affected. Not to build a case, but to understand what everyone is really carrying. The stated problems are rarely the real ones.",
    },
    {
      name: "Prevention & resolution workshops",
      body: "Give managers tools and training so team conflicts stop landing on your desk, then hold them accountable by making conflict resolution part of their performance reviews.",
    },
  ],
  remote:
    "I conduct almost all of my work over Zoom, and I offer same-day strategy calls for urgent situations.",
} as const;

/** A genuine, ordered sequence — which is why these carry numbers. */
export const process = [
  {
    title: "Interviews",
    body: "Confidential one-on-one conversations with the parties involved, and sometimes others who are affected. Not to build a case, but to understand what everyone is really carrying. The stated problems are rarely the real ones.",
  },
  {
    title: "Mediation",
    body: "The conversation the parties have been avoiding — sometimes for months, even years. I don't referee it and I don't smooth it over. I guide it. It's the hardest part of the process, and it's where everything changes.",
  },
  {
    title: "Written agreement",
    body: "Every successful resolution gets documented in a signed agreement. Who does what, by when, and what happens if it slips. Not a legal document, and not vague intentions — a mutual commitment. Signing moves the agreement out of the room and into the working relationship.",
  },
  {
    title: "Follow-up",
    body: "Agreements are made in a room. They survive — or don't — back at work. So I stay close, with follow-up coaching and crisis management in the weeks after. I can't guarantee 100% success; no honest mediator can. I can guarantee I won't disappear once the dust settles.",
  },
] as const;

export const assessment = {
  title: "Schedule your confidential conflict assessment",
  intro:
    "We'll discuss your situation in depth. It's real work — no sales pitch, no pressure. In 30 to 45 minutes, I'll help you answer:",
  questions: [
    "What's the least disruptive, lowest-risk path?",
    "Is mediation appropriate, or is coaching enough?",
    "Who else needs to be involved, and who shouldn't be?",
    "What's the best way to get the parties to mediation?",
    "What will be included in my proposal?",
  ],
  outro:
    "At the end we'll brainstorm next steps, which may or may not include me. That's perfectly fine. I'll be happy to refer you to someone who's a better fit.",
} as const;

/**
 * DRAFT COPY — the only section on this site not migrated from her own words.
 *
 * The live Wix site has no bio page, so there was nothing to migrate. Every
 * claim below is assembled from something already evidenced elsewhere on the
 * site: the endorsements, the FAQ, the panel logos, and the homepage. Nothing
 * biographical is invented — no education, no career history, no dates —
 * because inventing those about a real person would be worse than leaving
 * gaps.
 *
 * TODO(therese): rewrite in your own voice. The gaps worth filling are how you
 * came into this work, what you did before it, and what transformative
 * mediation means to you in plain language.
 */
export const about = {
  lede: "I mediate workplace conflicts that have stopped responding to everything else — and I stay until the resolution holds.",
  sections: [
    {
      heading: "What I actually do",
      body: "For more than thirty years and over 1,100 mediations, I've worked in employment disputes where the stated problem isn't the real one. My specialty is uncovering and unpacking the hidden emotional issues — ego, fear, humiliation, something that happened eighteen months ago that nobody will name out loud — that drive irrational, difficult, and sometimes explosive behavior. Once those are on the table, people can focus on a resolution that actually works for them, with minimal trauma and regret.",
    },
    {
      heading: "Transformative mediation",
      body: "I work in the transformative model, which means the goal isn't only to settle the dispute in front of us. It's to change how the people in the room understand the situation and each other, so they handle the next one differently. Colleagues who've watched me work describe it as a quiet way of lighting the path to common ground. That's the part I care most about.",
    },
    {
      heading: "I'm not an attorney",
      body: "I don't give legal advice, and that's deliberate. Your conflict has a legal dimension — that's why counsel is involved. But the reason two valued employees can't be in the same room isn't legal, and no amount of legal maneuvering resolves it. It just documents it. I work where the actual problem lives, and I work alongside in-house counsel when that's useful.",
    },
    {
      heading: "Teaching and training",
      body: "I've co-taught conflict resolution with Kenneth Cloke at Pepperdine University Law School and in mediator certification trainings at the Center for Conflict Resolution, and I've trained professionals in conflict resolution methods alongside Joan Goldsmith. Teaching keeps the work honest — it's hard to hand someone a method you can't explain.",
    },
    {
      heading: "How I work",
      body: "I take on a very small number of engagements at a time, so the organizations I work with get all of me rather than a slice of a caseload. Almost all of the work happens over Zoom, and I keep time open for same-day strategy calls when a situation is moving fast. I'm based in Culver City, California, and I work with organizations across the country.",
    },
  ],
} as const;

/** All 12 questions, verbatim from the live FAQ. */
export const faq = [
  {
    q: "Why should we invest in outside assistance instead of just handling difficult conflicts internally?",
    a: "Every hour you and other leaders wrestle with entrenched workplace drama is an hour you aren't spending on strategy, innovation, or client relations. Your jobs are to grow the business, not run a part-time mediation practice. Delegating messy problems to outside assistance is all about the proper allocation of resources — plain and simple.",
  },
  {
    q: "How do I talk to my bottom-line bosses about investing in conflict resolution services?",
    a: "Show them the numbers. The cost of professional mediation is always less than the cost of unresolved conflicts. Say that mediation will cost around “$X,” and replacing people costs “Y” times their annual salary. And litigation typically begins around “$Z,” even before a negotiated settlement or verdict is reached. Lastly, don't forget the missed targets and deadlines, as well as the damage to workplace culture.",
  },
  {
    q: "What's one of the biggest mistakes HR professionals and team leaders make when dealing with workplace conflicts?",
    a: "Trying to be the hero. Most are very competent in handling their job's basic requirements. But when conflicts involve deep emotional wounds or firmly held values and beliefs, do-it-yourself interventions often make matters worse. It's like trying to perform surgery with a butter knife. It will cause more harm than good, because the tool itself is a problem.",
  },
  {
    q: "What conflict resolution services do you provide beyond mediation?",
    a: "Don't think of me like an emergency room doctor who only shows up after the damage is done, patches you up, and sends you home, hoping it won't happen again. Instead, I offer interrelated services covering all stages of treatment: conflict prevention and resolution workshops, individual coaching, facilitated team discussions, as well as mediation.",
  },
  {
    q: "My managers keep dumping their team conflicts on me. How do I stop this?",
    a: "Give them tools and training, then hold them accountable. Make conflict prevention and resolution part of their performance reviews.",
  },
  {
    q: "How do I prove to my bosses that I'm dealing with conflicts strategically?",
    a: "Begin by identifying and managing conflicts before they become crises. Develop early warning and de-escalation systems to free you from firefighting. In other words, show them that you're looking ahead.",
  },
  {
    q: "What if the conflict involves one of our top performers, whom everyone's afraid to confront?",
    a: "This is where most organizations screw up royally. They think talent excuses toxicity. So toxic high performers kill morale and drive away other high performers. My one-on-one coaching understands that “prima donnas” require a different approach. It's not about changing them. It's about helping them want to change themselves. And trust me, it took me many years to get good at just that.",
  },
  {
    q: "How quickly can you help us resolve an urgent conflict situation?",
    a: "To get the ball rolling, I offer same-day strategy calls for urgent situations. Simple conflicts often resolve within one to two weeks. Complex cases involving deep relationship damage and bystander casualties usually take longer. However, in either case, you should see immediate de-escalation once my process begins.",
  },
  {
    q: "How quickly can you resolve a conflict that's been festering for months or even years?",
    a: "Speed depends on how willing people are to do the emotional work. I've resolved decade-long conflicts in single sessions when both parties were ready to move forward; however, that's not the norm. But remember, moving too quickly is like picking fruit before it's ripe. It will be hard, sour, and indigestible.",
  },
  {
    q: "What's your success rate, and how do you measure it?",
    a: "I don't track my success rate, but I consider these three metrics: resolution (a written agreement signed), repair (a professional working relationship restored), and durability (no repeat conflicts within 12 months). While those metrics are important, here's what matters most: my clients consistently tell me they wish they'd called me sooner. Early intervention saves time, money, and emotional exhaustion.",
  },
  {
    q: "Can you handle conflicts that involve potential legal issues?",
    a: "Absolutely, but let's be clear about roles. I'm not an attorney, so I don't give legal advice. However, my 30-plus years in employment mediation mean I understand when legal boundaries are being crossed. And my approach usually prevents litigation by addressing root causes early. I also work collaboratively with in-house legal counsel when needed.",
  },
  {
    q: "Can you effectively do your work remotely?",
    a: "Absolutely. I conduct almost all my work via Zoom conference meetings.",
  },
] as const;

export const endorsements = {
  intro:
    "Below are top-of-the-field professionals who are familiar with my work. I'm grateful for their support. Feel free to reach out to them.",
  items: [
    {
      name: "Candice Gottlieb-Clark",
      bio: "Candice is a renowned business advisor, coach, conflict management specialist and the founder of Dynamic Team Solutions. She and her team of experts help organizations and leaders across all industries raise the level of their businesses' functionality, teamwork, and productivity.",
      quote:
        "Therese has provided mediation services for my clients over the past seven or eight years. My clients' reason for using mediation is to address unresolved and rising conflict among individuals who work together, in person and remotely. I chose Therese to support these clients because of her skill in helping people repair damage to their relationships. Her approach to mediation is transformative — that is, both the mediation style and the outcome. Therese believes in educating people, which is an added gift. She carries that ideology into her sessions, allowing her to change not only the situation at hand but also to create new ways of looking at future situations, thereby bringing about lasting change.",
    },
    {
      name: "Kenneth Cloke",
      bio: "Ken is a world-recognized mediator, dialogue facilitator, conflict resolution systems designer, teacher, public speaker, author of numerous books and articles, and a pioneer and leader in the field of mediation and conflict resolution for nearly 50 years.",
      quote:
        "After more than thirty years of working with Therese White, both as a co-mediator and co-trainer, I can honestly say she is an extraordinary talent. We have tackled some very difficult and challenging cases together, many filled with raw emotion or revolving around deep-seated life experience issues. Therese is especially skilled in the transformational mediation model. Beyond mediation, she has been an invaluable co-teacher and assistant in several of my conflict resolution classes at Pepperdine University Law School and in my mediator certification trainings at the Center for Conflict Resolution. For genuine, deep, and lasting resolutions in any employment setting, Therese should be your first choice.",
    },
    {
      name: "Joan Goldsmith",
      bio: "Joan has been an organizational consultant, coach and educator for the past thirty-five years, specializing in leadership development, organizational change, conflict resolution, and team building. Joan has authored several books on leadership including, with Warren Bennis, Learning to Lead, and the forthcoming Women Leaders at the Grassroots: 9 Stories and 9 Strategies.",
      quote:
        "The most exceptional thing about Therese is her quiet way of lighting the path to common ground. Her understanding of how emotional intelligence impacts individuals and teams sets her apart from other mediators, especially when developing grassroots community leaders. Over the years, we've trained countless professionals in our conflict resolution methods, and I can confidently say she's one of the best in the field.",
    },
    {
      name: "A recent client",
      bio: "Identity withheld for confidentiality. A senior deputy compliance officer in an organization with over 110,000 employees, asked to share specific examples of how Therese met or exceeded expectations.",
      quote:
        "Therese handled an incredibly complex conflict involving numerous employees of various levels of employment positions — managers, supervisors, line staff. These situations involve a higher level of complexity due to the personal and professional relationships of the parties. The resolution process took place over months due to the significant amount of work required. Therese excelled at facilitating discussions among the parties, as well as coaching the supervisors. Ultimately, a very difficult conflict was resolved to the immense gratitude of the parties. Therese also provided numerous tools the parties could use if conflict arose in the future and to prevent the types of escalation that occurred in the past.",
    },
  ],
} as const;

/**
 * DRAFT COPY — like `about`, none of this is migrated from the live Wix site,
 * which has no equivalent page.
 *
 * The page addresses allied professionals rather than clients, and says
 * nothing about money in either direction. That is deliberate: mediator
 * ethics codes — including the Model Standards of Conduct for Mediators,
 * which govern the AAA/ICDR panel she sits on — restrict fees for referrals,
 * and lawyers cannot split fees with non-lawyers at all. A paid model needs
 * her to check her own panel rules first.
 *
 * Reasoning in full:
 * docs/superpowers/specs/2026-08-11-collaborate-page-design.md
 *
 * TODO(therese): rewrite in your own voice. The six handoff descriptions
 * under `partnerTypes` matter most — they describe other people's
 * professional boundaries, so they need to be right rather than plausible.
 */
export const collaborate = {
  eyebrow: "Collaborate",
  title: "Your client stays your client",
  lede: "I take the conflict, resolve it, and hand the working relationship back to you. I'm not looking for your retainer, your HR work, or your seat at the table.",

  partnerTypes: {
    title: "Who I work with",
    items: [
      {
        name: "HR leaders and People teams",
        body: "You own the policy, the record, and the relationship afterwards. I take the conversation you can't be neutral in, because you're also the person who has to manage both of them next quarter.",
      },
      {
        name: "Fractional and interim HR",
        body: "You're often the only HR in the building, and a live conflict eats the engagement you were actually hired for. I take it off your critical path.",
      },
      {
        name: "Ombuds and internal neutrals",
        body: "Your confidentiality is yours. I don't ask you to breach it and I don't report back to the organization through you. When a matter needs a documented resolution your office can't produce, I can.",
      },
      {
        name: "Employment counsel, in-house and outside",
        body: "You stay lead on the matter. I don't give legal advice and I don't touch strategy. I work the part that isn't legal, which is usually the part blocking settlement.",
      },
      {
        name: "Executive and leadership coaches",
        body: "Coaching one party rarely resolves a two-party conflict. I can take the joint conversation while your coaching relationship stays intact and uncompromised.",
      },
      {
        name: "EAP and workplace well-being providers",
        body: "You're supporting the individual. I'm resolving the dispute between them. Different work, and neither substitutes for the other.",
      },
    ],
  },

  ways: {
    title: "Four ways to work together",
    items: [
      {
        name: "Refer a matter out",
        body: "Send the whole thing to me. I scope it, quote it, resolve it, and tell you when it's finished.",
      },
      {
        name: "Bring me in alongside you",
        body: "Your engagement, your client, your name on it. I do the mediation as part of your program.",
      },
      {
        name: "Co-deliver a workshop",
        body: "Conflict prevention training for managers, built with you and taught together.",
      },
      {
        name: "Send me your hard one",
        body: "The conflict that's stopped responding to everything you've tried. That's the one I want.",
      },
    ],
  },

  reciprocal: {
    title: "What comes back",
    body: "I refer out constantly. When the problem turns out to be policy, or legal, or clinical, I say so and name someone — and I'd rather name someone I've actually met.",
  },

  form: {
    title: "Introduce yourself",
    intro: "No obligation and no follow-up sequence. I'd rather know who you are before either of us has a live matter.",
    otherLabel: "Something else",
  },
} as const;

/**
 * Footer-only links.
 *
 * Kept out of `nav` on purpose. The header is a buying path — every item
 * there answers "should I hire her?" — while /collaborate answers "should I
 * work with her?", asked by a peer. Adding it to `nav` would put it in the
 * header, since the footer builds its list from `nav`.
 */
export const footerNav = [
  { label: "Collaborate", href: "/collaborate" },
] as const;
