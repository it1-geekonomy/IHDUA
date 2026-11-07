"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  fetchDonations,
  fetchDonationById,
  type AdminDonationRow,
} from "@/domains/admin/lib/api";
import type { StatusFilter } from "./types";

export function useDonations() {
  const { token, ready } = useAdminAuth();

  const [rawDonations, setRawDonations] = useState<AdminDonationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Detail modal state
  const [selectedDonation, setSelectedDonation] = useState<AdminDonationRow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadDonations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDonations(token);
      setRawDonations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load donations.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (ready && token) {
      loadDonations();
    }
  }, [ready, token, loadDonations]);

  // Filtered rows
  const filteredDonations = useMemo(() => {
    let result = rawDonations;

    if (statusFilter !== "all") {
      result = result.filter((item) => {
        if (statusFilter === "paid") {
          return item.status === "paid" || item.status === "success";
        }
        return item.status === statusFilter;
      });
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.fullName?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.phone?.toLowerCase().includes(q) ||
          item.pan?.toLowerCase().includes(q) ||
          item.city?.toLowerCase().includes(q) ||
          item.receiptNumber?.toLowerCase().includes(q) ||
          item.razorpayPaymentId?.toLowerCase().includes(q) ||
          item.donationCategory?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [rawDonations, statusFilter, searchTerm]);

  // Paginated rows
  const totalItems = filteredDonations.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const paginatedDonations = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredDonations.slice(start, start + limit);
  }, [filteredDonations, page, limit]);

  // Calculate total successfully paid amount
  const totalRaisedINR = useMemo(() => {
    return rawDonations
      .filter((d) => (d.status === "paid" || d.status === "success") && (d.currency === "INR" || !d.currency))
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [rawDonations]);

  // Handle open details modal (fetching fresh /api/donors/:id for receipt & certificate URLs)
  const handleViewDetail = async (donation: AdminDonationRow) => {
    setSelectedDonation(donation);
    setIsDetailOpen(true);
    setDetailError(null);

    if (token) {
      setDetailLoading(true);
      try {
        const fullDetail = await fetchDonationById(token, donation.id);
        setSelectedDonation(fullDetail);
      } catch (err) {
        setDetailError(
          err instanceof Error
            ? err.message
            : "Failed to fetch full donation details.",
        );
      } finally {
        setDetailLoading(false);
      }
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDonation(null);
    setDetailError(null);
  };

  const handleStatusFilterChange = (val: StatusFilter) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  return {
    donations: paginatedDonations,
    totalCount: totalItems,
    allDonationsCount: rawDonations.length,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    searchTerm,
    onSearchChange: handleSearchChange,
    statusFilter,
    onStatusFilterChange: handleStatusFilterChange,
    totalRaisedINR,
    loading,
    error,
    refresh: loadDonations,
    selectedDonation,
    isDetailOpen,
    detailLoading,
    detailError,
    onViewDetail: handleViewDetail,
    onCloseDetail: handleCloseDetail,
  };
}

