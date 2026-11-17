"use client";

import {
  FileEdit,
  Loader2,
  Mail,
  Pencil,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import type { AdminUserRow } from "@/domains/admin/lib/api";
import type { AdminUser } from "@/domains/admin/lib/session";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

interface UsersTableProps {
  users: AdminUserRow[];
  loading: boolean;
  currentUser: AdminUser | null;
  onEdit: (user: AdminUserRow) => void;
  onDeletePrompt: (user: AdminUserRow) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export function UsersTable({
  users,
  loading,
  currentUser,
  onEdit,
  onDeletePrompt,
  onClearFilters,
  hasFilters,
}: UsersTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E0D8] bg-white p-16 text-[#5F6C6D] shadow-xs">
        <Loader2 className="h-7 w-7 animate-spin text-[#9739A8]" />
        <p className="mt-3 font-figtree text-xs font-medium">Loading user accounts…</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9D3C9] bg-white/60 p-16 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F4] text-[#8A847A] mb-3 border border-[#E5E0D8]">
          <Users className="h-6 w-6" />
        </div>
        <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
          {hasFilters ? "No users match your criteria" : "No users found"}
        </p>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D] max-w-sm">
          {hasFilters
            ? "Try adjusting your search query or role filter to find accounts."
            : "No user accounts have been registered yet."}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 rounded-xl border border-[#D9D3C9] bg-white px-3.5 py-1.5 font-figtree text-xs font-semibold text-[#0F1C1D] hover:bg-[#FAF8F4] cursor-pointer transition-all shadow-2xs"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white shadow-xs font-figtree">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[11px] font-bold uppercase tracking-wider text-[#5F6C6D]">
            <tr>
              <th className="py-3.5 px-5">Name</th>
              <th className="py-3.5 px-5">Email</th>
              <th className="py-3.5 px-5">Role</th>
              <th className="py-3.5 px-5">Created</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {users.map((row) => {
              const isSelf = currentUser?.id === row.id || currentUser?.email === row.email;
              const role = (row.role || "ADMIN").toUpperCase();
              const isAdmin = role === "ADMIN";

              return (
                <tr
                  key={row.id}
                  className="hover:bg-[#FAF8F4]/60 transition-colors group"
                >
                  {/* Name + Initial Avatar */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A0F1C] text-[#FFD638] font-bold text-xs shadow-2xs">
                        {row.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#0F1C1D] truncate">
                            {row.fullName}
                          </span>
                          {isSelf && (
                            <span className="rounded-full bg-[#FFD638]/25 border border-[#FFD638] px-2 py-0.2 font-figtree text-[10px] font-bold text-[#140816]">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-5 text-[#0F1C1D]">
                    <div className="flex items-center gap-1.5 text-[#5F6C6D]">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-[#8A847A]" />
                      <span className="text-xs text-[#0F1C1D]">{row.email}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-5">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[11px] font-bold text-purple-900 shadow-2xs">
                        <ShieldCheck className="h-3.5 w-3.5 text-purple-700" />
                        <span>ADMIN</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[11px] font-bold text-sky-800 shadow-2xs">
                        <FileEdit className="h-3.5 w-3.5 text-sky-600" />
                        <span>CONTENT</span>
                      </span>
                    )}
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-5 text-[#5F6C6D] whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] hover:border-[#8A847A] cursor-pointer transition-all shadow-2xs"
                        title={`Edit ${row.fullName}`}
                        aria-label={`Edit ${row.fullName}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeletePrompt(row)}
                        disabled={isSelf}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all shadow-2xs ${
                          isSelf
                            ? "border-transparent bg-transparent text-[#D9D3C9] cursor-not-allowed"
                            : "border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
                        }`}
                        title={
                          isSelf
                            ? "You cannot delete your own logged-in account"
                            : `Delete ${row.fullName}`
                        }
                        aria-label={
                          isSelf
                            ? "Cannot delete own account"
                            : `Delete ${row.fullName}`
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

