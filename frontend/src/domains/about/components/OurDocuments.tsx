"use client";

import { useState } from "react";
import Image from "next/image"; // use <img> if you're not on Next.js
import Typography from "@/lib/Typography";
import { useDocumentItems } from "@/domains/about/hooks/useDocumentItems";
import {
  DOCUMENT_GROUPS,
  DOCUMENT_THEMES,
  DOCUMENTS_DESCRIPTION,
  DOCUMENTS_HEADING,
  DOCUMENTS_LABEL,
  DOCUMENTS_PAGE_SIZE,
  PDF_ICON,
  type DocumentGroup,
} from "@/domains/about/constants/ourdocuments";

type OurDocumentsProps = {
  /** Card metadata only (title, description, variant). Items always come from the CMS. */
  groups?: DocumentGroup[];
};

/** Shown inside a card when nothing is published for it in the CMS */
const EMPTY_MESSAGES: Record<string, string> = {
  organizational:
    "No organizational documents have been published yet. Please publish documents from the CMS to show them here.",
  annual:
    "No annual reports have been published yet. Please publish reports from the CMS to show them here.",
};
const DEFAULT_EMPTY_MESSAGE =
  "Nothing has been published yet. Please publish from the CMS to show it here.";

// Only this group gets the view-only eye + custom icons.
const isViewOnlyGroup = (group: DocumentGroup) =>
  group.title.toLowerCase().includes("organizational");

// Icons (files live in /public/aboutus/)
const EYE_ICON = "/aboutus/eye.png";

// Every Organizational Document (including newly uploaded PDFs) uses this same icon
const ORG_DOC_ICON = "/aboutus/80G.png";

// Open the PDF preview in a new tab
const openPdf = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

/**
 * Real file download.
 * The HTML `download` attribute is ignored for files hosted on another domain
 * (S3, Cloudinary, API server...), so the browser just opens the PDF instead.
 * Here we fetch the file, turn it into a blob and save it ourselves.
 *   1) same-origin file  -> fetch it directly
 *   2) other domain      -> go straight to our /api/download proxy
 *                           (no failed CORS request in the Network tab)
 *   3) last resort: open the PDF in a new tab
 */
const downloadPdf = async (url: string, title: string) => {
  const safeName = title.replace(/[\\/:*?"<>|]+/g, "").trim() || "document";
  const filename = /\.pdf$/i.test(safeName) ? safeName : `${safeName}.pdf`;

  const save = (blob: Blob) => {
    const pdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });
    const objectUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
  };

  // Files on another domain can't be fetched from the browser (CORS), so only
  // try a direct fetch when the file is on our own site.
  let sameOrigin = false;
  try {
    sameOrigin = new URL(url, window.location.href).origin === window.location.origin;
  } catch {
    sameOrigin = false;
  }

  if (sameOrigin) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Direct download failed");
      save(await res.blob());
      return;
    } catch (err) {
      console.warn("[download] direct fetch failed, trying /api/download", err);
    }
  }

  try {
    const res = await fetch(
      `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(filename)}`,
    );
    if (!res.ok) throw new Error("Proxy download failed");
    save(await res.blob());
    return;
  } catch (err) {
    console.error(
      "[download] /api/download failed. Make sure app/api/download/route.ts exists. Opening preview instead.",
      err,
    );
  }

  openPdf(url);
};

function DocumentCard({ group }: { group: DocumentGroup }) {
  const theme = DOCUMENT_THEMES[group.variant];
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const viewOnly = isViewOnlyGroup(group);

  const totalPages = Math.max(1, Math.ceil(group.items.length / DOCUMENTS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // safe if CMS data shrinks
  const start = (currentPage - 1) * DOCUMENTS_PAGE_SIZE;
  const visibleItems = group.items.slice(start, start + DOCUMENTS_PAGE_SIZE);

  return (
    <article
      className={`flex h-full flex-col border p-[clamp(16px,2.4vw,32px)] ${theme.card}`}
    >
      {/* Card header */}
      <div className="flex items-center gap-[clamp(10px,1.2vw,16px)]">
        <div
          className={`flex h-[clamp(36px,3.4vw,48px)] w-[clamp(36px,3.4vw,48px)] shrink-0 items-center justify-center rounded-full ${theme.headerIconBg}`}
        >
          <Image
            src={theme.headerIcon}
            alt=""
            width={28}
            height={28}
            className="h-[clamp(20px,2vw,28px)] w-[clamp(20px,2vw,28px)]"
          />
        </div>

        <div className="min-w-0">
          <Typography
            variant="body-lg"
            className="font-lora font-normal text-[length:clamp(16px,1.6vw,22px)] leading-[1.3] text-[#311645]"
          >
            {group.title}
          </Typography>
          <Typography
            variant="body-sm"
            className="mt-[clamp(2px,0.3vw,4px)] font-figtree font-normal text-[length:clamp(11px,1vw,13px)] leading-[1.4] text-[#7E7783]"
          >
            {group.description}
          </Typography>
        </div>
      </div>

      {/* Nothing published in the CMS (or the request failed): show a message */}
      {group.items.length === 0 && (
        <div className="mt-[clamp(16px,2vw,24px)] flex flex-1 items-center justify-center rounded-lg border border-dashed border-[#D9D4C4] bg-white/60 px-6 py-10 text-center">
          <Typography
            variant="body-sm"
            className="max-w-sm font-figtree font-normal leading-relaxed text-[#5F6C6D]"
          >
            {EMPTY_MESSAGES[group.variant] ?? DEFAULT_EMPTY_MESSAGE}
          </Typography>
        </div>
      )}

      {/* PDF list */}
<<<<<<< HEAD
      {group.items.length > 0 && (
        <ul className="mt-[clamp(16px,2vw,24px)] flex flex-col gap-[clamp(8px,1vw,12px)]">
          {visibleItems.map((doc) =>
            viewOnly ? (
              /* ---------- Organizational Documents: view only ---------- */
              <li
                key={doc.id}
                onClick={() => openPdf(doc.url)}
                className="flex cursor-pointer items-center gap-[clamp(8px,1.2vw,16px)] bg-white p-[clamp(8px,1vw,12px)]"
              >
                {/* Document icon in tinted square */}
                <div
                  className={`flex h-[clamp(32px,3.2vw,44px)] w-[clamp(32px,3.2vw,44px)] shrink-0 items-center justify-center rounded-md ${theme.headerIconBg}`}
                >
                  <Image
                    src={getDocIcon(doc.title)}
                    alt=""
                    width={24}
                    height={24}
                    className="h-[clamp(16px,1.6vw,24px)] w-[clamp(16px,1.6vw,24px)] object-contain"
                  />
                </div>
=======
      <ul className="mt-[clamp(16px,2vw,24px)] flex flex-col gap-[clamp(8px,1vw,12px)]">
        {visibleItems.map((doc) =>
          viewOnly ? (
            /* ---------- Organizational Documents: view only ---------- */
            <li
              key={doc.id}
              onClick={() => openPdf(doc.url)}
              className="flex cursor-pointer items-center gap-[clamp(8px,1.2vw,16px)] bg-white p-[clamp(8px,1vw,12px)]"
            >
              {/* Same document icon for every organizational PDF */}
              <div
                className={`flex h-[clamp(32px,3.2vw,44px)] w-[clamp(32px,3.2vw,44px)] shrink-0 items-center justify-center rounded-md ${theme.headerIconBg}`}
              >
                <Image
                  src={ORG_DOC_ICON}
                  alt=""
                  width={24}
                  height={24}
                  className="h-[clamp(16px,1.6vw,24px)] w-[clamp(16px,1.6vw,24px)] object-contain"
                />
              </div>
>>>>>>> c9c3afe51122ecbc542af568fe4ae2bee732c0de

                <Typography
                  variant="body-sm"
                  className="min-w-0 flex-1 break-words font-figtree font-medium text-[length:clamp(12px,1.1vw,14px)] leading-[1.4] text-[#212121]"
                >
                  {doc.title}
                </Typography>

                {/* View button (eye) */}
                <button
                  type="button"
                  aria-label={`View ${doc.title}`}
                  onClick={(e) => {
                    e.stopPropagation(); // avoid double-open from the row click
                    openPdf(doc.url);
                  }}
                  className="flex h-[clamp(30px,3vw,40px)] w-[clamp(30px,3vw,40px)] shrink-0 items-center justify-center rounded-md transition-opacity hover:opacity-70"
                >
                  <Image
                    src={EYE_ICON}
                    alt=""
                    width={24}
                    height={24}
                    className="h-[clamp(18px,1.8vw,24px)] w-[clamp(18px,1.8vw,24px)] object-contain"
                  />
                </button>
              </li>
            ) : (
              /* ---------- Other groups (Annual Reports) ---------- */
              <li
                key={doc.id}
                role="button"
                tabIndex={0}
                aria-label={`Preview ${doc.title}`}
                onClick={() => openPdf(doc.url)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPdf(doc.url);
                  }
                }}
                className="flex cursor-pointer items-center gap-[clamp(8px,1.2vw,16px)] bg-white p-[clamp(8px,1vw,12px)]"
              >
                <Image
                  src={PDF_ICON}
                  alt=""
                  width={32}
                  height={32}
                  className="h-[clamp(24px,2.4vw,32px)] w-[clamp(24px,2.4vw,32px)] shrink-0"
                />

                <Typography
                  variant="body-sm"
                  className="min-w-0 flex-1 break-words font-figtree font-medium text-[length:clamp(12px,1.1vw,14px)] leading-[1.4] text-[#212121]"
                >
                  {doc.title}
                </Typography>

<<<<<<< HEAD
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  aria-label={`Download ${doc.title}`}
                  onClick={(e) => e.stopPropagation()} // download only, don't open preview
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`flex h-[clamp(30px,3vw,40px)] w-[clamp(30px,3vw,40px)] shrink-0 items-center justify-center rounded-md transition-opacity hover:opacity-80 ${theme.button}`}
                >
                  <Image
                    src={theme.buttonIcon}
                    alt=""
                    width={20}
                    height={20}
                    className="h-[clamp(14px,1.4vw,20px)] w-[clamp(14px,1.4vw,20px)]"
                  />
                </a>
              </li>
            ),
          )}
        </ul>
      )}
=======
              <button
                type="button"
                aria-label={`Download ${doc.title}`}
                disabled={downloadingId === String(doc.id)}
                onClick={async (e) => {
                  e.stopPropagation(); // download only, don't open preview
                  if (downloadingId) return;
                  setDownloadingId(String(doc.id));
                  try {
                    await downloadPdf(doc.url, doc.title);
                  } finally {
                    setDownloadingId(null);
                  }
                }}
                onKeyDown={(e) => e.stopPropagation()}
                className={`flex h-[clamp(30px,3vw,40px)] w-[clamp(30px,3vw,40px)] shrink-0 cursor-pointer items-center justify-center rounded-md transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-50 ${theme.button}`}
              >
                <Image
                  src={theme.buttonIcon}
                  alt=""
                  width={20}
                  height={20}
                  className={`h-[clamp(14px,1.4vw,20px)] w-[clamp(14px,1.4vw,20px)] ${
                    downloadingId === String(doc.id) ? "animate-pulse" : ""
                  }`}
                />
              </button>
            </li>
          )
        )}
      </ul>
>>>>>>> c9c3afe51122ecbc542af568fe4ae2bee732c0de

      {/* Pagination: only when this card has more PDFs than one page */}
      {totalPages > 1 && (
        <nav
          aria-label={`${group.title} pagination`}
          className="mt-auto flex items-center justify-center gap-[clamp(2px,0.4vw,4px)] pt-[clamp(16px,2vw,24px)]"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-label={`Page ${n}`}
              aria-current={n === currentPage ? "page" : undefined}
              className={`flex h-[clamp(20px,1.8vw,24px)] w-[clamp(20px,1.8vw,24px)] items-center justify-center rounded-sm transition-colors ${
                n === currentPage ? theme.pageActive : theme.pageInactive
              }`}
            >
              <Typography
                variant="body-sm"
                className="font-figtree font-medium text-[length:clamp(10px,0.9vw,12px)] leading-none"
              >
                {n}
              </Typography>
            </button>
          ))}
        </nav>
      )}
    </article>
  );
}

export default function OurDocuments({ groups = DOCUMENT_GROUPS }: OurDocumentsProps) {
  // null while loading; then published items per group (empty list if none)
  const items = useDocumentItems();

  // Static groups supply only title/description/theme; items come from the CMS
  const effectiveGroups: DocumentGroup[] | null = items
    ? groups.map((g) => ({
        ...g,
        items: (items as Record<string, DocumentGroup["items"]>)[g.variant] ?? [],
      }))
    : null;

  return (
    <section className="w-full px-6 pt-6 pb-6 lg:px-10 lg:pt-8 lg:pb-8 xl:pt-16 xl:pb-16 2xl:px-40">
      {/* Label + heading + description */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-[clamp(8px,1vw,12px)]">
          <span className="h-px w-[clamp(20px,2.4vw,32px)] bg-[#9739A8]" />
          <Typography
            variant="caption"
            className="font-figtree font-bold uppercase text-[#9739A8]"
          >
            {DOCUMENTS_LABEL}
          </Typography>
          <span className="h-px w-[clamp(20px,2.4vw,32px)] bg-[#9739A8]" />
        </div>

        <Typography
          variant="h2"
          className="mt-[clamp(8px,1vw,12px)] font-lora font-normal text-[#00191B]"
        >
          {DOCUMENTS_HEADING}
        </Typography>

        {/* Full width below 640px, wider cap from sm up */}
        <Typography
          variant="body-lg"
          className="mt-[clamp(12px,1.5vw,20px)] w-full font-figtree text-[length:clamp(14px,1.4vw,18px)] leading-[1.6] text-[#5F6C6D] sm:max-w-[clamp(520px,75vw,860px)] font-normal"
        >
          {DOCUMENTS_DESCRIPTION}
        </Typography>
      </div>

      {/* Cards: stacked below lg, side by side from lg. Empty while loading so no static docs flash. */}
      <div className="mt-[clamp(24px,4vw,56px)] grid min-h-[12rem] grid-cols-1 items-stretch gap-[clamp(16px,2vw,24px)] lg:grid-cols-2">
        {effectiveGroups?.map((group) => (
          <DocumentCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}