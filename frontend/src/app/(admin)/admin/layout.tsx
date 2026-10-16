import { AdminAuthProvider } from "@/domains/admin/components/AdminAuthProvider";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
