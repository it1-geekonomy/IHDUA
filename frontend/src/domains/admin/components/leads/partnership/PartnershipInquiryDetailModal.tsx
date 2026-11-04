"use client";

import { Building2, Check, Clock, Copy, Handshake, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatPartnershipDate,
  TYPE_STYLES,
  type LeadPartnership,
} from "./types";

interface PartnershipInquiryDetailModalProps {
  lead: LeadPartnership | null;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onClose: () => void;
  onEdit: (lead: LeadPartnership) => void;
}

export function PartnershipInquiryDetailModal({
  lead,
  copiedId,
  onCopy,
  onClose,
  onEdit,
}: PartnershipInquiryDetailModalProps) {
  if (!lead) return null;

  const typeBadgeClass =
    TYPE_STYLES[lead.partnershipType] || "bg-stone-100 text-stone-700 border-stone-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <Handshake className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-lora text-base font-medium text-[#0F1C1D]">
                Partnership Proposal
              </h3>
              <p className="text-xs text-[#5F6C6D]">From {lead.yourName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-neutral-100 hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                typeBadgeClass,
              )}
            >
              {lead.partnershipType}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#8A847A]">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatPartnershipDate(lead.createdAt)}</span>
            </div>
          </div>

          <div className="rounded-xl bg-[#FAF8F4] border border-[#E5E0D8] p-3 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#0F1C1D] font-semibold text-sm">
              <Building2 className="h-4 w-4 text-[#9739A8]" />
              <span>{lead.orgName || "Independent Partner"}</span>
            </div>

            <div className="pt-1 border-t border-[#E5E0D8]">
              <span className="text-[10px] uppercase font-bold text-[#8A847A] tracking-wider block mb-1">
                Phone Contact
              </span>
              <div className="flex items-center gap-1.5 text-[#0F1C1D] font-medium">
                <Phone className="h-3 w-3 text-[#8A847A]" />
                <span>{lead.phone}</span>
                <button
                  type="button"
                  onClick={() => onCopy(lead.phone, `modal-phone-${lead.id}`)}
                  className="text-[#8A847A] hover:text-[#0F1C1D] p-0.5"
                >
                  {copiedId === `modal-phone-${lead.id}` ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#8A847A] tracking-wider block mb-1.5">
              Proposal Summary & Objectives
            </span>
            <div className="rounded-xl border border-[#E5E0D8] bg-white p-3.5 text-xs text-[#0F1C1D] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
              {lead.proposal || "No proposal summary provided."}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#E5E0D8] pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#0F1C1D] cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(lead);
            }}
            className="rounded-lg bg-[#1A0F1C] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] cursor-pointer"
          >
            Edit Proposal
          </button>
        </div>
      </div>
    </div>
  );
}
