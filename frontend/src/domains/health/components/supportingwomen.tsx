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
      label="COMMUNITY HEALTH"
      heading={["Better Health Through", "Awareness and Care"]}
      description="IHDUA works to improve rural health awareness through educational sessions, preventive healthcare initiatives and medical camps. The focus is on helping individuals and families make informed health decisions and access essential medical support."
      items={items}
      categorySlug="health"
    />
  );
}
