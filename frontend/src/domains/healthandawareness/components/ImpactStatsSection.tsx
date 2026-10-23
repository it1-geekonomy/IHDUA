import ImpactStats from "@/shared/components/ImpactStats";

const ImpactStatsSection = () => {
  return (
    <ImpactStats
      heading="The Impact We Make"
      description="IHDUA's health awareness programmes have covered nutrition, hygiene, anaemia and reproductive health. Historical records document educational sessions for women, schoolchildren and Anganwadi workers. These initiatives helped share essential health information with rural communities."
      bannerHeading="Creating Lasting Change"
      stats={[
        {
          icon: "/Healthawareness/160.png",
          iconBg: "#F1E7F4",
          value: "160",
          label: "Reproductive and child health sessions",
        },
        {
          icon: "/Healthawareness/855.png",
          iconBg: "#FFEDCF",
          value: "855",
          label: "Women in nutrition & anaemia sessions",
        },
        {
          icon: "/Healthawareness/988.png",
          iconBg: "#F1E7F4",
          value: "988",
          label: "Women reached through hygiene sessions",
        },
        {
          icon: "/Healthawareness/34.png",
          iconBg: "#FFEDCF",
          value: "34+",
          label: "Anganwadi workers trained",
        },
      ]}
    />
  );
};

export default ImpactStatsSection;