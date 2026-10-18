/**
 * The header, footer and closing band shared by every page of the Wix copy
 * of the site, with links pointing at this site's own pages instead of
 * www.theresewhite.com.
 *
 * Web addresses match the Wix ones exactly (ruling of 2026-10-18), including
 * the odd ones Wix generated: Endorsements lives at /team-1-1 and FAQ at
 * /services-3. Keeping them means links already shared, bookmarked or
 * indexed keep working on the day the domain moves.
 */
export const wixNav = [
  { label: "About Therese", href: "/about-therese" },
  { label: "Endorsements", href: "/team-1-1" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "FAQ", href: "/services-3" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const wixFooter = {
  lines: [
    "L. Therese White",
    "Employment Mediator · Workplace Conflict Coach",
    "10736 Jefferson Blvd, #363",
    "Culver City, CA 90230",
  ],
  email: "Therese@ThereseWhite.com",
  emailHref: "mailto:Therese@ThereseWhite.com",
  phone: "323-291-4813",
  phoneHref: "tel:+13232914813",
  copyright: "© 2026 L. Therese White",
  legalTitle: "Legal",
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
    { label: "Cookie Preferences", href: "/cookie-preferences" },
    { label: "Accessibility", href: "/accessibility" },
  ],
  /**
   * Not on Wix. James asked on 2026-10-18 for a footer link to the referral
   * partner page, which the Wix site does not have. This is the one
   * deliberate addition to the Wix footer.
   */
  partners: { label: "Collaborate", href: "/collaborate" },
} as const;

/** The band that closes most pages, above the footer. */
export const wixAssessmentCta = {
  lines: ["Schedule Your", "Confidential Conflict Assessment"],
  button: "Click Here",
  href: "/contact",
} as const;

/** The booking page the Contact page's button opens. */
export const calendlyUrl = "https://calendly.com/therese-theresewhite/30min";
