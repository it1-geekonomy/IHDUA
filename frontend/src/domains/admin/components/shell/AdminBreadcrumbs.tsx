"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";

const PATH_LABELS: Record<string, string> = {
  admin: "Admin CMS",
  donations: "Donations",
  "recurring-donations": "Recurring Donations",
  forms: "Forms",
  contact: "Contact Leads",
  volunteer: "Volunteer Leads",
  partnership: "Partnership Inquiries",
  "newsletter-subscribers": "Newsletter Subscribers",
  "blog-categories": "Blog Categories",
  "blogs-and-stories": "Blogs & Stories",
  "home-banners": "Home Banners",
  "impact-stats": "Impact Stats",
  "leadership-members": "Leadership & Team",
  users: "Users",
  "organizational-documents": "Organizational Documents",
  "annual-reports": "Annual Reports",
  milestones: "Key Milestones",
  "terms-and-conditions": "Terms & Conditions",
  "privacy-policy": "Privacy Policy",
  impact: "Our Impact",
  education: "Education",
  "women-empowerment": "Women Empowerment",
  "skills-and-employment": "Skills & Employment",
  "model-village": "Model Village",
  health: "Health",
  new: "New Page",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface AdminBreadcrumbsProps {
  pathname: string;
}

export function AdminBreadcrumbs({ pathname }: AdminBreadcrumbsProps) {
  const { user } = useAdminAuth();
  const isContentRole = (user?.role || "").toUpperCase() === "CONTENT";
  const defaultAdminHome = isContentRole ? "/admin/blogs-and-stories" : "/admin/donations";

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, index) => {
    const accumulatedPath = `/${segments.slice(0, index + 1).join("/")}`;
    const label =
      PATH_LABELS[seg] ||
      (UUID.test(seg) ? "Edit Page" : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "));
    const isLast = index === segments.length - 1;
    const href = accumulatedPath === "/admin" ? defaultAdminHome : accumulatedPath;
    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex min-w-0 items-center gap-1 sm:gap-2 font-figtree text-[11px] sm:text-sm overflow-x-auto no-scrollbar py-1"
    >
      {breadcrumbs.map((crumb, idx) => {
        // Drop the root "Admin CMS" crumb below sm — saves space on long impact trails.
        const hideOnMobile = idx === 0 && breadcrumbs.length > 2;
        return (
          <div
            key={crumb.href}
            className={`flex min-w-0 items-center gap-1 sm:gap-2 shrink-0 last:min-w-0 last:shrink ${
              hideOnMobile ? "max-sm:hidden" : ""
            }`}
          >
            {idx > 0 && (
              <ChevronRight
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-[#8A847A] ${
                  idx === 1 && breadcrumbs.length > 2 ? "max-sm:hidden" : ""
                }`}
              />
            )}
            {crumb.isLast ? (
              <span className="truncate font-bold text-[#00191B]">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="font-medium text-[#5F6C6D] transition-colors hover:text-[#9739A8]"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

