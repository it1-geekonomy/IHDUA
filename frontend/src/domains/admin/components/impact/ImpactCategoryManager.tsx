"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import {
  deleteImpactPage,
  fetchImpactPages,
  IMPACT_PAGES_PER_PAGE,
  type PaginationMeta,
  restoreImpactPage,
  updateImpactPageStatus,
  type ContentStatus,
  type ImpactPageItem,
} from "@/domains/admin/lib/api";
import { CategoryNotSetUp } from "./CategoryNotSetUp";
import { useImpactCategory } from "./useImpactCategory";

const STATUS_STYLES: Record<ContentStatus, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const STATUS_OPTIONS: AdminSelectOption<ContentStatus>[] = [
  { value: "draft", label: "Draft", dotColor: "bg-amber-500" },
  { value: "published", label: "Published", dotColor: "bg-emerald-500" },
  { value: "archived", label: "Archived", dotColor: "bg-neutral-400" },
];

export function ImpactCategoryManager({ categorySlug }: { categorySlug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { def, category, loading: categoryLoading, settingUp, setUp, token, error: categoryError } =
    useImpactCategory(categorySlug);

  const [tab, setTab] = useState<"active" | "deleted">("active");
  const [pages, setPages] = useState<ImpactPageItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: IMPACT_PAGES_PER_PAGE, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    searchParams.get("created") ? "Page created." : null,
  );
  const [deleteTarget, setDeleteTarget] = useState<ImpactPageItem | null>(null);

  useEffect(() => {
    if (searchParams.get("created")) router.replace(`/admin/impact/${categorySlug}`);
  }, [searchParams, router, categorySlug]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 4000);
    return () => clearTimeout(t);
  }, [success]);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    if (!token || !category) return;
    try {
      const res = await fetchImpactPages(token, {
        categoryId: category.id,
        deleted: tab === "deleted",
        page,
        search: query,
      });
      if (!res.data.length && page > 1) {
        setPage(page - 1);
        return;
      }
      setPages(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pages.");
    } finally {
      setLoading(false);
    }
  }, [token, category, tab, page, query]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!def) return <p className="text-sm text-[#5F6C6D]">Unknown impact category.</p>;

  if (categoryLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-[#5F6C6D]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (!category) {
    return <CategoryNotSetUp def={def} settingUp={settingUp} error={categoryError} onSetUp={setUp} />;
  }

  const run = async (id: string, action: () => Promise<unknown>, message: string) => {
    setBusyId(id);
    setError(null);
    try {
      await action();
      setSuccess(message);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  const newHref = `/admin/impact/${def.slug}/new`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#E5E0D8] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Typography variant="h4" className="font-lora text-[#0F1C1D]">
              {def.name}
            </Typography>
            <span className="rounded-full bg-[#1A0F1C]/5 px-2.5 py-0.5 font-figtree font-semibold text-[#1A0F1C]">
              {meta.total} {meta.total === 1 ? "page" : "pages"}
            </span>
          </div>
          <Typography variant="body-sm" className="mt-1 font-figtree text-[#5F6C6D]">
            {def.summary} All pages share the {def.name} layout ({def.sections.length} sections).
          </Typography>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void load();
            }}
            disabled={loading}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] shadow-2xs hover:text-[#00191B] disabled:opacity-50 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </button>
          <Link
            href={newHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30]"
          >
            <Plus className="h-3.5 w-3.5" /> Add {def.name} page
          </Link>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#1F6B45]/20 bg-[#E7F6EE] px-4 py-3 text-xs font-medium text-[#1F6B45]">
          <Check className="h-4 w-4 shrink-0" /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <p className="flex-1">{error}</p>
          <button type="button" onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-[#E5E0D8] bg-white p-1">
          {(["active", "deleted"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                if (t === tab) return;
                setLoading(true);
                setPages([]);
                setPage(1);
                setTab(t);
              }}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                tab === t ? "bg-[#1A0F1C] text-white" : "text-[#5F6C6D] hover:text-[#0F1C1D]",
              )}
            >
              {t === "active" ? "Pages" : "Recently deleted"}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A847A]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages"
            className="w-full rounded-lg border border-[#D9D3C9] bg-white py-1.5 pl-8 pr-3 text-xs focus:border-[#9739A8] focus:outline-hidden"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E0D8] bg-white shadow-2xs overflow-visible">
        <div className="overflow-x-auto overflow-y-visible min-h-[260px]">
          <table className="w-full text-left font-figtree text-xs">
            <thead className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[11px] uppercase tracking-wide text-[#8A847A]">
              <tr>
                <th className="px-5 py-3 font-semibold rounded-tl-2xl">Page</th>
                <th className="px-5 py-3 font-semibold">URL</th>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Updated</th>
                <th className="px-5 py-3 text-right font-semibold rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-[#F0EBE3]">
            {loading && !pages.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[#8A847A]">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                </td>
              </tr>
            ) : pages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[#8A847A]">
                  {query.trim() ? "No pages match your search." : tab === "deleted" ? "Nothing in recently deleted." : (
                    <span>
                      No {def.name} pages yet.{" "}
                      <Link href={newHref} className="font-semibold text-[#9739A8] underline">
                        Add the first one
                      </Link>
                    </span>
                  )}
                </td>
              </tr>
            ) : (
              pages.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F4]/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E5E0D8] bg-[#FAF8F4]">
                        {p.cardImageUrl || p.heroImageUrl ? (
                          <img src={(p.cardImageUrl || p.heroImageUrl)!} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <FileText className="h-4 w-4 text-[#B5AEA3]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0F1C1D]">{p.name}</p>
                        <p className="truncate text-[11px] text-[#8A847A]">{p.heroTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#5F6C6D]">/{p.slug}</td>
                  <td className="px-5 py-3 text-[#5F6C6D]">{p.displayOrder}</td>
                  <td className="px-5 py-3">
                    {tab === "active" ? (
                      <AdminSelect<ContentStatus>
                        value={p.status}
                        onChange={(s) =>
                          s !== p.status &&
                          void run(p.id, () => updateImpactPageStatus(token!, p.id, s), `Status changed to ${s}.`)
                        }
                        options={STATUS_OPTIONS}
                        disabled={busyId === p.id}
                        dropdownClassName="w-48 z-[100] shadow-2xl"
                      />
                    ) : (
                      <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize", STATUS_STYLES[p.status])}>
                        {p.status}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#5F6C6D]">
                    {new Date(p.deletedAt || p.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {tab === "active" ? (
                        <>
                          {p.status === "published" && (
                            <a
                              href={`/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-white hover:text-[#0F1C1D]"
                              title="View on website"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <Link
                            href={`/admin/impact/${def.slug}/${p.id}`}
                            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-white hover:text-[#9739A8]"
                            title="Edit page"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                            title="Delete page"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === p.id}
                          onClick={() => void run(p.id, () => restoreImpactPage(token!, p.id), "Page restored.")}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0F1C1D] hover:border-[#9739A8] disabled:opacity-50 cursor-pointer"
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

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#FAF8F4] px-4 py-3">
            <p className="font-figtree text-xs text-[#5F6C6D]">
              Showing Page <span className="font-semibold text-[#0F1C1D]">{meta.page}</span> of{" "}
              <span className="font-semibold text-[#0F1C1D]">{meta.totalPages}</span> ({meta.total} total)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(meta.page - 1)}
                disabled={meta.page <= 1 || loading}
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2 text-xs font-medium text-[#5F6C6D] hover:text-[#00191B] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={() => setPage(meta.page + 1)}
                disabled={meta.page >= meta.totalPages || loading}
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2 text-xs font-medium text-[#5F6C6D] hover:text-[#00191B] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 font-figtree shadow-2xl">
            <h2 className="font-lora text-lg text-[#0F1C1D]">Delete &ldquo;{deleteTarget.name}&rdquo;?</h2>
            <p className="mt-1.5 text-xs text-[#5F6C6D]">
              The page disappears from the website and moves to Recently deleted, where you can restore it.
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-2 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === deleteTarget.id}
                onClick={async () => {
                  const target = deleteTarget;
                  await run(target.id, () => deleteImpactPage(token!, target.id), "Page moved to Recently deleted.");
                  setDeleteTarget(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {busyId === deleteTarget.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
