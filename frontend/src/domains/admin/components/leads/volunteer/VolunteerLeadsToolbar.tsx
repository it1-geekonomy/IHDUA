"use client";

import Link from "next/link";
import { Handshake, HeartHandshake, MessageSquare, RefreshCw, Search, Trash2 } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import { VOLUNTEER_AREAS } from "@/domains/admin/constants";

interface VolunteerLeadsToolbarProps {
  activeTab: "active" | "deleted";
  onTabChange: (tab: "active" | "deleted") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedArea: string;
  onAreaChange: (value: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const AREA_FILTER_OPTIONS: AdminSelectOption<string>[] = [
  { value: "", label: "All Areas of Interest" },
  ...VOLUNTEER_AREAS.map((area) => ({ value: area, label: area })),
];

const LIMIT_OPTIONS: AdminSelectOption<string>[] = [
  { value: "10", label: "10 / page" },
  { value: "20", label: "20 / page" },
  { value: "50", label: "50 / page" },
];

export function VolunteerLeadsToolbar({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  selectedArea,
  onAreaChange,
  limit,
  onLimitChange,
  loading,
  onRefresh,
}: VolunteerLeadsToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Top Switcher & Active/Trash Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white p-1 shadow-2xs font-figtree">
          <Link
            href="/admin/forms/contact"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#5F6C6D] hover:bg-neutral-100 hover:text-[#0F1C1D] transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Contact Leads</span>
          </Link>
          <Link
            href="/admin/forms/volunteer"
            className="flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
          >
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Volunteer Leads</span>
          </Link>
          <Link
            href="/admin/forms/partnership"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#5F6C6D] hover:bg-neutral-100 hover:text-[#0F1C1D] transition-colors"
          >
            <Handshake className="h-3.5 w-3.5" />
            <span>Partnerships</span>
          </Link>
        </div>

        <div className="inline-flex rounded-lg border border-[#E5E0D8] bg-white p-0.5 shadow-2xs font-figtree">
          <button
            type="button"
            onClick={() => onTabChange("active")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-[#1A0F1C] text-white shadow-2xs"
                : "text-[#5F6C6D] hover:text-[#0F1C1D]"
            }`}
          >
            Active Inbox
          </button>
          <button
            type="button"
            onClick={() => onTabChange("deleted")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "deleted"
                ? "bg-[#1A0F1C] text-white shadow-2xs"
                : "text-[#5F6C6D] hover:text-[#0F1C1D]"
            }`}
          >
            <Trash2 className="h-3 w-3" />
            <span>Trash</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between font-figtree">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A847A]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by applicant name, email, phone…"
            className="h-8 w-full rounded-lg border border-[#D9D3C9] bg-white pl-8 pr-3 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AdminSelect<string>
            value={selectedArea}
            onChange={onAreaChange}
            options={AREA_FILTER_OPTIONS}
            size="sm"
            dropdownClassName="w-56"
          />

          <AdminSelect<string>
            value={String(limit)}
            onChange={(val) => onLimitChange(Number(val))}
            options={LIMIT_OPTIONS}
            size="sm"
            dropdownClassName="w-32"
          />

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:text-[#00191B] disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

