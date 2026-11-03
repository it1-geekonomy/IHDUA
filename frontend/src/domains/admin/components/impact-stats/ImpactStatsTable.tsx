"use client";

import {
  ArchiveRestore,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CARD_POSITION_CONFIG,
  type ImpactStatItem,
  type PaginationMeta,
} from "./types";

interface ImpactStatsTableProps {
  items: ImpactStatItem[];
  loading: boolean;
  actionLoading: boolean;
  activeTab: "active" | "deleted";
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onEdit: (item: ImpactStatItem) => void;
  onDeletePrompt: (item: ImpactStatItem) => void;
  onRestore: (item: ImpactStatItem) => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ImpactStatsTable({
  items,
  loading,
  actionLoading,
  activeTab,
  meta,
  onPageChange,
  onEdit,
  onDeletePrompt,
  onRestore,
}: ImpactStatsTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-12 text-[#5F6C6D] shadow-xs">
        <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
        <p className="mt-3 font-figtree text-xs">Loading impact stats…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D9D3C9] bg-white/50 p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F4] text-[#8A847A] mb-3">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
          {activeTab === "active" ? "No impact stats found" : "Trash is empty"}
        </p>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D] max-w-sm">
          {activeTab === "active"
            ? "Add your first impact metric above to feature on the homepage calendar cards."
            : "No deleted impact stats were found in trash."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-figtree text-xs">
          <thead className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[11px] font-bold uppercase tracking-wider text-[#5F6C6D]">
            <tr>
              <th className="py-3 px-4 w-52">Card Position</th>
              <th className="py-3 px-4">Metric Name</th>
              <th className="py-3 px-4 w-44">Metric Value</th>
              <th className="py-3 px-4 w-44">Created</th>
              <th className="py-3 px-4 text-right w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {items.map((item) => {
              const posCfg =
                CARD_POSITION_CONFIG[item.cardPosition] ||
                CARD_POSITION_CONFIG.first;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#FAF8F4]/60 transition-colors group"
                >
                  {/* Card Position Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border",
                        posCfg.badgeBg,
                        posCfg.badgeText,
                        posCfg.badgeBorder,
                      )}
                    >
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", posCfg.dotColor)}
                      />
                      {posCfg.label}
                    </span>
                  </td>

                  {/* Metric Name */}
                  <td className="py-3.5 px-4 font-medium text-[#0F1C1D]">
                    <span className="font-semibold text-[13px]">
                      {item.metricName}
                    </span>
                  </td>

                  {/* Metric Value */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block rounded-md bg-[#FAF8F4] border border-[#E5E0D8] px-2.5 py-1 font-mono text-xs font-bold text-[#0F1C1D]">
                      {item.metricValue}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 text-[#5F6C6D] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#8A847A]" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {activeTab === "active" ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          disabled={actionLoading}
                          className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-[#FAF5FC] hover:text-[#9739A8] transition-colors cursor-pointer"
                          title="Edit impact stat"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeletePrompt(item)}
                          disabled={actionLoading}
                          className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Move to trash"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => onRestore(item)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                          title="Restore impact stat"
                        >
                          <ArchiveRestore className="h-3 w-3" />
                          <span>Restore</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E5E0D8] px-4 py-3 sm:flex-row font-figtree text-xs text-[#5F6C6D] bg-[#FAF8F4]/50">
          <div>
            Showing{" "}
            <span className="font-semibold text-[#0F1C1D]">
              {(meta.page - 1) * meta.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#0F1C1D]">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0F1C1D]">{meta.total}</span>{" "}
            metrics
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1 || actionLoading}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 text-xs font-semibold text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-2 font-mono text-[11px]">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages || actionLoading}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 text-xs font-semibold text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

