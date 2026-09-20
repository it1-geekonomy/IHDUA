import { Suspense } from "react";
import { AdminLoginForm } from "@/domains/admin/components/AdminLoginForm";
import { ADMIN_COPY } from "@/domains/admin/constants";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center font-figtree text-sm text-[#5F6C6D]">
          {ADMIN_COPY.loading}
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
