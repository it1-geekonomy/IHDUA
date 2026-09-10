import Image from "next/image";
import Typography, { figmaTypeScale } from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { LASTING_CHANGE } from "@/domains/home/constants/lastingchange";

type YellowImpactCardProps = {
  compact?: boolean;
};

export function  YellowImpactCard({ compact = false }: YellowImpactCardProps) {
  return (
    <div
      className={cn(
        "relative w-full min-w-0 overflow-hidden bg-[#FFD638]",
        compact
          ? "aspect-square min-h-0 p-4"
          : "p-5 pb-24 sm:px-6 sm:pb-28 sm:pt-9 md:pt-20 md:px-7 md:pt-11 xl:aspect-square xl:p-7 xl:pb-7 2xl:pt-16 2xl:px-8"
      )}
    >
      <Typography
        className={cn(
          "relative z-10 font-figtree font-semibold leading-snug",
          compact
            ? "!text-[20px] lg:!text-[22px] leading-tight"
            : `${figmaTypeScale[24]} sm:!text-[22px] md:!text-[30px] lg:!text-[28px] xl:!text-[25px] 2xl:!text-[28px]`
        )}
      >
        {LASTING_CHANGE.yellowCard.title}
      </Typography>
      <Typography
        variant="body-lg"
        className={cn(
          "relative z-10 mt-3 max-w-[15rem] font-figtree leading-relaxed text-[#7B6100] lg:!text-[18px]",
          compact
            ? "mt-2 !text-[13px] leading-snug"
            : "sm:mt-4 sm:!text-[16px] md:!text-[19px] xl:!text-[18px] md:max-w-[17rem] 2xl:mt-5"
        )}
      >
        {LASTING_CHANGE.yellowCard.description}
      </Typography>
      <Image
        src={LASTING_CHANGE.yellowCard.seal}
        alt=""
        width={140}
        height={140}
        className={cn(
          "pointer-events-none absolute bottom-0 right-0 object-contain lg:!size-[105px]",
          compact ? "size-[80px]" : "size-[100px] sm:size-[110px] xl:size-[140px]"
        )}
      />
    </div>
  );
}
