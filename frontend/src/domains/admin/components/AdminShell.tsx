"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { AdminSidebar } from "./shell/AdminSidebar";
import { AdminBreadcrumbs } from "./shell/AdminBreadcrumbs";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

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

      {/* Modular Sidebar Component */}
      <AdminSidebar
        isMobile={isMobile}
        mobileNavOpen={mobileNavOpen}
        sidebarCollapsed={sidebarCollapsed}
        pathname={pathname}
        user={user}
        onToggleSidebar={toggleSidebar}
        onCloseMobileNav={() => setMobileNavOpen(false)}
        onLogout={() => logout("user_action")}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300">
        {/* Dynamic Breadcrumbs Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E5E0D8] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
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

            <AdminBreadcrumbs pathname={pathname} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
