import WomenOpportunities from "@/shared/components/WomenOpportunities";

const WomenOpportunitiesSection = () => {
  return (
    <WomenOpportunities
      heading="Building Skills for a Brighter Future"
      topDescription="IHDUA’s Skill Development Project provides rural students with training in computer skills, Tally, GST and spoken English, alongside General Duty Assistant (GDA) and other vocational courses. These programmes aim to strengthen practical abilities and improve access to employment opportunities."
      images={[
        {
          src: "/youth/buildingskills1.png",
          alt: "Women receiving a certificate at a community programme",
        },
        {
          src: "/youth/buildingskills2.png",
          alt: "Women attending a training session in a hall",
        },
      ]}
      bottomDescription="The organisation also offers vocational training in tailoring, Aari work, Lippan art, Vision Assistant training and Thanjavur painting. Through these courses, students can explore different skills, develop their capabilities and prepare for future livelihood opportunities."
    />
  );
};

export default WomenOpportunitiesSection;