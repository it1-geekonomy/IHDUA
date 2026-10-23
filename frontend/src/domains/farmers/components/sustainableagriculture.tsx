import SkillsTogether from "@/shared/components/SkillsTogether";

const SkillsTogetherSection = () => {
  return (
    <SkillsTogether
      label="SUSTAINABLE AGRICULTURE"
      heading="Supporting Farmers Together"
      descriptions={[
        "IHDUA’s Model Village project supports farmers through soil health training, composting, crop cultivation awareness and agricultural exposure visits. These activities promote sustainable farming practices and strengthen agricultural knowledge.",
        "These initiatives help farmers improve farming practices, support livestock health and strengthen rural livelihoods.",
      ]}
      items={[
        {
          icon: "/skills%20and%20employement/practiclelearning.png",
          title: "Soil Health",
          description: "Develop useful skills through hands-on training.",
        },
        {
          icon: "/skills%20and%20employement/training.png",
          title: "Crop Awareness",
          description: "Turmeric and sunflower cultivation awareness.",
        },
        {
          icon: "/skills%20and%20employement/peersupport.png",
          title: "Livestock Support",
          description: "Veterinary camps and green fodder distribution.",
        },
        {
          icon: "/skills%20and%20employement/credit.png",
          title: "Farmer Learning",
          description: "Agricultural exposure visits and practical learning.",
        },
      ]}
    />
  );
};

export default SkillsTogetherSection;