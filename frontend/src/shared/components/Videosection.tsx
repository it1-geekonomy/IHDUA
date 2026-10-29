"use client";

import { useRef, useState } from "react";
import Typography from "@/lib/Typography";

export interface WomenOpportunitiesVideo {
  src: string;
  title: string; // accessible label, replaces alt
  poster?: string; // optional thumbnail shown before play
  type?: string; // defaults to "video/mp4"
}

export interface VideosectionProps {
  heading: string;
  topDescription: string | string[];
  videos: WomenOpportunitiesVideo[];
  bottomDescription?: string | string[]; // optional
}

const toParagraphs = (value?: string | string[]): string[] =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);

const PlayIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-white`} aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-white`} aria-hidden="true">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);

const SoundOnIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
  </svg>
);

const SoundOffIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
    <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.4 2.4c.1-.2.1-.4.1-.6zM19 12c0 .9-.2 1.8-.5 2.6l1.5 1.5A8.9 8.9 0 0 0 21 12a9 9 0 0 0-7-8.8v2.1A7 7 0 0 1 19 12zM4.3 3 3 4.3 7.7 9H3v6h4l5 5v-6.7l4.2 4.2c-.7.5-1.4.9-2.2 1.1v2.1a9 9 0 0 0 3.5-1.7l2 2 1.3-1.3L4.3 3zM12 4 9.9 6.1 12 8.2V4z" />
  </svg>
);

interface VideoPlayerProps {
  video: WomenOpportunitiesVideo;
  registerRef: (el: HTMLVideoElement | null) => void;
  onPlayStart: (el: HTMLVideoElement) => void;
}

const VideoPlayer = ({ video, registerRef, onPlayStart }: VideoPlayerProps) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const toggleMute = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  return (
    <div className="group relative w-full overflow-hidden bg-black">
      <video
        ref={(el) => {
          ref.current = el;
          registerRef(el);
        }}
        className="block aspect-video w-full cursor-pointer bg-black object-cover"
        playsInline
        preload="metadata"
        poster={video.poster}
        aria-label={video.title}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
        onPlay={(e) => {
          setPlaying(true);
          onPlayStart(e.currentTarget); // pause every other video
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <source src={video.src} type={video.type ?? "video/mp4"} />
        Your browser does not support the video tag.
      </video>

      {/* Center play / pause button.
          Always visible while paused; while playing it only shows on hover / focus. */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause video" : "Play video"}
        className={`absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition-all duration-200 hover:bg-black/70 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:h-11 sm:w-11 ${
          playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        {playing ? (
          <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </button>

      {/* Sound button, bottom right */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>
    </div>
  );
};

const Videosection = ({
  heading,
  topDescription,
  videos,
  bottomDescription,
}: VideosectionProps) => {
  const topParagraphs = toParagraphs(topDescription);
  const bottomParagraphs = toParagraphs(bottomDescription);

  // Keep every video element so we can pause the others when one starts
  const players = useRef<Set<HTMLVideoElement>>(new Set());

  const registerRef = (el: HTMLVideoElement | null) => {
    if (el) players.current.add(el);
  };

  const pauseOthers = (current: HTMLVideoElement) => {
    players.current.forEach((el) => {
      if (el !== current && !el.paused) el.pause();
    });
  };

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-14 2xl:px-40">
        <div className="flex w-full flex-col gap-3 sm:gap-6 lg:gap-8">
          {/* Heading + top description */}
          <div className="flex w-full flex-col gap-2 sm:gap-3 lg:gap-4">
            <Typography
              variant="h3"
              as="h2"
              className="w-full font-lora font-normal text-center sm:text-left text-[#00191B]"
            >
              {heading}
            </Typography>

            {topParagraphs.length > 0 && (
              <div className="flex w-full flex-col gap-4 sm:gap-5 lg:gap-6">
                {topParagraphs.map((text, index) => (
                  <Typography
                    key={index}
                    variant="body-lg"
                    className="w-full font-figtree text-[#5F6C6D] text-center sm:text-left"
                  >
                    {text}
                  </Typography>
                ))}
              </div>
            )}
          </div>

          {/* videos section */}
          <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-4 lg:gap-6">
            {videos.map((video, index) => (
              <VideoPlayer
                key={`${video.src}-${index}`}
                video={video}
                registerRef={registerRef}
                onPlayStart={pauseOthers}
              />
            ))}
          </div>

          {/* Bottom description (only rendered when provided) */}
          {bottomParagraphs.length > 0 && (
            <div className="flex w-full flex-col gap-4 sm:gap-5 lg:gap-6">
              {bottomParagraphs.map((text, index) => (
                <Typography
                  key={index}
                  variant="body-lg"
                  className="w-full font-figtree font-normal text-[#5F6C6D] text-center sm:text-left"
                >
                  {text}
                </Typography>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Videosection;