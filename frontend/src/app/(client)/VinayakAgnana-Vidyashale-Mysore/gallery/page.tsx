import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import GallerySection from "@/shared/components/Gallerysection";
import NewsletterSection from "@/shared/components/Newsletter";
import {
  VINAYAKA_HERO,
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
        heading={VINAYAKA_HERO.heading}
        description={VINAYAKA_HERO.description}
        image={VINAYAKA_HERO.image}
        imageMobile={VINAYAKA_HERO.imageMobile}
        imageAlt={VINAYAKA_HERO.imageAlt}
      />

      <FeatureHighlightSection
        label={VINAYAKA_HEADER.eyebrow}
        heading={VINAYAKA_HEADER.title}
        description={VINAYAKA_HEADER.description}
        button={{
          label: VINAYAKA_HEADER.buttonText,
          href: VINAYAKA_HEADER.websiteUrl,
          external: true,
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
