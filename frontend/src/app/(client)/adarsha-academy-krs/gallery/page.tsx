import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveImpactGalleryPage } from "@/domains/impact/cms/resolveImpactPage";
import { ImpactGalleryView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";
import { buildImpactGalleryMetadata } from "@/shared/lib/seo";

export const dynamic = "force-dynamic";

const SLUG = "adarsha-academy-krs";

export async function generateMetadata(): Promise<Metadata> {
  const loaded = await resolveImpactGalleryPage(SLUG);
  const gallery = (loaded?.data.content.gallery || {}) as { heading?: string };
  return buildImpactGalleryMetadata(SLUG, loaded?.page, gallery.heading);
}

export default async function AdarshaAcademyGalleryPage() {
  const loaded = await resolveImpactGalleryPage(SLUG);
  if (!loaded) notFound();

  return (
    <main className="w-full">
      <ImpactGalleryView data={loaded.data} withChrome />
      <NewsletterSection />
    </main>
  );
}
