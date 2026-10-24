import Image from "next/image";
import Typography from "@/lib/Typography";

export interface StatItem {
  icon: string;
  value: string; 
  label: string; 
}

export interface StatsStripProps {
  items: StatItem[];
}
const DIVIDER_V =
  "bg-[linear-gradient(to_bottom,#EFDFFF_0%,#CBB7E2_50%,#EFDFFF_100%)]";
const StatsStrip = ({ items }: StatsStripProps) => {
  return (
    <section className="w-full bg-white">
      <div className="w-full pt-6 lg:pt-8 xl:pt-14">
        <div className="w-full bg-[#F3EEF9] px-6 py-6 sm:py-6 lg:px-10 lg:py-6 xl:py-8 2xl:px-40">
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:flex sm:items-stretch sm:gap-0">
            {items.map((item, index) => (
              <div
                key={`${item.value}-${index}`}
                className="flex min-w-0 items-stretch sm:flex-1"
              >
                {index > 0 && (
                  <span
                    className={`pointer-events-none hidden w-px shrink-0 self-center sm:block sm:h-20 xl:h-24 ${DIVIDER_V}`}
                    aria-hidden="true"
                  />
                )}

                <div className="flex w-full min-w-0 flex-col items-center gap-2 px-1 text-center sm:px-3 lg:px-5 xl:gap-3 xl:px-8">
                  <Image
                    src={item.icon}
                    alt=""
                    width={40}
                    height={40}
                    className="h-8 w-8 object-contain sm:h-9 sm:w-9 xl:h-10 xl:w-10"
                  />

                  <div className="flex w-full flex-col items-center gap-1">
                    <Typography
                      variant="h4"
                      className="font-lora font-semibold text-[#9739A8]"
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      variant="body-sm"
                      className="max-w-[12rem] font-figtree font-normal text-[#5F6C6D]"
                    >
                      {item.label}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default StatsStrip;