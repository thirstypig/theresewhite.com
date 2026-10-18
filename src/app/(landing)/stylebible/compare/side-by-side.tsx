"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shows the Wix homepage and the redesigned sample next to each other, at
 * the same scale, so they can be compared section by section.
 *
 * Each side is drawn at a real screen width (1,440 pixels for desktop, 390
 * for a phone) and then shrunk to fit its column. Without that, the sample
 * would be squeezed into half a screen and show its tablet layout, which is
 * not a fair comparison. The Wix side is a full-page screenshot taken on
 * 2026-10-16; the sample side is the live page at /stylebible/home/,
 * loaded in a frame.
 */

const VIEWS = {
  desktop: { width: 1440, wixSrc: "/stylebible/img/wix-home-desktop.jpg", label: "Desktop, 1,440 pixels wide" },
  phone: { width: 390, wixSrc: "/stylebible/img/wix-home-mobile.jpg", label: "Phone, 390 pixels wide" },
} as const;

type View = keyof typeof VIEWS;

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

function Pane({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 8, alignContent: "start", minWidth: 0 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#000" }}>{title}</div>
        <div style={{ fontSize: 14, color: "#5f5c5a" }}>{note}</div>
      </div>
      {children}
    </div>
  );
}

function Sample({ view, paneWidth }: { view: View; paneWidth: number }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(2000);
  const { width } = VIEWS[view];
  const scale = paneWidth ? Math.min(1, paneWidth / width) : 0;

  // The frame is as tall as the page inside it, so the outer page scrolls
  // both sides together. Fonts and images settle after load, so measure a
  // few more times.
  const measure = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (doc) setHeight(doc.documentElement.scrollHeight);
  }, []);
  const onLoad = useCallback(() => {
    measure();
    [300, 1000, 2500].forEach((ms) => setTimeout(measure, ms));
  }, [measure]);

  return (
    <div style={{ height: height * scale, overflow: "hidden", border: "1px solid #d8c7bd", background: "#fff" }}>
      <iframe
        ref={frame}
        key={view}
        src="/stylebible/home/"
        title={`Redesigned homepage sample, ${VIEWS[view].label}`}
        onLoad={onLoad}
        scrolling="no"
        style={{ width, height, border: 0, transform: `scale(${scale})`, transformOrigin: "0 0", display: "block" }}
      />
    </div>
  );
}

export function SideBySide() {
  const [view, setView] = useState<View>("desktop");
  const [paneRef, paneWidth] = useWidth<HTMLDivElement>();
  const { width, wixSrc, label } = VIEWS[view];
  const shown = paneWidth ? Math.min(paneWidth, width) : 0;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div role="group" aria-label="Screen size" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(Object.keys(VIEWS) as View[]).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            style={{
              fontSize: 15,
              fontWeight: 600,
              padding: "8px 18px",
              borderRadius: 100,
              border: "2px solid #1a78c9",
              background: view === v ? "#1a78c9" : "#fff",
              color: view === v ? "#fff" : "#1a78c9",
              cursor: "pointer",
            }}
          >
            {v === "desktop" ? "Desktop" : "Phone"}
          </button>
        ))}
        <span style={{ alignSelf: "center", fontSize: 14, color: "#5f5c5a" }}>{label}. Scroll the page to move down both together.</span>
      </div>

      <div className="sbs-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
        <Pane title="Wix today" note="Screenshot of www.theresewhite.com, October 16, 2026">
          <div ref={paneRef} style={{ minWidth: 0 }}>
            {/* Plain img: a fixed screenshot shown at a computed width, not a responsive image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wixSrc}
              alt={`The live Wix homepage, full length, ${label}`}
              style={{ width: shown || "100%", height: "auto", display: "block", border: "1px solid #d8c7bd" }}
            />
          </div>
        </Pane>
        <Pane title="Recommended design" note="Same words, same order. Only the design changes.">
          <div style={{ width: shown || "100%" }}>
            <Sample view={view} paneWidth={shown} />
          </div>
        </Pane>
      </div>
      <style>{`@media (max-width: 760px) { .sbs-grid { grid-template-columns: minmax(0,1fr) !important; } }`}</style>
    </div>
  );
}
