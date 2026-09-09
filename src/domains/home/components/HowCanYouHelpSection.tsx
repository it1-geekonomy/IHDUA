import Image from "next/image";
import { HELP_ITEMS } from "@/domains/home/constants/howcanwehelp";
export default function HowCanYouHelpSection() {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:py-30 lg:px-10 2xl:px-40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="text-3xl font-serif text-[#00191B] sm:text-5xl">
            How can you help?
          </h2>
          <p className="w-full lg:max-w-xl xl:max-w-3xl text-sm leading-relaxed text-[#5F6C6D] sm:text-lg md:text-left">
            Together, we can create stronger communities and lasting
            opportunities. Your support helps IHDUA strengthen rural
            communities through education, sustainable livelihoods,
            healthcare, and community-led development.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:justify-items-stretch sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          {HELP_ITEMS.map((item) => (
            <div key={item.title} className="flex w-[280px] flex-col sm:w-full">
              <span className="h-[3px] w-full bg-[#9739A8]" />
              <div className="flex h-full flex-col bg-[#FAF9F5] px-5 py-6 sm:px-6 sm:py-8">
                <div className="flex h-14 w-14 items-center justify-center bg-[#FFD638] sm:h-16 sm:w-16">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain sm:h-8 sm:w-8"
                  />
                </div>

                <h3 className="mt-6 text-lg font-serif text-[#00191B] sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5F6C6D] sm:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}