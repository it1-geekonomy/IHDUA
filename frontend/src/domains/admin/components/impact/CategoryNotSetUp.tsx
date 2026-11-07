"use client";

import { AlertCircle, LayoutTemplate, Loader2 } from "lucide-react";
import type { ImpactCategoryDef } from "./layouts";

interface CategoryNotSetUpProps {
  def: ImpactCategoryDef;
  settingUp: boolean;
  error: string | null;
  onSetUp: () => void;
}

export function CategoryNotSetUp({ def, settingUp, error, onSetUp }: CategoryNotSetUpProps) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[#E5E0D8] bg-white p-8 text-center shadow-2xs">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E0D8] bg-[#FAF8F4] text-[#9739A8]">
        <LayoutTemplate className="h-6 w-6" />
      </div>
      <h2 className="font-lora text-lg text-[#0F1C1D]">{def.name} isn&apos;t set up yet</h2>
      <p className="mt-1.5 text-xs text-[#5F6C6D]">
        Create the {def.name} category once, then add its pages. Every page here uses the {def.name} layout.
      </p>
      {error && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-rose-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
      <button
        type="button"
        onClick={onSetUp}
        disabled={settingUp}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2C1A30] disabled:opacity-50 cursor-pointer"
      >
        {settingUp && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Set up {def.name}
      </button>
    </div>
  );
}
