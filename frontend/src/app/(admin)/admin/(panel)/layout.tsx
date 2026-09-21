import { AdminPanelGate } from "@/domains/admin/components/AdminPanelGate";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelGate>{children}</AdminPanelGate>;
}
