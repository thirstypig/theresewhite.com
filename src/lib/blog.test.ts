import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { formatPostDate, getAllPosts, getRecentPosts } from "@/lib/blog";
import { markdownToPlainText, renderInline, renderMarkdown } from "@/lib/markdown";

/**
 * The blog was copied from Wix word for word (James's ruling of
 * 2026-10-18). These checks catch the two ways that copy can quietly go
 * wrong: a post's wording drifting from what Wix shows, and a post missing
 * or out of order.
 */

const WIX_SLUGS = [
  "triple-take-tuesdays-why-conflict-resolution-training-fails-and-what-actually-works",
  "triple-take-tuesdays-your-culture-survey-results-are-worthless-here-s-what-works",
  "triple-take-tuesdays-stop-asking-why-employees-quit-do-this-instead",
  "triple-take-tuesdays-progressive-discipline-the-ripple-effects",
  "triple-take-tuesdays-the-500k-lawsuit-that-neutral-hr-could-have-prevented",
  "triple-take-tuesdays-nobody-uses-your-open-door-policy-here-s-why",
  "triple-take-tuesdays-why-your-best-employee-just-quit-and-maybe-it-s-your-fault",
  "triple-take-tuesdays-the-assumption-that-protects-workplace-predators",
  "this-termination-documentation-mistake-cost-2-3-million",
  "triple-take-tuesdays-why-a-15-000-team-retreat-failed-miserably",
];

/** Spaces, non-breaking spaces and line breaks all count as one space. */
const squash = (s: string) => s.replace(/[\s ]+/g, " ").trim();

describe("blog posts", () => {
  it("has the ten Wix posts, in Wix's order", () => {
    expect(getAllPosts().map((p) => p.slug)).toEqual(WIX_SLUGS);
  });

  it("matches the wording captured from Wix on 2026-10-18", () => {
    for (const post of getAllPosts()) {
      const capture = JSON.parse(
        readFileSync(join(process.cwd(), "docs", "wix-capture", `${post.slug}.json`), "utf8"),
      ) as { text: string };
      // On Wix the post body sits between the read time (or the "Updated:"
      // line) and the "Recent Posts" heading.
      const start = capture.text.indexOf(post.updated ? "Updated:" : "1 min read");
      const afterLine = capture.text.indexOf("\n", start);
      const end = capture.text.indexOf("Recent Posts");
      const wix = squash(capture.text.slice(afterLine, end));
      expect(squash(markdownToPlainText(post.body)), post.slug).toBe(wix);
    }
  });

  it("titles and excerpts match the Wix blog page", () => {
    const blog = JSON.parse(readFileSync(join(process.cwd(), "docs", "wix-capture", "blog.json"), "utf8")) as {
      text: string;
    };
    for (const post of getAllPosts()) {
      expect(blog.text, post.slug).toContain(`${post.title}\n${post.excerpt}\n`);
    }
  });

  it("shows dates as Wix does", () => {
    const post = getAllPosts()[0];
    expect(formatPostDate(post.date)).toBe("Sep 7, 2025");
  });

  it("recent posts are the three newest others", () => {
    expect(getRecentPosts(WIX_SLUGS[0]).map((p) => p.slug)).toEqual(WIX_SLUGS.slice(1, 4));
    expect(getRecentPosts(WIX_SLUGS[9]).map((p) => p.slug)).toEqual(WIX_SLUGS.slice(0, 3));
  });
});

describe("Markdown renderer", () => {
  it("handles bold, italic, bold italic and hashtags", () => {
    expect(renderInline("**TAKE #1 -- MYTH:** assume ***first*** and *why*")).toBe(
      '<strong>TAKE <span class="wix-hashtag">#1</span> -- MYTH:</strong> assume <strong><em>first</em></strong> and <em>why</em>',
    );
  });

  it("links real addresses but leaves bare brackets alone", () => {
    expect(renderInline("[Link: .XXX/Date] [site](http://ThereseWhite.com)")).toBe(
      '[Link: .XXX/Date] <a href="http://ThereseWhite.com" target="_blank" rel="noopener">site</a>',
    );
  });

  it("refuses script links and escapes markup", () => {
    expect(renderInline("[x](javascript:alert(1)) <b>")).toBe("[x](javascript:alert(1)) &lt;b&gt;");
  });

  it("builds paragraphs, line breaks and lists", () => {
    expect(renderMarkdown("One\\\nTwo\n\n- a\n- b")).toBe("<p>One<br>\nTwo</p>\n<ul><li>a</li><li>b</li></ul>");
  });
});
