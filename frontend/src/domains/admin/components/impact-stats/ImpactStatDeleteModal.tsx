"use client";

import { Loader2, Trash2 } from "lucide-react";
import { CARD_POSITION_CONFIG, type ImpactStatItem } from "./types";

interface ImpactStatDeleteModalProps {
  item: ImpactStatItem | null;
  actionLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ImpactStatDeleteModal({
  item,
  actionLoading,
  onCancel,
  onConfirm,
}: ImpactStatDeleteModalProps) {
  if (!item) return null;

  const posCfg = CARD_POSITION_CONFIG[item.cardPosition];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <Trash2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-lora text-base font-medium text-[#0F1C1D]">
              Move Impact Stat to Trash?
            </h3>
            <p className="text-xs text-[#5F6C6D]">
              You can restore this metric from the Trash tab at any time.
            </p>
          </div>
        </div>

        <div className="my-4 rounded-lg bg-[#FAF8F4] border border-[#E5E0D8] p-3 text-xs text-[#0F1C1D]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm text-[#0F1C1D]">
              {item.metricName}
            </span>
            <span className="font-mono font-bold text-xs bg-[#1A0F1C] text-white px-2 py-0.5 rounded">
              {item.metricValue}
            </span>
          </div>
          <span className="text-[#5F6C6D] font-medium block">
            {posCfg?.label || item.cardPosition}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {actionLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Move to Trash</span>
          </button>
        </div>
      </div>
    </div>
  );
}

