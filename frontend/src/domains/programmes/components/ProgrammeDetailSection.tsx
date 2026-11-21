import Image from "next/image";
import Typography from "@/lib/Typography";
import ProgrammeCard from "@/domains/programmes/components/ProgrammeCard";
import ShareThisBar from "@/shared/components/ShareThisBar";
import { absoluteUrl } from "@/shared/lib/siteUrl";
import {
  formatProgrammeDetailDate,
  formatProgrammeTime,
  isVideoUrl,
  type ProgrammeDetail,
  type ProgrammeListItem,
} from "@/domains/programmes/lib/programmes";

type Props = {
  programme: ProgrammeDetail;
  related: ProgrammeListItem[];
};

function ContentBody({ content }: { content: string | null }) {
  if (!content?.trim()) {
    return (
      <Typography
        variant="body-lg"
        className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
      >
        Details for this programme will be shared soon.
      </Typography>
    );
  }

  const paragraphs = content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 font-figtree text-[1.0625rem] font-normal leading-relaxed text-[#5F6C6D] sm:text-[1.125rem]">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export default function ProgrammeDetailSection({ programme, related }: Props) {
  const dateLabel = formatProgrammeDetailDate(programme.eventDate);
  const timeLabel = formatProgrammeTime(programme.eventTime);
  const mediaIsVideo = isVideoUrl(programme.eventMediaUrl);
  const hasMeta = Boolean(dateLabel || timeLabel || programme.eventLocation);

  return (
    <section className="w-full bg-white px-6 py-10 sm:py-12 lg:px-12 lg:py-16 2xl:px-32">
      <div className="mx-auto w-full max-w-[100rem]">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div>
            <Typography
              variant="h3"
              as="h1"
              className="font-lora font-normal leading-snug text-[#00191B]"
            >
              {programme.title}
            </Typography>

            {hasMeta && (
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[#9739A8]">
                {dateLabel && (
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="size-4 shrink-0"
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
                      variant="body-sm"
                      className="font-figtree font-medium text-[#9739A8]"
                    >
                      {dateLabel}
                    </Typography>
                  </div>
                )}
                {timeLabel && (
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="size-4 shrink-0"
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
                      variant="body-sm"
                      className="font-figtree font-medium text-[#9739A8]"
                    >
                      {timeLabel}
                    </Typography>
                  </div>
                )}
                {programme.eventLocation && (
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="size-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <Typography
                      variant="body-sm"
                      className="font-figtree font-medium text-[#9739A8]"
                    >
                      {programme.eventLocation}
                    </Typography>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 sm:mt-8">
              <ContentBody content={programme.content} />
            </div>

            <ShareThisBar
              className="mt-8 sm:mt-10"
              label="Share this programme"
              title={programme.title}
              url={absoluteUrl(`/programmes/${programme.slug}`)}
            />
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 lg:aspect-auto lg:min-h-[22rem]">
            {programme.eventMediaUrl && !mediaIsVideo ? (
              <Image
                src={programme.eventMediaUrl}
                alt={programme.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : programme.eventMediaUrl && mediaIsVideo ? (
              <video
                src={programme.eventMediaUrl}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[16rem] w-full items-center justify-center bg-[#F5F0F7]">
                <span className="font-figtree text-sm text-[#9739A8]/50">
                  No media
                </span>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-14 sm:mt-16 lg:mt-20">
            <Typography
              variant="h3"
              as="h2"
              className="font-lora font-normal text-[#00191B]"
            >
              Related Events
            </Typography>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((item) => (
                <ProgrammeCard key={item.id} programme={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
