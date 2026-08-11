import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Martian_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Consent } from "@/components/consent";
import { contact } from "@/content/site";
import { SITE_URL, IS_PRODUCTION_SITE } from "@/lib/site-config";
import {
  OG_IMAGE,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from "@/lib/page-metadata";

/* Display: high-contrast serif — authority with a pulse. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

/* Body: humanist sans that stays warm at long paragraph lengths. */
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

/* Utility: the voice of the signed record — labels, steps, figures. */
const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = SITE_TITLE;
const description = SITE_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${contact.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: contact.name,
    locale: "en_US",
    type: "website",
    // Named explicitly to override the opengraph-image.tsx convention, which
    // would otherwise inject the extensionless `/opengraph-image` path here.
    // GitHub Pages serves that as application/octet-stream. See OG_IMAGE.
    images: [OG_IMAGE],
  },
  // Every page, homepage included, sets its own through pageMetadata(). This
  // is the fallback for any page added later that forgets to — without it,
  // such a page would silently ship Next's default `summary` card and share
  // as a thumbnail while the rest of the site shares wide.
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE],
  },
  // Staging must never be indexed — it would compete with the live Wix site
  // for her own name and split the ranking.
  robots: IS_PRODUCTION_SITE
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

/** Tells search engines this is a local professional service, not a blog. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: contact.name,
  description,
  url: SITE_URL,
  telephone: contact.phone,
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.street,
    addressLocality: contact.city,
    addressRegion: contact.region,
    postalCode: contact.postalCode,
    addressCountry: "US",
  },
  areaServed: "US",
  knowsAbout: [
    "Employment mediation",
    "Workplace conflict resolution",
    "Conflict coaching",
    "Team facilitation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrumentSans.variable} ${martianMono.variable} h-full`}
    >
      <head>
        {/*
          Applies the saved theme before first paint. Without this the page
          renders in the OS theme and then visibly repaints into the chosen
          one. It has to be inline and synchronous to beat the first paint —
          the content is a fixed literal, with no interpolation.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("tw-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-sm focus:bg-btn focus:px-4 focus:py-2 focus:text-btn-fg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {/* JSON-LD is built from static content above — no user input reaches
            it. `<` is still escaped so a stray "</script>" in any future copy
            edit can't break out of the tag. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Consent />
      </body>
    </html>
  );
}
