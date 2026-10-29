"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArchiveRestore,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  Filter,
  Handshake,
  HeartHandshake,
  Inbox,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { CONTACT_SUBJECTS } from "@/domains/admin/constants";
import {
  deleteContactLead,
  fetchContactLeads,
  fetchDeletedContactLeads,
  restoreContactLead,
  updateContactLead,
  type LeadContact,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import { cn } from "@/lib/utils";

const SUBJECT_STYLES: Record<string, string> = {
  "General Enquiry": "bg-blue-50 text-blue-700 border-blue-200/80",
  "Programme Information": "bg-purple-50 text-purple-700 border-purple-200/80",
  "Donation Enquiry": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Volunteer Opportunities": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Partnership & Collaboration": "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  "CSR Projects": "bg-cyan-50 text-cyan-700 border-cyan-200/80",
  "Education Programmes": "bg-rose-50 text-rose-700 border-rose-200/80",
  "Healthcare Initiatives": "bg-teal-50 text-teal-700 border-teal-200/80",
  "Women's Empowerment": "bg-pink-50 text-pink-700 border-pink-200/80",
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

export function ContactLeadsPage() {
  const { token, ready } = useAdminAuth();

  // State
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [leads, setLeads] = useState<LeadContact[]>([]);
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
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<LeadContact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    mobile: string;
    subject: string;
    message: string;
  }>({
    name: "",
    email: "",
    mobile: "",
    subject: "General Enquiry",
    message: "",
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Request sequencing and initial-render protection
  const activeReqId = useRef(0);
  const searchInitRef = useRef(true);

  // Fetch data
  const loadLeads = useCallback(
    async (targetPage = page, targetLimit = limit, targetSearch = debouncedSearch) => {
      if (!token || !ready) return;
      const reqId = ++activeReqId.current;
      setLoading(true);
      setError(null);

      try {
        const fetcher = activeTab === "active" ? fetchContactLeads : fetchDeletedContactLeads;
        const res = await fetcher(token, {
          page: targetPage,
          limit: targetLimit,
          search: targetSearch,
        });
        if (reqId === activeReqId.current) {
          setLeads(res.data);
          setMeta(res.meta);
        }
      } catch (err) {
        if (reqId === activeReqId.current) {
          setError(err instanceof Error ? err.message : "Failed to load contact leads.");
        }
      } finally {
        if (reqId === activeReqId.current) {
          setLoading(false);
        }
      }
    },
    [token, ready, activeTab, page, limit, debouncedSearch],
  );

  // Single effect to fetch on mount, tab change, page change, limit change, or debounced search change
  useEffect(() => {
    if (ready && token) {
      void loadLeads(page, limit, debouncedSearch);
    }
  }, [ready, token, activeTab, page, limit, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search: skips initial mount so no duplicate call is made
  useEffect(() => {
    if (searchInitRef.current) {
      searchInitRef.current = false;
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Handle Delete (soft delete)
  const handleDelete = async (lead: LeadContact) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to move "${lead.name}"'s inquiry to trash?`)) {
      return;
    }

    setActionInProgress(lead.id);
    try {
      await deleteContactLead(token, lead.id);
      setFeedback({ type: "success", text: `Inquiry from "${lead.name}" moved to trash.` });
      if (selectedLead?.id === lead.id) setSelectedLead(null);
      await loadLeads();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete lead.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Restore
  const handleRestore = async (lead: LeadContact) => {
    if (!token) return;
    setActionInProgress(lead.id);

    try {
      await restoreContactLead(token, lead.id);
      setFeedback({ type: "success", text: `Inquiry from "${lead.name}" restored to inbox.` });
      if (selectedLead?.id === lead.id) setSelectedLead(null);
      await loadLeads();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to restore lead.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Start Edit Mode
  const startEdit = (lead: LeadContact) => {
    setEditFormData({
      name: lead.name,
      email: lead.email,
      mobile: lead.mobile,
      subject: lead.subject,
      message: lead.message,
    });
    setIsEditing(true);
  };

  // Save Edit (PATCH /api/leads-contact/:id)
  const handleSaveEdit = async () => {
    if (!token || !selectedLead) return;
    setSavingEdit(true);

    try {
      const updated = await updateContactLead(token, selectedLead.id, editFormData);
      setSelectedLead(updated);
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setIsEditing(false);
      setFeedback({
        type: "success",
        text: `Inquiry from "${updated.name}" updated successfully.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update contact inquiry.",
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

  // Filter leads locally by selectedSubject if chosen
  const filteredLeads = selectedSubject
    ? leads.filter((l) => l.subject === selectedSubject)
    : leads;

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          CLEAN HEADER: Title & Unified Status / Category Controls
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-lora text-2xl font-medium text-[#0F1C1D]">
              Contact Leads
            </h1>
            <span className="rounded-full bg-[#1A0F1C]/5 px-2.5 py-0.5 font-figtree text-xs font-semibold text-[#1A0F1C]">
              {meta.total} {meta.total === 1 ? "lead" : "leads"}
            </span>
          </div>
          <p className="mt-1 font-figtree text-xs text-[#5F6C6D]">
            Manage inquiries, messages, and partnership requests submitted via website forms.
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Category Switcher */}
          <div className="flex rounded-lg border border-[#D9D3C9] bg-white p-0.5 shadow-xs">
            <div className="flex items-center gap-1.5 rounded-md bg-[#1A0F1C] px-3 py-1.5 font-figtree text-xs font-bold text-white shadow-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Contact Leads</span>
            </div>
            <Link
              href="/admin/forms/volunteer"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-figtree text-xs font-medium text-[#5F6C6D] transition-colors hover:text-[#00191B]"
              title="Switch to Volunteer Inquiries"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Volunteer Leads</span>
            </Link>
            <Link
              href="/admin/forms/partnership"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-figtree text-xs font-medium text-[#5F6C6D] transition-colors hover:text-[#00191B]"
              title="Switch to Partnership Inquiries"
            >
              <Handshake className="h-3.5 w-3.5" />
              <span>Partnerships</span>
            </Link>
          </div>

          {/* Status Tabs: Inbox vs Trash */}
          <div className="flex rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] p-0.5 shadow-xs">
            <button
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

      {/* Feedback Toast */}
      {feedback && (
        <div
          role="status"
          className={cn(
            "flex items-center justify-between rounded-xl px-4 py-2.5 font-figtree text-xs font-medium shadow-xs transition-all",
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-red-200 bg-red-50 text-red-900",
          )}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          UNIFIED TABLE CARD: Toolbar + Data Grid + Pagination
          ───────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#D9D3C9] bg-white shadow-xs">
        {/* Integrated Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#E5E0D8] bg-[#FAF8F4]/60 p-3 sm:p-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-[#8A847A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or subject…"
              className="w-full rounded-lg border border-[#D9D3C9] bg-white py-1.5 pl-9 pr-8 font-figtree text-xs text-[#00191B] placeholder:text-[#8A847A] outline-none transition-colors focus:border-[#9739A8]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2 text-xs text-[#8A847A] hover:text-[#00191B] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Controls & Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-[#8A847A] shrink-0" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="max-w-[170px] sm:max-w-none rounded-lg border border-[#D9D3C9] bg-white px-2 py-1.5 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] cursor-pointer truncate"
              >
                <option value="">All Subject Categories</option>
                {CONTACT_SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Rows Per Page */}
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-[#D9D3C9] bg-white px-2 py-1.5 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] cursor-pointer"
              title="Rows per page"
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => void loadLeads(page, limit, debouncedSearch)}
              disabled={loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] transition-colors hover:border-[#9739A8] hover:text-[#9739A8] disabled:opacity-50 cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Data Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-center font-figtree text-sm text-[#5F6C6D]">
            <RefreshCw className="h-6 w-6 animate-spin text-[#9739A8]" />
            <p className="mt-3">Loading contact leads…</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center font-figtree">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadLeads()}
              className="mt-3 rounded-lg bg-[#9739A8] px-3.5 py-1.5 text-xs font-semibold text-white cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center font-figtree">
            <Inbox className="mx-auto h-10 w-10 text-[#8A847A]" />
            <p className="mt-3 text-base font-semibold text-[#00191B]">
              {activeTab === "active" ? "No contact leads found" : "Trash is empty"}
            </p>
            <p className="mt-1 text-xs text-[#5F6C6D]">
              {activeTab === "active"
                ? "Contact inquiries submitted through the website will appear here in real time."
                : "Soft-deleted inquiries will appear here for recovery."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[780px] text-left font-figtree text-xs">
              <thead className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[10px] font-bold uppercase tracking-wider text-[#7A7265]">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[170px]">Contact Person</th>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[200px]">Contact Details</th>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[150px]">Subject</th>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[200px]">Message Preview</th>
                  <th className="px-5 py-3 text-right whitespace-nowrap min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {filteredLeads.map((lead) => {
                  const subjectBadgeClass =
                    SUBJECT_STYLES[lead.subject] || "bg-stone-100 text-stone-700 border-stone-200";

                  return (
                    <tr
                      key={lead.id}
                      className="group transition-colors hover:bg-[#FAF8F4]/70"
                    >
                      {/* Name & Date */}
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsEditing(false);
                          }}
                          className="font-semibold text-sm text-[#00191B] hover:text-[#9739A8] hover:underline cursor-pointer block text-left"
                        >
                          {lead.name}
                        </button>
                        <span className="text-[11px] text-[#8A847A]">
                          {formatDate(lead.createdAt)}
                        </span>
                      </td>

                      {/* Contact Details */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-0.5 text-xs text-[#5F6C6D]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-[#8A847A] shrink-0" />
                            <a
                              href={`mailto:${lead.email}`}
                              className="hover:text-[#9739A8] hover:underline truncate max-w-[180px]"
                            >
                              {lead.email}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(lead.email, `email-${lead.id}`)}
                              className="text-[#8A847A] hover:text-[#00191B] cursor-pointer"
                              title="Copy email"
                            >
                              {copiedId === `email-${lead.id}` ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                          {lead.mobile && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-[#8A847A] shrink-0" />
                              <a
                                href={`tel:${lead.mobile}`}
                                className="hover:text-[#9739A8] hover:underline"
                              >
                                {lead.mobile}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Subject Badge */}
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                            subjectBadgeClass,
                          )}
                        >
                          {lead.subject}
                        </span>
                      </td>

                      {/* Message Preview */}
                      <td className="max-w-xs px-5 py-3.5">
                        <p className="line-clamp-2 text-xs leading-relaxed text-[#5F6C6D]">
                          {lead.message}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsEditing(false);
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#D9D3C9] bg-white text-[#5F6C6D] transition-colors hover:border-[#9739A8] hover:text-[#9739A8] cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLead(lead);
                              startEdit(lead);
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#D9D3C9] bg-white text-[#5F6C6D] transition-colors hover:border-amber-400 hover:text-amber-700 cursor-pointer"
                            title="Edit Inquiry (Patch by ID)"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          {activeTab === "active" ? (
                            <button
                              type="button"
                              onClick={() => void handleDelete(lead)}
                              disabled={actionInProgress === lead.id}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#D9D3C9] bg-white text-[#5F6C6D] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                              title="Move to Trash"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => void handleRestore(lead)}
                              disabled={actionInProgress === lead.id}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#D9D3C9] bg-white text-[#5F6C6D] transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50 cursor-pointer"
                              title="Restore to Inbox"
                            >
                              <ArchiveRestore className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Integrated Pagination Footer */}
        {meta.total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E5E0D8] bg-[#FAF8F4]/50 px-5 py-3 sm:flex-row">
            <p className="font-figtree text-xs text-[#5F6C6D]">
              Showing <strong className="text-[#00191B]">{(meta.page - 1) * meta.limit + 1}</strong> to{" "}
              <strong className="text-[#00191B]">{Math.min(meta.page * meta.limit, meta.total)}</strong> of{" "}
              <strong className="text-[#00191B]">{meta.total}</strong> inquiries
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2.5 font-figtree text-xs font-medium text-[#5F6C6D] transition-colors hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <span className="font-figtree text-xs font-semibold text-[#00191B]">
                {meta.page} / {meta.totalPages || 1}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
                disabled={page >= (meta.totalPages || 1) || loading}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2.5 font-figtree text-xs font-medium text-[#5F6C6D] transition-colors hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CONTACT INQUIRY DETAIL & EDIT MODAL (CLEAN & ELEGANT)
          ───────────────────────────────────────────────────────────── */}
      {selectedLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => {
            setSelectedLead(null);
            setIsEditing(false);
          }}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-4 sm:p-6 pb-3.5 sm:pb-5 border-b border-[#EAE5DC] bg-[#FAF8F4]/70 shrink-0 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border border-[#9739A8]/20 bg-[#FAF0FC] font-lora text-sm sm:text-base font-bold text-[#9739A8]">
                  {selectedLead.name
                    ? selectedLead.name
                        .trim()
                        .split(/\s+/)
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "??"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-lora text-lg sm:text-xl font-bold text-[#1A0F1C] truncate">
                    {isEditing ? "Edit Inquiry Details" : selectedLead.name}
                  </h3>
                  <div className="mt-0.5 sm:mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold truncate",
                        SUBJECT_STYLES[selectedLead.subject] || "bg-stone-100 text-stone-700",
                      )}
                    >
                      {selectedLead.subject}
                    </span>
                    <span className="inline-flex items-center gap-1 font-figtree text-[11px] sm:text-xs text-[#7A7265] shrink-0">
                      <Clock className="h-3 w-3" />
                      {formatDate(selectedLead.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => startEdit(selectedLead)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-2.5 sm:px-3 py-1.5 font-figtree text-xs font-semibold text-[#5F6C6D] hover:border-[#9739A8] hover:text-[#9739A8] cursor-pointer transition-colors shadow-2xs"
                    title="Edit details"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLead(null);
                    setIsEditing(false);
                  }}
                  className="rounded-lg p-1.5 text-[#8A847A] hover:bg-slate-200/60 hover:text-[#00191B] cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* View Mode Content */}
            {!isEditing ? (
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                {/* 2-Column Contact Micro-Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between rounded-xl border border-[#EAE5DC] bg-[#FAF8F4]/80 p-3 sm:p-3.5 min-w-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#9739A8]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#8A847A]">
                          Email Address
                        </p>
                        <p className="font-figtree text-xs font-semibold text-[#1A0F1C] truncate" title={selectedLead.email}>
                          {selectedLead.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedLead.email, "modal-email")}
                      className="ml-2 rounded-md p-1.5 text-[#8A847A] hover:bg-white hover:text-[#00191B] cursor-pointer shrink-0 transition-colors"
                      title="Copy email address"
                    >
                      {copiedId === "modal-email" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-[#EAE5DC] bg-[#FAF8F4]/80 p-3 sm:p-3.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#9739A8]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#8A847A]">
                        Phone Number
                      </p>
                      <p className="font-figtree text-xs font-semibold text-[#1A0F1C] truncate">
                        {selectedLead.mobile ? (
                          <a href={`tel:${selectedLead.mobile}`} className="hover:underline">
                            {selectedLead.mobile}
                          </a>
                        ) : (
                          <span className="font-normal text-[#8A847A]">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-figtree text-[10px] font-bold uppercase tracking-wider text-[#7A7265]">
                      <MessageSquare className="h-3.5 w-3.5 text-[#9739A8]" />
                      Inquiry Message
                    </span>
                    {selectedLead.deletedAt && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 font-figtree text-[11px] font-semibold text-red-600">
                        <Trash2 className="h-3 w-3" />
                        Moved to Trash ({formatDate(selectedLead.deletedAt)})
                      </span>
                    )}
                  </div>
                  <div className="max-h-56 sm:max-h-60 overflow-y-auto rounded-xl border border-[#EAE5DC] bg-[#FCFBF9] p-3.5 sm:p-4.5 font-figtree text-[13px] leading-relaxed text-[#2C2420] whitespace-pre-wrap selection:bg-[#FAF0FC]">
                    {selectedLead.message || "No message body provided."}
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode Form */
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-3.5 overflow-y-auto flex-1">
                <div>
                  <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData((f) => ({ ...f, name: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white"
                  />
                </div>

                {/* Responsive 1-col on mobile, 2-col on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData((f) => ({ ...f, email: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editFormData.mobile}
                      onChange={(e) =>
                        setEditFormData((f) => ({ ...f, mobile: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                    Subject Category
                  </label>
                  <select
                    value={editFormData.subject}
                    onChange={(e) =>
                      setEditFormData((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="mt-1 w-full max-w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white cursor-pointer truncate"
                  >
                    {CONTACT_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-figtree text-xs font-semibold text-[#00191B]">
                    Inquiry Message
                  </label>
                  <textarea
                    rows={4}
                    value={editFormData.message}
                    onChange={(e) =>
                      setEditFormData((f) => ({ ...f, message: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3 py-2 font-figtree text-xs text-[#00191B] outline-none focus:border-[#9739A8] focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-[#EAE5DC] bg-[#FAF8F4]/80 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
              {!isEditing ? (
                <>
                  <div>
                    {activeTab === "active" ? (
                      <button
                        type="button"
                        onClick={() => void handleDelete(selectedLead)}
                        className="inline-flex items-center gap-1.5 font-figtree text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Move to Trash</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void handleRestore(selectedLead)}
                        className="inline-flex items-center gap-1.5 font-figtree text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        <ArchiveRestore className="h-3.5 w-3.5" />
                        <span>Restore Inquiry</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="rounded-xl bg-[#1A0F1C] px-5 py-2 font-figtree text-xs font-bold text-white hover:bg-[#2D1B30] transition-colors cursor-pointer shadow-2xs"
                  >
                    Close
                  </button>
                </>
              ) : (
                <div className="flex w-full items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={savingEdit}
                    className="rounded-xl border border-[#D9D3C9] bg-white px-3.5 sm:px-4 py-2 font-figtree text-xs font-semibold text-[#5F6C6D] hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleSaveEdit()}
                    disabled={savingEdit}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#9739A8] px-3.5 sm:px-4 py-2 font-figtree text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
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
