"use client";

import { Check, Clock, Copy, ExternalLink, FileText, HeartHandshake, Mail, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatVolunteerDate,
  AREA_STYLES,
  type LeadVolunteer,
} from "./types";

interface VolunteerLeadDetailModalProps {
  lead: LeadVolunteer | null;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onClose: () => void;
  onEdit: (lead: LeadVolunteer) => void;
}

export function VolunteerLeadDetailModal({
  lead,
  copiedId,
  onCopy,
  onClose,
  onEdit,
}: VolunteerLeadDetailModalProps) {
  if (!lead) return null;

  const areaBadgeClass =
    AREA_STYLES[lead.areaOfInterest] || "bg-stone-100 text-stone-700 border-stone-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-lora text-base font-medium text-[#0F1C1D]">
                Volunteer Application
              </h3>
              <p className="text-xs text-[#5F6C6D]">From {lead.fullName}</p>
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
                areaBadgeClass,
              )}
            >
              {lead.areaOfInterest}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#8A847A]">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatVolunteerDate(lead.createdAt)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl bg-[#FAF8F4] border border-[#E5E0D8] p-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8A847A] tracking-wider block mb-1">
                Email
              </span>
              <div className="flex items-center gap-1.5 text-[#0F1C1D] font-medium">
                <Mail className="h-3 w-3 text-[#8A847A]" />
                <span className="truncate">{lead.email}</span>
                <button
                  type="button"
                  onClick={() => onCopy(lead.email, `modal-email-${lead.id}`)}
                  className="text-[#8A847A] hover:text-[#0F1C1D] p-0.5"
                >
                  {copiedId === `modal-email-${lead.id}` ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#8A847A] tracking-wider block mb-1">
                Phone
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
              Skills & Experience
            </span>
            <div className="rounded-xl border border-[#E5E0D8] bg-white p-3.5 text-xs text-[#0F1C1D] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              {lead.skills || "No skills or background details provided."}
            </div>
          </div>

          {lead.resumeUrl && (
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8A847A] tracking-wider block mb-1.5">
                Attached Resume
              </span>
              <a
                href={lead.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5E0D8] bg-[#FAF8F4] p-3 text-xs font-semibold text-[#9739A8] hover:bg-[#FAF5FC] transition-colors w-full"
              >
                <FileText className="h-4 w-4" />
                <span className="flex-1 truncate">View Full Resume Document</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
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
            Edit Application
          </button>
        </div>
      </div>
    </div>
  );
}
