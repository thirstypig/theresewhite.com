import { ImageResponse } from "next/og";
import { contact } from "@/content/site";

/**
 * The card image for every shared link.
 *
 * Generated from code rather than committed as an asset, so it cannot go
 * stale against her name or roles. One image serves the whole site: a card is
 * seen at thumbnail size in a chat list, where per-page artwork would be
 * unreadable anyway — the page's own og:title carries the specificity.
 *
 * `dynamic = "force-static"` is required. Without it `next build` fails under
 * `output: export` with "export const dynamic ... not configured on route
 * /opengraph-image", because Next treats the generator as a route handler and
 * cannot prove it is static.
 *
 * Deliberately avoids a custom font. Loading one means reading a file at
 * build time and shipping it, and the fallback sans is legible at this size.
 *
 * NOTE: the emitted file is `out/opengraph-image` with NO extension. GitHub
 * Pages sets Content-Type from the extension, so this must be checked on
 * staging after deploy — if it serves as application/octet-stream, scrapers
 * will reject it and the fallback is a committed PNG under public/.
 */

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${contact.name} — ${contact.roles.join(" and ")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#22495A",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#B6C4CB",
            }}
          >
            {contact.roles.join("  ·  ")}
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 88,
              lineHeight: 1.05,
              color: "#F7F4F0",
            }}
          >
            {contact.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* The sand rule is the one brand flourish that survives at
              thumbnail size. */}
          <div
            style={{
              width: 180,
              height: 4,
              background: "#D8C7BD",
              marginBottom: 32,
            }}
          />
          <div style={{ fontSize: 34, color: "#EDE4DC", maxWidth: 900 }}>
            30+ years. 1,100+ mediations. Mostly hard ones.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
