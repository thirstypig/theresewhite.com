"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/**
 * A case-study video, styled like the Wix video player it replaces: the
 * opening frame, darkened slightly, with a thin white play circle in the
 * middle.
 *
 * The video file is ours (copied from Wix into public/wix/case-studies/) and
 * nothing is downloaded until the visitor presses play: `preload="none"`
 * keeps the browser from fetching any of the 15 to 20 MB file in advance,
 * and the player's own controls only appear once it is playing. Both videos
 * are stored with their index at the front of the file, so playback starts
 * before the whole file arrives.
 *
 * `aspect` is the shape of the box Wix draws the video in, which is not
 * always the video's own 16:9 shape; like Wix, the picture is cropped to
 * fill it.
 */
export function CaseStudyVideo({
  src,
  poster,
  width,
  height,
  posterAlt,
  label,
  aspect,
  className = "",
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  posterAlt: string;
  /** Names the video for screen readers, e.g. "Case Study #2, Mistaken Discrimination Complaint". */
  label: string;
  aspect: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`} style={{ aspectRatio: aspect }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={playing}
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!playing && (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            void videoRef.current?.play();
          }}
          className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-white"
        >
          <Image
            src={poster}
            alt={posterAlt}
            width={width}
            height={height}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-black/25" aria-hidden="true" />
          <span className="sr-only">Play video: {label}</span>
          <svg
            viewBox="0 0 50 50"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-80"
          >
            <circle cx="25" cy="25" r="23.5" fill="rgba(0,0,0,.15)" stroke="#fff" strokeWidth="2" />
            <path d="M20 16.5v17l13.5-8.5z" fill="#fff" />
          </svg>
        </button>
      )}
    </div>
  );
}
