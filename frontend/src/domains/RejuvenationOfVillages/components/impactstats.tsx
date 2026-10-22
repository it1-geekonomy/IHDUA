import ImpactStats from "@/shared/components/ImpactStats";

const ImpactStatsSection = () => {
  return (
    <ImpactStats
      heading="The Impact We Make"
      description="IHDUA’s Model Village project records agricultural, livestock and village infrastructure initiatives. Activities include soil health training, composting, crop cultivation awareness, veterinary support and sanitation improvements."
      bannerHeading="Creating Lasting Change"
      stats={[
        {
          icon: "/Healthawareness/160.png",
          iconBg: "#F1E7F4",
          value: "16+",
          label: "Solar street lights installed",
        },
        {
          icon: "/Healthawareness/855.png",
          iconBg: "#FFEDCF",
          value: "14+",
          label: "People benefited from toilet construction",
        },
        {
          icon: "/Healthawareness/988.png",
          iconBg: "#F1E7F4",
          value: "48",
          label: "Soil health training participants",
        },
        {
          icon: "/Healthawareness/34.png",
          iconBg: "#FFEDCF",
          value: "81+",
          label: "Cattle covered by green fodder distribution",
        },
      ]}
    />
  );
};

export default ImpactStatsSection;