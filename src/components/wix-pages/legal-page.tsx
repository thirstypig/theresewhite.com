import { Fragment } from "react";
import type { LegalBlock, LegalInline, LegalPage } from "@/content/wix/legal";

/**
 * The one plain template the four Wix legal pages share: warm gray page
 * (#E8E6E6), charcoal Arial text, 18px headings, and no closing band.
 *
 * Sizes match Wix on desktop: 12px text on 16.8px lines, headings 18px.
 * On phones the text is 15px, because ruling 7 (2026-10-17) sets no reading
 * text below 15px there; headings go to 20px so they stay above the text.
 *
 * Blank lines between paragraphs are a margin of 1.4 times the text size,
 * the same as one empty line on Wix, so they grow with the phone text.
 *
 * `afterBlock` lets a page put something of its own after one block. The
 * Cookie Preferences page uses it for the button that reopens this site's
 * cookie banner.
 */
export function WixLegalPage({
  page,
  afterBlock,
}: {
  page: LegalPage;
  afterBlock?: { index: number; node: React.ReactNode };
}) {
  const headingGap = page.headingStyle === "caps" ? "mt-[1.4em]" : "mt-[1em]";

  return (
    <div className="bg-[#e8e6e6] text-[#414141]">
      <div className="mx-auto max-w-[980px] px-5 pt-8 pb-8 text-[15px] leading-[1.4] md:px-6 xl:px-0 md:pt-[55px] md:pb-[31px] md:text-[12px]">
        <div style={{ maxWidth: page.textWidth }}>
          <h1 className="text-[20px] leading-[1.4] md:text-[18px]">{page.title}</h1>
          {page.dates.map((line) => (
            <p key={line}>{line}</p>
          ))}

          {page.blocks.map((block, i) => {
            const previous = page.blocks[i - 1];
            const node = (
              <LegalBlockView
                block={block}
                afterHeading={previous?.kind === "heading"}
                headingClass={
                  block.kind === "heading"
                    ? `${block.minor ? "mt-[1em]" : headingGap} text-[20px] leading-[1.4] md:text-[18px] ${
                        page.headingStyle === "italic" ? "italic" : ""
                      }`
                    : ""
                }
              />
            );
            return (
              <Fragment key={i}>
                {node}
                {afterBlock?.index === i ? afterBlock.node : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LegalBlockView({
  block,
  afterHeading,
  headingClass,
}: {
  block: LegalBlock;
  afterHeading: boolean;
  headingClass: string;
}) {
  if (block.kind === "heading") {
    return block.minor ? (
      <h3 className={headingClass}>{block.text}</h3>
    ) : (
      <h2 className={headingClass}>{block.text}</h2>
    );
  }

  if (block.kind === "ul") {
    const gap = block.spaced && !afterHeading ? "mt-[1.4em]" : "";
    return (
      <ul className={`${gap} ml-[6px] list-disc pl-[16px] md:leading-[18px]`}>
        {block.items.map((item, i) => (
          <li key={i}>
            <Inline content={item} />
          </li>
        ))}
      </ul>
    );
  }

  const gap = block.tight || afterHeading ? "" : "mt-[1.4em]";
  return (
    <p className={`${gap} whitespace-pre-line ${block.italic ? "italic" : ""}`}>
      <Inline content={block.content} />
    </p>
  );
}

const EMAIL = "Therese@ThereseWhite.com";

/** Renders a paragraph's text, turning every copy of her email address into a link. */
function Inline({ content }: { content: LegalInline[] }) {
  return (
    <>
      {content.map((part, i) => {
        if (typeof part === "string") {
          const pieces = part.split(EMAIL);
          return (
            <Fragment key={i}>
              {pieces.map((piece, j) => (
                <Fragment key={j}>
                  {piece}
                  {j < pieces.length - 1 ? (
                    <a href={`mailto:${EMAIL}`} className="underline">
                      {EMAIL}
                    </a>
                  ) : null}
                </Fragment>
              ))}
            </Fragment>
          );
        }
        if (part.href) {
          return (
            <a
              key={i}
              href={part.href}
              target="_blank"
              rel="noopener"
              className={part.plain ? "hover:underline" : "underline"}
            >
              {part.text}
            </a>
          );
        }
        return (
          <span key={i} className={part.underline ? "underline" : undefined}>
            {part.text}
          </span>
        );
      })}
    </>
  );
}
