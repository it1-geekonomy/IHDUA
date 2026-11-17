"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { AdminSidebar } from "./shell/AdminSidebar";
import { AdminBreadcrumbs } from "./shell/AdminBreadcrumbs";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ihdua_admin_sidebar_collapsed");
      if (saved === "true") setSidebarCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  // Prevent body + main double scrollbars inside the fixed admin shell.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

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
    <div className="flex h-dvh overflow-hidden bg-[#F7F4EE] text-[#00191B]">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

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

      {/* Offset for fixed desktop sidebar so content isn't covered */}
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col transition-[padding] duration-300",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64",
        )}
      >
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-[#E5E0D8] bg-white px-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              id="btn-mobile-menu-open"
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] shadow-2xs hover:bg-slate-50 hover:text-[#00191B] lg:hidden"
              title="Open navigation menu"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1 overflow-hidden">
              <AdminBreadcrumbs pathname={pathname} />
            </div>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-2.5 sm:p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
