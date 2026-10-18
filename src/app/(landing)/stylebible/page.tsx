import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pageMetadata } from "@/lib/page-metadata";

/**
 * The style bible, at /stylebible: the live Wix site measured page by page,
 * the red-team review, and the recommended system for phase two.
 *
 * Unlinked on purpose. Nothing on the site points here, it is left out of the
 * sitemap, and it is noindex, so only people who are given the address find
 * it. It is for James, Therese and Bill, not for visitors. Remove it, or move
 * it behind /admin, before the site moves to theresewhite.com: it criticises
 * the current design in plain terms.
 *
 * There is one source, `docs/style-bible/index.html`, which is also what gets
 * published as the private Claude artifact. This page reads that file when
 * the site is built, so the two never drift apart. Its images live in
 * `public/stylebible/img/`.
 *
 * The file is a self-contained page with its own styles. `lp-lock` pins the
 * light palette, as on the landing pages, so the site's dark mode cannot
 * repaint it.
 */
export const metadata: Metadata = pageMetadata({
  title: "Style Bible",
  description:
    "The theresewhite.com design, measured from the live Wix site, with a red-team review and a simplified system for phase two.",
  path: "/stylebible",
  noindex: true,
});

function styleBibleHtml(): string {
  const source = readFileSync(
    join(process.cwd(), "docs/style-bible/index.html"),
    "utf8",
  );

  return (
    source
      // The site's own layout already supplies these.
      .replace(/<meta charset[^>]*>\s*/i, "")
      .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
      .replace(/<meta name="claude:[^>]*>\s*/i, "")
      // The landing layout already wraps the page in <main>.
      .replace(/<main>/i, "<div>")
      .replace(/<\/main>/i, "</div>")
      // The file refers to its images as img/…, relative to itself.
      .replaceAll('src="img/', 'src="/stylebible/img/')
  );
}

export default function StyleBiblePage() {
  return (
    <div
      className="lp-lock"
      dangerouslySetInnerHTML={{ __html: styleBibleHtml() }}
    />
  );
}
