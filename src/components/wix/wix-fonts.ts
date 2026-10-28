import localFont from "next/font/local";

/**
 * The three typefaces the Wix site uses besides Arial, which needs no
 * download. Each sets a CSS variable on the page wrapper in
 * src/app/(site)/layout.tsx, so components pick them up with
 * `font-[family-name:var(--wix-forum)]` and friends.
 *
 * - Forum: the menu tabs and blog text.
 * - Caudex: blog titles and endorser names.
 * - Syncopate: stands in for Lulo Clean, the wide capitals on every button.
 *   Lulo is sold only through Wix, so it cannot be used off Wix; Syncopate
 *   is the closest free match (ruling 2, 2026-10-17).
 *
 * The font files are stored in src/fonts, so the build never downloads them.
 */
export const wixForum = localFont({
  src: "../../fonts/forum/forum-latin-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--wix-forum",
  adjustFontFallback: "Arial",
});

export const wixCaudex = localFont({
  src: [
    { path: "../../fonts/caudex/caudex-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/caudex/caudex-latin-700.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/caudex/caudex-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../fonts/caudex/caudex-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
  display: "swap",
  variable: "--wix-caudex",
  adjustFontFallback: "Times New Roman",
});

export const wixButtonFont = localFont({
  src: "../../fonts/syncopate/syncopate-latin-700.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--wix-lulo",
  adjustFontFallback: "Arial",
});

export const wixFontVariables = `${wixForum.variable} ${wixCaudex.variable} ${wixButtonFont.variable}`;
