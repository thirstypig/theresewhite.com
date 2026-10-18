import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";
import { getAllPosts } from "@/lib/blog";
import { BlogColumn, BlogNavBar, CardFooterRule, StackedAuthorLine } from "@/components/blog/blog-ui";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Triple Take Tuesdays: short takes from employment mediator L. Therese White on workplace conflict, HR myths and what actually works.",
  path: "/blog",
});

/**
 * The blog page, a copy of www.theresewhite.com/blog as of 2026-10-18.
 *
 * Every post is a card: author photo and name, date and read time, the title
 * in italic Caudex, and the first three lines of the post. Wix's cards are a
 * fixed 341 pixels tall with the text at the top; `min-h` keeps that shape
 * while letting a card grow if a long title wraps on a narrower screen.
 *
 * Left out, because they need Wix's servers: the view and comment counts,
 * the like heart, the "more" menu (three dots) on each card, and the search
 * box. The whole card is clickable, as on Wix.
 */
export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <BlogColumn>
      <BlogNavBar current phoneLabel="Blog" asHeading />
      <ul className="m-0 flex list-none flex-col p-0 md:mt-5 md:gap-[33px] md:px-5">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="relative flex flex-col border-b border-[rgba(65,65,65,0.2)] bg-white px-[18px] pt-[30px] pb-[30px] text-[#414141] md:min-h-[341px] md:border md:border-[rgba(232,230,230,0.75)] md:px-9 md:pt-[25px] md:pb-[25px]">
              <StackedAuthorLine post={post} />
              <h2 className="mt-[14px] font-[family-name:var(--wix-caudex)] text-[22px] leading-[30.8px] font-normal italic md:text-[28px] md:leading-[36px]">
                <Link href={`/post/${post.slug}`} className="after:absolute after:inset-0 hover:text-[#d8c7bd]">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 line-clamp-3 font-[family-name:var(--wix-forum)] text-[15px] leading-[22.5px] md:text-[16px] md:leading-[24px]">
                {post.excerpt}
              </p>
              <CardFooterRule />
            </article>
          </li>
        ))}
      </ul>
    </BlogColumn>
  );
}
