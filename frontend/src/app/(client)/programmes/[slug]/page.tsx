import { notFound } from "next/navigation";
import HeroBanner from "@/shared/components/Herobanner";
import NewsletterSection from "@/shared/components/Newsletter";
import ProgrammeDetailSection from "@/domains/programmes/components/ProgrammeDetailSection";
import { PROGRAMMES_HERO } from "@/domains/programmes/constants/programmesHero";
import {
  fetchAllPublishedProgrammes,
  fetchProgrammeBySlug,
  type ProgrammeListItem,
} from "@/domains/programmes/lib/programmes";
import { buildPageMetadata } from "@/shared/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProgrammeSlugPageProps {
  params: Promise<{ slug: string }>;
}

const RELATED_COUNT = 3;

export async function generateStaticParams() {
  try {
    const items = await fetchAllPublishedProgrammes();
    return items.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProgrammeSlugPageProps) {
  const { slug } = await params;
  const programme = await fetchProgrammeBySlug(slug).catch(() => null);
  const path = `/programmes/${slug}`;

  if (!programme) {
    return buildPageMetadata({
      path,
      title: "Programme | IHDUA",
    });
  }

  const plain =
    programme.content
      ?.replace(/\s+/g, " ")
      .trim()
      .slice(0, 155) || PROGRAMMES_HERO.description;

  return buildPageMetadata({
    path,
    title: `${programme.title} | IHDUA`,
    description: plain,
    images: programme.eventMediaUrl
      ? [{ url: programme.eventMediaUrl, alt: programme.title }]
      : undefined,
  });
}

export default async function ProgrammeSlugPage({
  params,
}: ProgrammeSlugPageProps) {
  const { slug } = await params;

  const [programme, published] = await Promise.all([
    fetchProgrammeBySlug(slug).catch(() => null),
    fetchAllPublishedProgrammes().catch(() => [] as ProgrammeListItem[]),
  ]);

  if (!programme) {
    notFound();
  }

  const related = published
    .filter((p) => p.id !== programme.id && p.slug)
    .slice(0, RELATED_COUNT);

  return (
    <main className="w-full">
      <HeroBanner
        heading={PROGRAMMES_HERO.heading}
        description={PROGRAMMES_HERO.description}
        image={PROGRAMMES_HERO.image}
        imageMobile={PROGRAMMES_HERO.imageMobile}
        imageAlt={PROGRAMMES_HERO.imageAlt}
      />

      <ProgrammeDetailSection programme={programme} related={related} />

      <NewsletterSection />
    </main>
  );
}
