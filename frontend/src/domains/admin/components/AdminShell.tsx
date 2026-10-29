"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FileText,
  HandCoins,
  Handshake,
  HeartHandshake,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  ScrollText,
  Shield,
  Tag,
  Users,
  X,
} from "lucide-react";
import { ADMIN_NAV_SECTIONS } from "@/domains/admin/constants";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
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
  terms: ScrollText,
  privacy: Shield,
  categories: Tag,
  blogs: BookOpen,
};

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
  users: "Users",
  "organizational-documents": "Organizational Documents",
  "annual-reports": "Annual Reports",
  "terms-and-conditions": "Terms & Conditions",
  "privacy-policy": "Privacy Policy",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  // State: mobile drawer open (< lg) & desktop collapsed (lg+)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track viewport breakpoint
  useEffect(() => {
    const updateSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileNavOpen(false);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Restore desktop collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ihdua_admin_sidebar_collapsed");
      if (saved === "true") setSidebarCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const toggleSidebar = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileNavOpen((prev) => !prev);
      return;
    }
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ihdua_admin_sidebar_collapsed", String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const closeSidebar = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileNavOpen(false);
      return;
    }
    setSidebarCollapsed(true);
    try {
      localStorage.setItem("ihdua_admin_sidebar_collapsed", "true");
    } catch {
      /* ignore */
    }
  }, []);

  const isSidebarOpen = isMobile ? mobileNavOpen : !sidebarCollapsed;

  // Keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const handleLogout = () => {
    logout("user_action");
  };

  // Generate dynamic breadcrumb navigation
  const segments = pathname.split("/").filter(Boolean);
  let accumulatedPath = "";
  const breadcrumbs = segments.map((seg, index) => {
    accumulatedPath += `/${seg}`;
    const label =
      PATH_LABELS[seg] ||
      seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    const isLast = index === segments.length - 1;
    const href = accumulatedPath === "/admin" ? "/admin/donations" : accumulatedPath;
    return { href, label, isLast };
  });

  return (
    <div className="flex min-h-screen bg-[#F7F4EE] text-[#00191B]">
      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          SLIDING SIDEBAR: Desktop Mini Icon Rail / Expanded + Mobile Slide-over Drawer
          ───────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1A0F1C] text-white shadow-2xl transition-all duration-300 ease-in-out lg:static lg:relative lg:z-auto lg:shadow-xl",
          // Mobile state (< lg):
          mobileNavOpen ? "translate-x-0 w-72" : "-translate-x-full w-72",
          // Desktop state (lg+): icon rail (w-[72px]) when collapsed, full sidebar (w-64) when expanded
          !isMobile && (sidebarCollapsed ? "lg:translate-x-0 lg:w-[72px]" : "lg:translate-x-0 lg:w-64"),
        )}
      >
        {/* Floating Arrow Toggle Button on the Sidebar Edge */}
        {!isMobile && (
          <button
            id="btn-sidebar-edge-toggle"
            type="button"
            onClick={toggleSidebar}
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

        {/* Inner container dynamically sized to rail or full */}
        <div
          className={cn(
            "flex h-full w-full flex-1 flex-col transition-all duration-300",
            sidebarCollapsed && !isMobile
              ? "w-[72px] overflow-visible"
              : "w-full max-w-full overflow-hidden",
          )}
        >
          {/* Header: Crisp Logo */}
          <div
            className={cn(
              "flex h-16 items-center border-b border-white/10 overflow-hidden w-full",
              sidebarCollapsed && !isMobile ? "justify-center px-4" : "justify-between px-4 sm:px-5",
            )}
          >
            {sidebarCollapsed && !isMobile ? (
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
                  onClick={() => setMobileNavOpen(false)}
                >
                  <img
                    src="/idhualogo1.png"
                    alt="IHDUA Logo"
                    className="h-10 w-auto object-contain shrink-0"
                  />
                </Link>

                {/* Mobile close button (inside drawer) pushed to the far right edge */}
                <button
                  id="btn-mobile-drawer-close"
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white hover:border-white/25 active:scale-95 cursor-pointer transition-all lg:hidden shrink-0"
                  title="Close navigation"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Navigation Links: Icon Rail vs Full List */}
          <nav
            className={cn(
              "flex flex-1 flex-col overflow-y-auto overflow-x-hidden",
              sidebarCollapsed && !isMobile ? "gap-2.5 p-2.5" : "gap-4 p-4",
            )}
          >
            {ADMIN_NAV_SECTIONS.map((section, sIdx) => (
              <div key={section.title} className="flex flex-col gap-1 min-w-0">
                {/* Section title or subtle separator */}
                {!sidebarCollapsed || isMobile ? (
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
                    (item.href === "/admin/forms/contact" && pathname === "/admin/forms");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      title={sidebarCollapsed && !isMobile ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center rounded-xl transition-all font-figtree text-sm min-w-0",
                        // Expanded styling:
                        !sidebarCollapsed || isMobile
                          ? "gap-3 px-3.5 py-2.5 font-medium overflow-hidden"
                          : "h-11 w-11 justify-center mx-auto",
                        // Active styling:
                        active
                          ? "bg-[#FFD638] font-bold text-[#140816] shadow-md shadow-[#FFD638]/20"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                      {(!sidebarCollapsed || isMobile) && (
                        <span className="truncate whitespace-nowrap min-w-0">{item.label}</span>
                      )}

                      {/* Floating tooltip on hover in icon-rail mode */}
                      {sidebarCollapsed && !isMobile && (
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

          {/* Sidebar Footer: Compact Avatar & Sign Out in Rail Mode */}
          <div
            className={cn(
              "border-t border-white/10",
              sidebarCollapsed && !isMobile
                ? "flex flex-col items-center gap-2 p-2.5 overflow-visible"
                : "p-4 overflow-hidden",
            )}
          >
            {sidebarCollapsed && !isMobile ? (
              <>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD638] font-figtree text-xs font-bold text-[#140816] shadow-xs cursor-default"
                  title={`${user?.fullName || "Administrator"} (${user?.email || "admin@ihdua.org"})`}
                >
                  {user?.fullName?.charAt(0) || "A"}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
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
                  onClick={handleLogout}
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

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA & TOP HEADER WITH BREADCRUMBS
          ───────────────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300">
        {/* Dynamic Breadcrumbs Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E5E0D8] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Drawer Open Button */}
            <button
              id="btn-mobile-menu-open"
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:bg-slate-50 hover:text-[#00191B] lg:hidden cursor-pointer shadow-2xs"
              title="Open navigation menu"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Dynamic Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumbs"
              className="flex items-center gap-1.5 sm:gap-2 font-figtree text-xs sm:text-sm overflow-x-auto py-1"
            >
              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.href} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#8A847A]" />}
                  {crumb.isLast ? (
                    <span className="font-bold text-[#00191B]">
                      {crumb.label}
                    </span>
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
          </div>
        </header>

        {/* Page Content with Responsive Padding & Clean Overflow */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-8 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
