import { BlogsAndStoriesPage } from "@/domains/admin/components/BlogsAndStoriesPage";

export const metadata = {
  title: "Blogs & Stories | IHDUA Admin",
  description: "Publish and manage community stories, articles, and field updates.",
};

export default function AdminBlogsAndStoriesRoute() {
  return <BlogsAndStoriesPage />;
}

