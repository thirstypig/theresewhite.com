"use client";

import { useState } from "react";

/**
 * The four share icons under each post, as on Wix: Facebook, X, LinkedIn
 * and copy link. The first three are ordinary links to each network's
 * public share page, so they work on a static site. Copy link needs a
 * little browser code, which is why this file is a client component.
 *
 * The icons are drawn here as simple outlines in the post's charcoal, 19
 * pixels square and 49 pixels apart, matching Wix's spacing. They are close
 * to Wix's icons but not traced from them.
 */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <FacebookIcon /> },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, icon: <XIcon /> },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <LinkedInIcon /> },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (older browser or permissions): nothing to do.
    }
  }

  return (
    <div className="flex h-[66px] items-center gap-[30px] text-[#414141]">
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener" aria-label={l.label} className="hover:text-[#d8c7bd]">
          {l.icon}
        </a>
      ))}
      <button type="button" onClick={copy} aria-label="Copy link" className="cursor-pointer hover:text-[#d8c7bd]">
        <LinkIcon />
      </button>
      <span role="status" className="font-[family-name:var(--wix-forum)] text-[14px]">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}

const iconProps = {
  width: 19,
  height: 19,
  viewBox: "0 0 19 19",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  "aria-hidden": true,
} as const;

function FacebookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10.5 17V10h2.3l.4-2.6h-2.7V5.8c0-.8.3-1.3 1.4-1.3h1.4V2.2c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.4v1.9H5.6V10h2.3v7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 3h3.6l9.4 13h-3.6z" />
      <path d="M15.5 3 10.6 8.4M8.3 10.9 3.5 16" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3.5 7.5v8M3.5 4.2v.6" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M7.5 15.5v-8M7.5 10.6c0-1.8 1.3-3.2 3-3.2s3 1.1 3 3.2v4.9" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 11a3.2 3.2 0 0 0 4.6.1l2.7-2.7a3.2 3.2 0 0 0-4.6-4.6l-1.2 1.2" strokeLinecap="round" />
      <path d="M11 8a3.2 3.2 0 0 0-4.6-.1l-2.7 2.7a3.2 3.2 0 0 0 4.6 4.6l1.2-1.2" strokeLinecap="round" />
    </svg>
  );
}
