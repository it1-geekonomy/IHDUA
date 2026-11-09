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
      heading={["Promoting Health &", "Well-being in Communities"]}
      description="IHDUA conducts health awareness programmes, medical checkups and healthcare camps to improve well-being in rural areas."
      items={items}
      categorySlug="health"
    />
  );
}
