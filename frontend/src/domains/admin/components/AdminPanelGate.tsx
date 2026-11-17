"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRequireAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { AdminShell } from "@/domains/admin/components/AdminShell";
import { ADMIN_COPY, ADMIN_ONLY_ROUTES } from "@/domains/admin/constants";

export function AdminPanelGate({ children }: { children: React.ReactNode }) {
  const { ready, token, user } = useRequireAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isContentRole = (user?.role || "").toUpperCase() === "CONTENT";
  const isRestrictedPath =
    isContentRole &&
    ADMIN_ONLY_ROUTES.some(
      (prefix) =>
        pathname === prefix ||
        pathname?.startsWith(`${prefix}/`) ||
        (pathname === "/admin/forms" && prefix === "/admin/forms/contact"),
    );

  useEffect(() => {
    if (ready && token && isRestrictedPath) {
      router.replace("/admin/blogs-and-stories");
    }
  }, [ready, token, isRestrictedPath, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#9739A8] font-figtree text-sm text-white/80">
        {ADMIN_COPY.loading}
      </div>
    );
  }

  if (!token) return null;

  if (isRestrictedPath) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE] font-figtree text-xs text-[#5F6C6D]">
        Redirecting to authorized section…
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
