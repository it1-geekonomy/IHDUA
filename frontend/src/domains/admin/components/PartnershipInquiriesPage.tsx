"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArchiveRestore,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  Filter,
  Handshake,
  HeartHandshake,
  MessageSquare,
  Pencil,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { PARTNERSHIP_TYPES } from "@/domains/admin/constants";
import {
  deletePartnershipInquiry,
  fetchDeletedPartnershipInquiries,
  fetchPartnershipInquiries,
  restorePartnershipInquiry,
  updatePartnershipInquiry,
  type LeadPartnership,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<string, string> = {
  "CSR Partnership": "bg-purple-50 text-purple-700 border-purple-200/80",
  "NGO / Non-Profit Collaboration": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Academic Partnership": "bg-blue-50 text-blue-700 border-blue-200/80",
  "Corporate Partnership": "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  "Programme Sponsorship": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Infrastructure Development": "bg-teal-50 text-teal-700 border-teal-200/80",
  Other: "bg-stone-100 text-stone-700 border-stone-200",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function getInitials(name: string) {
  if (!name) return "P";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function PartnershipInquiriesPage() {
  const { token, ready } = useAdminAuth();

  // State
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [inquiries, setInquiries] = useState<LeadPartnership[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedInquiry, setSelectedInquiry] = useState<LeadPartnership | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    yourName: string;
    orgName: string;
    phone: string;
    partnershipType: string;
    proposal: string;
  }>({
    yourName: "",
    orgName: "",
    phone: "",
    partnershipType: "CSR Partnership",
    proposal: "",
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Request sequencing and initial-render protection
  const activeReqId = useRef(0);
  const searchInitRef = useRef(true);

  // Fetch inquiries
  const loadInquiries = useCallback(
    async (targetPage = page, targetLimit = limit, targetSearch = debouncedSearch) => {
      if (!token || !ready) return;
      const reqId = ++activeReqId.current;
      setLoading(true);
      setError(null);

      try {
        const queryParams = {
          page: targetPage,
          limit: targetLimit,
          search: targetSearch || undefined,
        };

        const response =
          activeTab === "active"
            ? await fetchPartnershipInquiries(token, queryParams)
            : await fetchDeletedPartnershipInquiries(token, queryParams);

        if (reqId !== activeReqId.current) return;

        setInquiries(response.data || []);
        if (response.meta) {
          setMeta(response.meta);
        }
      } catch (err) {
        if (reqId !== activeReqId.current) return;
        setError(err instanceof Error ? err.message : "Failed to load partnership inquiries.");
      } finally {
        if (reqId === activeReqId.current) {
          setLoading(false);
        }
      }
    },
    [token, ready, page, limit, debouncedSearch, activeTab],
  );

  // Debounce search input
  useEffect(() => {
    if (searchInitRef.current) {
      searchInitRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Single effect to fetch on mount, tab change, page change, limit change, or debounced search change
  useEffect(() => {
    if (ready && token) {
      void loadInquiries(page, limit, debouncedSearch);
    }
  }, [ready, token, activeTab, page, limit, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Soft-Delete
  const handleDelete = async (inquiry: LeadPartnership) => {
    if (!token) return;
    setActionInProgress(inquiry.id);
    try {
      await deletePartnershipInquiry(token, inquiry.id);
      setFeedback({
        type: "success",
        text: `Inquiry from "${inquiry.yourName} (${inquiry.orgName})" moved to trash.`,
      });
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry(null);
        setIsEditing(false);
      }
      void loadInquiries();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete inquiry.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Restore
  const handleRestore = async (inquiry: LeadPartnership) => {
    if (!token) return;
    setActionInProgress(inquiry.id);
    try {
      await restorePartnershipInquiry(token, inquiry.id);
      setFeedback({
        type: "success",
        text: `Inquiry from "${inquiry.yourName} (${inquiry.orgName})" restored successfully.`,
      });
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry(null);
        setIsEditing(false);
      }
      void loadInquiries();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to restore inquiry.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Open modal in View mode
  const openViewModal = (inquiry: LeadPartnership) => {
    setSelectedInquiry(inquiry);
    setIsEditing(false);
  };

  // Open modal in Edit mode
  const openEditModal = (inquiry: LeadPartnership) => {
    setSelectedInquiry(inquiry);
    setEditFormData({
      yourName: inquiry.yourName,
      orgName: inquiry.orgName,
      phone: inquiry.phone,
      partnershipType: inquiry.partnershipType || "CSR Partnership",
      proposal: inquiry.proposal || "",
    });
    setIsEditing(true);
  };

  // Save Inline Edit (PATCH)
  const handleSaveEdit = async () => {
    if (!token || !selectedInquiry) return;
    setSavingEdit(true);
    try {
      const updated = await updatePartnershipInquiry(token, selectedInquiry.id, editFormData);
      setFeedback({ type: "success", text: "Partnership inquiry updated successfully." });
      setSelectedInquiry(updated);
      setIsEditing(false);
      void loadInquiries();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update inquiry.",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter inquiries locally by selectedType if set
  const filteredInquiries = selectedType
    ? inquiries.filter((i) => i.partnershipType === selectedType)
    : inquiries;

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          HEADER: Title, Counter & Unified Category Switcher
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-lora text-2xl font-medium text-[#0F1C1D]">
              Partnership Inquiries
            </h1>
            <span className="rounded-full bg-[#1A0F1C]/5 px-2.5 py-0.5 font-figtree text-xs font-semibold text-[#1A0F1C]">
              {meta.total} {meta.total === 1 ? "inquiry" : "inquiries"}
            </span>
          </div>
          <p className="mt-1 font-figtree text-xs text-[#5F6C6D]">
            Review, evaluate, and collaborate with CSR foundations, NGOs, and corporate partners.
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Category Switcher */}
          <div className="flex rounded-lg border border-[#D9D3C9] bg-white p-0.5 shadow-xs">
            <Link
              href="/admin/forms/contact"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-figtree text-xs font-medium text-[#5F6C6D] transition-colors hover:text-[#00191B]"
              title="Switch to Contact Leads"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Contact Leads</span>
            </Link>
            <Link
              href="/admin/forms/volunteer"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-figtree text-xs font-medium text-[#5F6C6D] transition-colors hover:text-[#00191B]"
              title="Switch to Volunteer Inquiries"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Volunteer Leads</span>
            </Link>
            <div className="flex items-center gap-1.5 rounded-md bg-[#1A0F1C] px-3 py-1.5 font-figtree text-xs font-bold text-white shadow-xs">
              <Handshake className="h-3.5 w-3.5" />
              <span>Partnerships</span>
            </div>
          </div>

          {/* Status Tabs: Inbox vs Trash */}
          <div className="flex rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] p-0.5 shadow-xs">
            <button
              id="btn-tab-active-inbox"
              type="button"
              onClick={() => {
                setActiveTab("active");
                setPage(1);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 font-figtree text-xs font-semibold transition-all cursor-pointer",
                activeTab === "active"
                  ? "bg-white text-[#9739A8] shadow-xs"
                  : "text-[#5F6C6D] hover:text-[#00191B]",
              )}
            >
              Active Inbox
            </button>
            <button
              id="btn-tab-trash"
              type="button"
              onClick={() => {
                setActiveTab("deleted");
                setPage(1);
              }}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-1.5 font-figtree text-xs font-semibold transition-all cursor-pointer",
                activeTab === "deleted"
                  ? "bg-white text-red-600 shadow-xs"
                  : "text-[#5F6C6D] hover:text-[#00191B]",
              )}
            >
              <Trash2 className="h-3 w-3" />
              <span>Trash</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FEEDBACK BANNER
          ───────────────────────────────────────────────────────────── */}
      {feedback && (
        <div
          className={cn(
            "flex items-center justify-between rounded-xl p-3.5 text-xs font-figtree font-medium transition-all shadow-xs",
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800",
          )}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="cursor-pointer opacity-70 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          INTEGRATED TOOLBAR: Search, Type Filter & Controls
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E0D8] bg-white p-3.5 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A847A]" />
            <input
              type="text"
              placeholder="Search partner, org, phone or proposal…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#D9D3C9] bg-[#FAF8F4] py-2 pl-9 pr-3 font-figtree text-xs text-[#00191B] placeholder-[#8A847A] outline-none transition-colors focus:border-[#9739A8] focus:bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A847A] hover:text-[#00191B] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Partnership Type Filter */}
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A847A]" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#D9D3C9] bg-[#FAF8F4] py-2 pl-9 pr-8 font-figtree text-xs text-[#00191B] outline-none transition-colors focus:border-[#9739A8] focus:bg-white cursor-pointer"
            >
              <option value="">All Partnership Types</option>
              {PARTNERSHIP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side controls: Rows per page & Refresh */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <div className="flex items-center gap-1.5 font-figtree text-xs text-[#5F6C6D]">
            <span>Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-2 py-1.5 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void loadInquiries()}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-[#D9D3C9] bg-white px-3 py-1.5 font-figtree text-xs font-semibold text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#00191B] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh inquiry records"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin text-[#9739A8]")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DATA TABLE CONTAINER (RESPONSIVE GRID)
          ───────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white shadow-xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[820px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE5DC] bg-[#FAF8F4]/80 text-[11px] font-bold uppercase tracking-wider text-[#7A7265] font-figtree">
                <th className="py-3.5 pl-6 pr-4">Partner Contact</th>
                <th className="px-4 py-3.5">Organization</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Partnership Model</th>
                <th className="px-4 py-3.5">Proposal Summary</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EAE5DC] font-figtree text-xs text-[#1A0F1C]">
              {loading && inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-[#9739A8]" />
                      <span className="text-xs text-[#7A7265]">Loading inquiries…</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-red-600">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                      <span>{error}</span>
                      <button
                        type="button"
                        onClick={() => void loadInquiries()}
                        className="mt-2 rounded-lg bg-[#FAF8F4] border border-[#D9D3C9] px-3 py-1 text-xs text-[#00191B] hover:bg-white cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#7A7265]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Handshake className="h-8 w-8 text-[#D9D3C9]" />
                      <span className="font-medium text-[#1A0F1C]">
                        {activeTab === "active"
                          ? "No partnership inquiries found"
                          : "Trash is currently empty"}
                      </span>
                      <span className="text-[11px] text-[#8A847A]">
                        {searchTerm || selectedType
                          ? "Try clearing your search or filters."
                          : "Website submissions will automatically appear here."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => {
                  const typeClass =
                    TYPE_STYLES[inquiry.partnershipType] ||
                    "bg-stone-100 text-stone-700 border-stone-200";

                  return (
                    <tr
                      key={inquiry.id}
                      className="group transition-colors hover:bg-[#FAF8F4]/60"
                    >
                      {/* Submitter & Date */}
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FAF0FC] to-[#FAF8F4] border border-[#9739A8]/20 text-[#9739A8] font-figtree font-bold text-xs shadow-2xs">
                            {getInitials(inquiry.yourName)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-[#00191B] block truncate max-w-[170px]">
                              {inquiry.yourName}
                            </span>
                            <span className="text-[11px] text-[#7A7265] flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3 text-[#A89F91]" />
                              {formatDate(inquiry.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 max-w-[180px]">
                          <Building2 className="h-3.5 w-3.5 shrink-0 text-[#9739A8]" />
                          <span className="font-semibold text-[#1A0F1C] truncate" title={inquiry.orgName}>
                            {inquiry.orgName}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-figtree text-xs text-[#4A4238] whitespace-nowrap">
                            {inquiry.phone}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(inquiry.phone, inquiry.id + "-phone")}
                            className="rounded-md p-1 text-[#8A847A] opacity-0 group-hover:opacity-100 hover:bg-[#FAF8F4] hover:text-[#00191B] transition-opacity cursor-pointer"
                            title="Copy phone number"
                          >
                            {copiedId === inquiry.id + "-phone" ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Partnership Type */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md border px-2 py-0.5 font-figtree text-[11px] font-semibold whitespace-nowrap",
                            typeClass,
                          )}
                        >
                          {inquiry.partnershipType}
                        </span>
                      </td>

                      {/* Proposal Preview */}
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <p
                          className="font-figtree text-xs text-[#5F6C6D] line-clamp-2 leading-relaxed"
                          title={inquiry.proposal || "No proposal text provided."}
                        >
                          {inquiry.proposal || (
                            <span className="italic text-[#A89F91]">No proposal text provided</span>
                          )}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`btn-view-${inquiry.id}`}
                            type="button"
                            onClick={() => openViewModal(inquiry)}
                            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#9739A8] transition-colors cursor-pointer"
                            title="View inquiry details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            id={`btn-edit-${inquiry.id}`}
                            type="button"
                            onClick={() => openEditModal(inquiry)}
                            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#9739A8] transition-colors cursor-pointer"
                            title="Edit inquiry details"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {activeTab === "active" ? (
                            <button
                              id={`btn-delete-${inquiry.id}`}
                              type="button"
                              onClick={() => void handleDelete(inquiry)}
                              disabled={actionInProgress === inquiry.id}
                              className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                              title="Move to trash"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              id={`btn-restore-${inquiry.id}`}
                              type="button"
                              onClick={() => void handleRestore(inquiry)}
                              disabled={actionInProgress === inquiry.id}
                              className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
                              title="Restore from trash"
                            >
                              <ArchiveRestore className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            PAGINATION FOOTER
            ───────────────────────────────────────────────────────────── */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#EAE5DC] bg-[#FAF8F4]/50 px-6 py-3">
            <span className="font-figtree text-xs text-[#7A7265]">
              Showing page <strong className="text-[#1A0F1C]">{meta.page}</strong> of{" "}
              <strong className="text-[#1A0F1C]">{meta.totalPages}</strong> ({meta.total} total)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 py-1.5 font-figtree text-xs font-semibold text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#00191B] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages || loading}
                className="flex items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 py-1.5 font-figtree text-xs font-semibold text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#00191B] disabled:opacity-40 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CLEAN DETAIL / EDIT POPUP MODAL (NO RAW IDS, NO EMAIL REPLY)
          ───────────────────────────────────────────────────────────── */}
      {selectedInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#00191B]/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            className="w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EAE5DC] bg-[#FAF8F4]/80 px-4 sm:px-6 py-3.5 sm:py-5 shrink-0 gap-3">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#9739A8]/10 border border-[#9739A8]/20 text-[#9739A8] font-figtree font-bold text-sm shadow-2xs">
                  {getInitials(selectedInquiry.yourName)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-lora text-lg font-medium text-[#1A0F1C] truncate">
                      {selectedInquiry.yourName}
                    </h2>
                    <span
                      className={cn(
                        "rounded-md border px-2 py-0.5 font-figtree text-[11px] font-semibold",
                        TYPE_STYLES[selectedInquiry.partnershipType] ||
                          "bg-stone-100 text-stone-700 border-stone-200",
                      )}
                    >
                      {selectedInquiry.partnershipType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-figtree text-xs font-semibold text-[#5F6C6D]">
                      {selectedInquiry.orgName}
                    </span>
                    <span className="text-[#D9D3C9]">•</span>
                    <span className="font-figtree text-xs text-[#8A847A] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(selectedInquiry.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-3">
                <button
                  id="btn-modal-edit-toggle"
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                    } else {
                      openEditModal(selectedInquiry);
                    }
                  }}
                  className={cn(
                    "rounded-lg p-2 transition-colors cursor-pointer",
                    isEditing
                      ? "bg-[#FAF0FC] text-[#9739A8]"
                      : "text-[#8A847A] hover:bg-white hover:text-[#00191B]",
                  )}
                  title={isEditing ? "Cancel edit" : "Edit inquiry details"}
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  id="btn-modal-close-header"
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-lg p-2 text-[#8A847A] hover:bg-white hover:text-[#00191B] transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: View vs Edit */}
            {!isEditing ? (
              <div className="p-6 space-y-4">
                {/* 2-Column Contact Info Micro-Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Organization Card */}
                  <div className="flex items-center justify-between rounded-xl border border-[#EAE5DC] bg-[#FAF8F4]/80 p-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#9739A8]">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#8A847A]">
                          Organization
                        </p>
                        <p className="font-figtree text-xs font-semibold text-[#1A0F1C] truncate" title={selectedInquiry.orgName}>
                          {selectedInquiry.orgName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedInquiry.orgName, "modal-org")}
                      className="ml-2 rounded-md p-1.5 text-[#8A847A] hover:bg-white hover:text-[#00191B] cursor-pointer shrink-0 transition-colors"
                      title="Copy organization name"
                    >
                      {copiedId === "modal-org" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Phone Card */}
                  <div className="flex items-center justify-between rounded-xl border border-[#EAE5DC] bg-[#FAF8F4]/80 p-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#9739A8]">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#8A847A]">
                          Phone Number
                        </p>
                        <p className="font-figtree text-xs font-semibold text-[#1A0F1C]">
                          <a href={`tel:${selectedInquiry.phone}`} className="hover:underline">
                            {selectedInquiry.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedInquiry.phone, "modal-phone")}
                      className="ml-2 rounded-md p-1.5 text-[#8A847A] hover:bg-white hover:text-[#00191B] cursor-pointer shrink-0 transition-colors"
                      title="Copy phone number"
                    >
                      {copiedId === "modal-phone" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Proposal & Scope Section */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-figtree text-[10px] font-bold uppercase tracking-wider text-[#7A7265]">
                      <Handshake className="h-3.5 w-3.5 text-[#9739A8]" />
                      Partnership Proposal & Scope
                    </span>
                    {selectedInquiry.deletedAt && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 font-figtree text-[11px] font-semibold text-red-600">
                        <Trash2 className="h-3 w-3" />
                        Moved to Trash ({formatDate(selectedInquiry.deletedAt)})
                      </span>
                    )}
                  </div>
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-[#EAE5DC] bg-[#FCFBF9] p-4.5 font-figtree text-[13px] leading-relaxed text-[#2C2420] whitespace-pre-wrap selection:bg-[#FAF0FC]">
                    {selectedInquiry.proposal || "No proposal narrative submitted."}
                  </div>
                </div>
              </div>
            ) : (
              /* Inline Edit Form */
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-3.5 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                      Submitter Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.yourName}
                      onChange={(e) =>
                        setEditFormData((f) => ({ ...f, yourName: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.orgName}
                      onChange={(e) =>
                        setEditFormData((f) => ({ ...f, orgName: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                      Partnership Model
                    </label>
                    <select
                      value={editFormData.partnershipType}
                      onChange={(e) =>
                        setEditFormData((f) => ({ ...f, partnershipType: e.target.value }))
                      }
                      className="mt-1 w-full max-w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white cursor-pointer truncate"
                    >
                      {PARTNERSHIP_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                    Collaboration Scope & Proposal
                  </label>
                  <textarea
                    rows={4}
                    value={editFormData.proposal}
                    onChange={(e) =>
                      setEditFormData((f) => ({ ...f, proposal: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between border-t border-[#EAE5DC] bg-[#FAF8F4]/80 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
              {!isEditing ? (
                <>
                  <div>
                    {activeTab === "active" ? (
                      <button
                        id="btn-modal-move-to-trash"
                        type="button"
                        onClick={() => void handleDelete(selectedInquiry)}
                        className="inline-flex items-center gap-1.5 font-figtree text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Move to Trash</span>
                      </button>
                    ) : (
                      <button
                        id="btn-modal-restore"
                        type="button"
                        onClick={() => void handleRestore(selectedInquiry)}
                        className="inline-flex items-center gap-1.5 font-figtree text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        <ArchiveRestore className="h-3.5 w-3.5" />
                        <span>Restore Inquiry</span>
                      </button>
                    )}
                  </div>

                  <button
                    id="btn-modal-close"
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="rounded-xl bg-[#1A0F1C] px-5 py-2 font-figtree text-xs font-bold text-white hover:bg-[#2D1B30] transition-colors cursor-pointer shadow-2xs"
                  >
                    Close
                  </button>
                </>
              ) : (
                <div className="flex w-full items-center justify-end gap-2">
                  <button
                    id="btn-modal-cancel-edit"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={savingEdit}
                    className="rounded-xl border border-[#D9D3C9] bg-white px-4 py-2 font-figtree text-xs font-semibold text-[#5F6C6D] hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    id="btn-modal-save-changes"
                    type="button"
                    onClick={() => void handleSaveEdit()}
                    disabled={savingEdit}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#9739A8] px-4 py-2 font-figtree text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    {savingEdit && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>{savingEdit ? "Saving…" : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
