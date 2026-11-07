import { redirect } from "next/navigation";
import { IMPACT_CATEGORIES } from "@/domains/admin/components/impact/layouts";

export default function AdminImpactRoute() {
  redirect(`/admin/impact/${IMPACT_CATEGORIES[0].slug}`);
}
