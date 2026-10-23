import Image from "next/image";
import Typography from "@/lib/Typography";

export interface HealthIconItem {
  icon: string;
  iconBg: string;
  title: string;
}

export interface CommunityHealthBannerProps {
  heading: string;
  items: HealthIconItem[];
  mainImage: string; // right side image
  mainImageAlt?: string;
}

// Split the heading into at most 2 lines.
// A lone "&", "+", "/", "|" or "-" is glued to the previous word.
const splitHeading = (heading: string): string[] => {
  const tokens = heading.trim().split(/\s+/);
  const words: string[] = [];

  tokens.forEach((token) => {
    if (/^[&+/|-]$/.test(token) && words.length > 0) {
      words[words.length - 1] = `${words[words.length - 1]} ${token}`;
    } else {
      words.push(token);
    }
  });

  if (words.length <= 1) return words;
  const splitAt = Math.ceil(words.length / 2);
  return [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")];
};

// Stat title: split into one word per line
const TitleLines = ({ title }: { title: string }) => (
  <>
    {title.split(" ").map((word, i, arr) => (
      <span key={`${word}-${i}`}>
        {word}
        {i < arr.length - 1 && <br />}
      </span>
    ))}
  </>
);

const CommunityHealthBanner = ({
  heading,
  items,
  mainImage,
  mainImageAlt = "",
}: CommunityHealthBannerProps) => {
  const headingLines = splitHeading(heading);

  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 pb-6 lg:px-10 lg:pt-8 lg:pb-8 xl:pt-16 xl:pb-16 2xl:px-40">
        <div className="flex w-full flex-col overflow-hidden bg-[#FEF7EF] sm:flex-row sm:items-stretch">
          {/* Heading + stats */}
          <div className="flex w-full flex-col items-center gap-6 px-4 pt-8 pb-6 sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-4 md:gap-4 md:px-6 lg:gap-6 lg:px-10 lg:py-3 xl:gap-10 xl:px-12 xl:py-4 2xl:px-16">
            {/* Gradient heading:
                below 640px -> wraps onto the next line when it doesn't fit, centered
                640px and up -> 2 lines, never wraps further */}
            <Typography
              variant="h4"
              className="w-fit max-w-full text-center font-figtree font-medium bg-gradient-to-r from-[#9739A8] to-[#E6AC20] bg-clip-text text-transparent sm:shrink-0 sm:whitespace-nowrap sm:text-left"
            >
              {headingLines.map((line, i) => (
                <span key={`${line}-${i}`} className="sm:block">
                  {line}
                  {i < headingLines.length - 1 && " "}
                </span>
              ))}
            </Typography>

            {/* Stats */}
            <div className="flex w-full min-w-0 items-stretch justify-between sm:flex-1 sm:justify-center">
              {items.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="flex min-w-0 flex-1 items-stretch lg:flex-none"
                >
                  {/* Divider: hidden below 640px */}
                  {index > 0 && (
                    <span
                      className="hidden w-px shrink-0 self-stretch bg-[#FCE1A0] sm:block"
                      aria-hidden="true"
                    />
                  )}

                  {/* Padding:
                      below xl -> small / fluid so the stats fit
                      xl and up -> the same fixed padding on every stat, so the
                      gap on both sides of each divider is equal (as in Figma) */}
                  <div className="flex w-full min-w-0 flex-col items-center gap-2 px-1 text-center sm:gap-2 sm:px-1.5 md:gap-2 md:px-2 lg:px-[clamp(0.75rem,2.2vw,2rem)] xl:gap-3 xl:px-10 2xl:px-12">
                    {/* Icon circle:
                        below 640px -> 48px / 24px
                        640px to 1279px -> small, to fit
                        xl and up -> 56px / 28px */}
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-14 xl:w-14"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="h-6 w-6 object-contain sm:h-4 sm:w-4 md:h-[1.125rem] md:w-[1.125rem] lg:h-5 lg:w-5 xl:h-7 xl:w-7"
                      />
                    </div>

                    {/* Title:
                        below 640px -> body-lg
                        640px to 1279px -> caption, normal-case
                        xl and up -> body-lg */}
                    <Typography
                      variant="body-lg"
                      className="font-figtree font-medium text-[#501959] sm:hidden"
                    >
                      <TitleLines title={item.title} />
                    </Typography>
                    <Typography
                      variant="caption"
                      className="hidden font-figtree font-medium normal-case text-[#501959] sm:block xl:hidden"
                    >
                      <TitleLines title={item.title} />
                    </Typography>
                    <Typography
                      variant="body-lg"
                      className="hidden font-figtree font-medium text-[#501959] xl:block"
                    >
                      <TitleLines title={item.title} />
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main image: touches the bottom, never cropped */}
          <div className="w-3/5 shrink-0 self-end sm:w-[26%] md:w-[28%] lg:w-[30%] xl:w-[28%] 2xl:w-[26%]">
            <Image
              src={mainImage}
              alt={mainImageAlt}
              width={0}
              height={0}
              sizes="(min-width: 1536px) 26vw, (min-width: 1280px) 28vw, (min-width: 1024px) 30vw, (min-width: 768px) 28vw, (min-width: 640px) 26vw, 60vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHealthBanner;