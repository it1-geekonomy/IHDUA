import { AnnualReportsPage } from "@/domains/admin/components/AnnualReportsPage";

export const metadata = {
  title: "Annual Reports | IHDUA Admin",
  description: "Manage official annual reports, financial disclosures, and governance documents.",
};

export default function AdminAnnualReportsRoute() {
  return <AnnualReportsPage />;
}
