import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import GallerySection from "@/shared/components/Gallerysection";
import NewsletterSection from "@/shared/components/Newsletter";
import {
  VINAYAKA_GALLERY_HERO,
  VINAYAKA_HEADER,
  VINAYAKA_GALLERY,
} from "@/domains/impact/education/constants/vinayakaSchool";

export default function MullurSchoolGalleryPage() {
  const galleryImages = VINAYAKA_GALLERY.map((photo) => ({
    src: photo.src,
    alt: photo.alt,
  }));

  return (
    <main className="w-full">
      <HeroBanner
        heading={VINAYAKA_GALLERY_HERO.heading}
        description={VINAYAKA_GALLERY_HERO.description}
        image={VINAYAKA_GALLERY_HERO.image}
        imageMobile={VINAYAKA_GALLERY_HERO.imageMobile}
        imageAlt={VINAYAKA_GALLERY_HERO.imageAlt}
      />

      <FeatureHighlightSection
        label={VINAYAKA_HEADER.eyebrow}
        heading={VINAYAKA_HEADER.title}
        description={VINAYAKA_HEADER.description}
        button={{
          label: VINAYAKA_HEADER.buttonText,
        }}
        items={[...VINAYAKA_HEADER.highlights]}
      />

      <GallerySection
        heading="Gallery"
        images={galleryImages}
      />

      <NewsletterSection />
    </main>
  );
}
