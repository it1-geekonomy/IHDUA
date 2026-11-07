"use client";

import { AlertCircle } from "lucide-react";
import { useDonations } from "./useDonations";
import { DonationsHeader } from "./DonationsHeader";
import { DonationsToolbar } from "./DonationsToolbar";
import { DonationsTable } from "./DonationsTable";
import { DonationDetailModal } from "./DonationDetailModal";

export function DonationsManager() {
  const {
    donations,
    totalCount,
    allDonationsCount,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    totalRaisedINR,
    loading,
    error,
    refresh,
    selectedDonation,
    isDetailOpen,
    detailLoading,
    detailError,
    onViewDetail,
    onCloseDetail,
  } = useDonations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <DonationsHeader
        totalCount={allDonationsCount}
        totalRaisedINR={totalRaisedINR}
        loading={loading}
        onRefresh={refresh}
      />

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 font-figtree font-medium shadow-2xs">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      {/* Toolbar */}
      <DonationsToolbar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        limit={limit}
        onLimitChange={setLimit}
      />

      {/* Table */}
      <DonationsTable
        donations={donations}
        totalCount={totalCount}
        totalPages={totalPages}
        page={page}
        loading={loading}
        onPageChange={setPage}
        onViewDetail={onViewDetail}
      />

      {/* Detail Modal */}
      <DonationDetailModal
        isOpen={isDetailOpen}
        donation={selectedDonation}
        loading={detailLoading}
        error={detailError}
        onClose={onCloseDetail}
      />
    </div>
  );
}

