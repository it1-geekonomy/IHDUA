"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HandCoins, LogOut, Users } from "lucide-react";
import { ADMIN_COPY, ADMIN_NAV } from "@/domains/admin/constants";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { cn } from "@/lib/utils";

const ICONS = {
  users: Users,
  donations: HandCoins,
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();

  const onLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F7F4EE] text-[#00191B]">
      <aside className="flex w-60 shrink-0 flex-col bg-[#9739A8] text-white">
        <div className="border-b border-white/15 px-5 py-5">
          <Link href="/admin/donations" className="flex items-center gap-3">
            <Image
              src="/idhualogo1.png"
              alt="IHDUA logo"
              width={120}
              height={120}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-3 font-manrope text-sm font-semibold tracking-tight">
            {ADMIN_COPY.brand}
          </p>
          <p className="mt-1 truncate font-figtree text-xs text-white/70">
            {user?.email}
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {ADMIN_NAV.map((item) => {
            const Icon = ICONS[item.icon];
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2.5 font-figtree text-sm transition-colors",
                  active
                    ? "bg-[#FFD638] font-semibold text-[#00191B]"
                    : "text-white/85 hover:bg-[#9739A8]/40 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/15 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 font-figtree text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {ADMIN_COPY.logout}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-[#D9D3C9] bg-white px-6">
          <p className="font-figtree text-sm text-[#5F6C6D]">
            Signed in as{" "}
            <span className="font-semibold text-[#00191B]">
              {user?.fullName ?? "Admin"}
            </span>
          </p>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
