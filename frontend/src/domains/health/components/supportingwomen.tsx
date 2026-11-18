import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection";
import { fetchImpactCategoryCards } from "@/shared/lib/impactApi";

export default async function HealthCardsSection() {
  const apiCards = await fetchImpactCategoryCards("health");

  const items: ImageCardItem[] =
    apiCards && apiCards.length > 0
      ? apiCards.map((card, idx) => ({
          title: card.title || card.name,
          image: card.imageUrl || "",
          imageAlt: card.title || card.name,
          href: card.slug.startsWith("/") ? card.slug : `/${card.slug}`,
          theme: (idx % 2 === 0 ? "purple" : "amber") as ImageCardItem["theme"],
        }))
      : [];

  return (
    <ImageCardsSection
      label="HEALTH INITIATIVES"
      heading={["Supporting Women to", "Lead and Grow"]}
      description="We create opportunities for women to strengthen their skills, participate in economic activities and enhance their decision-making power. Through initiatives such as microfinance and vocational training, IHDUA supports women in becoming equal stakeholders in their households and communities."
      items={items}
      categorySlug="health"
    />
  );
}
