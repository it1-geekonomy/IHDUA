import ImpactStats from "@/shared/components/ImpactStats";

const ImpactStatsSection = () => {
  return (
    <ImpactStats
      heading="The Impact We Make"
      description="IHDUA’s vocational training programme gives rural women the opportunity to develop practical tailoring skills that can be used for employment or home-based work. By learning within their own communities, participants can build skills while continuing to manage their existing family responsibilities."
      bannerHeading="Turning Skills Into Opportunities"
      stats={[
        {
          icon: "/Healthawareness/160.png",
          iconBg: "#F1E7F4",
          value: "250+",
          label: "Women Benefited",
        },
        {
          icon: "/Healthawareness/855.png",
          iconBg: "#FFEDCF",
          value: "06 Months",
          label: "Training Duration",
        },
        {
          icon: "/Healthawareness/988.png",
          iconBg: "#F1E7F4",
          value: "02",
          label: "Villages Per Year",
        },
        {
          icon: "/Healthawareness/34.png",
          iconBg: "#FFEDCF",
          value: "Since 2005",
          label: "Programme Running",
        },
      ]}
    />
  );
};

export default ImpactStatsSection;