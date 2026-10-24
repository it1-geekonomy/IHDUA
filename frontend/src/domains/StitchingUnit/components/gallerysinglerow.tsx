import GallerySection1Row from "@/shared/components/Gallerysection1row";

export default function GallerySingleRow() {
  return(
    <GallerySection1Row 
        heading="Gallery"
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
};