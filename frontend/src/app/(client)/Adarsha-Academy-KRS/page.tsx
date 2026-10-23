import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection";
import AdarshaStorySections from "@/domains/impact/education/components/AdarshaStorySections";
import NewsletterSection from "@/shared/components/Newsletter";
import {
  ADARSHA_HERO,
  ADARSHA_HIGHLIGHTS,
} from "@/domains/impact/education/constants/adarshaSchool";

export default function AdarshaAcademyPage() {
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

      <AdarshaStorySections />

      <NewsletterSection />
    </main>
  );
}