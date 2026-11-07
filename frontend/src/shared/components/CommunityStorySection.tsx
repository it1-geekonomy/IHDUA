import Image from "next/image";
import Typography from "@/lib/Typography";
import { ADARSHA_STORIES } from "@/domains/impact/education/constants/adarshaSchool";

export interface CommunityStoryFeatureCard {
  icon?: string;
  title: string;
  description: string;
}

export interface CommunityStorySectionProps {
  title?: string;
  paragraphs?: readonly string[] | string[];
  image?: string;
  imageAlt?: string;
  featureCard?: CommunityStoryFeatureCard;
}

export default function CommunityStorySection({
  title = ADARSHA_STORIES.story2.title,
  paragraphs = ADARSHA_STORIES.story2.paragraphs,
  image = ADARSHA_STORIES.story2.image,
  imageAlt = ADARSHA_STORIES.story2.imageAlt,
  featureCard = ADARSHA_STORIES.story2.featureCard,
}: CommunityStorySectionProps = {}) {
  const finalIcon = featureCard.icon ?? ADARSHA_STORIES.story2.featureCard.icon;

  return (
    <section className="w-full bg-white">
      <div className="w-full pt-6 lg:pt-8 xl:pt-14">
        {/* Section container: generous padding like Figma (120px) to make the section bigger */}
        <div className="w-full bg-[#F3EEF9] py-12 lg:py-20 xl:py-24">
          <div className="w-full px-6 lg:px-10 2xl:px-40">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-stretch">
              {/* Left Image: Large, 6 columns, full natural aspect ratio */}
              <div className="order-2 flex w-full lg:order-1 lg:col-span-6">
                <div className="relative w-full aspect-[762/451] overflow-hidden rounded-[4px] shadow-sm">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Content: 6 columns, perfectly responsive between top and bottom of image */}
              <div className="order-1 flex w-full flex-col justify-between items-start lg:order-2 lg:col-span-6">
                <div>
                  {/* Headline: pure variant="h1" token */}
                  <Typography
                    variant="h2"
                    as="h2"
                    className="font-lora font-normal text-[#00191B] text-left leading-tight"
                  >
                    {title}
                  </Typography>

                  {/* Top Paragraph: pure variant="body-xl" token */}
                  <div className="mt-5 sm:mt-6 lg:mt-8 xl:mt-10 flex flex-col gap-4 w-full">
                    {paragraphs.map((p, idx) => (
                      <Typography
                        key={idx}
                        variant="body-xl"
                        className="font-figtree font-normal text-[#5F6C6D] text-left"
                      >
                        {p}
                      </Typography>
                    ))}
                  </div>
                </div>

                {/* Bottom Feature Card: stays aligned at bottom of image, does NOT overflow */}
                <div className="mt-8 lg:mt-auto pt-4 lg:pt-6 flex items-center gap-4 sm:gap-5 lg:gap-6 w-full">
                  {/* Circle Logo: 112px on desktop (7rem in Figma) */}
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28 shrink-0 items-center justify-center rounded-full bg-[#E6DAF5]">
                    <Image
                      src={finalIcon}
                      alt={featureCard.title}
                      width={64}
                      height={64}
                      className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14 object-contain"
                    />
                  </div>
                  {/* Feature Text: pure variant="body-xl" tokens with margin-top only */}
                  <div className="flex flex-col min-w-0">
                    <Typography
                      variant="body-xl"
                      className="font-figtree font-bold text-[#734E9F] text-left"
                    >
                      {featureCard.title}
                    </Typography>
                    <Typography
                      variant="body-xl"
                      className="font-figtree font-normal text-[#5F6C6D] text-left mt-1"
                    >
                      {featureCard.description}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
