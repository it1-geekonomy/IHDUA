import Typography from "@/lib/Typography";

const LABEL = "HOW WE SUPPORT WOMEN";
const HEADING = "Creating Pathways to Greater Independence";
const DESC =
  "IHDUA's women's empowerment work combines Self-Help Groups, microfinance initiatives and vocational training to create opportunities for women to build skills, participate in economic activities and take a more active role in their households and communities.";

export default function HowWeSupportWomen() {
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
                {LABEL}
              </Typography>
              <span className="h-px w-6 bg-[#9739A8] sm:hidden" aria-hidden="true" />
            </div>

            <Typography
              variant="h2"
              className="w-full font-lora text-[#00191B]"
            >
              {HEADING}
            </Typography>
          </div>

          {/* Description */}
          <Typography
            variant="body-lg"
            className="w-full font-figtree font-normal text-[#5F6C6D]"
          >
            {DESC}
          </Typography>
        </div>
      </div>
    </section>
  );
}
