import Image from "next/image";
import Link from "next/link";
import Typography from "@/lib/Typography";
import {
  formatProgrammeCardDate,
  formatProgrammeTime,
  isVideoUrl,
  type ProgrammeListItem,
} from "@/domains/programmes/lib/programmes";

type ProgrammeCardProps = {
  programme: ProgrammeListItem;
  priority?: boolean;
};

export default function ProgrammeCard({
  programme,
  priority = false,
}: ProgrammeCardProps) {
  const dateLabel = formatProgrammeCardDate(programme.eventDate);
  const timeLabel = formatProgrammeTime(programme.eventTime);
  const mediaIsVideo = isVideoUrl(programme.eventMediaUrl);

  return (
    <Link
      href={`/programmes/${programme.slug}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-shadow duration-200 hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {programme.eventMediaUrl && !mediaIsVideo ? (
          <Image
            src={programme.eventMediaUrl}
            alt={programme.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : programme.eventMediaUrl && mediaIsVideo ? (
          <>
            <video
              src={`${programme.eventMediaUrl}#t=0.001`}
              preload="metadata"
              muted
              playsInline
              disablePictureInPicture
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex size-11 items-center justify-center rounded-full bg-white/90 text-[#9739A8] shadow-md">
                <svg className="ml-0.5 size-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F5F0F7]">
            <span className="font-figtree text-sm text-[#9739A8]/50">
              No image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Typography
          variant="body-xl"
          as="h3"
          className="font-lora font-normal leading-snug text-[#00191B] transition-colors group-hover:text-[#9739A8]"
        >
          {programme.title}
        </Typography>

        <div className="mt-auto flex items-end justify-between gap-3">
          {dateLabel || timeLabel ? (
            <div className="flex min-w-0 flex-col gap-0.5 text-[#7A8889]">
              {dateLabel && (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="size-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <Typography
                    variant="caption"
                    className="truncate font-figtree font-normal normal-case tracking-normal text-[#7A8889]"
                  >
                    Event Date: {dateLabel}
                  </Typography>
                </div>
              )}
              {timeLabel && (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="size-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <Typography
                    variant="caption"
                    className="truncate font-figtree font-normal normal-case tracking-normal text-[#7A8889]"
                  >
                    {timeLabel}
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            <span />
          )}

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#9739A8] px-3 py-1.5 font-figtree text-xs font-semibold text-white transition group-hover:bg-[#7A2E87]">
            Read More
            <svg
              className="size-3 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H9M17 7V15"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
