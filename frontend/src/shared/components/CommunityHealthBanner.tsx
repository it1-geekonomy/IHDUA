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
  mainImage: string; 
  mainImageAlt?: string;
}

const CommunityHealthBanner = ({
  heading,
  items,
  mainImage,
  mainImageAlt = "",
}: CommunityHealthBannerProps) => {
  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 pb-6 lg:px-10 lg:pt-8 lg:pb-8 xl:pt-16 xl:pb-16 2xl:px-40">
        <div className="flex w-full flex-col overflow-hidden bg-[#FEF7EF] sm:flex-row sm:items-stretch">
          <div className="flex w-full flex-col items-center gap-6 px-4 pt-8 pb-6 sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-4 md:gap-4 md:px-6 lg:gap-6 lg:px-10 lg:py-3 xl:px-12 xl:py-4">
            <Typography
              variant="h4"
              className="w-fit shrink-0 whitespace-nowrap text-center font-figtree font-medium bg-gradient-to-r from-[#9739A8] to-[#E6AC20] bg-clip-text text-transparent sm:text-left"
            >
              {heading.split(" ").map((word, i, arr) => (
                <span key={`${word}-${i}`} className="sm:block">
                  {word}
                  {i < arr.length - 1 && (
                    <span className="sm:hidden">&nbsp;</span>
                  )}
                </span>
              ))}
            </Typography>

            
            <div className="flex w-full items-stretch justify-between sm:min-w-0 sm:flex-1 sm:justify-evenly lg:justify-center">
              {items.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="flex min-w-0 flex-1 items-stretch sm:flex-none"
                >
                  {index > 0 && (
                    <span
                      className="hidden w-px self-stretch bg-[#FCE1A0] sm:block"
                      aria-hidden="true"
                    />
                  )}
                 
                  <div className="flex w-full flex-col items-center gap-2 px-1 text-center sm:gap-2 sm:px-2 md:gap-3 md:px-4 lg:px-8 xl:px-10">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 md:h-14 md:w-14"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="h-6 w-6 object-contain sm:h-5 sm:w-5 md:h-7 md:w-7"
                      />
                    </div>

                    <Typography
                      variant="body-lg"
                      className="font-figtree font-medium text-[#501959]"
                    >
                      {item.title.split(" ").map((word, i, arr) => (
                        <span key={`${word}-${i}`}>
                          {word}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-3/5 shrink-0 self-end sm:w-[30%] md:w-[34%] lg:w-[30%] xl:w-[28%] 2xl:w-[26%]">
            <Image
              src={mainImage}
              alt={mainImageAlt}
              width={0}
              height={0}
              sizes="(min-width: 1536px) 26vw, (min-width: 1280px) 28vw, (min-width: 1024px) 30vw, (min-width: 768px) 34vw, (min-width: 640px) 30vw, 60vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHealthBanner;