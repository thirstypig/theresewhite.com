"use client";

import { useState } from "react";
import Image from "next/image";
import { video } from "@/content/site";

/**
 * Click-to-load YouTube facade.
 *
 * A live iframe would pull several hundred KB of Google script and set
 * third-party cookies on first paint. Visitors here are researching a
 * confidential workplace problem, so nothing loads from YouTube until they
 * choose to play.
 */
export function VideoPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="m-0">
      <div className="relative aspect-video overflow-hidden rounded-sm bg-deep">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play video: ${video.title}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover transition-opacity group-hover:opacity-90"
            />
            <span className="absolute inset-0 bg-deep/25 transition-colors group-hover:bg-deep/10" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-band-fg/95 shadow-lg transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                className="ml-1 h-6 w-6 fill-deep"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">
        {video.disclosure}
      </figcaption>
    </figure>
  );
}
