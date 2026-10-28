import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Consent } from "@/components/consent";
import { contact } from "@/content/site";
import { SITE_URL, IS_PRODUCTION_SITE } from "@/lib/site-config";
import {
  OG_IMAGE,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from "@/lib/page-metadata";

/* Display: high-contrast serif — authority with a pulse. */
/*
 * The font files live in src/fonts and ship with the site, so the build never
 * downloads anything from Google Fonts. Each file is the "latin" file Google
 * Fonts serves for the same request (src/fonts/<family>/ holds the license).
 * Fraunces and Instrument Sans are variable fonts, one file covering every
 * weight in the range given; adjustFontFallback picks the stand-in font that
 * is resized to match while the real one loads, the same one Google's loader
 * used (Times New Roman for serifs, Arial otherwise).
 */
const fraunces = localFont({
  src: "../fonts/fraunces/fraunces-latin-variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/* Body: humanist sans that stays warm at long paragraph lengths. */
const instrumentSans = localFont({
  src: "../fonts/instrument-sans/instrument-sans-latin-variable.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-instrument-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

/* Utility: the voice of the signed record — labels, steps, figures. */
const martianMono = localFont({
  // One file serves both weights, exactly as Google Fonts sends it.
  src: [
    { path: "../fonts/martian-mono/martian-mono-latin-400-500.woff2", weight: "400", style: "normal" },
    { path: "../fonts/martian-mono/martian-mono-latin-400-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-martian-mono",
  display: "swap",
  adjustFontFallback: "Arial",
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
      {/*
        Deliberately thin. The header, footer and skip link live in
        src/app/(site)/layout.tsx so landing pages under (landing) can render
        without them. Everything kept here is needed by both: the document
        shell, fonts, the pre-paint theme script, JSON-LD and the consent
        banner, which has to run wherever analytics might load.
      */}
      <body className="flex min-h-full flex-col">
        {children}
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
