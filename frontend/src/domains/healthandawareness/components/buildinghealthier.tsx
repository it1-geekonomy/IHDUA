import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

const MissionSection = () => {
  return (
    <FeatureHighlightSection
      label="HEALTH AWARENESS"
      heading="Building Healthier Communities"
      description="IHDUA’s health education initiatives cover personal and environmental hygiene, nutrition, sanitation, reproductive health and common health concerns."
      
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Focus Areas",
          description: "Health education, hygiene practices, nutrition and reproductive health awareness.",
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Students",
          heading: "Programme Reach",
          description: "Health education reached SHG members, schoolchildren and Anganwadi workers.",
        },
      ]}
    />
  );
};
export default MissionSection;
