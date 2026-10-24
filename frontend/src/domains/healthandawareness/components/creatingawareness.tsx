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
          src: "/Healthawareness/awareness1.png",
          alt: "Health awareness session with women and children seated on the floor",
        },
        {
          src: "/Healthawareness/awareness2.png",
          alt: "Students in green uniforms attending a session in a classroom",
        },
        {
          src: "/Healthawareness/awareness3.png",
          alt: "Awareness session held outdoors in front of a school building",
        },
        {
          src: "/Healthawareness/awareness4.png",
          alt: "Students in blue uniforms seated on the ground at a session",
        },
      ]}
    />
  );
};

export default AwarenessGallerySection;