import WomenOpportunities from "@/shared/components/WomenOpportunities";

const WomenOpportunitiesSection = () => {
  return (
    <WomenOpportunities
      heading="Supporting Farmers Together"
      topDescription="IHDUA’s Model Village project supports farmers through soil health training, composting, crop cultivation awareness and agricultural exposure visits. These activities encourage improved farming practices, promote sustainable agriculture and strengthen farmers’ knowledge."
      images={[
        {
          src: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793946279960-2yxa9-rectangle-35-5-.webp",
          alt: "Women receiving a certificate at a community programme",
        },
        {
          src: "/farmers/supportfarmers2.png",
          alt: "Women attending a training session in a hall",
        },
      ]}
      bottomDescription="The project also documents foxtail millet adoption, turmeric and sunflower cultivation awareness, fruit sapling distribution and vermicompost production. Livestock support includes veterinary camps, green fodder distribution and Azolla cultivation. These activities support animal health and sustainable farming practices."
    />
  );
};

export default WomenOpportunitiesSection;