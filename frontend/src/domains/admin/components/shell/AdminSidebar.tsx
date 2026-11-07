"use client";

import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  ChevronLeft,
  FileCheck,
  FileText,
  GraduationCap,
  HandCoins,
  Handshake,
  HeartHandshake,
  HeartPulse,
  House,
  Images,
  LogOut,
  Sparkles,
  Mail,
  MessageSquare,
  Milestone,
  ScrollText,
  Shield,
  Tag,
  TrendingUp,
  Users,
  Users2,
  X,
} from "lucide-react";
import { ADMIN_NAV_SECTIONS } from "@/domains/admin/constants";
import type { AdminUser } from "@/domains/admin/lib/session";
import { cn } from "@/lib/utils";

const ICONS = {
  users: Users,
  donations: HandCoins,
  forms: FileText,
  contact: MessageSquare,
  volunteer: HeartHandshake,
  partnership: Handshake,
  newsletter: Mail,
  orgDocs: FileCheck,
  reports: FileText,
  milestones: Milestone,
  homeBanners: Images,
  impactStats: TrendingUp,
  leadership: Users2,
  terms: ScrollText,
  privacy: Shield,
  categories: Tag,
  blogs: BookOpen,
  impactEducation: GraduationCap,
  impactWomen: Sparkles,
  impactSkills: Briefcase,
  impactVillage: House,
  impactHealth: HeartPulse,
};

interface AdminSidebarProps {
  isMobile: boolean;
  mobileNavOpen: boolean;
  sidebarCollapsed: boolean;
  pathname: string;
  user: AdminUser | null;
  onToggleSidebar: () => void;
  onCloseMobileNav: () => void;
  onLogout: () => void;
}

export function AdminSidebar({
  isMobile,
  mobileNavOpen,
  sidebarCollapsed,
  pathname,
  user,
  onToggleSidebar,
  onCloseMobileNav,
  onLogout,
}: AdminSidebarProps) {
  const isCollapsed = sidebarCollapsed && !isMobile;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1A0F1C] text-white shadow-2xl transition-all duration-300 ease-in-out lg:static lg:relative lg:z-auto lg:shadow-xl",
        mobileNavOpen ? "translate-x-0 w-72" : "-translate-x-full w-72",
        !isMobile && (sidebarCollapsed ? "lg:translate-x-0 lg:w-[72px]" : "lg:translate-x-0 lg:w-64"),
      )}
    >
      {/* Floating edge toggle button (Desktop only) */}
      {!isMobile && (
        <button
          id="btn-sidebar-edge-toggle"
          type="button"
          onClick={onToggleSidebar}
          className="absolute -right-4 top-5 z-50 hidden lg:flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-[#1A0F1C] text-white shadow-lg transition-all hover:bg-[#FFD638] hover:text-[#140816] hover:border-[#FFD638] hover:scale-110 cursor-pointer active:scale-95"
          title={sidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              sidebarCollapsed && "rotate-180",
            )}
          />
        </button>
      )}

      {/* Inner container */}
      <div
        className={cn(
          "flex h-full w-full flex-1 flex-col transition-all duration-300",
          isCollapsed ? "w-[72px] overflow-visible" : "w-full max-w-full overflow-hidden",
        )}
      >
        {/* Header: Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/10 overflow-hidden w-full",
            isCollapsed ? "justify-center px-4" : "justify-between px-4 sm:px-5",
          )}
        >
          {isCollapsed ? (
            <Link
              href="/admin/donations"
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105"
              title="IHDUA Admin CMS"
            >
              <img
                src="/ihdua-round.png"
                alt="IHDUA"
                className="h-9 w-9 object-contain drop-shadow-xs"
              />
            </Link>
          ) : (
            <>
              <Link
                href="/admin/donations"
                className="flex items-center transition-opacity hover:opacity-90 min-w-0 overflow-hidden shrink-0"
                title="IHDUA Admin CMS"
                onClick={onCloseMobileNav}
              >
                <img
                  src="/idhualogo1.png"
                  alt="IHDUA Logo"
                  className="h-10 w-auto object-contain shrink-0"
                />
              </Link>

              <button
                id="btn-mobile-drawer-close"
                type="button"
                onClick={onCloseMobileNav}
                className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white hover:border-white/25 active:scale-95 cursor-pointer transition-all lg:hidden shrink-0"
                title="Close navigation"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav
          className={cn(
            "flex flex-1 flex-col overflow-y-auto overflow-x-hidden",
            isCollapsed ? "gap-2.5 p-2.5" : "gap-4 p-4",
          )}
        >
          {ADMIN_NAV_SECTIONS.map((section, sIdx) => (
            <div key={section.title} className="flex flex-col gap-1 min-w-0">
              {!isCollapsed ? (
                <p className="px-3 pb-1 font-figtree text-[10px] font-bold uppercase tracking-wider text-white/40 truncate whitespace-nowrap">
                  {section.title}
                </p>
              ) : sIdx > 0 ? (
                <div className="my-1.5 mx-auto h-[1px] w-8 bg-white/10" />
              ) : null}

              {section.items.map((item) => {
                const Icon = (item.icon && ICONS[item.icon as keyof typeof ICONS]) || FileText;
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`) ||
                  (item.href === "/admin/forms/contact" && pathname === "/admin/forms");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobileNav}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center rounded-xl transition-all font-figtree text-sm min-w-0",
                      !isCollapsed
                        ? "gap-3 px-3.5 py-2.5 font-medium overflow-hidden"
                        : "h-11 w-11 justify-center mx-auto",
                      active
                        ? "bg-[#FFD638] font-bold text-[#140816] shadow-md shadow-[#FFD638]/20"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                    {!isCollapsed && (
                      <span className="truncate whitespace-nowrap min-w-0">{item.label}</span>
                    )}

                    {isCollapsed && (
                      <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center rounded-lg bg-[#140816] px-2.5 py-1.5 font-figtree text-xs font-semibold text-white shadow-xl border border-white/15 whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer: User Profile & Sign Out */}
        <div
          className={cn(
            "border-t border-white/10",
            isCollapsed
              ? "flex flex-col items-center gap-2 p-2.5 overflow-visible"
              : "p-4 overflow-hidden",
          )}
        >
          {isCollapsed ? (
            <>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD638] font-figtree text-xs font-bold text-[#140816] shadow-xs cursor-default"
                title={`${user?.fullName || "Administrator"} (${user?.email || "admin@ihdua.org"})`}
              >
                {user?.fullName?.charAt(0) || "A"}
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-all hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-200 cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center rounded-lg bg-[#140816] px-2.5 py-1.5 font-figtree text-xs font-semibold text-white shadow-xl border border-white/15 whitespace-nowrap z-50">
                  Sign Out
                </span>
              </button>
            </>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-3 px-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD638] font-figtree text-xs font-bold text-[#140816]">
                  {user?.fullName?.charAt(0) || "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-figtree text-xs font-semibold text-white">
                    {user?.fullName || "Administrator"}
                  </p>
                  <p className="truncate font-figtree text-[11px] text-white/50">
                    {user?.email || "admin@ihdua.org"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 font-figtree text-xs font-semibold text-white transition-all hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-200 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

