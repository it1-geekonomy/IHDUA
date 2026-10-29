import { PrivacyPolicyPage } from "@/domains/admin/components/PrivacyPolicyPage";

export const metadata = {
  title: "Privacy Policy | IHDUA Admin",
  description: "Manage data protection policies, privacy statements, and compliance terms.",
};

export default function AdminPrivacyPolicyRoute() {
  return <PrivacyPolicyPage />;
}
