import AwarenessGallery from "@/shared/components/AwarenessGallery";

const AwarenessGallerySection = () => {
  return (
    <AwarenessGallery
      heading="Building a Sustainable Village"
      descriptions={[
        "IHDUA’s Model Village project focuses on Chikkahundi village in Gundlupet taluk, supporting holistic development through sustainable agriculture, organic farming and eco-friendly activities. The project addresses community needs through agricultural, livestock and infrastructure initiatives.",
        "Documented activities include soil health training, vermicompost production, fruit sapling distribution, veterinary camps, toilet construction and solar street-light installation. These initiatives support farming practices, livestock well-being and village infrastructure.",
      ]}
      images={[
        {
          src: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855083670-yngwd-rectangle-35-1-.webp",
          alt: "Health awareness session with women and children seated on the floor",
        },
        {
          src: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855119443-xxlen-rectangle-34-1-.webp",
          alt: "Students in green uniforms attending a session in a classroom",
        },
        {
          src:  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855146655-ejch2-rectangle-35-2-.webp",
          alt: "Awareness session held outdoors in front of a school building",
        },
        {
          src: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855184197-xhmu6-rectangle-34-2-.webp",
          alt: "Students in blue uniforms seated on the ground at a session",
        },
      ]}
    />
  );
};

export default AwarenessGallerySection;