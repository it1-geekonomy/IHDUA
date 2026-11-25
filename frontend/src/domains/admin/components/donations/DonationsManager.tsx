"use client";

import { AlertCircle, Check } from "lucide-react";
import { useDonations } from "./useDonations";
import { DonationsHeader } from "./DonationsHeader";
import { DonationsToolbar } from "./DonationsToolbar";
import { DonationsTable } from "./DonationsTable";
import { DonationDetailModal } from "./DonationDetailModal";
import { ManualDonationModal } from "./ManualDonationModal";

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
    originFilter,
    onOriginFilterChange,
    totalRaisedINR,
    loading,
    error,
    successMessage,
    refresh,
    selectedDonation,
    isDetailOpen,
    detailLoading,
    detailError,
    onViewDetail,
    onCloseDetail,
    isManualOpen,
    manualLoading,
    openManual,
    closeManual,
    handleCreateManual,
  } = useDonations();

  return (
    <div className="space-y-6">
      <DonationsHeader
        totalCount={allDonationsCount}
        totalRaisedINR={totalRaisedINR}
        loading={loading}
        onRefresh={refresh}
        onAddOffline={openManual}
      />

      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#1F6B45]/20 bg-[#E7F6EE] px-4 py-3 text-xs text-[#1F6B45] font-figtree font-medium shadow-2xs">
          <Check className="h-4 w-4 shrink-0" />
          <p className="flex-1">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 font-figtree font-medium shadow-2xs">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      <DonationsToolbar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        originFilter={originFilter}
        onOriginFilterChange={onOriginFilterChange}
        limit={limit}
        onLimitChange={setLimit}
      />

      <DonationsTable
        donations={donations}
        totalCount={totalCount}
        totalPages={totalPages}
        page={page}
        loading={loading}
        onPageChange={setPage}
        onViewDetail={onViewDetail}
      />

      <DonationDetailModal
        isOpen={isDetailOpen}
        donation={selectedDonation}
        loading={detailLoading}
        error={detailError}
        onClose={onCloseDetail}
      />

      <ManualDonationModal
        isOpen={isManualOpen}
        actionLoading={manualLoading}
        onClose={closeManual}
        onSave={handleCreateManual}
      />
    </div>
  );
}

