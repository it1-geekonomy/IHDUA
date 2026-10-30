"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export interface TinyMceEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  height?: number | string;
}

// Dynamically import TinyMCE React Editor with ssr: false
const EditorComponent = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 w-full flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-50/70 p-6 text-stone-500">
        <Loader2 className="h-6 w-6 animate-spin text-[#0B5D51] mb-2" />
        <p className="text-xs font-figtree font-medium">Loading rich text editor…</p>
      </div>
    ),
  },
);

export function TinyMceEditor({
  value,
  onChange,
  disabled = false,
  placeholder = "Write or paste terms, clauses, responsibilities, policies...",
  height = 500,
}: TinyMceEditorProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If a broken or mismatched tinymce instance was cached in memory, reset it
    if (typeof window !== "undefined") {
      const w = window as any;
      if (w.tinymce && (!w.tinymce.majorVersion || w.tinymce.majorVersion === "8")) {
        try {
          w.tinymce.remove();
        } catch {
          /* ignore */
        }
        delete w.tinymce;
      }
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div
        style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
        className="flex w-full flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-50/70 p-6 text-stone-400"
      >
        <Loader2 className="h-6 w-6 animate-spin text-[#0B5D51] mb-2" />
        <p className="text-xs font-figtree font-medium">Initializing TinyMCE…</p>
      </div>
    );
  }

  return (
    <div className="tinymce-wrapper w-full overflow-hidden rounded-xl border border-stone-300 focus-within:border-[#0B5D51] focus-within:ring-2 focus-within:ring-[#0B5D51]/20 transition-all bg-white shadow-xs">
      <EditorComponent
        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6.8.3/tinymce.min.js"
        value={value}
        disabled={disabled}
        onEditorChange={(newContent) => {
          onChange(newContent);
        }}
        init={{
          height: height,
          menubar: "file edit view insert format tools table help",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | " +
            "bold italic underline strikethrough | forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | table link | " +
            "removeformat | code fullscreen preview | help",
          toolbar_mode: "sliding",
          placeholder: placeholder,
          branding: false,
          promotion: false,
          elementpath: true,
          statusbar: true,
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-size: 15px;
              line-height: 1.7;
              color: #1f2937;
              padding: 18px;
              margin: 0;
            }
            h1 { font-size: 1.85rem; font-weight: 700; color: #0B5D51; margin-top: 1.4em; margin-bottom: 0.5em; }
            h2 { font-size: 1.5rem; font-weight: 700; color: #0B5D51; margin-top: 1.3em; margin-bottom: 0.5em; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
            h3 { font-size: 1.25rem; font-weight: 600; color: #111827; margin-top: 1.2em; margin-bottom: 0.4em; }
            h4, h5, h6 { font-size: 1.1rem; font-weight: 600; color: #374151; margin-top: 1em; margin-bottom: 0.4em; }
            p { margin-top: 0; margin-bottom: 1em; }
            a { color: #0B5D51; text-decoration: underline; font-weight: 500; }
            a:hover { color: #074037; }
            ul, ol { padding-left: 1.5rem; margin-bottom: 1em; }
            li { margin-bottom: 0.35em; }
            blockquote {
              border-left: 4px solid #0B5D51;
              padding-left: 1rem;
              margin: 1em 0;
              color: #4b5563;
              font-style: italic;
              background-color: #f8fafc;
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
              border-radius: 0 0.375rem 0.375rem 0;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1.25em 0;
            }
            table, th, td {
              border: 1px solid #d1d5db;
            }
            th, td {
              padding: 10px 14px;
              text-align: left;
            }
            th {
              background-color: #f3f4f6;
              font-weight: 600;
              color: #111827;
            }
            code {
              background-color: #f1f5f9;
              padding: 0.2em 0.4em;
              border-radius: 0.25rem;
              font-size: 0.9em;
              font-family: monospace;
            }
          `,
        }}
      />
    </div>
  );
}
