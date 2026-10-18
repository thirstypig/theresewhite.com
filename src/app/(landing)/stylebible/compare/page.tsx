import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { SideBySide } from "./side-by-side";

/**
 * The Wix homepage next to the redesigned sample, at /stylebible/compare/.
 *
 * Unlinked and noindex, like the rest of /stylebible. Linked from the style
 * bible's "Side by side" chapter.
 */
export const metadata: Metadata = pageMetadata({
  title: "Homepage Side by Side",
  description:
    "The live Wix homepage next to the same page in the style bible's recommended design. Same words, same order.",
  path: "/stylebible/compare",
  noindex: true,
});

export default function ComparePage() {
  return (
    <div className="lp-lock" style={{ background: "#fff", color: "#414141", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ maxWidth: 1600, margin: "0 auto", paddingBlock: 32, paddingInline: "max(16px, env(safe-area-inset-left, 0px))", display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <a href="/stylebible/" style={{ fontSize: 15, color: "#1a78c9" }}>
            ← Style bible
          </a>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15, color: "#000", fontWeight: 700 }}>Homepage, side by side</h1>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5 }}>
            On the left is the homepage as it is on Wix today. On the right is the same page in the style bible&apos;s
            recommended design: six colors, six text sizes and one button style. Every word and every section is in the
            same order as on Wix, including &ldquo;Click Here.&rdquo; Changes to the words are a separate, later step.
          </p>
          <p style={{ margin: 0, fontSize: 15 }}>
            <a href="/stylebible/home/" style={{ color: "#1a78c9" }}>
              Open the recommended design full size
            </a>
            {"  ·  "}
            <a href="https://www.theresewhite.com" style={{ color: "#1a78c9" }}>
              Open the live Wix site
            </a>
          </p>
        </div>
        <SideBySide />
      </div>
    </div>
  );
}
