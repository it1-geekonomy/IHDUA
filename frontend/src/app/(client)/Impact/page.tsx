import HeroBanner from "@/shared/components/Herobanner";
import ImageCardsSection from "@/shared/components/Imagecardsection";
import CommunityHealthBanner from "@/shared/components/CommunityHealthBanner";
import MovementMarquee from "@/domains/home/components/Movementmarquee";
import {
  EDUCATION_HUB_HERO,
  EDUCATION_SCHOOL_ITEMS,
  EDUCATION_TRANSFORMS_BANNER,
} from "@/domains/impact/education/constants/educationHub";

export default function ImpactPage() {
  return (
    <main className="w-full">
      <HeroBanner
        heading={EDUCATION_HUB_HERO.heading}
        description={EDUCATION_HUB_HERO.description}
        image={EDUCATION_HUB_HERO.image}
        imageMobile={EDUCATION_HUB_HERO.imageMobile}
        imageAlt={EDUCATION_HUB_HERO.imageAlt}
      />

      <ImageCardsSection
        label="RURAL EDUCATION"
        heading="Creating Opportunities Through Education"
        description="IHDUA works to support education in rural communities by creating opportunities for children to access learning and develop their potential. Our education initiatives include Mullur School and Adarsha Academy, with a focus on providing learning opportunities for children from rural communities."
        items={EDUCATION_SCHOOL_ITEMS}
      />

      <CommunityHealthBanner
        heading={EDUCATION_TRANSFORMS_BANNER.heading}
        mainImage={EDUCATION_TRANSFORMS_BANNER.mainImage}
        mainImageAlt={EDUCATION_TRANSFORMS_BANNER.mainImageAlt}
        items={[...EDUCATION_TRANSFORMS_BANNER.items]}
      />

      <MovementMarquee />
    </main>
  );
}