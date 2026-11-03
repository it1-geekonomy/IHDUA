"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  deletePartnershipInquiry,
  fetchDeletedPartnershipInquiries,
  fetchPartnershipInquiries,
  restorePartnershipInquiry,
  updatePartnershipInquiry,
  type LeadPartnership,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { PartnershipInquiryEditFormData } from "./types";

export function usePartnershipInquiries() {
  const { token, ready } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [leads, setLeads] = useState<LeadPartnership[]>([]);
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
  const [selectedLead, setSelectedLead] = useState<LeadPartnership | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<PartnershipInquiryEditFormData>({
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

  const activeReqId = useRef(0);
  const searchInitRef = useRef(true);

  const loadLeads = useCallback(
    async (targetPage = page, targetLimit = limit, targetSearch = debouncedSearch) => {
      if (!token || !ready) return;
      const reqId = ++activeReqId.current;
      setLoading(true);
      setError(null);

      try {
        const fetcher = activeTab === "active" ? fetchPartnershipInquiries : fetchDeletedPartnershipInquiries;
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
          setError(err instanceof Error ? err.message : "Failed to load partnership inquiries.");
        }
      } finally {
        if (reqId === activeReqId.current) {
          setLoading(false);
        }
      }
    },
    [token, ready, activeTab, page, limit, debouncedSearch],
  );

  useEffect(() => {
    if (ready && token) {
      void loadLeads(page, limit, debouncedSearch);
    }
  }, [ready, token, activeTab, page, limit, debouncedSearch, loadLeads]);

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (lead: LeadPartnership) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to move "${lead.yourName}"'s proposal to trash?`)) {
      return;
    }

    setActionInProgress(lead.id);
    try {
      await deletePartnershipInquiry(token, lead.id);
      setFeedback({ type: "success", text: `Proposal from "${lead.yourName}" moved to trash.` });
      if (selectedLead?.id === lead.id) setSelectedLead(null);
      await loadLeads();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete inquiry.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRestore = async (lead: LeadPartnership) => {
    if (!token) return;
    setActionInProgress(lead.id);

    try {
      await restorePartnershipInquiry(token, lead.id);
      setFeedback({ type: "success", text: `Proposal from "${lead.yourName}" restored to inbox.` });
      if (selectedLead?.id === lead.id) setSelectedLead(null);
      await loadLeads();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to restore inquiry.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const startEdit = (lead: LeadPartnership) => {
    setEditFormData({
      yourName: lead.yourName,
      orgName: lead.orgName || "",
      phone: lead.phone,
      partnershipType: lead.partnershipType,
      proposal: lead.proposal || "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!token || !selectedLead) return;
    setSavingEdit(true);

    try {
      const updated = await updatePartnershipInquiry(token, selectedLead.id, editFormData);
      setSelectedLead(updated);
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setIsEditing(false);
      setFeedback({
        type: "success",
        text: `Proposal from "${updated.yourName}" updated successfully.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update inquiry.",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredLeads = selectedType
    ? leads.filter((l) => l.partnershipType === selectedType)
    : leads;

  return {
    activeTab,
    setActiveTab,
    leads,
    filteredLeads,
    page,
    setPage,
    limit,
    setLimit,
    meta,
    loading,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedLead,
    setSelectedLead,
    isEditing,
    setIsEditing,
    editFormData,
    setEditFormData,
    copiedId,
    actionInProgress,
    savingEdit,
    feedback,
    setFeedback,
    loadLeads,
    copyToClipboard,
    handleDelete,
    handleRestore,
    startEdit,
    handleSaveEdit,
  };
}
