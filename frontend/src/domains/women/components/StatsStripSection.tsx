import StatsStrip from "@/shared/components/StatsStrip";

const StatsStripSection = () => {
  return (
    <StatsStrip
      items={[
        {
          icon: "/skills and employement/697.png",
          value: "697+",
          label: "Self-Help Groups formed",
        },
        {
          icon: "/skills and employement/7578.png",
          value: "7,578+",
          label: "SHG members",
        },
        {
          icon: "/skills and employement/18.png",
          value: "18",
          label: "Federations reported",
        },
        {
          icon: "/skills and employement/3290.png",
          value: "3,290+",
          label: "Skill development participants recorded",
        },
      ]}
    />
  );
};

export default StatsStripSection;