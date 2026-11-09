import HeroBanner from "@/shared/components/Herobanner";
import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection";
import CommunityHealthBanner from "@/shared/components/CommunityHealthBanner";
import {
  EDUCATION_HUB_HERO,
  EDUCATION_TRANSFORMS_BANNER,
} from "@/domains/impact/education/constants/educationHub";
import { fetchImpactCategoryCards } from "@/shared/lib/impactApi";

export const dynamic = "force-dynamic";

export default async function ImpactPage() {
  const apiCards = await fetchImpactCategoryCards("education");

  const educationItems: ImageCardItem[] =
    apiCards && apiCards.length > 0
      ? apiCards.map((card, idx) => ({
          title: card.title || card.name,
          image: card.imageUrl || "",
          imageAlt: card.title || card.name,
          href: card.slug.startsWith("/") ? card.slug : `/${card.slug}`,
          theme: idx % 2 === 0 ? "purple" : "amber",
        }))
      : [];

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
        items={educationItems}
        categorySlug="education"
      />

      <CommunityHealthBanner
        heading={EDUCATION_TRANSFORMS_BANNER.heading}
        mainImage={EDUCATION_TRANSFORMS_BANNER.mainImage}
        mainImageAlt={EDUCATION_TRANSFORMS_BANNER.mainImageAlt}
        items={[...EDUCATION_TRANSFORMS_BANNER.items]}
      />
    </main>
  );
}