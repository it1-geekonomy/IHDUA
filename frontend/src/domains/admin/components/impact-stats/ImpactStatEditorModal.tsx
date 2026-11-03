"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import {
  CARD_POSITION_CONFIG,
  type ImpactCardPosition,
  type ImpactStatFormValues,
  type ImpactStatItem,
} from "./types";

interface ImpactStatEditorModalProps {
  isOpen: boolean;
  editingItem: ImpactStatItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: ImpactStatFormValues) => Promise<void>;
}

const POSITION_SELECT_OPTIONS: AdminSelectOption<ImpactCardPosition>[] = [
  {
    value: "first",
    label: "Card 1 (Slot 1) — Purple Theme",
    dotColor: "bg-[#9739A8]",
  },
  {
    value: "second",
    label: "Card 2 (Slot 2) — Yellow Theme",
    dotColor: "bg-[#F5C93B]",
  },
  {
    value: "third",
    label: "Card 3 (Slot 3) — Purple Theme",
    dotColor: "bg-[#9739A8]",
  },
  {
    value: "fourth",
    label: "Card 4 (Slot 4) — Yellow Theme",
    dotColor: "bg-[#F5C93B]",
  },
];

export function ImpactStatEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: ImpactStatEditorModalProps) {
  const [cardPosition, setCardPosition] = useState<ImpactCardPosition>("first");
  const [metricName, setMetricName] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setCardPosition(editingItem.cardPosition);
      setMetricName(editingItem.metricName);
      setMetricValue(editingItem.metricValue);
    } else {
      setCardPosition("first");
      setMetricName("");
      setMetricValue("");
    }
    setError(null);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim()) {
      setError("Please provide a metric name (e.g. Villages Reached).");
      return;
    }
    if (!metricValue.trim()) {
      setError("Please provide a formatted value (e.g. 202+, ₹9.14 Cr).");
      return;
    }

    try {
      await onSave({
        cardPosition,
        metricName: metricName.trim(),
        metricValue: metricValue.trim(),
      });
    } catch {
      // Error handled in hook
    }
  };

  const posCfg = CARD_POSITION_CONFIG[cardPosition];
  const isPurple = cardPosition === "first" || cardPosition === "third";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
                {editingItem ? "Edit Impact Stat" : "Create New Impact Stat"}
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                Configure the metric and card position for the website.
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Card Position */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Card Position & Theme <span className="text-rose-600">*</span>
            </label>
            <AdminSelect<ImpactCardPosition>
              value={cardPosition}
              onChange={setCardPosition}
              options={POSITION_SELECT_OPTIONS}
              size="md"
              className="w-full"
              dropdownClassName="w-full"
            />
            <p className="mt-1 font-figtree text-[11px] text-[#8A847A]">
              Card 1 & 3 render with purple binding; Card 2 & 4 render with yellow binding.
            </p>
          </div>

          {/* Metric Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Metric Name / Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              placeholder="e.g. Villages Reached, Self-Help Groups Supported"
              maxLength={150}
              className="h-10 w-full rounded-lg border border-[#D9D3C9] bg-white px-3 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
              required
            />
          </div>

          {/* Metric Value */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Metric Value <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
              placeholder="e.g. 202+, 600+, ₹9.14 Cr, 5,000+"
              maxLength={50}
              className="h-10 w-full rounded-lg border border-[#D9D3C9] bg-white px-3 font-figtree text-xs font-mono font-bold text-[#0F1C1D] placeholder:text-[#8A847A] placeholder:font-normal focus:border-[#9739A8] focus:outline-hidden"
              required
            />
          </div>

          {/* Live Card Preview */}
          <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F4] p-3.5">
            <span className="block text-[11px] font-semibold text-[#5F6C6D] uppercase tracking-wider mb-2">
              Website Card Preview ({posCfg.slot})
            </span>
            <div className="mx-auto w-48 rounded-xl border border-[#E5E0D8] bg-white p-4 shadow-sm text-center">
              {/* Card top binding strip */}
              <div
                className="h-2 rounded-full mx-auto w-16 mb-3"
                style={{ backgroundColor: posCfg.themeColor }}
              />
              <span className="block font-figtree text-2xl font-bold text-[#00191B] tabular-nums">
                {metricValue || "202+"}
              </span>
              <div className="my-2 h-px w-full bg-[#ECE8DC]" />
              <span className="block font-figtree text-xs font-bold text-[#3B3B3B] leading-tight">
                {metricName || "Metric Label"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-2 font-figtree text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-4 py-2 font-figtree text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] disabled:opacity-50 transition-all cursor-pointer"
            >
              {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingItem ? "Update Stat" : "Create Stat"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

