"use client";

import { useRequireAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { AdminShell } from "@/domains/admin/components/AdminShell";
import { ADMIN_COPY } from "@/domains/admin/constants";

export function AdminPanelGate({ children }: { children: React.ReactNode }) {
  const { ready, token } = useRequireAdminAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#9739A8] font-figtree text-sm text-white/80">
        {ADMIN_COPY.loading}
      </div>
    );
  }

  if (!token) return null;

  return <AdminShell>{children}</AdminShell>;
}
