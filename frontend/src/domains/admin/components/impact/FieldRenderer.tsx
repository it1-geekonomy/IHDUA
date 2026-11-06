"use client";

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { AdminSelect } from "@/domains/admin/components/AdminSelect";
import { emptyObject, type FieldDef } from "./layouts";
import { MediaInput } from "./MediaInput";

type Json = Record<string, unknown>;

export const inputClass =
  "w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden";

export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="mb-1 block text-[11px] font-semibold text-[#0F1C1D]">
      {label} {required && <span className="text-rose-600">*</span>}
    </label>
  );
}

function move<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function ItemControls({
  index,
  count,
  min,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  min: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  const btn = "rounded-md p-1 text-[#8A847A] hover:bg-white hover:text-[#0F1C1D] disabled:opacity-30 cursor-pointer";
  return (
    <div className="flex items-center gap-0.5">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(index - 1)} title="Move up">
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn} disabled={index === count - 1} onClick={() => onMove(index + 1)} title="Move down">
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className="rounded-md p-1 text-[#8A847A] hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
        disabled={count <= min}
        onClick={onRemove}
        title="Remove"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-[#D9D3C9] px-2.5 py-1.5 text-[11px] font-semibold text-[#9739A8] hover:border-[#9739A8] hover:bg-[#FAF8F4] cursor-pointer"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export function FieldsEditor({
  fields,
  value,
  onChange,
}: {
  fields: FieldDef[];
  value: Json;
  onChange: (next: Json) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => {
        const wide = !["text", "icon", "color", "select"].includes(field.kind);
        return (
          <div key={field.key} className={wide ? "sm:col-span-2" : undefined}>
            <FieldRenderer
              field={field}
              value={value?.[field.key]}
              onChange={(v) => onChange({ ...value, [field.key]: v })}
            />
          </div>
        );
      })}
    </div>
  );
}

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  switch (field.kind) {
    case "text":
      return (
        <div>
          <FieldLabel label={field.label} required={field.required} />
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
          {field.help && <p className="mt-1 text-[10px] text-[#8A847A]">{field.help}</p>}
        </div>
      );

    case "textarea":
      return (
        <div>
          <FieldLabel label={field.label} required={field.required} />
          <textarea
            rows={field.rows ?? 3}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${inputClass} resize-y`}
          />
        </div>
      );

    case "paragraphs": {
      const items = (value as string[] | undefined)?.length ? (value as string[]) : [""];
      const max = field.max ?? 6;
      return (
        <div>
          <FieldLabel label={field.label} required={field.required} />
          <div className="space-y-2">
            {items.map((p, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Paragraph ${i + 1}`}
                  className={`${inputClass} resize-y`}
                />
                <ItemControls
                  index={i}
                  count={items.length}
                  min={1}
                  onMove={(to) => onChange(move(items, i, to))}
                  onRemove={() => onChange(items.filter((_, j) => j !== i))}
                />
              </div>
            ))}
            {items.length < max && <AddButton label="Add paragraph" onClick={() => onChange([...items, ""])} />}
          </div>
        </div>
      );
    }

    case "image":
      return (
        <div>
          <FieldLabel label={field.label} required={field.required} />
          <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF8F4]/40 p-3">
            <MediaInput kind="image" url={(value as string) ?? ""} onChange={onChange} />
          </div>
        </div>
      );

    case "icon":
    case "video":
      return (
        <div>
          <FieldLabel label={field.label} required={field.required} />
          <MediaInput kind={field.kind} url={(value as string) ?? ""} onChange={onChange} />
        </div>
      );

    case "color": {
      const color = (value as string) || "#F1E7F4";
      return (
        <div>
          <FieldLabel label={field.label} />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border border-[#D9D3C9] bg-white p-0.5"
            />
            <input type="text" value={color} onChange={(e) => onChange(e.target.value)} className={inputClass} />
          </div>
        </div>
      );
    }

    case "select":
      return (
        <div>
          <FieldLabel label={field.label} />
          <AdminSelect
            value={(value as string) || field.options[0].value}
            onChange={onChange}
            options={field.options}
            size="md"
            className="w-full"
            dropdownClassName="w-full"
          />
        </div>
      );

    case "button": {
      const b = (value as { label?: string; href?: string }) ?? {};
      return (
        <div>
          <FieldLabel label={field.label} required={field.required} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={b.label ?? ""}
              onChange={(e) => onChange({ ...b, label: e.target.value })}
              placeholder={field.placeholder ? `Button text, e.g. ${field.placeholder}` : "Button text"}
              className={inputClass}
            />
            <input
              type="text"
              value={b.href ?? ""}
              onChange={(e) => onChange({ ...b, href: e.target.value })}
              placeholder="Link, e.g. https://… or /page-url"
              className={inputClass}
            />
          </div>
        </div>
      );
    }

    case "group":
      return (
        <div>
          <FieldLabel label={field.label} />
          <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF8F4]/40 p-3">
            <FieldsEditor fields={field.fields} value={(value as Json) ?? {}} onChange={onChange} />
          </div>
        </div>
      );

    case "list": {
      const items = (value as Json[]) ?? [];
      const min = field.min ?? 0;
      const max = field.max ?? 20;
      return (
        <div>
          <FieldLabel label={`${field.label} (${items.length}${field.min === field.max ? "" : ` of max ${max}`})`} />
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg border border-[#E5E0D8] bg-[#FAF8F4]/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#8A847A]">
                    {field.itemLabel} {i + 1}
                  </span>
                  <ItemControls
                    index={i}
                    count={items.length}
                    min={min}
                    onMove={(to) => onChange(move(items, i, to))}
                    onRemove={() => onChange(items.filter((_, j) => j !== i))}
                  />
                </div>
                <FieldsEditor
                  fields={field.fields}
                  value={item}
                  onChange={(next) => onChange(items.map((x, j) => (j === i ? next : x)))}
                />
              </div>
            ))}
            {items.length < max && (
              <AddButton
                label={`Add ${field.itemLabel.toLowerCase()}`}
                onClick={() => onChange([...items, emptyObject(field.fields)])}
              />
            )}
          </div>
        </div>
      );
    }

    case "images": {
      const items = (value as string[]) ?? [];
      const min = field.min ?? 0;
      const max = field.max ?? 40;
      return (
        <div>
          <FieldLabel
            label={`${field.label} (${items.length}${field.min === field.max ? "" : ` of max ${max}`})`}
            required={min > 0}
          />
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((url, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-[#E5E0D8] bg-[#FAF8F4]/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#8A847A]">Photo {i + 1}</span>
                  <ItemControls
                    index={i}
                    count={items.length}
                    min={min}
                    onMove={(to) => onChange(move(items, i, to))}
                    onRemove={() => onChange(items.filter((_, j) => j !== i))}
                  />
                </div>
                <MediaInput
                  kind="image"
                  url={url}
                  onChange={(next) => onChange(items.map((x, j) => (j === i ? next : x)))}
                />
              </div>
            ))}
          </div>
          {items.length < max && (
            <div className="mt-3">
              <AddButton label="Add photo" onClick={() => onChange([...items, ""])} />
            </div>
          )}
        </div>
      );
    }
  }
}
