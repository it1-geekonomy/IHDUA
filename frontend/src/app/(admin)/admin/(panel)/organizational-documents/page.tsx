import { OrganizationalDocumentsPage } from "@/domains/admin/components/OrganizationalDocumentsPage";

export const metadata = {
  title: "Organizational Documents | IHDUA Admin",
  description: "Manage official certificates, trust deeds, 80G, and compliance documents.",
};

export default function AdminOrganizationalDocumentsRoute() {
  return <OrganizationalDocumentsPage />;
}
