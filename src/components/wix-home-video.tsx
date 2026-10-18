"use client";

import { useState } from "react";
import Image from "next/image";
import { wixHome, wixHomeImages } from "@/content/wix-home";
import { video } from "@/content/site";

/**
 * The homepage video, dressed as the Wix video box.
 *
 * On Wix this box plays a muted, looping copy of the video straight away,
 * starting on a still of her logo over a bookshelf. Here the box shows that
 * same still with Wix's play symbol in the middle, and nothing loads from
 * YouTube until the visitor presses it. That is the same rule as
 * src/components/video-player.tsx: visitors are researching a confidential
 * workplace problem, so no Google script or cookie arrives uninvited.
 *
 * The YouTube video is https://youtu.be/6DDxPMJ6L-Q, taken from
 * `wixHome.quoteBand.videoUrl`.
 */
const youtubeId = new URL(wixHome.quoteBand.videoUrl).pathname.slice(1);

export function WixHomeVideo() {
  const [playing, setPlaying] = useState(false);
  const poster = wixHomeImages.videoPoster;

  return (
    <div className="relative aspect-video w-full bg-black">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${video.title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0d63d1]"
        >
          <Image
            src={poster.src}
            width={poster.width}
            height={poster.height}
            alt=""
            sizes="(min-width: 1024px) 640px, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Wix's play symbol: a plain black triangle, slightly see-through. */}
          <svg
            viewBox="0 0 65 65"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 opacity-80 transition-opacity group-hover:opacity-100 lg:h-[65px] lg:w-[65px]"
          >
            <path d="M14 4l44 28.5L14 61z" fill="#000" />
          </svg>
        </button>
      )}
    </div>
  );
}
