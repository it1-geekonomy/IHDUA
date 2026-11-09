import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection";
import { fetchImpactCategoryCards } from "@/shared/lib/impactApi";

export default async function GrowingSustainably() {
  const apiCards = await fetchImpactCategoryCards("skills-and-employment");

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
      label="ORGANIC FARMING"
      heading={["Growing Sustainably.", "Farming for the Future"]}
      description="IHDUA promotes organic farming practices that support sustainable agriculture, healthier soil and environmentally responsible cultivation.
Through organic farming initiatives and training, the programme encourages practical approaches to sustainable cultivation and better farming practices."
      items={items}
      categorySlug="skills-and-employment"
    />
  );
}
