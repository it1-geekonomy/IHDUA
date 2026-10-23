import AwarenessGallery from "@/shared/components/AwarenessGallery";

const AwarenessGallerySection = () => {
  return (
    <AwarenessGallery
      heading="Growing Through Sustainable Practices"
      descriptions={[
        "Horticulture and agroforestry are among the agricultural activities documented in IHDUA’s Model Village project. These initiatives connect farming practices with nutrition, resource use and sustainable rural development.",
        "Horticulture and agroforestry are among the agricultural activities documented in IHDUA’s Model Village project. These initiatives connect farming practices with nutrition, resource use and sustainable rural development.",
      ]}
      images={[
        {
          src: "/modelvillage/growing1.png",
          alt: "Health awareness session with women and children seated on the floor",
        },
        {
          src: "/modelvillage/growing2.png",
          alt: "Students in green uniforms attending a session in a classroom",
        },
        {
          src: "/modelvillage/growing3.png",
          alt: "Awareness session held outdoors in front of a school building",
        },
        {
          src: "/modelvillage/growing4.png",
          alt: "Students in blue uniforms seated on the ground at a session",
        },
      ]}
    />
  );
};

export default AwarenessGallerySection;