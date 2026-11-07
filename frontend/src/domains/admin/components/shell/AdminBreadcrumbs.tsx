"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const PATH_LABELS: Record<string, string> = {
  admin: "Admin CMS",
  donations: "Donations",
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
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, index) => {
    const accumulatedPath = `/${segments.slice(0, index + 1).join("/")}`;
    const label =
      PATH_LABELS[seg] ||
      (UUID.test(seg) ? "Edit Page" : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "));
    const isLast = index === segments.length - 1;
    const href = accumulatedPath === "/admin" ? "/admin/donations" : accumulatedPath;
    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex items-center gap-1.5 sm:gap-2 font-figtree text-xs sm:text-sm overflow-x-auto py-1"
    >
      {breadcrumbs.map((crumb, idx) => (
        <div key={crumb.href} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#8A847A]" />}
          {crumb.isLast ? (
            <span className="font-bold text-[#00191B]">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="font-medium text-[#5F6C6D] transition-colors hover:text-[#9739A8]"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

