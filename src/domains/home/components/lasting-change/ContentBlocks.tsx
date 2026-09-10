import Link from "next/link";
import Typography, { figmaTypeScale } from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { LASTING_CHANGE } from "@/domains/home/constants/lastingchange";

type HeadlineBlockProps = {
  variant?: "stack" | "lg" | "xl";
  className?: string;
};

export function HeadlineBlock({
  variant = "stack",
  className,
}: HeadlineBlockProps) {
  if (variant === "lg") {
    return (
      <div
        className={cn(
          "col-span-2 flex aspect-[2/1] min-h-0 flex-col justify-center overflow-hidden px-2",
          className
        )}
      >
        <Typography className="font-lora text-[28px]! font-normal leading-tight">
          {LASTING_CHANGE.headline}
        </Typography>
        <Typography
          variant="body-lg"
          className="mt-3 font-figtree !text-[15px] leading-snug text-[#5F6C6D]"
        >
          {LASTING_CHANGE.body}
        </Typography>
      </div>
    );
  }

  if (variant === "xl") {
    return (
      <div
        className={cn(
          "col-span-2 flex flex-col items-end justify-center px-2 xl:px-4",
          className
        )}
      >
        <Typography
          className={cn(
            "max-w-[34rem] font-lora font-normal leading-tight!",
            figmaTypeScale[50]
          )}
        >
          {LASTING_CHANGE.headline}
        </Typography>
        <Typography
          variant="body-lg"
          className="mt-4 max-w-[34rem] font-figtree leading-relaxed text-[#5F6C6D] xl:mt-5"
        >
          {LASTING_CHANGE.body}
        </Typography>
      </div>
    );
  }

  return (
    <div className={className}>
      <Typography
        variant="h2"
        className="font-lora font-medium leading-tight text-[#00191B]"
      >
        {LASTING_CHANGE.headline}
      </Typography>
      <Typography
        variant="body-lg"
        className="mt-3 font-figtree leading-relaxed text-[#5F6C6D]"
      >
        {LASTING_CHANGE.body}
      </Typography>
    </div>
  );
}

type CtaBlockProps = {
  variant?: "centered" | "lg" | "xl";
  className?: string;
};

function GetInvolvedButton({ className }: { className?: string }) {
  return (
    <Link
      href={LASTING_CHANGE.ctaHref}
      className={cn(
        "inline-flex items-center gap-2 bg-[#FFD638] px-5 py-3 font-figtree font-semibold transition-opacity hover:opacity-90",
        figmaTypeScale[18],
        className
      )}
    >
      Get Involved
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function CtaBlock({ variant = "centered", className }: CtaBlockProps) {
  if (variant === "lg") {
    return (
      <div
        className={cn(
          "flex aspect-square min-h-0 flex-col items-start justify-center gap-5 overflow-hidden py-1",
          className
        )}
      >
        <Typography
          variant="body-lg"
          className="font-figtree !text-[14px] leading-snug text-[#5F6C6D]"
        >
          {LASTING_CHANGE.ctaText}
        </Typography>
        <GetInvolvedButton className="w-fit rounded-sm" />
      </div>
    );
  }

  if (variant === "xl") {
    return (
      <div
        className={cn("flex flex-col justify-center gap-6 xl:gap-8", className)}
      >
        <Typography
          variant="body-lg"
          className="font-figtree leading-relaxed text-[#5F6C6D]"
        >
          {LASTING_CHANGE.ctaText}
        </Typography>
        <GetInvolvedButton className="w-fit rounded-sm" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <Typography
        variant="body-lg"
        className="max-w-xl font-figtree leading-relaxed text-[#5F6C6D]"
      >
        {LASTING_CHANGE.ctaText}
      </Typography>
      <GetInvolvedButton className="mt-4" />
    </div>
  );
}
