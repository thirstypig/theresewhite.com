import { Caudex, Forum, Syncopate } from "next/font/google";

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
 */
export const wixForum = Forum({ weight: "400", subsets: ["latin"], display: "swap", variable: "--wix-forum" });

export const wixCaudex = Caudex({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--wix-caudex",
});

export const wixButtonFont = Syncopate({ weight: "700", subsets: ["latin"], display: "swap", variable: "--wix-lulo" });

export const wixFontVariables = `${wixForum.variable} ${wixCaudex.variable} ${wixButtonFont.variable}`;
