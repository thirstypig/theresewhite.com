import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog";

/**
 * The pieces the blog page and the post pages share, copied from the Wix
 * blog as measured on 2026-10-18.
 *
 * Wix draws the blog as a 980-pixel white column on the cream page color
 * (#F4EFEB), with posts in thin-bordered white cards. Text is Forum, titles
 * are Caudex, and the gray is the site's charcoal (#414141).
 *
 * On a phone Wix serves a different layout: no cream sides, a sand bar
 * (#D8C7BD) under the header naming the page ("Blog" or "Post"), and no card
 * borders. The `md:` classes switch between the two at 768 pixels wide.
 */

/** The author photo Wix shows beside her name, 32 pixels round. */
export const authorPhoto = {
  src: "/wix/blog/therese-white-author-photo.webp",
  width: 206,
  height: 220,
  alt: "L. Therese White, smiling, in a white jacket and glasses",
};

/**
 * Wix links the author's name and photo to her Wix member profile, which
 * cannot exist off Wix. Here they go to her About page instead.
 */
export const AUTHOR_HREF = "/about-therese";

export function AuthorPhoto() {
  return (
    <Link href={AUTHOR_HREF} className="relative z-10 block size-8 shrink-0 overflow-hidden rounded-full">
      <Image
        src={authorPhoto.src}
        width={authorPhoto.width}
        height={authorPhoto.height}
        alt={authorPhoto.alt}
        className="size-8 object-cover"
      />
    </Link>
  );
}

/** The white column on the cream page, which runs from header to footer. */
export function BlogColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white md:bg-[#f4efeb]">
      <div className="mx-auto max-w-[980px] bg-white pb-[21px] md:pb-[45px]">{children}</div>
    </div>
  );
}

/**
 * The blog's own menu line at the top of the column. Wix shows the one
 * category, "Therese's Triple Newsletter Archive", which goes back to the
 * blog page; it is sand-colored when you are on the blog page itself.
 *
 * On a phone Wix replaces it with a sand bar reading "Blog" or "Post".
 * `asHeading` makes the line the page's one main heading on the blog page,
 * which has no other title.
 */
export function BlogNavBar({ current, phoneLabel, asHeading = false }: { current: boolean; phoneLabel: string; asHeading?: boolean }) {
  const Wrapper = asHeading ? "h1" : "div";
  return (
    <>
      <Wrapper className="m-0 font-normal">
        <span className="hidden h-20 items-center px-5 md:flex">
          <Link
            href="/blog"
            aria-current={current ? "page" : undefined}
            className={`font-[family-name:var(--wix-forum)] text-[14px] leading-[19.6px] ${current ? "text-[#d8c7bd]" : "text-[#414141] hover:text-[#d8c7bd]"}`}
          >
            Therese&apos;s Triple Newsletter Archive
          </Link>
        </span>
        <span className="flex h-[50px] items-center bg-[#d8c7bd] px-[18px] font-[family-name:var(--wix-forum)] text-[15px] text-white md:hidden">
          {phoneLabel}
        </span>
      </Wrapper>
    </>
  );
}

/** "Sep 7, 2025 · 1 min read" */
export function PostDateAndReadTime({ post }: { post: Post }) {
  return (
    <>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span aria-hidden="true" className="mx-[7px]">
        ·
      </span>
      <span>{post.readTimeMinutes} min read</span>
    </>
  );
}

/**
 * The author line as the blog page and phone post pages draw it: photo, then
 * her name above the date and read time, all 12px.
 */
export function StackedAuthorLine({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-[10px] font-[family-name:var(--wix-forum)] text-[12px] leading-[16px] text-[#414141]">
      <AuthorPhoto />
      <div>
        <Link href={AUTHOR_HREF} className="relative z-10 hover:text-[#d8c7bd]">
          {post.author}
        </Link>
        <div>
          <PostDateAndReadTime post={post} />
        </div>
      </div>
    </div>
  );
}

/**
 * A thin rule where Wix shows a post's view count, comment count and like
 * heart. Those need Wix's servers, so they are left out; the rule stays so
 * the card keeps its Wix shape.
 */
export function CardFooterRule() {
  return <div aria-hidden="true" className="mt-auto hidden h-[34px] border-t border-[rgba(65,65,65,0.2)] md:block" />;
}
