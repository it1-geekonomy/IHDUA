import Image from "next/image";
import Typography from "@/lib/Typography";

const ITEMS = [
  {
    icon: "/Health/h1.png",
    iconBg: "#F1E7F4",
    title: "Build Confidence",
  },
  {
    icon: "/Health/h2.png",
    iconBg: "#FFEDCF",
    title: "Create Opportunities",
  },
  {
    icon: "/Health/h3.png",
    iconBg: "#F1E7F4",
    title: "Develop Skills",
  },
];

export default function WomenEmpowermentStat() {
  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 pb-6 lg:px-10 lg:pt-8 lg:pb-8 xl:pt-16 xl:pb-16 2xl:px-40">
        <div className="flex w-full flex-col overflow-hidden bg-[#FEF7EF] sm:flex-row sm:items-stretch">
          {/* Left Content Area: Heading + 3 Feature Icons */}
          <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-6 px-4 pt-8 pb-6 sm:flex-row sm:items-center sm:gap-2 sm:px-3 sm:py-3 md:gap-3 md:px-4 lg:gap-6 lg:px-8 lg:py-4 xl:px-10">
            {/* Heading: Centered single-line on mobile (matches Health), 2-line stacked on sm+ */}
            <Typography
              variant="h4"
              className="w-fit shrink-0 whitespace-nowrap text-center font-figtree font-medium bg-gradient-to-r from-[#9739A8] to-[#E6AC20] bg-clip-text text-transparent sm:text-left text-[20px] sm:text-[16px] md:text-[18px] lg:text-[26px] xl:text-[28px]"
            >
              <span className="sm:block">Women</span>
              <span className="sm:hidden">&nbsp;</span>
              <span className="sm:block">Empowerment</span>
            </Typography>

            {/* 3 Items: Dividers are hidden on mobile to give ample breathing room, visible on sm+ */}
            <div className="flex w-full min-w-0 flex-1 items-stretch justify-between sm:justify-evenly">
              {ITEMS.map((item, index) => (
                <div
                  key={item.title}
                  className="flex min-w-0 flex-1 items-stretch"
                >
                  {index > 0 && (
                    <span
                      className="hidden w-px self-stretch bg-[#FCE1A0] shrink-0 sm:block"
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex w-full min-w-0 flex-col items-center justify-center gap-2 px-1 text-center sm:gap-1.5 sm:px-1 md:gap-2 md:px-2 lg:gap-3 lg:px-6 xl:px-8">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-14 lg:w-14"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="h-6 w-6 object-contain sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-7 lg:w-7"
                      />
                    </div>

                    <Typography
                      variant="body-lg"
                      className="font-figtree font-medium text-[#501959] text-[13px] sm:text-[10px] md:text-[11px] lg:text-[15px] xl:text-[16px] leading-tight"
                    >
                      {item.title.split(" ").map((word, i, arr) => (
                        <span key={`${word}-${i}`}>
                          {word}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Illustration: Aligned to bottom-right (w-3/5 on mobile matching Health) */}
          <div className="w-3/5 shrink-0 self-end sm:w-[18%] sm:max-w-[130px] md:w-[20%] md:max-w-[160px] lg:w-[26%] lg:max-w-[280px] xl:w-[28%] xl:max-w-[340px] flex items-end justify-end">
            <Image
              src="/womenempowerment/empowerment-banner.png"
              alt="Women empowerment initiatives and collaborative learning"
              width={541}
              height={248}
              sizes="(min-width: 1536px) 28vw, (min-width: 1280px) 28vw, (min-width: 1024px) 26vw, (min-width: 768px) 20vw, (min-width: 640px) 18vw, 60vw"
              className="block h-auto w-full object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
