import { TermsAndConditionsPage } from "@/domains/admin/components/TermsAndConditionsPage";

export const metadata = {
  title: "Terms and Conditions | IHDUA Admin",
  description: "Manage terms of service, governance policies, and legal disclaimers.",
};

export default function AdminTermsAndConditionsRoute() {
  return <TermsAndConditionsPage />;
}
