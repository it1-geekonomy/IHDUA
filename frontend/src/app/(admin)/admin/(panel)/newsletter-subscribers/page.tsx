import { NewsletterSubscribersPage } from "@/domains/admin/components/NewsletterSubscribersPage";

export const metadata = {
  title: "Newsletter Subscribers | IHDUA Admin",
  description: "View and manage email newsletter subscriptions and audience records.",
};

export default function AdminNewsletterSubscribersRoute() {
  return <NewsletterSubscribersPage />;
}
