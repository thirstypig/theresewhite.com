import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { SideBySide } from "./side-by-side";
import { audience, reasoning } from "./compare-content";
import s from "./compare.module.css";

/**
 * Three versions of the homepage side by side, at /stylebible/compare/:
 * Wix today, the recommended design with the Wix words, and the recommended
 * design with proposed new words. Above them, who the homepage is for and
 * the reasoning behind columns two and three; that text lives in
 * compare-content.ts.
 *
 * Unlinked and noindex, like the rest of /stylebible. Linked from the style
 * bible's "Side by side" chapter.
 */
export const metadata: Metadata = pageMetadata({
  title: "Homepage Side by Side",
  description:
    "The live Wix homepage next to two redesigns: the same words in the recommended design, and proposed new words in a modern layout.",
  path: "/stylebible/compare",
  noindex: true,
});

function SourceTag({ source }: { source: "site" | "judgment" }) {
  return source === "site" ? (
    <span className={`${s.tag} ${s.site}`}>From her site</span>
  ) : (
    <span className={`${s.tag} ${s.judgment}`}>Our judgment</span>
  );
}

function Reasons({ r }: { r: (typeof reasoning)[keyof typeof reasoning] }) {
  return (
    <section className={s.reasonPanel}>
      <h2 className={s.h2}>{r.title}</h2>
      <p className={s.lede}>{r.intro}</p>
      <ol className={s.reasonList}>
        {r.items.map((item) => (
          <li key={item.lead}>
            <span className={s.reasonLead}>{item.lead}</span>
            <span>{item.body}</span>
            <span className={s.finding}>{item.finding}</span>
          </li>
        ))}
      </ol>
      <p className={s.limit}>{r.limit}</p>
    </section>
  );
}

export default function ComparePage() {
  return (
    <div className={`lp-lock ${s.page}`}>
      <div className={s.wrap}>
        <div className={s.intro}>
          <a href="/stylebible/" className={s.link} style={{ fontSize: 15 }}>
            ← Style bible
          </a>
          <h1 className={s.h1}>Homepage, three ways</h1>
          <p className={s.lede}>
            Column 1 is the homepage on Wix today. Column 2 keeps every Wix word, in the same order, and changes only the
            design. Column 3 changes both the words and the layout. Comparing 1 with 2 shows what design alone does;
            comparing 2 with 3 shows what new words add.
          </p>
          <p style={{ fontSize: 15 }}>
            <a className={s.link} href="#columns">Jump to the three columns</a>
            {"  ·  "}
            Open full size: <a className={s.link} href="/stylebible/home/">column 2</a>
            {"  ·  "}
            <a className={s.link} href="/stylebible/home-new/">column 3</a>
            {"  ·  "}
            <a className={s.link} href="https://www.theresewhite.com">the live Wix site</a>
          </p>
        </div>

        <section className={s.panel} aria-labelledby="audience">
          <h2 id="audience" className={s.h2}>
            {audience.title}
          </h2>
          <p className={s.lede} style={{ maxWidth: 820 }}>
            {audience.intro}
          </p>
          <p className={s.legend}>
            <SourceTag source="site" /> stated or directly implied by her own Wix pages
            <SourceTag source="judgment" /> our design opinion, not tested on her visitors
          </p>
          <div className={s.groups}>
            {audience.groups.map((g) => (
              <div key={g.label} className={s.group}>
                <h3 className={s.groupLabel}>{g.label}</h3>
                <ul className={s.list}>
                  {g.items.map((item) => (
                    <li key={item.text}>
                      <span>{item.text}</span>
                      <SourceTag source={item.source} />
                      {item.note && <span className={s.note}>{item.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className={s.reasons}>
          <Reasons r={reasoning.same} />
          <Reasons r={reasoning.new} />
        </div>

        <SideBySide />
      </div>
    </div>
  );
}
