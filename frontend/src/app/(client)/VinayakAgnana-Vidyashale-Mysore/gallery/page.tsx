import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import GallerySection from "@/shared/components/Gallerysection";
import NewsletterSection from "@/shared/components/Newsletter";
import {
  VINAYAKA_HERO,
  VINAYAKA_GALLERY,
} from "@/domains/impact/education/constants/vinayakaSchool";

const HIGHLIGHT_ITEMS = [
  {
    icon: "/icons/mission.png",
    iconAlt: "School Mission",
    heading: "Mission",
    description: "Provide excellent primary school instruction for rural students.",
  },
  {
    icon: "/icons/benifit.png",
    iconAlt: "School Alumni",
    heading: "3,000+",
    description: "Students have completed 10th grade since the school was founded in 1994.",
  },
];

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
        label="EDUCATION"
        heading="Vinayaka Jnana Vidyashale, Mysuru"
        description="Creating opportunities for rural children through accessible, quality education."
        button={{
          label: "Visit School Website",
          href: "https://ihdua.org",
          external: true,
        }}
        items={HIGHLIGHT_ITEMS}
      />

      <GallerySection
        heading="Gallery"
        images={galleryImages}
      />

      <NewsletterSection />
    </main>
  );
}
