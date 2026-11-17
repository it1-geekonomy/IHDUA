"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import type { AdminUserRow } from "@/domains/admin/lib/api";

interface UserDeleteModalProps {
  user: AdminUserRow | null;
  actionLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function UserDeleteModal({
  user,
  actionLoading,
  onCancel,
  onConfirm,
}: UserDeleteModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-lora text-lg font-medium text-[#0F1C1D]">
              Delete User Account?
            </h3>
            <p className="text-xs text-[#5F6C6D]">
              This action will revoke the user's access to the admin system.
            </p>
          </div>
        </div>

        {/* User Card Details */}
        <div className="my-5 rounded-xl bg-[#FAF8F4] border border-[#E5E0D8] p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A0F1C] text-[#FFD638] font-bold text-xs shadow-2xs">
              {user.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-[#0F1C1D] truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-[#5F6C6D] truncate">{user.email}</p>
            </div>
            <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-900">
              {user.role || "ADMIN"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200/80 p-3 mb-5 text-[11px] text-amber-900 leading-relaxed">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            The user will no longer be able to sign in or manage content.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={actionLoading}
            className="rounded-xl border border-[#D9D3C9] bg-white px-4 py-2 text-xs font-semibold text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 active:scale-95 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
          >
            {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Delete User</span>
          </button>
        </div>
      </div>
    </div>
  );
}

