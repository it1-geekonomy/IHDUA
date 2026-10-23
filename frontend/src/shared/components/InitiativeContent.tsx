import Image from "next/image";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";

export interface InitiativeContentProps {
  label?: string;
  title: string;
  paragraphs: readonly string[];
  imageAlt: string;
  image: string;
  imageAspectClass: string;
  reverse?: boolean;
  hasAccentBar?: boolean;
}

export default function InitiativeContent({
  label,
  title,
  paragraphs,
  imageAlt,
  image,
  imageAspectClass,
  reverse = false,
  hasAccentBar = false,
}: InitiativeContentProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14",
        reverse && "lg:flex-row-reverse",
      )}
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
        {label && (
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            <Typography
              variant="caption"
              className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
            >
              {label}
            </Typography>
          </div>
        )}

        {hasAccentBar ? (
          <div className="flex items-stretch gap-3">
            <span
              className="w-1 shrink-0 self-stretch rounded-full bg-[#E6AC20]"
              aria-hidden="true"
            />
            <Typography variant="h3" className="font-lora text-[#00191B]">
              {title}
            </Typography>
          </div>
        ) : (
          <Typography variant="h3" className="font-lora text-[#00191B]">
            {title}
          </Typography>
        )}

        <div className="flex flex-col gap-3 sm:gap-4">
          {paragraphs.map((paragraph, index) => (
            <Typography
              key={index}
              variant="body-lg"
              className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
            >
              {paragraph}
            </Typography>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden lg:w-1/2",
          imageAspectClass,
        )}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 64rem) 50vw, (min-width: 40rem) 90vw, 100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
