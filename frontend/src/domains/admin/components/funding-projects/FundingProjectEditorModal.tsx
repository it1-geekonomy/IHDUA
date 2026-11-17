"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import type {
  ContentStatus,
  FundingComponentItem,
  FundingProjectFormValues,
  FundingProjectItem,
} from "./types";

interface Props {
  isOpen: boolean;
  editingItem: FundingProjectItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: FundingProjectFormValues) => void;
}

const STATUS_OPTIONS: AdminSelectOption<ContentStatus>[] = [
  { value: "draft", label: "Draft", dotColor: "bg-amber-500" },
  { value: "published", label: "Published (Donate page)", dotColor: "bg-emerald-500" },
  { value: "archived", label: "Archived", dotColor: "bg-neutral-400" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

/** Keep digits only from any amount input (₹2,00,000 → 200000). */
function toAmountDigits(raw: string): string {
  return raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

/** Format digits as Indian Rupee label for display / donate page. */
function toAmountLabel(digits: string): string {
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return `₹${digits}`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

type AmountRow = { name: string; amount: string };

const emptyComponent = (): AmountRow => ({ name: "", amount: "" });

function componentFromStored(c: FundingComponentItem): AmountRow {
  return {
    name: c.name || "",
    amount: c.amountDigits || toAmountDigits(c.amountLabel || "") || c.amountLabel || "",
  };
}

function toStoredComponent(row: AmountRow): FundingComponentItem | null {
  const name = row.name.trim();
  const digits = toAmountDigits(row.amount);
  if (!name || !digits) return null;
  return {
    name,
    amountDigits: digits,
    amountLabel: toAmountLabel(digits),
  };
}

export function FundingProjectEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: Props) {
  const [projectNumber, setProjectNumber] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [totalLabel, setTotalLabel] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [components, setComponents] = useState<AmountRow[]>([emptyComponent()]);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [error, setError] = useState<string | null>(null);
  /** Keep existing slug stable when editing so public links don't break. */
  const [lockedSlug, setLockedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setLockedSlug(editingItem.slug);
      setProjectNumber(editingItem.projectNumber);
      setTitle(editingItem.title);
      setSummary(editingItem.summary);
      setTotalLabel(editingItem.totalLabel);
      setHighlightsText((editingItem.highlights || []).join("\n"));
      setComponents(
        editingItem.components?.length
          ? editingItem.components.map(componentFromStored)
          : [emptyComponent()],
      );
      setSortOrder(editingItem.sortOrder ?? 0);
      setStatus(editingItem.status);
    } else {
      setLockedSlug(null);
      setProjectNumber("");
      setTitle("");
      setSummary("");
      setTotalLabel("");
      setHighlightsText("");
      setComponents([emptyComponent()]);
      setSortOrder(0);
      setStatus("draft");
    }
    setError(null);
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !projectNumber.trim() || !summary.trim() || !totalLabel.trim()) {
      setError("Fill project #, title, summary, and total sought.");
      return;
    }

    const cleanedComponents = components
      .map(toStoredComponent)
      .filter((c): c is FundingComponentItem => Boolean(c));

    if (cleanedComponents.length === 0) {
      setError("Add at least one funding component with a name and amount.");
      return;
    }

    const slug = lockedSlug || slugify(trimmedTitle);
    if (!slug) {
      setError("Title must include letters or numbers so a URL slug can be created.");
      return;
    }

    onSave({
      slug,
      projectNumber: projectNumber.trim(),
      title: trimmedTitle,
      summary: summary.trim(),
      totalLabel: totalLabel.trim(),
      // Cause for donation checkout = project title (no separate field)
      cause: trimmedTitle,
      highlights: highlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      components: cleanedComponents,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white shadow-2xl font-figtree">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-5 py-4">
          <div>
            <h2 className="font-lora text-lg text-[#0F1C1D]">
              {editingItem ? "Edit funding project" : "Add funding project"}
            </h2>
            <p className="text-xs text-[#5F6C6D]">
              Totals and component breakups shown on /donate
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-xs font-semibold">
                Project # *
                <input
                  className="mt-1 w-full rounded-lg border border-[#D9D3C9] px-3 py-2"
                  value={projectNumber}
                  onChange={(e) => setProjectNumber(e.target.value)}
                  placeholder="01"
                />
              </label>
              <label className="text-xs font-semibold sm:col-span-2">
                Title *
                <input
                  className="mt-1 w-full rounded-lg border border-[#D9D3C9] px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Watershed Development"
                />
              </label>
            </div>

            <label className="block text-xs font-semibold">
              Summary *
              <textarea
                className="mt-1 min-h-[72px] w-full rounded-lg border border-[#D9D3C9] px-3 py-2"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-xs font-semibold">
                Total sought *
                <input
                  className="mt-1 w-full rounded-lg border border-[#D9D3C9] px-3 py-2"
                  value={totalLabel}
                  onChange={(e) => setTotalLabel(e.target.value)}
                  placeholder="₹35 lakh"
                />
              </label>
              <label className="text-xs font-semibold">
                Sort order
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-[#D9D3C9] px-3 py-2"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
              </label>
              <div>
                <p className="mb-1.5 text-xs font-semibold">Status</p>
                <AdminSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} />
              </div>
            </div>

            <label className="block text-xs font-semibold">
              Highlights (one per line)
              <textarea
                className="mt-1 min-h-[80px] w-full rounded-lg border border-[#D9D3C9] px-3 py-2"
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
              />
            </label>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold">Funding breakup components *</p>
                  <p className="text-[10px] font-normal text-[#5F6C6D]">
                    One amount field — enter 200000 or ₹2,00,000
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#9739A8]"
                  onClick={() => setComponents((prev) => [...prev, emptyComponent()])}
                >
                  <Plus className="h-3.5 w-3.5" /> Add component
                </button>
              </div>
              <div className="space-y-2">
                {components.map((row, index) => (
                  <div
                    key={index}
                    className="grid gap-2 rounded-lg border border-[#E5E0D8] p-2 sm:grid-cols-[1fr_160px_36px]"
                  >
                    <input
                      placeholder="Component name"
                      className="rounded border border-[#D9D3C9] px-2 py-1.5 text-xs"
                      value={row.name}
                      onChange={(e) =>
                        setComponents((prev) =>
                          prev.map((c, i) => (i === index ? { ...c, name: e.target.value } : c)),
                        )
                      }
                    />
                    <input
                      placeholder="Amount (e.g. 200000)"
                      inputMode="numeric"
                      className="rounded border border-[#D9D3C9] px-2 py-1.5 text-xs"
                      value={row.amount}
                      onChange={(e) =>
                        setComponents((prev) =>
                          prev.map((c, i) =>
                            i === index ? { ...c, amount: e.target.value } : c,
                          ),
                        )
                      }
                      onBlur={() =>
                        setComponents((prev) =>
                          prev.map((c, i) => {
                            if (i !== index) return c;
                            const digits = toAmountDigits(c.amount);
                            return { ...c, amount: digits ? toAmountLabel(digits) : c.amount };
                          }),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="text-rose-600"
                      onClick={() =>
                        setComponents((prev) =>
                          prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <Trash2 className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#E5E0D8] px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D9D3C9] px-3.5 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#9739A8] px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editingItem ? "Save changes" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
