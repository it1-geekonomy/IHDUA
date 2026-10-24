import Image from "next/image";
import Typography from "@/lib/Typography";

export interface ImpactStatItem {
  icon: string; // image path, e.g. "/Healthawareness/160.png"
  iconBg: string; // hex, e.g. "#F1E7F4"
  value: string; // e.g. "160", "34+"
  label: string; // e.g. "Reproductive and child health sessions"
}

export interface ImpactStatsProps {
  heading: string;
  description: string | readonly string[];
  bannerHeading: string; // gradient heading inside the box
  stats: ImpactStatItem[];
}

const ImpactStats = ({
  heading,
  description,
  bannerHeading,
  stats,
}: ImpactStatsProps) => {
  // Split the banner heading into exactly 2 lines.
  // "Creating Lasting Change" -> "Creating Lasting" / "Change"
  const words = bannerHeading.split(" ");
  const splitAt = Math.ceil(words.length / 2);
  const lineOne = words.slice(0, splitAt).join(" ");
  const lineTwo = words.slice(splitAt).join(" ");
  const paragraphs =
    typeof description === "string" ? [description] : description;

  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-16 2xl:px-40">
        <div className="flex w-full flex-col gap-6 lg:gap-8">
          {/* Heading + description */}
          <div className="flex w-full flex-col gap-3 lg:gap-4">
            <Typography
              variant="h3"
              as="h2"
              className="w-full text-center font-lora font-normal text-[#00191B] sm:text-left"
            >
              {heading}
            </Typography>
            {paragraphs.map((paragraph, index) => (
              <Typography
                key={index}
                variant="body-lg"
                className="w-full font-figtree font-normal text-[#5F6C6D] text-center sm:text-left"
              >
                {paragraph}
              </Typography>
            ))}
          </div>

          {/* Stats box */}
          <div className="flex w-full flex-col items-center gap-6 bg-[#FEF7EF] px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-4 lg:px-6 lg:py-6 xl:gap-8 xl:px-12 xl:py-8">
            {/* Gradient heading:
                below lg -> one line, centered
                lg and up -> exactly 2 lines */}
            <Typography
              variant="h4"
              as="h3"
              className="w-fit shrink-0 whitespace-nowrap text-center font-figtree font-medium bg-gradient-to-r from-[#9739A8] to-[#E6AC20] bg-clip-text text-transparent lg:text-left"
            >
              <span className="lg:block">{lineOne}</span>{" "}
              {lineTwo && <span className="lg:block">{lineTwo}</span>}
            </Typography>

            {/* Stats:
                below sm    -> 2x2 grid, no dividers
                sm and up   -> 4 equal columns with dividers */}
            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 sm:flex sm:flex-1 sm:items-stretch sm:gap-0 lg:min-w-0">
              {stats.map((item, index) => (
                <div
                  key={`${item.value}-${index}`}
                  className="flex min-w-0 items-stretch sm:flex-1"
                >
                  {/* Divider: hidden below sm */}
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
                        className="font-figtree font-medium text-[#501959]"
                      >
                        {item.value}
                      </Typography>
                      {/* Label width:
                          below lg -> narrow so it wraps into short lines
                          lg -> uses the full column width (no extra cap)
                          xl and up -> capped again for a tidy look */}
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
};

export default ImpactStats;