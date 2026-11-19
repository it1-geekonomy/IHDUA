import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveImpactGalleryPage } from "@/domains/impact/cms/resolveImpactPage";
import { ImpactGalleryView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";
import { buildImpactGalleryMetadata } from "@/shared/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await resolveImpactGalleryPage(slug);
  const gallery = (loaded?.data.content.gallery || {}) as { heading?: string };
  return buildImpactGalleryMetadata(slug, loaded?.page, gallery.heading);
}

/** CMS-driven gallery for any initiative that has a separate gallery page. */
export default async function DynamicImpactGalleryPage({ params }: Props) {
  const { slug } = await params;
  const loaded = await resolveImpactGalleryPage(slug);
  if (!loaded) notFound();

  return (
    <main className="w-full">
      <ImpactGalleryView data={loaded.data} withChrome />
      <NewsletterSection />
    </main>
  );
}
