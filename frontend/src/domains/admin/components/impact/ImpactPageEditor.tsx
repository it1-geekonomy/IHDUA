"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, ExternalLink, Eye, Loader2, X } from "lucide-react";
import Typography from "@/lib/Typography";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import { BlogSeoAccordion } from "@/domains/admin/components/blogs-and-stories/BlogSeoAccordion";
import {
  createImpactPage,
  fetchImpactPageById,
  updateImpactPage,
  type ContentStatus,
  type ImpactPageItem,
} from "@/domains/admin/lib/api";
import { BannerImageField } from "./BannerImageField";
import { FieldLabel, inputClass } from "./FieldRenderer";
import { mergeContent, validateContent } from "./layouts";
import { SectionCard } from "./SectionCard";
import { ImpactPagePreview } from "./ImpactPagePreview";
import { useImpactCategory } from "./useImpactCategory";
import { CategoryNotSetUp } from "./CategoryNotSetUp";

const STATUS_OPTIONS: AdminSelectOption<ContentStatus>[] = [
  { value: "draft", label: "Draft (hidden on website)", dotColor: "bg-amber-500" },
  { value: "published", label: "Published (live on website)", dotColor: "bg-emerald-500" },
  { value: "archived", label: "Archived (unpublished)", dotColor: "bg-neutral-400" },
];

const toSlug = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

interface ImpactPageEditorProps {
  categorySlug: string;
  pageId?: string;
}

export function ImpactPageEditor({ categorySlug, pageId }: ImpactPageEditorProps) {
  const router = useRouter();
  const { def, category, loading: categoryLoading, settingUp, setUp, token, error: categoryError } =
    useImpactCategory(categorySlug);

  const [page, setPage] = useState<ImpactPageItem | null>(null);
  const [loading, setLoading] = useState(Boolean(pageId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImageMobile, setHeroImageMobile] = useState<File | null>(null);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [saveCount, setSaveCount] = useState(0);
  const [content, setContent] = useState<Record<string, unknown>>(() =>
    def ? mergeContent(def.sections, null) : {},
  );

  useEffect(() => {
    if (!pageId || !token || !def) return;
    let cancelled = false;
    fetchImpactPageById(token, pageId)
      .then((p) => {
        if (cancelled) return;
        setPage(p);
        setName(p.name);
        setSlug(p.slug);
        setSlugTouched(true);
        setDisplayOrder(p.displayOrder);
        setStatus(p.status);
        setHeroTitle(p.heroTitle ?? "");
        setHeroDescription(p.heroDescription ?? "");
        setMetaTitle(p.metaTitle ?? "");
        setMetaDescription(p.metaDescription ?? "");
        setContent(mergeContent(def.sections, p.content));
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load the page."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [pageId, token, def]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 4000);
    return () => clearTimeout(t);
  }, [saved]);

  if (!def) {
    return <p className="text-sm text-[#5F6C6D]">Unknown impact category.</p>;
  }

  const listHref = `/admin/impact/${def.slug}`;

  if (categoryLoading || loading) {
    return (
      <div className="flex items-center gap-2 py-20 justify-center text-sm text-[#5F6C6D]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (!category) {
    return <CategoryNotSetUp def={def} settingUp={settingUp} error={categoryError} onSetUp={setUp} />;
  }

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(toSlug(value));
  };

  const handleSave = async () => {
    if (!token) return;
    const issues: string[] = [];
    if (!name.trim()) issues.push("Page name: required");
    if (!slug.trim()) issues.push("URL slug: required");
    if (!heroTitle.trim()) issues.push("Banner › Title: required");
    if (!heroImage && !page?.heroImageUrl) issues.push("Banner › Desktop image: required");
    issues.push(...validateContent(def.sections, content));
    setProblems(issues);
    if (issues.length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    setError(null);
    const input = {
      categoryId: category.id,
      name: name.trim(),
      slug: slug.trim(),
      displayOrder,
      status,
      heroTitle: heroTitle.trim(),
      heroDescription: heroDescription.trim(),
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      content,
      heroImage,
      heroImageMobile,
    };
    try {
      if (page) {
        const updated = await updateImpactPage(token, page.id, input);
        setPage(updated);
        setSaveCount((n) => n + 1);
        setHeroImage(null);
        setHeroImageMobile(null);
        setSaved(true);
      } else {
        await createImpactPage(token, input);
        router.push(`${listHref}?created=1`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save the page.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const card = "rounded-2xl border border-[#E5E0D8] bg-white p-5 shadow-2xs";

  return (
    <div className="space-y-6 pb-24">
      {previewing && (
        <ImpactPagePreview
          data={{ layoutType: def.layoutType, slug, heroTitle, heroDescription, content }}
          heroImage={heroImage ?? page?.heroImageUrl}
          heroImageMobile={heroImageMobile ?? page?.heroImageMobileUrl}
          onClose={() => setPreviewing(false)}
        />
      )}
      <div className="flex flex-col gap-4 border-b border-[#E5E0D8] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href={listHref}
            className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-[#5F6C6D] hover:text-[#9739A8]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {def.name} pages
          </Link>
          <Typography variant="h4" className="font-lora text-[#0F1C1D]">
            {page ? `Edit: ${page.name}` : `New ${def.name} Page`}
          </Typography>
          <Typography variant="body-sm" className="mt-1 font-figtree text-[#5F6C6D]">
            Uses the {def.name} layout. Fill each section below; optional sections can be switched off.
          </Typography>
        </div>
        <div className="flex items-center gap-2.5">
          {page?.status === "published" && (
            <a
              href={`/${page.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B]"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View on website
            </a>
          )}
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] disabled:opacity-50 cursor-pointer"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {page ? "Save changes" : "Create page"}
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#1F6B45]/20 bg-[#E7F6EE] px-4 py-3 text-xs font-medium text-[#1F6B45]">
          <Check className="h-4 w-4 shrink-0" /> Page saved.
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

      {problems.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <p className="mb-1.5 font-semibold">Please fix these before saving:</p>
          <ul className="list-disc space-y-0.5 pl-5">
            {problems.slice(0, 12).map((p) => (
              <li key={p}>{p}</li>
            ))}
            {problems.length > 12 && <li>…and {problems.length - 12} more</li>}
          </ul>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className={card}>
            <h3 className="mb-4 text-sm font-semibold text-[#0F1C1D]">Page details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel label="Page name (menu label)" required />
                <input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={`e.g. ${def.examples.pageName}`}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel label="URL slug" required />
                <div className="flex items-center rounded-lg border border-[#D9D3C9] bg-white focus-within:border-[#9739A8]">
                  <span className="pl-3 text-xs text-[#8A847A]">/</span>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(toSlug(e.target.value));
                    }}
                    placeholder={def.examples.slug}
                    className="w-full rounded-lg bg-transparent px-1 py-1.5 text-xs text-[#0F1C1D] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={card}>
            <h3 className="mb-1 text-sm font-semibold text-[#0F1C1D]">Banner</h3>
            <p className="mb-4 text-[11px] text-[#5F6C6D]">Large image at the top of the page with the title and short description.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel label="Title" required />
                <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel label="Short description" />
                <textarea
                  rows={2}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </div>
              <BannerImageField
                label="Desktop image"
                hint="Recommended 1920×800, max 5 MB"
                required
                currentUrl={page?.heroImageUrl}
                file={heroImage}
                onFileChange={setHeroImage}
              />
              <BannerImageField
                label="Mobile image"
                hint="Recommended 800×1000, max 5 MB"
                currentUrl={page?.heroImageMobileUrl}
                file={heroImageMobile}
                onFileChange={setHeroImageMobile}
                aspect="aspect-[16/7]"
              />
            </div>
          </section>

          <div className="flex items-center justify-between pt-2">
            <h3 className="font-lora text-lg text-[#0F1C1D]">Page sections</h3>
            <span className="text-[11px] text-[#8A847A]">Shown on the website in this order</span>
          </div>

          {def.sections.map((section, i) => (
            <SectionCard
              key={section.key}
              index={i}
              section={section}
              value={content[section.key]}
              onChange={(next) => setContent((c) => ({ ...c, [section.key]: next }))}
              saveCount={saveCount}
            />
          ))}
        </div>

        <aside className="space-y-6">
          <section className={card}>
            <h3 className="mb-4 text-sm font-semibold text-[#0F1C1D]">Publishing</h3>
            <div className="space-y-4">
              <div>
                <FieldLabel label="Status" />
                <AdminSelect<ContentStatus>
                  value={status}
                  onChange={setStatus}
                  options={STATUS_OPTIONS}
                  size="md"
                  className="w-full"
                  dropdownClassName="w-full"
                />
              </div>
              <div>
                <FieldLabel label="Order in menu" />
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Math.max(1, Number(e.target.value) || 1))}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <BlogSeoAccordion
            metaTitle={metaTitle}
            onMetaTitleChange={setMetaTitle}
            metaDescription={metaDescription}
            onMetaDescriptionChange={setMetaDescription}
            showSchemaCode={false}
          />
        </aside>
      </div>
    </div>
  );
}
