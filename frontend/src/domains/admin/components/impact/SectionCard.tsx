"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldsEditor, ItemControls } from "./FieldRenderer";
import { emptyObject, type SectionDef } from "./layouts";

type Json = Record<string, unknown>;

interface SectionCardProps {
  index: number;
  section: SectionDef;
  value: unknown;
  onChange: (next: unknown) => void;
}

export function SectionCard({ index, section, value, onChange }: SectionCardProps) {
  const [open, setOpen] = useState(index < 2);
  const enabled = value !== null && value !== undefined;

  const toggleEnabled = () => {
    onChange(enabled ? null : emptyObject(section.fields));
    if (!enabled) setOpen(true);
  };

  return (
    <section className="rounded-2xl border border-[#E5E0D8] bg-white shadow-2xs">
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF8F4] text-[11px] font-bold text-[#9739A8] border border-[#E5E0D8]">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
              {section.title}
              {section.optional && (
                <span className="ml-2 rounded-full bg-[#1A0F1C]/5 px-2 py-0.5 text-[10px] font-semibold text-[#5F6C6D]">
                  Optional
                </span>
              )}
            </p>
            <p className="truncate text-[11px] text-[#5F6C6D]">{section.description}</p>
          </div>
        </button>

        {section.optional && (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={toggleEnabled}
            title={enabled ? "Hide this section on the page" : "Show this section on the page"}
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer",
              enabled ? "bg-[#9739A8]" : "bg-[#D9D3C9]",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                enabled ? "left-[18px]" : "left-0.5",
              )}
            />
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-1 text-[#8A847A] hover:bg-[#FAF8F4] cursor-pointer"
          aria-label={open ? "Collapse section" : "Expand section"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="border-t border-[#E5E0D8] px-5 py-5">
          {!enabled ? (
            <p className="text-xs text-[#8A847A]">
              This section is hidden on the page. Switch it on to add content.
            </p>
          ) : section.repeatable ? (
            <RepeatableBlocks section={section} blocks={value as Json[]} onChange={onChange} />
          ) : (
            <FieldsEditor fields={section.fields} value={value as Json} onChange={onChange} />
          )}
        </div>
      )}
    </section>
  );
}

function RepeatableBlocks({
  section,
  blocks,
  onChange,
}: {
  section: SectionDef;
  blocks: Json[];
  onChange: (next: Json[]) => void;
}) {
  const { min, max, itemLabel } = section.repeatable!;
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <div key={i} className="rounded-xl border border-[#E5E0D8] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#8A847A]">
              {itemLabel} {i + 1}
            </span>
            <ItemControls
              index={i}
              count={blocks.length}
              min={min}
              onMove={(to) => {
                const next = [...blocks];
                const [b] = next.splice(i, 1);
                next.splice(to, 0, b);
                onChange(next);
              }}
              onRemove={() => onChange(blocks.filter((_, j) => j !== i))}
            />
          </div>
          <FieldsEditor
            fields={section.fields}
            value={block}
            onChange={(next) => onChange(blocks.map((b, j) => (j === i ? next : b)))}
          />
        </div>
      ))}
      {blocks.length < max && (
        <button
          type="button"
          onClick={() => onChange([...blocks, emptyObject(section.fields)])}
          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-[#D9D3C9] px-3 py-2 text-xs font-semibold text-[#9739A8] hover:border-[#9739A8] hover:bg-[#FAF8F4] cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add {itemLabel.toLowerCase()}
        </button>
      )}
    </div>
  );
}
