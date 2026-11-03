import GallerySection from "@/shared/components/Gallerysection";

export default function GallerySingleRow() {
  return (
    <GallerySection
      heading="Gallery"
      rows={1}
      images={[
        {
          src: "/Stitchingunit/Gallerypic1.png",
          alt: "Women receiving a certificate at a community programme",
        },
        {
          src: "/Stitchingunit/Gallerypic2.png",
          alt: "Women attending a training session in a hall",
        },
        {
          src: "/Stitchingunit/Gallerypic3.png",
          alt: "Women receiving a certificate at a community programme",
        },
        {
          src: "/Stitchingunit/Gallerypic4.png",
          alt: "Women attending a training session in a hall",
        },
      ]}
    />
  );
}