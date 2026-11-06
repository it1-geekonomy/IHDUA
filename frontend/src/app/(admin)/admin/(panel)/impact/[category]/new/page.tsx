import { notFound } from "next/navigation";
import { ImpactPageEditor } from "@/domains/admin/components/impact/ImpactPageEditor";
import { getCategoryDef } from "@/domains/admin/components/impact/layouts";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const def = getCategoryDef((await params).category);
  return { title: `New ${def?.name ?? "Impact"} Page | IHDUA Admin` };
}

export default async function AdminImpactNewPageRoute({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!getCategoryDef(category)) notFound();
  return <ImpactPageEditor categorySlug={category} />;
}
