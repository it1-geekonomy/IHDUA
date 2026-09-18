import Image from "next/image";
import { figmaTypeScale } from "@/lib/Typography";
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
      <div className="absolute inset-x-0 bottom-0 z-10 flex w-full items-center justify-center bg-black/50 px-2 py-2.5 sm:px-3 sm:py-3">
        <p
          className={cn(
            "text-center font-figtree font-medium text-white",
            figmaTypeScale[18]
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
