import { cn } from "@/lib/utils";

type MenuToggleProps = {
  open: boolean;
  onToggle: () => void;
};

export function MenuToggle({ open, onToggle }: MenuToggleProps) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onToggle}
      className="relative flex h-11 w-11 items-center justify-center rounded-sm xl:hidden"
    >
      <span className="sr-only">{open ? "Close" : "Menu"}</span>
      <span className="relative block h-4 w-5">
        <span
          className={cn(
            "absolute left-0 block h-0.5 w-5 bg-white transition-all duration-300",
            open ? "top-1.5 rotate-45" : "top-0",
          )}
        />
        <span
          className={cn(
            "absolute left-0 top-1.5 block h-0.5 w-5 bg-white transition-all duration-300",
            open ? "opacity-0" : "opacity-100",
          )}
        />
        <span
          className={cn(
            "absolute left-0 block h-0.5 w-5 bg-white transition-all duration-300",
            open ? "top-1.5 -rotate-45" : "top-3",
          )}
        />
      </span>
    </button>
  );
}
