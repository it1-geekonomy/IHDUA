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

const Videosection = ({
  heading,
  topDescription,
  videos,
  bottomDescription,
}: VideosectionProps) => {
  const topParagraphs = toParagraphs(topDescription);
  const bottomParagraphs = toParagraphs(bottomDescription);

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
              <div key={`${video.src}-${index}`} className="w-full">
                <video
                  className="block aspect-video w-full bg-black object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster={video.poster}
                  aria-label={video.title}
                >
                  <source src={video.src} type={video.type ?? "video/mp4"} />
                  Your browser does not support the video tag.
                </video>
              </div>
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