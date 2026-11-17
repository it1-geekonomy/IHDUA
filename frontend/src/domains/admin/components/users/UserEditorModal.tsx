"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, User, UserPlus, X } from "lucide-react";
import type { AdminUserRole, AdminUserRow } from "@/domains/admin/lib/api";

export type UserFormValues = {
  fullName: string;
  email: string;
  role: AdminUserRole;
  password?: string;
};

interface UserEditorModalProps {
  isOpen: boolean;
  editingItem: AdminUserRow | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: UserFormValues) => void;
}

export function UserEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: UserEditorModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminUserRole>("ADMIN");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setFullName(editingItem.fullName || "");
      setEmail(editingItem.email || "");
      setRole(editingItem.role || "ADMIN");
      setPassword("");
    } else {
      setFullName("");
      setEmail("");
      setRole("ADMIN");
      setPassword("");
    }
    setShowPassword(false);
    setErrors({});
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
    } = {};

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedName) {
      newErrors.fullName = "Full name is required.";
    } else if (trimmedName.length > 255) {
      newErrors.fullName = "Full name cannot exceed 255 characters.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!editingItem) {
      // Create mode: password is required
      if (!trimmedPass) {
        newErrors.password = "Password is required for new users.";
      } else if (trimmedPass.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      }
    } else {
      // Edit mode: password optional, but if entered must be >= 8 chars
      if (trimmedPass && trimmedPass.length < 8) {
        newErrors.password = "New password must be at least 8 characters.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const values: UserFormValues = {
        fullName: trimmedName,
        email: trimmedEmail,
        role,
      };
      if (trimmedPass) {
        values.password = trimmedPass;
      }
      onSave(values);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-[#E5E0D8] font-figtree">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              {editingItem ? <User className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="font-lora text-xl font-medium text-[#0F1C1D]">
                {editingItem ? "Edit User Account" : "Add New User"}
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                {editingItem
                  ? "Update user details, system role, or reset password."
                  : "Create an administrator or content editor account."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] cursor-pointer"
            title="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
              }}
              placeholder="e.g. Priya Sharma"
              disabled={actionLoading}
              className={`h-10 w-full rounded-xl border bg-white px-3.5 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-[#D9D3C9] focus:border-[#9739A8] focus:ring-[#9739A8]/20"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="e.g. user@ihdua.org"
              disabled={actionLoading}
              className={`h-10 w-full rounded-xl border bg-white px-3.5 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-[#D9D3C9] focus:border-[#9739A8] focus:ring-[#9739A8]/20"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              System Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex flex-col gap-1 rounded-xl border p-3 cursor-pointer transition-all ${
                  role === "ADMIN"
                    ? "border-[#9739A8] bg-[#9739A8]/5 ring-2 ring-[#9739A8]/20"
                    : "border-[#D9D3C9] bg-white hover:bg-[#FAF8F4]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#0F1C1D]">ADMIN</span>
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={role === "ADMIN"}
                    onChange={() => setRole("ADMIN")}
                    className="accent-[#9739A8]"
                  />
                </div>
                <span className="text-[11px] text-[#5F6C6D] leading-tight">
                  Full system access across all CMS modules and users
                </span>
              </label>

              <label
                className={`flex flex-col gap-1 rounded-xl border p-3 cursor-pointer transition-all ${
                  role === "CONTENT"
                    ? "border-[#0284C7] bg-[#0284C7]/5 ring-2 ring-[#0284C7]/20"
                    : "border-[#D9D3C9] bg-white hover:bg-[#FAF8F4]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#0F1C1D]">CONTENT</span>
                  <input
                    type="radio"
                    name="role"
                    value="CONTENT"
                    checked={role === "CONTENT"}
                    onChange={() => setRole("CONTENT")}
                    className="accent-[#0284C7]"
                  />
                </div>
                <span className="text-[11px] text-[#5F6C6D] leading-tight">
                  Editor access for Blogs, Stories, and general content
                </span>
              </label>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              {editingItem ? (
                <>
                  New Password{" "}
                  <span className="text-[11px] font-normal text-[#5F6C6D]">
                    (optional — leave blank to keep unchanged)
                  </span>
                </>
              ) : (
                <>
                  Password <span className="text-rose-500">*</span>
                </>
              )}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                placeholder={
                  editingItem ? "•••••••• (unchanged)" : "Minimum 8 characters"
                }
                disabled={actionLoading}
                className={`h-10 w-full rounded-xl border bg-white pl-3.5 pr-10 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                    : "border-[#D9D3C9] focus:border-[#9739A8] focus:ring-[#9739A8]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A847A] hover:text-[#0F1C1D] cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="rounded-xl border border-[#D9D3C9] bg-white px-4 py-2 text-xs font-semibold text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFD638] px-5 py-2 text-xs font-bold text-[#140816] hover:bg-[#ffe169] active:scale-95 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
            >
              {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingItem ? "Save Changes" : "Create User"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

