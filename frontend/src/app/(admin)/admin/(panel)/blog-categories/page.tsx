import { BlogCategoriesPage } from "@/domains/admin/components/BlogCategoriesPage";

export const metadata = {
  title: "Blog Categories | IHDUA Admin",
  description: "Manage categories for blogs and stories across the IHDUA platform.",
};

export default function AdminBlogCategoriesRoute() {
  return <BlogCategoriesPage />;
}

