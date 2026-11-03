"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Pencil,
  Plus,
  Tag,
  Trees,
} from "lucide-react";
import type { AdminImpactCategoryItem, AdminImpactInitiativeItem } from "./types";
import { cn } from "@/lib/utils";

interface CategoryAccordionCardProps {
  category: AdminImpactCategoryItem;
  initiatives: AdminImpactInitiativeItem[];
  initiallyExpanded?: boolean;
  onEditInitiative: (item: AdminImpactInitiativeItem) => void;
  onAddInitiativeToCategory: (category: AdminImpactCategoryItem) => void;
}

function getCategoryIcon(slug: string) {
  switch (slug) {
    case "education":
      return GraduationCap;
    case "women-empowerment":
      return HeartHandshake;
    case "skills-employment":
    case "skills-and-employment":
      return Briefcase;
    case "model-village":
      return Trees;
    case "health":
      return Activity;
    default:
      return Tag;
  }
}

function getTemplateLabel(slug: string) {
  switch (slug) {
    case "education":
      return "EducationTemplate.tsx";
    case "women-empowerment":
      return "WomenEmpowermentTemplate.tsx";
    case "skills-employment":
    case "skills-and-employment":
      return "SkillsEmploymentTemplate.tsx";
    case "model-village":
      return "ModelVillageTemplate.tsx";
    case "health":
      return "HealthTemplate.tsx";
    default:
      return "StandardTemplate.tsx";
  }
}

export function CategoryAccordionCard({
  category,
  initiatives,
  initiallyExpanded = true,
  onEditInitiative,
  onAddInitiativeToCategory,
}: CategoryAccordionCardProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const IconComponent = getCategoryIcon(category.slug);
  const templateName = getTemplateLabel(category.slug);

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs transition-all">
      {/* Category Header Row (Accordion Trigger) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAF8F4]/80 hover:bg-[#FAF8F4] cursor-pointer transition-colors border-b border-[#E5E0D8]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#9739A8] border border-[#E5E0D8] shadow-2xs">
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-lora text-base font-semibold text-[#0F1C1D]">
                {category.name}
              </h2>
              <span className="font-mono text-[11px] text-[#8A847A]">
                /{category.slug}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center rounded-md bg-[#9739A8]/10 px-2 py-0.5 font-figtree text-[10px] font-semibold text-[#9739A8]">
                {templateName}
              </span>
              <span className="text-[11px] text-[#5F6C6D]">
                · {initiatives.length}{" "}
                {initiatives.length === 1 ? "page" : "pages"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddInitiativeToCategory(category);
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 py-1 text-xs font-semibold text-[#0F1C1D] hover:border-[#9739A8] hover:text-[#9739A8] transition-colors cursor-pointer"
            title="Add new initiative page under this category"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Page</span>
          </button>

          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D]">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {/* Accordion Body: List of Initiatives */}
      {isExpanded && (
        <div className="divide-y divide-[#E5E0D8]">
          {initiatives.length === 0 ? (
            <div className="p-8 text-center text-[#5F6C6D] bg-white">
              <p className="text-xs font-figtree">
                No initiative pages added to {category.name} yet.
              </p>
              <button
                type="button"
                onClick={() => onAddInitiativeToCategory(category)}
                className="mt-2 text-xs font-semibold text-[#9739A8] hover:underline cursor-pointer"
              >
                + Create the first page
              </button>
            </div>
          ) : (
            initiatives.map((init) => (
              <div
                key={init.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-[#FAF8F4]/40 transition-colors bg-white group"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#FAF8F4] font-mono text-[10px] font-bold text-[#8A847A] border border-[#E5E0D8]">
                    {init.displayOrder}
                  </span>
                  <div>
                    <h3 className="font-figtree text-sm font-semibold text-[#0F1C1D]">
                      {init.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-[#8A847A]">
                        /{init.slug}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          init.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200",
                        )}
                      >
                        {init.status}
                      </span>
                      {init.heroImageUrl && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F4] px-1.5 py-0.5 text-[10px] font-medium text-[#5F6C6D] border border-[#E5E0D8]">
                          🖼️ Banner
                        </span>
                      )}
                      {init.stats && init.stats.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F4] px-1.5 py-0.5 text-[10px] font-medium text-[#5F6C6D] border border-[#E5E0D8]">
                          📊 {init.stats.length} {init.stats.length === 1 ? "Stat" : "Stats"}
                        </span>
                      )}
                      {(init.story1Title || init.story2Title) && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F4] px-1.5 py-0.5 text-[10px] font-medium text-[#5F6C6D] border border-[#E5E0D8]">
                          📖 Stories
                        </span>
                      )}
                      {init.galleryImages && init.galleryImages.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F4] px-1.5 py-0.5 text-[10px] font-medium text-[#5F6C6D] border border-[#E5E0D8]">
                          📸 {init.galleryImages.length} {init.galleryImages.length === 1 ? "Photo" : "Photos"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onEditInitiative(init)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F1C1D] hover:border-[#9739A8] hover:text-[#9739A8] shadow-2xs transition-colors cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit Page</span>
                  </button>

                  <Link
                    href={`/${init.slug}`}
                    target="_blank"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:text-[#0F1C1D] hover:border-[#0F1C1D] shadow-2xs transition-colors cursor-pointer"
                    title={`View live page: /${init.slug}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

