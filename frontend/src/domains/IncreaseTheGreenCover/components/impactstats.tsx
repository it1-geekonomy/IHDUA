import ImpactStats from "@/shared/components/ImpactStats";

const ImpactStatsSection = () => {
  return (
    <ImpactStats
      heading="The Impact We Make"
      description="IHDUA’s Model Village project includes horticulture activities, fruit sapling distribution and agroforestry learning. These initiatives support nutrition, low-cost cultivation and sustainable agricultural practices."
      bannerHeading="Creating Lasting Change"
      stats={[
        {
          icon: "/Healthawareness/160.png",
          iconBg: "#F1E7F4",
          value: "5/family",
          label: "Fruit saplings distributed",
        },
        {
          icon: "/Healthawareness/855.png",
          iconBg: "#FFEDCF",
          value: "16",
          label: "Participants in Model Village exposure visit",
        },
        {
          icon: "/Healthawareness/988.png",
          iconBg: "#F1E7F4",
          value: "18",
          label: "Participants from other villages in exposure visit",
        },
        {
          icon: "/Healthawareness/34.png",
          iconBg: "#FFEDCF",
          value: "32",
          label: "Farmers reached through sunflower cultivation awareness",
        },
      ]}
    />
  );
};

export default ImpactStatsSection;