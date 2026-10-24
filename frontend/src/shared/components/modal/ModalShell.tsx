"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidthClass?: string;
}

export function ModalShell({
  isOpen,
  onClose,
  eyebrow,
  title,
  subtitle,
  children,
  maxWidthClass = "max-w-[620px]",
}: ModalShellProps) {
  // Lock background scroll reliably while modal is active
  useBodyScrollLock(isOpen);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-shell-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full bg-white rounded-xl shadow-2xl p-6 sm:p-9 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200",
          maxWidthClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          {eyebrow && (
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-[#9739A8] uppercase font-figtree">
              {eyebrow}
            </p>
          )}
          <h2
            id="modal-shell-title"
            className="mt-1 font-lora text-[26px] sm:text-[32px] font-normal text-[#111827] leading-tight"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 font-figtree text-[13px] sm:text-[14px] text-[#6B7280]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Modal Body / Content */}
        {children}
      </div>
    </div>
  );
}
