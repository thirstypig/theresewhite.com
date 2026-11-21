"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { columns, type ColumnKey } from "./compare-content";

/**
 * Shows three versions of the homepage next to each other, at the same
 * scale, so they can be compared section by section:
 *
 *  1. Wix today: a full-page screenshot taken on 2026-11-20.
 *  2. /stylebible/home/: the Wix words in the recommended design.
 *  3. /stylebible/home-new/: new words and a new layout.
 *
 * Each version is drawn at a real screen width (1,440 pixels for desktop,
 * 390 for a phone) and then shrunk to fit its column. Without that, a sample
 * squeezed into a third of the screen would show its phone layout, which is
 * not a fair comparison.
 *
 * Below 1,000 pixels wide, three columns are too narrow to read, so the page
 * shows one column at a time with buttons to switch between them.
 */

const VIEWS = {
  desktop: { width: 1440, wixSrc: "/stylebible/img/wix-home-desktop.jpg", label: "Desktop, 1,440 pixels wide" },
  phone: { width: 390, wixSrc: "/stylebible/img/wix-home-mobile.jpg", label: "Phone, 390 pixels wide" },
} as const;

type View = keyof typeof VIEWS;

const SAMPLE_SRC: Record<Exclude<ColumnKey, "wix">, string> = {
  same: "/stylebible/home/",
  new: "/stylebible/home-new/",
};

const GAP = 20;
const NARROW = "(max-width: 999px)";

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return narrow;
}

function Sample({ src, view, shown, title }: { src: string; view: View; shown: number; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(2000);
  const { width } = VIEWS[view];
  const scale = shown ? shown / width : 0;

  // The frame is as tall as the page inside it, so the outer page scrolls
  // every column together.
  const measure = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (doc) setHeight(doc.documentElement.scrollHeight);
  }, []);

  // The sample is a locked page (see ../layout.tsx). When it finishes
  // loading it is still showing the empty password screen; its real content
  // is drawn a moment later, once it sees this tab is unlocked, and its
  // pictures arrive after that. So one measurement at load is too early, and
  // the frame would cut the page off. Instead, measure again every time the
  // page inside changes height.
  const watcher = useRef<ResizeObserver | null>(null);
  const onLoad = useCallback(() => {
    measure();
    watcher.current?.disconnect();
    const inner = frame.current?.contentWindow;
    const body = frame.current?.contentDocument?.body;
    if (!inner || !body) return;
    // Made by the frame's own window, which is the one that lays the page out.
    const observer = new inner.ResizeObserver(measure);
    observer.observe(body);
    watcher.current = observer;
  }, [measure]);
  useEffect(() => () => watcher.current?.disconnect(), []);

  return (
    <div style={{ width: shown || "100%", height: height * scale, overflow: "hidden", border: "1px solid #d8c7bd", background: "#fff" }}>
      <iframe
        ref={frame}
        src={src}
        title={title}
        onLoad={onLoad}
        scrolling="no"
        style={{ width, height, border: 0, transform: `scale(${scale})`, transformOrigin: "0 0", display: "block" }}
      />
    </div>
  );
}

const pill = (active: boolean): React.CSSProperties => ({
  fontSize: 15,
  fontWeight: 600,
  minHeight: 40,
  padding: "6px 16px",
  borderRadius: 100,
  border: "2px solid #1a78c9",
  background: active ? "#1a78c9" : "#fff",
  color: active ? "#fff" : "#145e9e",
  cursor: "pointer",
});

export function SideBySide() {
  // Until someone picks a size, a phone reader sees the phone versions and
  // everyone else sees desktop.
  const [chosen, setView] = useState<View | null>(null);
  const [focus, setFocus] = useState<ColumnKey>("new");
  const narrow = useNarrow();
  const [gridRef, gridWidth] = useWidth<HTMLDivElement>();
  const view: View = chosen ?? (narrow ? "phone" : "desktop");
  const { width, wixSrc, label } = VIEWS[view];

  const visible = narrow ? columns.filter((c) => c.key === focus) : columns;
  const columnWidth = gridWidth ? (gridWidth - GAP * (visible.length - 1)) / visible.length : 0;
  const shown = columnWidth ? Math.min(columnWidth, width) : 0;

  return (
    <div id="columns" style={{ display: "grid", gap: 16, scrollMarginTop: 16 }}>
      <div role="group" aria-label="Screen size" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {(Object.keys(VIEWS) as View[]).map((v) => (
          <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} style={pill(view === v)}>
            {v === "desktop" ? "Desktop" : "Phone"}
          </button>
        ))}
        <span style={{ fontSize: 14, color: "#5f5c5a" }}>{label}. Scroll the page to move down all columns together.</span>
      </div>

      {narrow && (
        <div role="group" aria-label="Which version to show" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {columns.map((c) => (
            <button key={c.key} type="button" aria-pressed={focus === c.key} onClick={() => setFocus(c.key)} style={pill(focus === c.key)}>
              {c.key === "wix" ? "1. Wix today" : c.key === "same" ? "2. Same words" : "3. New words"}
            </button>
          ))}
        </div>
      )}

      <div
        ref={gridRef}
        style={{ display: "grid", gridTemplateColumns: `repeat(${visible.length}, minmax(0,1fr))`, gap: GAP, alignItems: "start" }}
      >
        {visible.map((c) => (
          <div key={c.key} style={{ display: "grid", gap: 8, alignContent: "start", minWidth: 0 }}>
            {/* Fixed height so the three pages start level even when a note wraps. */}
            <div style={{ minHeight: narrow ? undefined : 64 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#000" }}>{c.title}</div>
              <div style={{ fontSize: 14, color: "#5f5c5a" }}>{c.note}</div>
            </div>
            {c.key === "wix" ? (
              /* Plain img: a fixed screenshot shown at a computed width, not a responsive image. */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={wixSrc}
                alt={`The live Wix homepage, full length, ${label}`}
                style={{ width: shown || "100%", height: "auto", display: "block", border: "1px solid #d8c7bd" }}
              />
            ) : (
              /* Keyed by screen size so each size starts from a fresh frame.
                 A frame can grow to fit its page but never shrinks, so reusing
                 the tall phone frame for the shorter desktop page left blank
                 space under it. */
              <Sample key={view} src={SAMPLE_SRC[c.key]} view={view} shown={shown} title={`${c.title}, ${label}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
