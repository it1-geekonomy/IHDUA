import Typography from "@/lib/Typography";

const HEALTH_LABEL = "HOW WE SUPPORT VILLAGES";
const HEALTH_HEADING = "Building a Sustainable Future";
const HEALTH_DESC =
"IHDUA’s initiatives include soil health training, composting, livestock support, sanitation improvements and solar street lighting. These activities address local needs while supporting sustainable farming and better village infrastructure.";
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
              <span className="h-px w-6 bg-[#9739A8] sm:hidden" aria-hidden="true" />
            </div>

            <Typography
              variant="h2"
              className="w-full font-lora text-[#00191B]"
            >
              {HEALTH_HEADING}
            </Typography>
          </div>

          {/* Description */}
          <Typography
            variant="body-lg"
            className="w-full font-figtree font-normal text-[#5F6C6D] text-center sm:text-left"
          >
            {HEALTH_DESC}
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default HealthAwarenessSection;