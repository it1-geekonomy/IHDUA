import Typography from "@/lib/Typography";

const HEALTH_LABEL = "WHY VILLAGE DEVELOPMENT MATTERS";
const HEALTH_HEADING = "Supporting Holistic Village Development";
const HEALTH_DESC = [
  "IHDUA’s Model Village project combines agricultural, livestock and infrastructure initiatives to address local needs. Documented activities include soil health training, composting, crop cultivation awareness, veterinary camps and sanitation improvements. The project also includes fruit sapling distribution, green fodder support, toilet construction and solar street-light installation.",
];

const HealthAwarenessSection = () => {
  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-8 2xl:px-40">
        <div className="flex w-full flex-col gap-4 lg:gap-6">
          {/* Label + Heading */}
          <div className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            {/* Label with decorative lines */}
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              <Typography
                variant="caption"
                className="font-bold font-figtree uppercase text-[#9739A8]"
              >
                {HEALTH_LABEL}
              </Typography>
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            </div>

            <Typography
              variant="h3"
              className="w-full font-lora text-[#00191B]"
            >
              {HEALTH_HEADING}
            </Typography>
          </div>

          {/* Description paragraphs */}
          <div className="flex w-full flex-col gap-3 lg:gap-4">
            {HEALTH_DESC.map((para, index) => (
              <Typography
                key={index}
                variant="body-lg"
                className="w-full font-figtree font-normal text-[#5F6C6D]"
              >
                {para}
              </Typography>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthAwarenessSection;