import { HomeBannersPage } from "@/domains/admin/components/HomeBannersPage";

export const metadata = {
  title: "Home Banners | IHDUA Admin",
  description: "Manage homepage hero banner images and carousel slides.",
};

export default function AdminHomeBannersRoute() {
  return <HomeBannersPage />;
}

