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
        <div className="w-full bg-[#F3EEF9] py-8 lg:py-12">
          <div className="w-full px-6 lg:px-10 2xl:px-40">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
              {/* Left Image: Landscape Campus */}
              <div className="order-2 flex w-full self-stretch lg:order-1 lg:col-span-5">
                <div className="relative min-h-[260px] sm:min-h-[300px] lg:min-h-full w-full overflow-hidden rounded-[2px] shadow-sm">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="order-1 flex w-full flex-col justify-between items-start lg:order-2 lg:col-span-7">
                <div>
                  <Typography
                    variant="h3"
                    className="font-lora font-normal text-[#00191B] text-left leading-tight mb-4"
                  >
                    {title}
                  </Typography>

                  <div className="flex flex-col gap-3.5">
                    {paragraphs.map((p, idx) => (
                      <Typography
                        key={idx}
                        variant="body-lg"
                        className="font-figtree font-light text-[#5F6C6D] text-left leading-relaxed"
                      >
                        {p}
                      </Typography>
                    ))}
                  </div>
                </div>

                {/* Highlight Feature Card */}
                <div className="mt-6 flex items-center gap-4 sm:gap-5 w-full">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-[#E6DAF5]">
                    <Image
                      src={finalIcon}
                      alt={featureCard.title}
                      width={36}
                      height={36}
                      className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <Typography
                      variant="body-lg"
                      className="font-figtree font-bold text-[#734E9F] text-left leading-snug"
                    >
                      {featureCard.title}
                    </Typography>
                    <Typography
                      variant="body-lg"
                      className="font-figtree font-light text-[#5F6C6D] text-left mt-1 leading-relaxed"
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
