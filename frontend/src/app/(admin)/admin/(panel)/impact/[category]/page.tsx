import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ImpactCategoryManager } from "@/domains/admin/components/impact/ImpactCategoryManager";
import { getCategoryDef } from "@/domains/admin/components/impact/layouts";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const def = getCategoryDef((await params).category);
  return { title: `${def?.name ?? "Impact"} Pages | IHDUA Admin` };
}

export default async function AdminImpactCategoryRoute({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!getCategoryDef(category)) notFound();
  return (
    <Suspense>
      <ImpactCategoryManager categorySlug={category} />
    </Suspense>
  );
}
