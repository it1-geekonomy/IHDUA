import { cn } from "@/lib/utils";

type NavChevronProps = {
  open?: boolean;
  className?: string;
};

export function NavChevron({ open, className }: NavChevronProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        open && "rotate-180",
        className,
      )}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
