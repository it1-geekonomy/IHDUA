import Image from "next/image";
import Typography from "@/lib/Typography";
import {
  WHO_WE_ARE_COLORS as COLOR,
  WHO_WE_ARE_HEADING,
  WHO_WE_ARE_IMAGE,
  WHO_WE_ARE_LABEL,
  WHO_WE_ARE_PARAGRAPHS,
  WHO_WE_ARE_SIZES as SIZE,
} from "@/domains/about/constants/whoweare";

const WhoWeAre = () => {
  return (
    <section className="w-full bg-white">
  <div className="w-full px-6 pt-6 pb-6 lg:px-10 lg:pt-8 lg:pb-8 xl:pt-16 xl:pb-16 2xl:px-40">
    <div
      className={`grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_40%] lg:items-start xl:grid-cols-[minmax(0,1fr)_36%] xl:grid-rows-[auto_1fr] ${SIZE.gridGapX}`}
    >
          {/* Label + heading */}
          <div
            className={`flex w-full flex-col items-center text-center lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:items-start lg:text-left xl:col-span-1 xl:self-start ${SIZE.headerGap} ${SIZE.headerMarginBottom}`}
          >
            <div
              className={`flex items-center justify-center lg:justify-start ${SIZE.labelGap}`}
            >
              <span
                className={`h-px ${SIZE.labelLine} ${COLOR.accentBg}`}
                aria-hidden="true"
              />
              <Typography
                variant="caption"
                className={`font-bold font-figtree uppercase ${SIZE.labelText} ${COLOR.accentText}`}
              >
                {WHO_WE_ARE_LABEL}
              </Typography>
              <span
                className={`h-px ${SIZE.labelLine} ${COLOR.accentBg}`}
                aria-hidden="true"
              />
            </div>

          <Typography
  variant="h2"
  className={`w-full font-lora leading-snug ${SIZE.headingText} ${COLOR.heading}`}
>
  {WHO_WE_ARE_HEADING.line1}{" "}
  <br className="hidden xl:block" />
  {WHO_WE_ARE_HEADING.line2}
</Typography>
          </div>

          {/* Image */}
          <div
            className={`relative mx-auto aspect-[4/3] w-full overflow-hidden lg:col-start-2 lg:row-start-2 lg:mx-0 lg:mb-0 lg:aspect-auto lg:max-w-none lg:self-stretch xl:col-start-2 xl:row-span-2 xl:row-start-1 ${SIZE.imageMaxWidth} ${SIZE.imageMarginBottom}`}
          >
            <Image
              src={WHO_WE_ARE_IMAGE.src}
              alt={WHO_WE_ARE_IMAGE.alt}
              fill
              sizes={WHO_WE_ARE_IMAGE.sizes}
              className="object-cover lg:object-contain lg:object-center"
            />
          </div>

          {/* Description */}
          <div
            className={`flex flex-col lg:col-start-1 lg:row-start-2 xl:self-start ${SIZE.descriptionGap}`}
          >
            {WHO_WE_ARE_PARAGRAPHS.map(({ id, text }) => (
              <Typography
                key={id}
                variant="body-lg"
                className={`font-figtree font-normal leading-relaxed ${SIZE.bodyText} ${COLOR.body}`}
              >
                {text}
              </Typography>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;