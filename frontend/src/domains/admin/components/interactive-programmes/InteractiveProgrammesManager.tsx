"use client";

import {
  AlertCircle,
  Check,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import { InteractiveProgrammeEditorModal } from "./InteractiveProgrammeEditorModal";
import { useInteractiveProgrammes } from "./useInteractiveProgrammes";
import type { ContentStatus, InteractiveProgrammeItem } from "./types";

const STATUS_FILTER: AdminSelectOption<ContentStatus | "all">[] = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft", dotColor: "bg-amber-500" },
  { value: "published", label: "Published", dotColor: "bg-emerald-500" },
  { value: "archived", label: "Archived", dotColor: "bg-neutral-400" },
];

function StatusBadge({ status }: { status: ContentStatus }) {
  const map = {
    draft: "bg-amber-50 text-amber-800 border-amber-200",
    published: "bg-emerald-50 text-emerald-800 border-emerald-200",
    archived: "bg-neutral-100 text-neutral-600 border-neutral-200",
  } as const;
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${map[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

function formatTime(value: string | null) {
  if (!value) return "";
  return value.slice(0, 5);
}

export function InteractiveProgrammesManager() {
  const m = useInteractiveProgrammes();

  return (
    <div className="space-y-6 font-figtree">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-lora text-2xl text-[#0F1C1D]">
            Interactive Programmes
          </h1>
          <p className="mt-1 text-sm text-[#5F6C6D]">
            Manage events and interactive programmes ({m.meta.total} total).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void m.loadData()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 text-xs font-semibold"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${m.loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={m.openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#9739A8] px-3 py-2 text-xs font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Add programme
          </button>
        </div>
      </div>

      {m.successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-[#1F6B45]/20 bg-[#E7F6EE] px-4 py-3 text-xs text-[#1F6B45]">
          <Check className="h-4 w-4" />
          {m.successMessage}
        </div>
      )}
      {m.error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4" />
          <span className="flex-1">{m.error}</span>
          <button type="button" onClick={() => m.setError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E5E0D8] bg-white p-3">
        <div className="flex rounded-lg border border-[#E5E0D8] p-0.5">
          {(["active", "deleted"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                m.setActiveTab(tab);
                m.setPage(1);
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                m.activeTab === tab
                  ? "bg-[#9739A8] text-white"
                  : "text-[#5F6C6D]"
              }`}
            >
              {tab === "active" ? "Active" : "Trash"}
            </button>
          ))}
        </div>
        <input
          value={m.searchTerm}
          onChange={(e) => m.setSearchTerm(e.target.value)}
          placeholder="Search title, slug, location…"
          className="min-w-[200px] flex-1 rounded-lg border border-[#D9D3C9] px-3 py-2 text-xs"
        />
        {m.activeTab === "active" && (
          <div className="w-44">
            <AdminSelect
              value={m.statusFilter}
              onChange={(v) => {
                m.setStatusFilter(v);
                m.setPage(1);
              }}
              options={STATUS_FILTER}
            />
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E0D8] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[#5F6C6D]">
              <tr>
                <th className="px-4 py-3 font-semibold">Programme</th>
                <th className="px-4 py-3 font-semibold">Date / time</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {m.loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#5F6C6D]">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : m.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#5F6C6D]">
                    No interactive programmes found.
                  </td>
                </tr>
              ) : (
                m.items.map((item: InteractiveProgrammeItem) => (
                  <tr key={item.id} className="border-b border-[#F0EBF3]">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#0F1C1D]">{item.title}</p>
                      <p className="text-[10px] text-[#5F6C6D]">{item.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(item.eventDate)}
                      {item.eventTime ? (
                        <span className="text-[#5F6C6D]">
                          {" "}
                          · {formatTime(item.eventTime)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{item.eventLocation || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {m.activeTab === "active" ? (
                          <>
                            <button
                              type="button"
                              disabled={m.actionLoading}
                              onClick={() => void m.openEdit(item)}
                              className="rounded border border-[#D9D3C9] p-1.5 hover:bg-neutral-50 disabled:opacity-50"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {item.status !== "published" && (
                              <button
                                type="button"
                                onClick={() =>
                                  void m.handleQuickStatus(item, "published")
                                }
                                className="rounded border border-emerald-200 px-2 py-1 text-[10px] font-semibold text-emerald-700"
                              >
                                Publish
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => m.promptDelete(item)}
                              className="rounded border border-rose-200 p-1.5 text-rose-600"
                              title="Trash"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void m.handleRestore(item)}
                            className="inline-flex items-center gap-1 rounded border border-[#D9D3C9] px-2 py-1 text-[10px] font-semibold"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {m.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E5E0D8] px-4 py-3 text-xs">
            <span>
              Page {m.meta.page} / {m.meta.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={m.meta.page <= 1}
                onClick={() => m.setPage(m.meta.page - 1)}
                className="rounded border px-2 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={m.meta.page >= m.meta.totalPages}
                onClick={() => m.setPage(m.meta.page + 1)}
                className="rounded border px-2 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <InteractiveProgrammeEditorModal
        isOpen={m.isEditorOpen}
        editingItem={m.editingItem}
        actionLoading={m.actionLoading}
        onClose={m.closeEditor}
        onSave={(values) => void m.handleSave(values)}
      />

      {m.deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6">
            <h3 className="font-lora text-base">Move to trash?</h3>
            <p className="mt-2 text-xs text-[#5F6C6D]">
              “{m.deleteTarget.title}” can be restored later from Trash.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={m.cancelDelete}
                className="rounded-lg border px-3 py-1.5 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={m.actionLoading}
                onClick={() => void m.handleDeleteConfirm()}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                {m.actionLoading ? "…" : "Move to trash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
