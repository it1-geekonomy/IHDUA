import Image from "next/image";
import Typography from "@/lib/Typography";

interface TwoImageSectionProps {
  title?: string;
  topParagraphs?: readonly string[];
  subsections?: readonly {
    subtitle: string;
    paragraphs: readonly string[];
  }[];
  images: {
    src: string;
    alt: string;
  }[];
  bottomParagraphs?: readonly string[];
}

export default function InitiativeTwoImageSection({
  title,
  topParagraphs,
  subsections,
  images,
  bottomParagraphs,
}: TwoImageSectionProps) {
  return (
    <section className="flex w-full flex-col gap-6 sm:gap-8">
      {/* Title */}
      {title && (
        <Typography variant="h2" className="font-lora text-[#00191B]">
          {title}
        </Typography>
      )}

      {/* Top paragraphs */}
      {topParagraphs && topParagraphs.length > 0 && (
        <div className="flex flex-col gap-3">
          {topParagraphs.map((p, idx) => (
            <Typography
              key={idx}
              variant="body-lg"
              className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
            >
              {p}
            </Typography>
          ))}
        </div>
      )}

      {/* Subsections if provided */}
      {subsections && subsections.length > 0 && (
        <div className="flex flex-col gap-6">
          {subsections.map((sub, sIdx) => (
            <div key={sIdx} className="flex flex-col gap-3">
              <Typography variant="h3" className="font-lora text-[#00191B]">
                {sub.subtitle}
              </Typography>
              {sub.paragraphs.map((p, pIdx) => (
                <Typography
                  key={pIdx}
                  variant="body-lg"
                  className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
                >
                  {p}
                </Typography>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Two Images Side by Side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-[784/421] w-full overflow-hidden"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 40rem) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Bottom paragraphs */}
      {bottomParagraphs && bottomParagraphs.length > 0 && (
        <div className="flex flex-col gap-3">
          {bottomParagraphs.map((p, idx) => (
            <Typography
              key={idx}
              variant="body-lg"
              className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
            >
              {p}
            </Typography>
          ))}
        </div>
      )}
    </section>
  );
}
