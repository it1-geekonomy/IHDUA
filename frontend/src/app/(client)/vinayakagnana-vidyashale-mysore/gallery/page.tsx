import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveImpactGalleryPage } from "@/domains/impact/cms/resolveImpactPage";
import { ImpactGalleryView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";

export const dynamic = "force-dynamic";

/** Covers both historical and current CMS slugs for this school. */
const SLUG = "vinayaka-jnana-vidyashale-mysuru";

export async function generateMetadata(): Promise<Metadata> {
  const loaded = await resolveImpactGalleryPage(SLUG);
  if (!loaded) return {};
  return {
    title: `Gallery · ${loaded.page.metaTitle || loaded.data.heroTitle}`,
    description: loaded.page.metaDescription || loaded.data.heroDescription || undefined,
  };
}

export default async function VinayakaGalleryPage() {
  const loaded = await resolveImpactGalleryPage(SLUG);
  if (!loaded) notFound();

  return (
    <main className="w-full">
      <ImpactGalleryView data={loaded.data} withChrome />
      <NewsletterSection />
    </main>
  );
}
