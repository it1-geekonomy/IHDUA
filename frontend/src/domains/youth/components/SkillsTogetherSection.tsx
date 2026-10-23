import SkillsTogether from "@/shared/components/SkillsTogether";

const SkillsTogetherSection = () => {
  return (
    <SkillsTogether
      label="Youth Skill Development"
      heading="Building Skills Together"
      descriptions={[
        "IHDUA supports rural students through vocational training programmes that develop practical skills and prepare them for employment opportunities. Courses include computer training, General Duty Assistant (GDA), tailoring and other vocational disciplines.",
        "These programmes help rural youth develop practical skills, gain confidence and prepare for future employment opportunities.",
      ]}
      items={[
        {
          icon: "/skills%20and%20employement/practiclelearning.png",
          title: "Practical Learning",
          description: "Develop useful skills through hands-on training.",
        },
        {
          icon: "/skills%20and%20employement/training.png",
          title: "Training & Guidance",
          description: "Learn through structured vocational programmes.",
        },
        {
          icon: "/skills%20and%20employement/peersupport.png",
          title: "Peer Support",
          description: "Build confidence through shared learning.",
        },
        {
          icon: "/skills%20and%20employement/credit.png",
          title: "Access to Credit",
          description: "Prepare for future employment opportunities.",
        },
      ]}
    />
  );
};

export default SkillsTogetherSection;