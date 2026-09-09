import { PATHS } from "@/domains/home/constants/ThreePathsSection";
export default function ThreePathsSection() {
  return (
    <section className="w-full bg-[#FFD638]">
      <div className="w-full px-6 py-14 sm:px-10 sm:py-20 lg:px-10 lg:py-16 2xl:px-40">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#9739A8]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9739A8]">
            Get Involved
          </span>
        </div>

        <h2 className="mt-4 font-serif text-3xl text-[#00191B] sm:text-4xl lg:text-5xl">
          Three Paths to Shared Progress
        </h2>

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
              <span className="text-xs font-bold uppercase tracking-widest text-[#9739A8]">
                {path.label}
              </span>

              <h3 className="mt-4 font-serif text-2xl text-[#00191B] sm:text-4xl">
                {path.title}
              </h3>

              <p className="mt-6 text-sm leading-relaxed text-[#5F6C6D] sm:text-lg">
                {path.description}
              </p>

              <button className="mt-12 mb-4 w-full bg-[#9739A8] px-6 py-4 text-md font-semibold text-white sm:w-fit">
                {path.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}