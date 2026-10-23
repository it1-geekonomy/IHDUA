import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

const MissionSection = () => {
  return (
    <FeatureHighlightSection
      label="GREEN VILLAGE INITIATIVES"
      heading="Growing a Greener Future"
      description="IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods."
      
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Focus Areas",
          description: "Fruit sapling distribution, horticulture and sustainable farming practices.",
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Students",
          heading: "Programme Reach",
          description: "Fruit saplings, agroforestry learning and eco-friendly agricultural initiatives.",
        },
      ]}
    />
  );
};
export default MissionSection;
