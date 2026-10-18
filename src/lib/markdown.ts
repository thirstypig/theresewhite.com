/**
 * Turns a blog post's Markdown into HTML, and its front matter into fields.
 *
 * Why this is written here instead of installing a Markdown library: the ten
 * posts copied from Wix use only five things — paragraphs, line breaks
 * inside a paragraph, bold, italic, bulleted lists and links. Covering just
 * those takes about a hundred lines, adds nothing to install or keep
 * patched, and is tested in markdown.test.ts. If a future post needs more
 * (headings, images, quotes), switching to the `marked` package is the
 * simpler move than growing this file.
 *
 * The files are ordinary Markdown, so TinaCMS, which the blog is planned to
 * move to, reads and writes them as they are.
 *
 * Safety: every piece of text is HTML-escaped before any tag is added, and
 * links only allow http, https, mailto, tel and site-relative addresses, so
 * a post cannot inject markup or scripts into the page.
 */

/** Front matter values: the posts use only strings and whole numbers. */
export type FrontMatter = Record<string, string | number>;

/**
 * Splits a file into its front matter and its body.
 *
 * Front matter is the block between the two `---` lines at the top. Each line
 * is `key: value`, where the value is a number or a double-quoted string
 * (JSON quoting, which is also valid YAML, so TinaCMS can read it). This
 * deliberately accepts nothing fancier; a line it does not understand stops
 * the build rather than being silently dropped.
 */
export function parseFrontMatter(file: string): { data: FrontMatter; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(file.replace(/\r\n/g, "\n"));
  if (!match) throw new Error("Post file has no front matter block between --- lines.");
  const data: FrontMatter = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const kv = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`Front matter line not understood: ${line}`);
    const [, key, raw] = kv;
    if (/^-?\d+$/.test(raw)) data[key] = Number(raw);
    else if (raw.startsWith('"')) data[key] = JSON.parse(raw) as string;
    else data[key] = raw;
  }
  return { data, body: match[2] };
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Only these kinds of address become links; anything else stays plain text. */
function safeHref(href: string): string | null {
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(href) ? href : null;
}

/**
 * Bold, italic, links, hashtags and in-paragraph line breaks.
 *
 * Hashtags: Wix turns any `#` followed by a word into a hashtag, colored
 * sand (#D8C7BD) and bold-weighted, linking to a Wix page listing posts with
 * that tag. Those listing pages cannot exist on a static site, so the tag
 * keeps its color here but is not a link. Every post has three: the #1, #2
 * and #3 in "TAKE #1".
 */
export function renderInline(markdown: string): string {
  let html = escapeHtml(markdown);

  // Links: [text](address). Square brackets with no (address) after them,
  // such as "[Link: .XXX/TripleTakeTuesdays/Date]", stay as typed.
  html = html.replace(/\[([^[\]]+)\]\(([^)\s]+)\)/g, (whole, text: string, href: string) => {
    const safe = safeHref(href.replace(/&amp;/g, "&"));
    if (!safe) return whole;
    const external = /^https?:\/\//i.test(safe);
    return `<a href="${escapeHtml(safe)}"${external ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  });

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/(^|[\s(>])#(\d+)\b/g, '$1<span class="wix-hashtag">#$2</span>');

  // A backslash at the end of a line is Markdown's line break within a
  // paragraph. Wix posts use it for the signature block.
  html = html.replace(/\\\n/g, "<br>\n");
  return html;
}

/**
 * The whole body: blocks separated by a blank line. A block whose lines all
 * start with "- " (or "1. ") is a list; anything else is a paragraph.
 */
export function renderMarkdown(markdown: string): string {
  const blocks = markdown
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/);

  return blocks
    .map((block) => {
      const lines = block.split("\n");
      if (lines.every((l) => /^- /.test(l))) {
        return `<ul>${lines.map((l) => `<li>${renderInline(l.slice(2))}</li>`).join("")}</ul>`;
      }
      if (lines.every((l) => /^\d+\. /.test(l))) {
        return `<ol>${lines.map((l) => `<li>${renderInline(l.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
      }
      return `<p>${renderInline(block)}</p>`;
    })
    .join("\n");
}

/** The body as plain text, for checks that compare wording with Wix. */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^[\]]+)\]\(([^)\s]+)\)/g, "$1")
    .replace(/\*+/g, "")
    .replace(/\\\n/g, "\n")
    .replace(/^- /gm, "");
}
