import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_URL } from "@/lib/site-config";
import { formatPostDate, getAllPosts, getPost, getRecentPosts } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import {
  AUTHOR_HREF,
  AuthorPhoto,
  BlogColumn,
  BlogNavBar,
  CardFooterRule,
  PostDateAndReadTime,
  StackedAuthorLine,
} from "@/components/blog/blog-ui";
import { ShareBar } from "@/components/blog/share-bar";

/**
 * One blog post, at the same address as on Wix: /post/<address>.
 *
 * The site is built ahead of time into plain files, so every post's page has
 * to be known when building. generateStaticParams lists one page per
 * Markdown file in content/posts, and dynamicParams = false makes any other
 * /post/ address a 404 instead of an attempt to build it on request, which a
 * static host cannot do.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

/**
 * Each post's own title and sharing card. The description is the start of
 * the post, cut at a word near 155 characters, because Wix set no separate
 * description for these posts.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: shortDescription(post.excerpt), path: `/post/${post.slug}` });
}

function shortDescription(text: string): string {
  if (text.length <= 155) return text;
  return `${text.slice(0, 155).replace(/\s+\S*$/, "")}…`;
}

/**
 * Laid out from www.theresewhite.com/post/… as measured on 2026-10-18 at
 * 1,440 pixels wide: a bordered white card, text 740 pixels wide, title in
 * Caudex 40px on 56px lines, body in Forum 18px on 27px lines with one blank
 * line (27px) between paragraphs, sand-colored links and hashtags. Below the
 * card, "Recent Posts" shows the three newest other posts.
 *
 * Left out, because they need Wix's servers: view and comment counts, the
 * like heart, the "more" menu (three dots), and the comments box. The share
 * icons stay, since they are plain links.
 */
export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const recent = getRecentPosts(post.slug);
  const url = `${SITE_URL}/post/${post.slug}/`;

  return (
    <div className="bg-[#f4efeb] pt-5 md:pt-0">
      <BlogColumn>
        <BlogNavBar current={false} phoneLabel="Post" />
        <article className="bg-white px-[18px] pt-[33px] pb-5 text-[#414141] md:mx-5 md:mt-5 md:border md:border-[rgba(232,230,230,0.75)] md:px-[60px] md:pt-[60px] md:pb-[60px] lg:px-[99px]">
          {/* Phone: name above date, as Wix's phone layout shows it. */}
          <div className="md:hidden">
            <StackedAuthorLine post={post} />
          </div>
          {/* Wider screens: one line, "L. Therese White · Sep 7, 2025 · 1 min read". */}
          <div className="hidden items-center gap-3 font-[family-name:var(--wix-forum)] text-[14px] leading-[21px] md:flex">
            <AuthorPhoto />
            <p>
              <Link href={AUTHOR_HREF} className="hover:text-[#d8c7bd]">
                {post.author}
              </Link>
              <span aria-hidden="true" className="mx-[5px]">
                ·
              </span>
              <PostDateAndReadTime post={post} />
            </p>
          </div>

          <h1 className="mt-3 font-[family-name:var(--wix-caudex)] text-[26px] leading-[36.4px] font-normal md:mt-[18px] md:text-[40px] md:leading-[56px]">
            {post.title}
          </h1>
          {post.updated ? (
            <p className="mt-3 font-[family-name:var(--wix-forum)] text-[14px] leading-[21px] md:mt-[18px]">
              Updated: <time dateTime={post.updated}>{formatPostDate(post.updated, { dropCurrentYear: true })}</time>
            </p>
          ) : null}

          <div
            className="mt-5 font-[family-name:var(--wix-forum)] text-[16px] leading-[24px] break-words md:text-[18px] md:leading-[27px] [&_.wix-hashtag]:font-bold [&_.wix-hashtag]:text-[#d8c7bd] [&_a]:text-[#d8c7bd] [&_a:hover]:underline [&_li]:pl-[9px] [&_strong]:font-bold [&_ul]:ml-[27px] [&_ul]:list-disc [&>*+*]:mt-6 md:[&>*+*]:mt-[27px]"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />

          <div className="mt-[47px] border-y border-[rgba(65,65,65,0.2)] md:mt-[101px]">
            <ShareBar url={url} title={post.title} />
          </div>
        </article>

        <section aria-labelledby="recent-posts" className="mt-[30px] px-[18px] md:px-5">
          <div className="flex items-baseline justify-between">
            <h2 id="recent-posts" className="font-[family-name:var(--wix-forum)] text-[18px] leading-[27px] font-normal text-[#414141]">
              Recent Posts
            </h2>
            <Link href="/blog" className="font-[family-name:var(--wix-forum)] text-[15px] leading-[21px] text-[#414141] hover:text-[#d8c7bd] md:text-[14px]">
              See All
            </Link>
          </div>
          {/* Phone: Wix shows these as a swipeable row; this scrolls sideways
              inside its own strip, never the page. */}
          <ul className="m-0 mt-5 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto p-0 pb-2 md:grid md:snap-none md:grid-cols-3 md:gap-[33px] md:overflow-visible md:pb-0">
            {recent.map((p) => (
              <li key={p.slug} className="w-[85%] shrink-0 snap-start md:w-auto">
                <article className="relative flex h-full flex-col border border-[rgba(232,230,230,0.75)] bg-white p-[25px] text-[#414141] md:min-h-[314px]">
                  <h3 className="line-clamp-2 font-[family-name:var(--wix-caudex)] text-[18px] leading-[23px] font-normal">
                    <Link href={`/post/${p.slug}`} className="after:absolute after:inset-0 hover:text-[#d8c7bd]">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-4 line-clamp-4 font-[family-name:var(--wix-forum)] text-[16px] leading-[24px]">{p.excerpt}</p>
                  <CardFooterRule />
                </article>
              </li>
            ))}
          </ul>
        </section>
      </BlogColumn>
    </div>
  );
}
