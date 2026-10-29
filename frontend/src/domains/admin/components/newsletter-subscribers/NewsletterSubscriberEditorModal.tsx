"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, X } from "lucide-react";
import type { NewsletterSubscriberItem } from "./types";
import { cn } from "@/lib/utils";

interface NewsletterSubscriberEditorModalProps {
  isOpen: boolean;
  editingItem: NewsletterSubscriberItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (data: { email: string; isActive: boolean }) => void;
}

export function NewsletterSubscriberEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: NewsletterSubscriberEditorModalProps) {
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !editingItem) return;
    setEmail(editingItem.email);
    setIsActive(editingItem.isActive);
    setError(null);
  }, [isOpen, editingItem]);

  if (!isOpen || !editingItem) return null;

  const handleSubmit = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Email address is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    onSave({ email: trimmed, isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] overflow-hidden my-auto font-figtree">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 bg-[#FAF8F4]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-lora text-base font-medium text-[#0F1C1D]">
                Edit Subscriber
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                Update subscriber email or status.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5F6C6D] hover:bg-stone-200 hover:text-[#0F1C1D] cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F1C1D]">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. subscriber@example.com"
              className={cn(
                "w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:outline-hidden transition-all",
                error
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-[#D9D3C9] focus:border-[#9739A8]",
              )}
            />
            {error && <p className="text-[11px] text-rose-500">{error}</p>}
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="isActiveSubscriber"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-[#D9D3C9] text-[#9739A8] focus:ring-[#9739A8] cursor-pointer"
            />
            <label
              htmlFor="isActiveSubscriber"
              className="text-xs font-medium text-[#0F1C1D] cursor-pointer"
            >
              Active Subscription (Receives newsletters)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E5E0D8] bg-[#FAF8F4] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2C1A30] cursor-pointer shadow-xs disabled:opacity-50"
          >
            {actionLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Update Subscriber</span>
          </button>
        </div>
      </div>
    </div>
  );
}
