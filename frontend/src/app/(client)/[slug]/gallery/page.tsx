import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveImpactGalleryPage } from "@/domains/impact/cms/resolveImpactPage";
import { ImpactGalleryView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await resolveImpactGalleryPage(slug);
  if (!loaded) return {};
  const gallery = (loaded.data.content.gallery || {}) as { heading?: string };
  const titleBase = loaded.page.metaTitle || `${loaded.data.heroTitle} | IHDUA`;
  return {
    title: `${gallery.heading || "Gallery"} · ${titleBase}`,
    description: loaded.page.metaDescription || loaded.data.heroDescription || undefined,
  };
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
