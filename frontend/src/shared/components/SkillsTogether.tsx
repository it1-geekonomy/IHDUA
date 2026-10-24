import Image from "next/image";
import Typography from "@/lib/Typography";

export interface SkillFeatureItem {
  icon: string; // image path, e.g. "/skills%20and%20employement/training.png"
  title: string;
  description: string;
}

export interface SkillsTogetherProps {
  label: string;
  heading: string;
  descriptions: string[]; // each string renders as its own paragraph
  items: SkillFeatureItem[]; // up to 4 items, shown as a 2x2 grid from 640px up
}

// Figma divider gradient:
// #E3CCF9 at 2.75% -> #9D8BB3 at 50% -> #E3CCF9 at 97%
// Always 1px thick so it renders on every screen (0.5px can round to 0).
const DIVIDER_V =
  "bg-[linear-gradient(to_bottom,#E3CCF9_2.75%,#9D8BB3_50%,#E3CCF9_97%)]";
const DIVIDER_H =
  "bg-[linear-gradient(to_right,#E3CCF9_2.75%,#9D8BB3_50%,#E3CCF9_97%)]";

// Divider lengths
const DIVIDER_LENGTH_H = "sm:h-24 lg:h-32 xl:h-40"; // vertical line height
const DIVIDER_LENGTH_W = "sm:w-48 lg:w-60 xl:w-80"; // horizontal line width (longer)

// Grid cell for each item from 640px up.
// Columns: 1 = left, 2 = vertical divider, 3 = right.
// Rows: 1 = top, 2 = horizontal divider, 3 = bottom.
const ITEM_CELLS = [
  "sm:col-start-1 sm:row-start-1",
  "sm:col-start-3 sm:row-start-1",
  "sm:col-start-1 sm:row-start-3",
  "sm:col-start-3 sm:row-start-3",
];

const SkillsTogether = ({
  label,
  heading,
  descriptions,
  items,
}: SkillsTogetherProps) => {
  return (
    <section className="w-full bg-white">
      {/* Outer wrapper: vertical space only (above and below the box), no left/right space */}
      <div className="w-full pt-6 lg:pt-8 xl:pt-14">
        {/* Colored box: full width. Horizontal padding keeps the content
            aligned with the other sections; vertical padding inside is small. */}
        <div className="w-full bg-[#F3EEF9] px-6 py-4 sm:py-5 lg:px-10 lg:py-5 xl:py-6 2xl:px-40">
          {/* Below lg: text block, then features stacked.
              lg: label + heading span the full width on top; below them the
                  descriptions sit on the left and the stats on the right.
              xl and up: two equal columns, text block left, stats right. */}
          <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-4 lg:gap-y-5 xl:grid-cols-2 xl:gap-16">
            {/* Label + heading + descriptions.
                At lg this wrapper uses display: contents so its two children
                become direct cells of the outer grid. From xl it is a normal
                flex column again. */}
            <div className="flex w-full flex-col gap-4 lg:contents xl:flex xl:gap-5">
              {/* Label + heading: centered below 1024px, left-aligned from lg */}
              <div className="flex w-full flex-col items-center gap-3 text-center lg:col-span-2 lg:items-start lg:text-left xl:col-span-1">
                {/* Label with decorative lines on both sides */}
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
                  <Typography
                    variant="caption"
                    className="font-bold font-figtree uppercase text-[#9739A8]"
                  >
                    {label}
                  </Typography>
                  <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
                </div>

                <Typography
                  variant="h3"
                  className="w-full font-lora font-normal text-[#00191B]"
                >
                  {heading}
                </Typography>
              </div>

              <div className="flex w-full flex-col gap-3 lg:gap-4">
                {descriptions.map((para, index) => (
                  <Typography
                    key={index}
                    variant="body-lg"
                    className="w-full font-figtree font-normal text-[#5F6C6D] text-center lg:text-left"
                  >
                    {para}
                  </Typography>
                ))}
              </div>
            </div>

            {/* Features.
                Below 640px: 1 column, no dividers.
                640px and up: the two item columns are sized to their content and
                the whole group is centered. The 1px middle column holds the
                dividers, with the same gap on both sides, so the line is always
                visually centered between the left and right items. */}
            <div className="grid w-full grid-cols-1 gap-y-6 sm:grid-cols-[minmax(0,auto)_1px_minmax(0,auto)] sm:grid-rows-[auto_1px_auto] sm:justify-center sm:gap-x-6 sm:gap-y-4 lg:gap-x-4 lg:gap-y-3 xl:gap-x-8 xl:gap-y-6">
              {/* Vertical divider: middle column, spans all 3 rows */}
              <span
                className={`pointer-events-none hidden w-px sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:block sm:self-center sm:justify-self-center ${DIVIDER_LENGTH_H} ${DIVIDER_V}`}
                aria-hidden="true"
              />
              {/* Horizontal divider: same middle column, middle row. It is centered
                  on the 1px cell, so both lines cross at exactly the same point. */}
              <span
                className={`pointer-events-none hidden h-px sm:col-start-2 sm:row-start-2 sm:block sm:self-center sm:justify-self-center ${DIVIDER_LENGTH_W} ${DIVIDER_H}`}
                aria-hidden="true"
              />

              {items.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className={`flex min-w-0 items-start gap-3 lg:gap-2.5 xl:gap-4 ${ITEM_CELLS[index] ?? ""}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9966A2] sm:h-11 sm:w-11 lg:h-10 lg:w-10 xl:h-12 xl:w-12">
                    <Image
                      src={item.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="h-5 w-5 object-contain brightness-0 invert xl:h-6 xl:w-6"
                    />
                  </div>

                  <div className="flex min-w-0 flex-col gap-1">
                    <Typography
                      variant="body-lg"
                      className="font-lora font-normal text-[#00191B]"
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body-sm"
                      className="font-figtree font-normal text-[#5F6C6D] normal-case"
                    >
                      {item.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsTogether;