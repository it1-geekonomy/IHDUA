import AwarenessGallery from "@/shared/components/AwarenessGallery";

const AwarenessGallerySection = () => {
  return (
    <AwarenessGallery
      heading="Building Healthier Communities"
      descriptions={[
        "IHDUA’s health awareness initiatives cover nutrition, hygiene, sanitation and reproductive health. The programmes address common health concerns and share essential health information with rural women and families.",
        "Documented activities include health education sessions, Anganwadi worker training, nutrition awareness and reproductive and child health programmes. These initiatives promote health knowledge and well-being in rural communities.",
      ]}
      images={[
        {
          src: "/Healthcamps/camps1.png",
          alt: "Health awareness session with women and children seated on the floor",
        },
        {
          src: "/Healthcamps/camps2.png",
          alt: "Students in green uniforms attending a session in a classroom",
        },
        {
          src: "/Healthcamps/camps3.png",
          alt: "Awareness session held outdoors in front of a school building",
        },
        {
          src: "/Healthcamps/camps4.png",
          alt: "Students in blue uniforms seated on the ground at a session",
        },
      ]}
    />
  );
};

export default AwarenessGallerySection;