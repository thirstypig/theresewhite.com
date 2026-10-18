import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseFrontMatter } from "@/lib/markdown";

/**
 * The blog posts, read from `content/posts/<address>.md` when the site is
 * built. One Markdown file per post, named after its web address, so
 * `content/posts/this-termination-documentation-mistake-cost-2-3-million.md`
 * becomes /post/this-termination-documentation-mistake-cost-2-3-million.
 *
 * The files live at the top of the repository rather than under src/
 * because that is where TinaCMS, the planned editor for the blog, expects
 * content it edits. Adding a post is adding a file; nothing else needs to
 * change, because both the blog page and the post pages list whatever is in
 * the folder.
 *
 * This runs only during the build (the site is static), so it reads the
 * disk directly.
 */

export const POSTS_DIR = join(process.cwd(), "content", "posts");

export type Post = {
  /** The web address after /post/, taken from the file name. */
  slug: string;
  title: string;
  /** First published, as an ISO date and time. Wix shows it as "Sep 7, 2025". */
  date: string;
  /**
   * Last edited, when Wix shows an "Updated:" line under the title. Nine of
   * the ten posts have one; the termination post does not.
   */
  updated?: string;
  author: string;
  readTimeMinutes: number;
  /**
   * The text shown on the blog page under the title. Wix generates it from
   * the start of the post and cuts it at about 500 characters; it is copied
   * here as Wix had it. The page shows only the first three lines.
   */
  excerpt: string;
  /** The post's address on the Wix site, kept for the record. */
  wixUrl: string;
  /**
   * A cover picture. None of the ten Wix posts has one, so none of the
   * files set it; the field exists so a future post can.
   */
  coverImage?: string;
  /** The post body, in Markdown. */
  body: string;
};

function required(data: Record<string, string | number>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value) throw new Error(`${file}: front matter is missing "${key}".`);
  return value;
}

function readPost(file: string): Post {
  const { data, body } = parseFrontMatter(readFileSync(join(POSTS_DIR, file), "utf8"));
  const readTime = data.readTimeMinutes;
  if (typeof readTime !== "number") throw new Error(`${file}: front matter is missing "readTimeMinutes".`);
  return {
    slug: file.replace(/\.md$/, ""),
    title: required(data, "title", file),
    date: required(data, "date", file),
    updated: typeof data.updated === "string" ? data.updated : undefined,
    author: required(data, "author", file),
    readTimeMinutes: readTime,
    excerpt: required(data, "excerpt", file),
    wixUrl: required(data, "wixUrl", file),
    coverImage: typeof data.coverImage === "string" && data.coverImage ? data.coverImage : undefined,
    body,
  };
}

/** Every post, newest first, which is the order Wix lists them in. */
export function getAllPosts(): Post[] {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/**
 * The three posts in the "Recent Posts" row under a post: the newest three
 * other than the one being read, as on Wix.
 */
export function getRecentPosts(slug: string, count = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, count);
}

/**
 * Dates as Wix writes them, in Pacific time, where Therese works:
 * "Sep 7, 2025". The "Updated:" line drops the year when it is the current
 * year ("Aug 26"), which is what Wix showed in 2026.
 */
export function formatPostDate(iso: string, { dropCurrentYear = false } = {}): string {
  const d = new Date(iso);
  const zone = "America/Los_Angeles";
  const year = new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric" }).format(d);
  const thisYear = new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric" }).format(new Date());
  const withYear = !(dropCurrentYear && year === thisYear);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  }).format(d);
}
