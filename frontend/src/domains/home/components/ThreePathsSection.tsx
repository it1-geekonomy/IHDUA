import { PATHS } from "@/domains/home/constants/ThreePathsSection";
import Typography from "@/lib/Typography";

export default function ThreePathsSection() {
  return (
    <section className="w-full bg-[#FFD638]">
      <div className="w-full px-6 py-14 sm:px-10 sm:py-20 lg:px-10 lg:py-16 2xl:px-40">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#9739A8]" />
          <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
            Get Involved
          </Typography>
        </div>

        <Typography variant="h2" className="mt-4 font-lora font-normal text-[#00191B]">
          Three Paths to Shared Progress
        </Typography>

        <div className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:gap-12">
          {PATHS.map((path, index) => (
            <div
              key={path.title}
              className={`w-72 bg-white px-6 py-6 sm:w-full sm:px-7 sm:py-7 lg:mx-auto lg:w-full lg:max-w-lg lg:px-8 lg:py-6 xl:px-14 xl:py-10 ${
                index === 2
                  ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-theme(spacing.5))] lg:col-span-1 lg:max-w-lg"
                  : ""
              }`}
            >
              <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
                {path.label}
              </Typography>

              <Typography variant="h3" className="mt-4 font-lora font-normal text-[#00191B]">
                {path.title}
              </Typography>

              <Typography variant="body-lg" className="mt-6 leading-relaxed text-[#5F6C6D] font-normal font-figtree">
                {path.description}
              </Typography>

              <button className="mt-12 mb-4 w-full bg-[#9739A8] px-6 py-4 sm:w-fit cursor-pointer">
                <Typography variant="body-sm" className="font-medium font-figtree text-white">
                  {path.button}
                </Typography>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}