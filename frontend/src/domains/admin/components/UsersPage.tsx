"use client";

import { useEffect, useState } from "react";
import { ADMIN_COPY } from "@/domains/admin/constants";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  fetchUsers,
  type AdminUserRow,
} from "@/domains/admin/lib/api";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function UsersPage() {
  const { token, ready } = useAdminAuth();
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !token) return;
    let cancelled = false;

    setLoading(true);
    fetchUsers(token)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ready, token]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-lora text-3xl text-[#0F1C1D]">{ADMIN_COPY.usersTitle}</h1>
        <p className="mt-1 font-figtree text-sm text-[#5F6C6D]">
          {ADMIN_COPY.usersSubtitle}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#D7E0E1] bg-white shadow-sm">
        {loading ? (
          <p className="p-6 font-figtree text-sm text-[#5F6C6D]">{ADMIN_COPY.loading}</p>
        ) : error ? (
          <p className="p-6 font-figtree text-sm text-[#A33B3B]">{error}</p>
        ) : rows.length === 0 ? (
          <p className="p-6 font-figtree text-sm text-[#5F6C6D]">{ADMIN_COPY.emptyUsers}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left font-figtree text-sm">
              <thead className="bg-[#F4F6F7] text-[#5F6C6D]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[#E7EEEE]">
                    <td className="px-4 py-3 font-medium text-[#0F1C1D]">
                      {row.fullName}
                    </td>
                    <td className="px-4 py-3 text-[#0F1C1D]">{row.email}</td>
                    <td className="px-4 py-3 text-[#5F6C6D]">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
