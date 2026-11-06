import AwarenessGallery from "@/shared/components/AwarenessGallery";

const AwarenessGallerySection = () => {
  return (
    <AwarenessGallery
      heading="Creating Awareness Through Education"
      descriptions={[
        "IHDUA’s documented activities include health education for women’s Self-Help Groups, training for Anganwadi workers and reproductive and child health awareness sessions. These programmes covered nutrition, hygiene and maternal and child health.",
        "Sessions also addressed anaemia, menstruation, sanitation and family planning, helping participants access essential health information.",
      ]}
      images={[
        {
          src:  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855228960-qt5ei-rectangle-35-3-.webp",
          alt: "Health awareness session with women and children seated on the floor",
        },
        {
          src: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855271830-qp5id-rectangle-34-3-.webp",
          alt: "Students in green uniforms attending a session in a classroom",
        },
        {
          src:  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855308305-wvf5f-rectangle-35-4-.webp",
          alt: "Awareness session held outdoors in front of a school building",
        },
        {
          src:  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855335574-9w3eb-rectangle-34-4-.webp",
          alt: "Students in blue uniforms seated on the ground at a session",
        },
      ]}
    />
  );
};

export default AwarenessGallerySection;