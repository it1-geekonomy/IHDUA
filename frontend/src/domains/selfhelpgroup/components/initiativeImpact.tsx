import Image from "next/image";
import Typography from "@/lib/Typography";
import { type ImpactStatItem } from "@/shared/components/ImpactStats";

interface InitiativeImpactProps {
  heading?: string;
  description?: string;
  paragraphs?: readonly string[];
  bannerHeading?: string;
  stats: ImpactStatItem[];
}

export default function InitiativeImpact({
  heading = "The Impact We Make",
  description,
  paragraphs,
  bannerHeading = "Creating Lasting Change",
  stats,
}: InitiativeImpactProps) {
  const contentParagraphs =
    paragraphs ??
    (description
      ? [description]
      : [
          "IHDUA’s Women Leadership Project has supported the formation of Self-Help Groups, bringing women together to build savings, financial awareness and shared responsibility across community members.",
          "Through regular group meetings, savings routines and training programs, members strengthen their financial confidence and support community-led initiatives that contribute to long-term social and economic progress in their villages.",
        ]);

  const words = bannerHeading.split(" ");
  const splitAt = Math.ceil(words.length / 2);
  const lineOne = words.slice(0, splitAt).join(" ");
  const lineTwo = words.slice(splitAt).join(" ");

  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-16 2xl:px-40">
        <div className="flex w-full flex-col gap-6 lg:gap-8">
          {/* Heading + description paragraphs */}
          <div className="flex w-full flex-col gap-3 lg:gap-4">
            <Typography
              variant="body-xl"
              className="w-full text-center font-lora font-normal text-[#00191B] sm:text-left"
            >
              {heading}
            </Typography>
            <div className="flex flex-col gap-3">
              {contentParagraphs.map((p, idx) => (
                <Typography
                  key={idx}
                  variant="body-lg"
                  className="w-full font-figtree font-normal text-[#5F6C6D] leading-relaxed"
                >
                  {p}
                </Typography>
              ))}
            </div>
          </div>

          {/* Stats box matching existing ImpactStats */}
          <div className="flex w-full flex-col items-center gap-6 bg-[#FEF7EF] px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-4 lg:px-6 lg:py-6 xl:gap-8 xl:px-12 xl:py-8">
            {/* Gradient heading */}
            <Typography
              variant="h4"
              className="w-fit shrink-0 whitespace-nowrap text-center font-figtree font-medium bg-gradient-to-r from-[#9739A8] to-[#E6AC20] bg-clip-text text-transparent lg:text-left"
            >
              <span className="lg:block">{lineOne}</span>{" "}
              {lineTwo && <span className="lg:block">{lineTwo}</span>}
            </Typography>

            {/* Stats: 2x2 on mobile (<640px), 4 columns on sm+ */}
            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 sm:flex sm:flex-1 sm:items-stretch sm:gap-0 lg:min-w-0">
              {stats.map((item, index) => (
                <div
                  key={`${item.value}-${index}`}
                  className="flex min-w-0 items-stretch sm:flex-1"
                >
                  {/* Divider: hidden below 640px */}
                  {index > 0 && (
                    <span
                      className="hidden w-px self-stretch bg-[#FCE1A0] sm:block"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex w-full min-w-0 flex-col items-center gap-2 px-1 text-center sm:px-2 md:gap-3 md:px-3 lg:gap-2 lg:px-2 xl:gap-3 xl:px-6">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 md:h-14 md:w-14 lg:h-12 lg:w-12 xl:h-14 xl:w-14"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="h-6 w-6 object-contain sm:h-5 sm:w-5 md:h-7 md:w-7 lg:h-6 lg:w-6 xl:h-7 xl:w-7"
                      />
                    </div>

                    <div className="flex w-full flex-col items-center gap-1">
                      <Typography
                        variant="body-xl"
                        className="whitespace-nowrap font-figtree font-medium text-[#501959]"
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="body-sm"
                        className="max-w-[9rem] font-figtree font-normal text-[#5F6C6D] md:max-w-[10rem] lg:max-w-none xl:max-w-[11rem]"
                      >
                        {item.label}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

