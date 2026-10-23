import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection";
import GallerySection from "@/shared/components/Gallerysection";
import NewsletterSection from "@/shared/components/Newsletter";
import {
  ADARSHA_HERO,
  ADARSHA_HIGHLIGHTS,
  ADARSHA_GALLERY,
} from "@/domains/impact/education/constants/adarshaSchool";

export default function AdarshaAcademyGalleryPage() {
  return (
    <main className="w-full">
      <HeroBanner
        heading={ADARSHA_HERO.heading}
        description={ADARSHA_HERO.description}
        image={ADARSHA_HERO.image}
        imageMobile={ADARSHA_HERO.imageMobile}
        imageAlt={ADARSHA_HERO.imageAlt}
      />

      <FeatureHighlightSection
        label="EDUCATION"
        heading="Adarsha Academy"
        description="A rural private school providing education to children from villages in the vicinity of the Krishnarajasagara (KRS) Dam."
        items={[...ADARSHA_HIGHLIGHTS]}
      />

      <GallerySection
        heading="Gallery"
        images={[...ADARSHA_GALLERY]}
      />

      <NewsletterSection />
    </main>
  );
}
