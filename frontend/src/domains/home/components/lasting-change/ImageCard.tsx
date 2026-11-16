import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageCardProps = {
  image: string;
  label: string;
  className?: string;
};

export function ImageCard({ image, label, className }: ImageCardProps) {
  return (
    <div
      className={cn(
        "relative isolate aspect-square w-full min-w-0 overflow-hidden",
        className
      )}
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex h-[48px] min-h-[48px] w-full items-center justify-center bg-black/50 px-2 py-1">
        <p className="line-clamp-2 w-full text-center font-figtree text-[12px] font-medium leading-[16px] text-white [overflow-wrap:normal] [word-break:keep-all]">
          {label}
        </p>
      </div>
    </div>
  );
}