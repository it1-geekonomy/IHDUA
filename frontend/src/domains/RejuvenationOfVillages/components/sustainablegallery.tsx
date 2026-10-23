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
          src: "/modelvillage/sustainablevillage1.png",
          alt: "Health awareness session with women and children seated on the floor",
        },
        {
          src: "/modelvillage/sustainablevillage2.png",
          alt: "Students in green uniforms attending a session in a classroom",
        },
        {
          src: "/modelvillage/sustainablevillage3.png",
          alt: "Awareness session held outdoors in front of a school building",
        },
        {
          src: "/modelvillage/sustainablevillage4.png",
          alt: "Students in blue uniforms seated on the ground at a session",
        },
      ]}
    />
  );
};

export default AwarenessGallerySection;