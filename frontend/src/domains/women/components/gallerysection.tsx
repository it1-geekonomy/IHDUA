import GallerySection from "@/shared/components/Gallerysection"; // adjust to where your component file lives

const IMG_1 = "/skills and employement/g1.png";
const IMG_2 = "/skills and employement/g2.png";
const IMG_3 = "/skills and employement/g3.png";
const IMG_4 = "/skills and employement/g4.png";
const IMG_5 = "/skills and employement/g5.png";
const IMG_6 = "/skills and employement/g6.png";
const IMG_7 = "/skills and employement/g7.png";
const IMG_8 = "/skills and employement/g8.png";
const IMG_9 = "/skills and employement/g9.png";
const IMG_10 = "/skills and employement/g10.png";
const IMG_11 = "/skills and employement/g11.png";
const IMG_12 = "/skills and employement/g12.png";

export default function SkillsAndEmploymentGallery() {
  return (
    <GallerySection
      heading="Gallery"
      images={[
        { src: encodeURI(IMG_1), alt: "Gallery photo 1" },
        { src: encodeURI(IMG_2), alt: "Gallery photo 2" },
        { src: encodeURI(IMG_3), alt: "Gallery photo 3" },
        { src: encodeURI(IMG_4), alt: "Gallery photo 4" },
        { src: encodeURI(IMG_5), alt: "Gallery photo 5" },
        { src: encodeURI(IMG_6), alt: "Gallery photo 6" },
        { src: encodeURI(IMG_7), alt: "Gallery photo 7" },
        { src: encodeURI(IMG_8), alt: "Gallery photo 8" },
        { src: encodeURI(IMG_9), alt: "Gallery photo 9" },
        { src: encodeURI(IMG_10), alt: "Gallery photo 10" },
        { src: encodeURI(IMG_11), alt: "Gallery photo 11" },
        { src: encodeURI(IMG_12), alt: "Gallery photo 12" },
      ]}
    />
  );
}