import { ImpactStatsPage } from "@/domains/admin/components/ImpactStatsPage";

export const metadata = {
  title: "Impact Stats | IHDUA Admin",
  description: "Manage grassroots impact counters and animated statistics.",
};

export default function AdminImpactStatsRoute() {
  return <ImpactStatsPage />;
}

