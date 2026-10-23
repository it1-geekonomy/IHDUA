import ImpactStats from "@/shared/components/ImpactStats";

const ImpactStatsSection = () => {
  return (
    <ImpactStats
      heading="The Impact We Make"
      description="IHDUA’s Skill Development Project provides rural students with training in computer skills, General Duty Assistant (GDA) and other vocational courses. The report records participation across multiple training programmes, supporting practical skill development and employment opportunities."
      bannerHeading="Creating Lasting Change"
      stats={[
        {
          icon: "/Healthawareness/160.png",
          iconBg: "#F1E7F4",
          value: "48+",
          label: "Soil health training participants.",
        },
        {
          icon: "/Healthawareness/855.png",
          iconBg: "#FFEDCF",
          value: "32+",
          label: "Turmeric cultivation awareness participants.",
        },
        {
          icon: "/Healthawareness/988.png",
          iconBg: "#F1E7F4",
          value: "15",
          label: "Farmers adopted foxtail millet.",
        },
        {
          icon: "/Healthawareness/34.png",
          iconBg: "#FFEDCF",
          value: "3,290+",
          label: "Farmers received green maize fodder.",
        },
      ]}
    />
  );
};

export default ImpactStatsSection;