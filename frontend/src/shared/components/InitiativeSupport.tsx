import Image from "next/image";
import Typography from "@/lib/Typography";

export interface InitiativeSupportStep {
  icon?: string;
  title: string;
  description: string;
}

export interface InitiativeSupportProps {
  label: string;
  heading: string;
  description: string;
  steps: readonly InitiativeSupportStep[] | InitiativeSupportStep[];
  className?: string;
}

const CARD_STYLES = [
  { background: "bg-[#F6EEF7]", icon: "bg-[#7D4387]" },
  { background: "bg-[#FFF5E5]", icon: "bg-[#C89A3A]" },
  { background: "bg-[#F6EEF7]", icon: "bg-[#7D4387]" },
  { background: "bg-[#FFF5E5]", icon: "bg-[#C89A3A]" },
] as const;

const DEFAULT_ICONS = [
  "/icons/community-support.svg",
  "/icons/piggy-bank.svg",
  "/icons/financial-literacy.svg",
  "/icons/community-leadership.svg",
] as const;

export default function InitiativeSupport({
  label,
  heading,
  description,
  steps,
  className = "",
}: InitiativeSupportProps) {
  return (
    <section className={`w-full bg-white ${className}`}>
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-14 2xl:px-40">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col items-center text-center sm:items-start sm:text-left gap-3">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              <Typography
                variant="caption"
                className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
              >
                {label}
              </Typography>
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            </div>

            <Typography
              variant="h2"
              className="w-full font-lora leading-[1.2] text-[#00191B]"
            >
              {heading}
            </Typography>

            <Typography
              variant="body-lg"
              className="w-full font-figtree font-normal text-[#5F6C6D] text-center sm:text-left"
            >
              {description}
            </Typography>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const styles = CARD_STYLES[index % CARD_STYLES.length];
              const iconSrc = step.icon ?? DEFAULT_ICONS[index % DEFAULT_ICONS.length];
              return (
                <div
                  key={step.title}
                  className={`flex min-w-0 flex-col items-start gap-3 p-4 sm:p-5 ${styles.background}`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
                  >
                    <Image
                      src={iconSrc}
                      alt=""
                      width={24}
                      height={24}
                      className="h-5 w-5 object-contain brightness-0 invert"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <Typography
                      variant="body-lg"
                      as="h3"
                      className="font-lora font-normal text-[#00191B]"
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body-sm"
                      className="font-figtree font-normal text-[#5F6C6D] leading-relaxed"
                    >
                      {step.description}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
