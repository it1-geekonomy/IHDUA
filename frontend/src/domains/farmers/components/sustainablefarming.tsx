import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

const MissionSection = () => {
  return (
    <FeatureHighlightSection
      label="FARMER EMPOWERMENT"
      heading="Sustainable Farming"
      description="IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods."
      
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Focus Areas",
          description: "Sustainable agriculture, soil health, crop cultivation and livestock care.",
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Students",
          heading: "Programme Reach",
          description: "Farmer support through agricultural training, demonstrations and Model Village initiatives.",
        },
      ]}
    />
  );
};
export default MissionSection;
