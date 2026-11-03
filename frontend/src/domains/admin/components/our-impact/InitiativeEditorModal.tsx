"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Globe,
  GraduationCap,
  Heart,
  ImageIcon,
  IndianRupee,
  Layers,
  Loader2,
  MapPin,
  Plus,
  Scissors,
  Sparkles,
  Target,
  Trash2,
  Trees,
  TrendingUp,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AdminImpactCategoryItem,
  AdminImpactInitiativeItem,
  ContentStatus,
  InitiativeFormValues,
  InitiativeGalleryPhoto,
  InitiativeStatItem,
} from "./types";

interface InitiativeEditorModalProps {
  isOpen: boolean;
  editingItem: AdminImpactInitiativeItem | null;
  defaultCategoryId?: string;
  categories: AdminImpactCategoryItem[];
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: InitiativeFormValues) => void;
}

type TabKey = "basic" | "hero" | "stats" | "stories" | "gallery";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─────────────────────────────────────────────────────────────
// Icons Catalog & Picker
// ─────────────────────────────────────────────────────────────
export const AVAILABLE_ICONS = [
  { key: "target", label: "Target / Mission", icon: Target },
  { key: "users", label: "Users / Community", icon: Users },
  { key: "school", label: "Education / School", icon: GraduationCap },
  { key: "building", label: "Building / Campus", icon: Building },
  { key: "heart", label: "Health / Care", icon: Heart },
  { key: "rupee", label: "Finance / Loans", icon: IndianRupee },
  { key: "trending", label: "Growth / Impact", icon: TrendingUp },
  { key: "award", label: "Excellence / Pass", icon: Award },
  { key: "pin", label: "Village / Location", icon: MapPin },
  { key: "trees", label: "Environment / Green", icon: Trees },
  { key: "briefcase", label: "Job / Training", icon: Briefcase },
  { key: "scissors", label: "Stitching / Garments", icon: Scissors },
  { key: "activity", label: "Medical / Camps", icon: Activity },
  { key: "sparkles", label: "General / Highlight", icon: Sparkles },
] as const;

function getIconComponent(key?: string) {
  const match = AVAILABLE_ICONS.find(
    (i) => i.key === (key || "").toLowerCase().trim(),
  );
  return match ? match.icon : Sparkles;
}

function IconPickerDropdown({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const CurrentIcon = getIconComponent(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {label && (
        <span className="block text-[10px] font-semibold text-[#8A847A] mb-1">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0F1C1D] hover:border-[#9739A8] transition-all cursor-pointer shadow-2xs"
        title="Choose icon"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FAF8F4] text-[#9739A8]">
          <CurrentIcon className="h-3.5 w-3.5" />
        </span>
        <span className="capitalize text-[11px] text-[#5F6C6D]">
          {value || "Icon"}
        </span>
        <ChevronDown className="h-3 w-3 text-[#8A847A]" />
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-1.5 w-56 rounded-xl border border-[#E5E0D8] bg-white p-2 shadow-xl grid grid-cols-4 gap-1 animate-in fade-in zoom-in-95 duration-100">
          {AVAILABLE_ICONS.map((item) => {
            const IconC = item.icon;
            const isSelected = value === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onChange(item.key);
                  setOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg p-2 text-xs transition-colors cursor-pointer group",
                  isSelected
                    ? "bg-[#9739A8] text-white shadow-xs"
                    : "hover:bg-[#FAF8F4] text-[#0F1C1D]",
                )}
                title={item.label}
              >
                <IconC className="h-4 w-4" />
                <span className="mt-1 text-[9px] truncate max-w-full font-medium">
                  {item.key}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Single Image Upload Dropzone (File upload + Instant preview)
// ─────────────────────────────────────────────────────────────
function ImageUploadBox({
  label,
  sublabel,
  previewUrl,
  onFileSelect,
  onRemove,
}: {
  label: string;
  sublabel?: string;
  previewUrl?: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (PNG, JPG, WebP, etc.)");
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#0F1C1D]">
          {label}
        </label>
        {sublabel && (
          <span className="text-[11px] text-[#8A847A]">{sublabel}</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative flex items-center gap-3.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F4] p-2.5">
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-[#D9D3C9] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={label}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-semibold text-[#0F1C1D] truncate">
              {label} Selected
            </p>
            <p className="text-[11px] text-[#5F6C6D] truncate max-w-xs font-mono">
              {previewUrl.startsWith("data:")
                ? "Uploaded from device"
                : previewUrl}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-[#9739A8] hover:underline cursor-pointer"
              >
                Change Image
              </button>
              <span className="text-[#D9D3C9]">·</span>
              <button
                type="button"
                onClick={onRemove}
                className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all cursor-pointer text-center",
            isDragging
              ? "border-[#9739A8] bg-[#FAF8F4]"
              : "border-[#D9D3C9] hover:border-[#9739A8]/70 bg-[#FAF8F4]/30 hover:bg-[#FAF8F4]",
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#9739A8] shadow-2xs border border-[#E5E0D8] mb-1.5">
            <UploadCloud className="h-4 w-4" />
          </div>
          <p className="text-xs font-semibold text-[#0F1C1D]">
            Click to upload image or drag & drop
          </p>
          <p className="text-[11px] text-[#8A847A] mt-0.5">
            PNG, JPG, WebP, AVIF up to 5MB
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Multi-Image Gallery Dropzone (Pure image upload, NO text)
// ─────────────────────────────────────────────────────────────
function MultiImageGalleryUpload({
  photos,
  onAddPhotos,
  onRemovePhoto,
}: {
  photos: InitiativeGalleryPhoto[];
  onAddPhotos: (newPhotos: InitiativeGalleryPhoto[]) => void;
  onRemovePhoto: (index: number) => void;
}) {
  const multiInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const added: InitiativeGalleryPhoto[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        added.push({
          src: objectUrl,
          file,
        });
      }
    });
    if (added.length > 0) {
      onAddPhotos(added);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-[#0F1C1D]">
            Gallery Photos ({photos.filter((p) => p.src.trim()).length})
          </h3>
          <p className="text-[11px] text-[#5F6C6D]">
            Upload multiple photos directly. No caption text required.
          </p>
        </div>
        <button
          type="button"
          onClick={() => multiInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FAF8F4] border border-[#D9D3C9] px-3 py-1.5 text-xs font-semibold text-[#9739A8] hover:bg-[#F4F1EA] transition-all cursor-pointer shadow-2xs"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>+ Upload Photos</span>
        </button>
      </div>

      <input
        ref={multiInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => processFiles(e.target.files)}
        className="hidden"
      />

      {/* Grid of uploaded photos */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          processFiles(e.dataTransfer.files);
        }}
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 rounded-2xl border-2 transition-all min-h-[160px]",
          isDragging
            ? "border-[#9739A8] bg-[#FAF8F4]"
            : "border-[#E5E0D8] bg-[#FAF8F4]/30",
        )}
      >
        {photos
          .filter((p) => p.src.trim())
          .map((photo, idx) => (
            <div
              key={idx}
              className="group relative aspect-4/3 overflow-hidden rounded-xl border border-[#D9D3C9] bg-white shadow-2xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={`Gallery photo ${idx + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-200"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemovePhoto(idx)}
                  className="rounded-full bg-rose-600 p-2 text-white shadow-md hover:bg-rose-700 transition-transform hover:scale-110 cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-white">
                #{idx + 1}
              </span>
            </div>
          ))}

        {/* Add photos placeholder tile */}
        <div
          onClick={() => multiInputRef.current?.click()}
          className="flex flex-col items-center justify-center aspect-4/3 rounded-xl border-2 border-dashed border-[#D9D3C9] bg-white hover:border-[#9739A8] hover:bg-[#FAF8F4] transition-all cursor-pointer p-3 text-center"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8] mb-1">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-[#0F1C1D]">
            Add Images
          </span>
          <span className="text-[10px] text-[#8A847A]">
            Drag or click
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Preset defaults for known initiatives
// ─────────────────────────────────────────────────────────────
const KNOWN_INITIATIVE_PRESETS: Record<string, Partial<InitiativeFormValues>> = {
  "adarsha-academy-krs": {
    heroHeading: "Adarsha Academy",
    heroDescription:
      "A rural private school providing education to children from villages in the vicinity of the Krishnarajasagara (KRS) Dam.",
    heroImageUrl: "/Rural Education/Frame 648 (7).png",
    heroMobileImageUrl: "/Rural Education/Frame 695.png",
    highlightLabel: "EDUCATION",
    highlightHeading: "Adarsha Academy",
    highlightDescription:
      "A rural private school providing education to children from villages in the vicinity of the Krishnarajasagara (KRS) Dam.",
    missionHeading: "Mission",
    missionDescription:
      "Providing quality primary education for children in rural communities.",
    missionIcon: "target",
    beneficiariesHeading: "Beneficiaries",
    beneficiariesDescription: "More than 380 students since 2010",
    beneficiariesIcon: "users",
    stats: [
      { value: "380+", label: "Students Since 2010", icon: "school" },
      { value: "100%", label: "Pass Rate", icon: "award" },
      { value: "7", label: "Villages Served", icon: "pin" },
    ],
    story1Title: "Education in a Rural Setting",
    story1Description:
      "The Adarsha Academy is a kindergarten through 8th grade rural private school providing full-time education to children from seven villages.",
    story1ImageUrl: "/Rural Education/Rectangle 51 (2).png",
    story2Title: "Education for Rural Children",
    story2Description:
      "Focusing on science experiments, digital literacy, arts, and balanced midday nutrition so every child can thrive.",
    story2ImageUrl: "/Rural Education/Rectangle 51 (3).png",
    story2ButtonLabel: "View Gallery",
    story2ButtonUrl: "/adarsha-academy-krs/gallery",
    galleryHeading: "Adarsha Academy Campus & Moments",
    galleryImages: [
      { src: "/Rural Education/Frame 648 (7).png" },
      { src: "/Rural Education/Rectangle 51 (2).png" },
      { src: "/Rural Education/Rectangle 51 (3).png" },
      { src: "/Rural Education/Frame 695.png" },
    ],
  },
  "vinayakagnana-vidyashale-mysore": {
    heroHeading: "Vinayaka Jnana Vidyashale",
    heroDescription:
      "Rural community school in Mysore providing affordable English and Kannada medium education.",
    heroImageUrl: "/Rural Education/Frame 648 (7).png",
    heroMobileImageUrl: "/Rural Education/Frame 695.png",
    highlightLabel: "EDUCATION",
    highlightHeading: "Vinayaka Jnana Vidyashale",
    highlightDescription:
      "Rural community school in Mysore providing affordable English and Kannada medium education.",
    missionHeading: "Mission",
    missionDescription:
      "Empowering underprivileged children through comprehensive primary education and holistic care.",
    missionIcon: "target",
    beneficiariesHeading: "Beneficiaries",
    beneficiariesDescription: "250+ Children supported yearly",
    beneficiariesIcon: "users",
    stats: [
      { value: "250+", label: "Students Supported", icon: "school" },
      { value: "15+", label: "Dedicated Teachers", icon: "award" },
    ],
    story1Title: "Bridging the Urban-Rural Divide",
    story1Description:
      "Ensuring children from vulnerable socio-economic backgrounds have equal access to modern learning tools.",
    story1ImageUrl: "/Rural Education/Rectangle 51 (2).png",
    story2Title: "Nourishment & Extracurriculars",
    story2Description:
      "Providing midday meals, sports competitions, and arts festivals to develop well-rounded future citizens.",
    story2ImageUrl: "/Rural Education/Rectangle 51 (3).png",
    story2ButtonLabel: "View School Gallery",
    story2ButtonUrl: "/vinayakagnana-vidyashale-mysore/gallery",
    galleryHeading: "School Activities & Cultural Events",
    galleryImages: [
      { src: "/Rural Education/Frame 648 (7).png" },
      { src: "/Rural Education/Rectangle 51 (2).png" },
      { src: "/Rural Education/Rectangle 51 (3).png" },
    ],
  },
  "self-help-group-federation": {
    heroHeading: "Self-Help Groups & Federation",
    heroDescription:
      "Village Self-Help Groups and federations where women save together, share decisions and grow as community leaders.",
    heroImageUrl: "/selfhelpgroup/banner-desktop.png",
    heroMobileImageUrl: "/selfhelpgroup/banner-mobile.png",
    highlightLabel: "WOMEN EMPOWERMENT",
    highlightHeading: "Self Help Group & Federation",
    highlightDescription:
      "IHDUA supports rural communities through Self-Help Groups that encourage collective savings, shared decision-making and women's leadership.",
    missionHeading: "Mission",
    missionDescription:
      "Empowering rural women through savings, skills and leadership.",
    missionIcon: "target",
    beneficiariesHeading: "Beneficiaries",
    beneficiariesDescription:
      "Building financial confidence, collaboration and stronger communities.",
    beneficiariesIcon: "users",
    stats: [
      { value: "7,578+", label: "SHG Members", icon: "users" },
      { value: "697+", label: "Self-Help Groups", icon: "building" },
      { value: "18", label: "Federations Reported", icon: "award" },
      { value: "43", label: "Farmer SHGs", icon: "trees" },
    ],
    story1Title: "The Power of Collective Action",
    story1Description:
      "Self-Help Groups (SHGs) bring together 10–20 women from the same village to build financial skills, shared responsibility and leadership. With IHDUA's guidance, members contribute to shared savings, maintain group records and participate in collective decision-making.",
    story1ImageUrl: "/selfhelpgroup/collective.png",
    womenStoryHeading: "Creating Financial Independence for Rural Women",
    womenStoryTopDesc:
      "IHDUA's Self-Help Groups help rural women save together, keep group records and take part in collective decisions. Regular meetings build financial confidence, while federations bring group representatives together to discuss village concerns and share solutions.",
    womenStoryImage1Url: "/selfhelpgroup/financial-independence-1.jpg",
    womenStoryImage2Url: "/selfhelpgroup/financial-independence-2.jpg",
    womenStoryBottomDesc:
      "IHDUA's Microfinance Initiative makes it possible for rural women to become informed financial decision-makers who have access to loans at competitive rates, which they may use for their family's health, education and livelihood needs.",
    galleryHeading: "Federation Meets & Community Action",
    galleryImages: [
      { src: "/selfhelpgroup/financial-independence-1.jpg" },
      { src: "/selfhelpgroup/financial-independence-2.jpg" },
      { src: "/selfhelpgroup/collective.png" },
    ],
  },
  "micro-finance-initiatives": {
    heroHeading: "Microfinance Initiative",
    heroDescription:
      "Connecting rural women entrepreneurs to formal bank loans for sustainable livelihood creation.",
    heroImageUrl: "/womenempowerment/banner-desktop.png",
    heroMobileImageUrl: "/womenempowerment/banner-mobile.png",
    highlightLabel: "WOMEN EMPOWERMENT",
    highlightHeading: "Microfinance Initiative",
    highlightDescription:
      "Empowering rural women through low-cost institutional credit linkages and financial literacy.",
    missionHeading: "Credit Access",
    missionDescription:
      "Enabling women to fund dairy farms, grocery stores, and tailoring micro-enterprises.",
    missionIcon: "rupee",
    beneficiariesHeading: "Total Credit Linkages",
    beneficiariesDescription: "₹9.14+ Crores in low-interest bank loans facilitated",
    beneficiariesIcon: "trending",
    stats: [
      { value: "₹9.14 Cr", label: "Loans Facilitated", icon: "rupee" },
      { value: "218+", label: "Bank Credit Linkages", icon: "award" },
    ],
    story1Title: "Low-Cost Institutional Credit",
    story1Description:
      "Through partnerships with nationalized banks, IHDUA assists rural women in securing competitive loans for micro-enterprises without extortionate middleman interest.",
    story1ImageUrl: "/womenempowerment/microfinance.png",
    womenStoryHeading: "Financial Autonomy for Women",
    womenStoryTopDesc:
      "Access to formal credit transforms village women into confident entrepreneurs and community stakeholders.",
    womenStoryImage1Url: "/selfhelpgroup/financial-independence-1.jpg",
    womenStoryImage2Url: "/selfhelpgroup/financial-independence-2.jpg",
    womenStoryBottomDesc:
      "Weekly repayment discipline and joint accountability ensure 100% on-time recovery and lasting economic dignity.",
    galleryHeading: "Microfinance Linkage Moments",
    galleryImages: [
      { src: "/womenempowerment/microfinance.png" },
      { src: "/selfhelpgroup/financial-independence-1.jpg" },
    ],
  },
  "health-awareness": {
    heroHeading: "Health Awareness & Preventive Care",
    heroDescription:
      "Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.",
    heroImageUrl: "/Healthawareness/healthawarenessbg.png",
    heroMobileImageUrl: "/Healthawareness/healthawarenessmobilebg.png",
    highlightLabel: "HEALTH AWARENESS",
    highlightHeading: "Promoting Healthier Communities",
    highlightDescription:
      "IHDUA conducts community health programmes, preventative screenings, and nutritional guidance to improve well-being in rural villages.",
    missionHeading: "Focus Areas",
    missionDescription: "Nutrition, hygiene, sanitation and reproductive health awareness.",
    missionIcon: "heart",
    beneficiariesHeading: "Programme Reach",
    beneficiariesDescription:
      "Historical programmes included health education for women, schoolchildren and Anganwadi workers.",
    beneficiariesIcon: "users",
    stats: [
      { value: "160", label: "Reproductive & Child Sessions", icon: "activity" },
      { value: "855", label: "Women in Nutrition Sessions", icon: "heart" },
      { value: "988", label: "Women in Hygiene Sessions", icon: "users" },
      { value: "34+", label: "Anganwadi Workers Trained", icon: "award" },
    ],
    story1Title: "Supporting Community Well-being",
    story1Description:
      "IHDUA conducted health education sessions covering nutrition, anaemia, personal hygiene, menstruation, sanitation and family planning. Training also addressed community health awareness and the role of village health workers.",
    story1ImageUrl: "/Healthawareness/Rectangle.png",
    grid4Heading: "Creating Awareness Through Education",
    grid4Description:
      "IHDUA's health awareness initiatives cover nutrition, hygiene, sanitation and reproductive health. The programmes address common health concerns and share essential health information with rural women and families.\n\nDocumented activities include health education sessions, Anganwadi worker training, nutrition awareness and reproductive and child health programmes.",
    grid4Image1Url: "/Healthawareness/awareness1.png",
    grid4Image2Url: "/Healthawareness/awareness2.png",
    grid4Image3Url: "/Healthawareness/awareness3.png",
    grid4Image4Url: "/Healthawareness/awareness4.png",
    galleryHeading: "Awareness Sessions Photo Highlights",
    galleryImages: [
      { src: "/Healthawareness/awareness1.png" },
      { src: "/Healthawareness/awareness2.png" },
      { src: "/Healthawareness/awareness3.png" },
      { src: "/Healthawareness/awareness4.png" },
    ],
  },
  "health-camps": {
    heroHeading: "Free Medical & Diagnostic Camps",
    heroDescription:
      "Bringing specialist doctors, eye checkups, and free medicines directly to remote rural villages.",
    heroImageUrl: "/Healthawareness/healthawarenessbg.png",
    heroMobileImageUrl: "/Healthawareness/healthawarenessmobilebg.png",
    highlightLabel: "HEALTHCARE",
    highlightHeading: "Free Medical Camps",
    highlightDescription:
      "Free medical camps bring doctor consultations, diagnostics, eye examinations, and free medicines to remote hamlets.",
    missionHeading: "Free Diagnostics",
    missionDescription: "Specialist consultations, cancer screening, and eye care.",
    missionIcon: "activity",
    beneficiariesHeading: "Villages Reached",
    beneficiariesDescription: "Direct medical access for 28+ remote hamlets",
    beneficiariesIcon: "pin",
    stats: [
      { value: "28+", label: "Camps Conducted", icon: "activity" },
      { value: "1,200+", label: "Free Spectacles Distributed", icon: "heart" },
    ],
    story1Title: "Bringing Medical Care to Village Doorsteps",
    story1Description:
      "Preventive screenings and mobile doctor units ensure elder citizens and children receive early diagnosis for chronic illnesses.",
    story1ImageUrl: "/Healthcamps/camps1.png",
    grid4Heading: "Diagnostic Camp Moments",
    grid4Description:
      "Health camps conduct eye screenings, blood glucose checks, pediatric reviews, and general consultations.",
    grid4Image1Url: "/Healthcamps/camps1.png",
    grid4Image2Url: "/Healthcamps/camps2.png",
    grid4Image3Url: "/Healthcamps/camps3.png",
    grid4Image4Url: "/Healthcamps/camps4.png",
    galleryHeading: "Medical Camps Photo Highlights",
    galleryImages: [
      { src: "/Healthcamps/camps1.png" },
      { src: "/Healthcamps/camps2.png" },
      { src: "/Healthcamps/camps3.png" },
      { src: "/Healthcamps/camps4.png" },
    ],
  },
  "stitching-unit": {
    heroHeading: "Stitching & Garment Production Unit",
    heroDescription:
      "A practical skills programme designed to provide vocational training opportunities for rural women.",
    heroImageUrl: "/Rural Education/Rectangle 51 (2).png",
    heroMobileImageUrl: "/Rural Education/Rectangle 51 (2).png",
    highlightLabel: "WOMEN EMPOWERMENT",
    highlightHeading: "Vocational Training",
    highlightDescription:
      "A practical skills programme designed to provide vocational training opportunities for rural women.",
    missionHeading: "Mission",
    missionDescription: "Provide practical vocational training to rural women.",
    missionIcon: "scissors",
    beneficiariesHeading: "Beneficiaries",
    beneficiariesDescription: "More than 250 women have benefited from our programmes since 2005.",
    beneficiariesIcon: "briefcase",
    stats: [
      { value: "2,174+", label: "Tailoring Graduates", icon: "scissors" },
      { value: "100%", label: "Direct Income Increase", icon: "trending" },
    ],
    story1Title: "Practical Skills for Real Life",
    story1Description:
      "IHDUA's stitching and tailoring centre equips rural women with modern garment-making techniques, empowering them to earn an independent living from their own homes.",
    story1ImageUrl: "/Rural Education/Rectangle 51 (2).png",
    womenStoryHeading: "Garment Craftsmanship & Independence",
    womenStoryTopDesc:
      "Vocational training in professional apparel cutting, machine operation, and finishing gives women marketable skills.",
    womenStoryImage1Url: "/Rural Education/Rectangle 51 (2).png",
    womenStoryImage2Url: "/Rural Education/Rectangle 51 (3).png",
    womenStoryBottomDesc:
      "Equipped with sewing machines and pattern drafting techniques, women establish micro-enterprises right from their villages.",
    galleryHeading: "Garment Unit Production & Machines",
    galleryImages: [
      { src: "/Rural Education/Rectangle 51 (2).png" },
      { src: "/Rural Education/Rectangle 51 (3).png" },
    ],
  },
  "youth": {
    heroHeading: "Youth Skill Development",
    heroDescription:
      "Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.",
    heroImageUrl: "/skills and employement/bannerbg.png",
    heroMobileImageUrl: "/skills and employement/bannermobilebg.png",
    highlightLabel: "SKILLS & EMPLOYMENT",
    highlightHeading: "Youth Skill Development",
    highlightDescription:
      "IHDUA provides rural youth and women with marketable skills and vocational training to build financial independence.",
    missionHeading: "Focus Areas",
    missionDescription: "Technical, healthcare, vocational and soft skills.",
    missionIcon: "briefcase",
    beneficiariesHeading: "Beneficiaries",
    beneficiariesDescription: "1,800+ youth trained across rural communities in Karnataka.",
    beneficiariesIcon: "users",
    stats: [
      { value: "514+", label: "Youth Computer Certified", icon: "award" },
      { value: "267+", label: "Nursing Assistants Placed", icon: "activity" },
    ],
    story1Title: "Why Youth Skill Training Matters",
    story1Description:
      "Vocational training gives rural students the knowledge and confidence to pursue dignified livelihoods. By connecting classroom learning with practical apprenticeships, our courses help bridge the gap between education and economic independence.",
    story1ImageUrl: "/skills and employement/Rectangle.png",
    womenStoryHeading: "Building Skills for a Brighter Future",
    womenStoryTopDesc:
      "IHDUA’s Skill Development Project provides rural students with training in computer skills, Tally, GST and spoken English, alongside General Duty Assistant (GDA) and other vocational courses. These programmes aim to strengthen practical abilities and improve access to employment opportunities.",
    womenStoryImage1Url: "/youth/buildingskills1.png",
    womenStoryImage2Url: "/youth/buildingskills2.png",
    womenStoryBottomDesc:
      "The organisation also offers vocational training in tailoring, Aari work, Lippan art, Vision Assistant training and Thanjavur painting. Through these courses, students can explore different skills, develop their capabilities and prepare for future livelihood opportunities.",
    galleryHeading: "Youth Training Labs & Sessions",
    galleryImages: [
      { src: "/skills and employement/Rectangle.png" },
      { src: "/skills and employement/Rectangle 51.png" },
    ],
  },
  "rejuvenation-of-villages": {
    heroHeading: "Rejuvenation of Villages",
    heroDescription:
      "Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.",
    heroImageUrl: "/modelvillage/modelvillagebg.png",
    heroMobileImageUrl: "/modelvillage/modelvillagemobilebg.png",
    highlightLabel: "VILLAGE DEVELOPMENT",
    highlightHeading: "Building Better Rural Communities",
    highlightDescription:
      "IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods.",
    missionHeading: "Focus Areas",
    missionDescription: "Agriculture, livestock care, sanitation and village infrastructure improvements.",
    missionIcon: "trees",
    beneficiariesHeading: "Programme Reach",
    beneficiariesDescription: "Village initiatives include soil health training, veterinary support and solar street-light installation.",
    beneficiariesIcon: "pin",
    stats: [
      { value: "500+", label: "Saplings Planted", icon: "trees" },
      { value: "140+", label: "Farmers Adopted Vermicompost", icon: "award" },
    ],
    story1Title: "Why Village Development Matters",
    story1Description:
      "Rejuvenating villages requires integrated support across soil health, water conservation, community commons, and eco-friendly infrastructure. When rural families have access to sustainable farming and reliable water sources, entire communities flourish.",
    story1ImageUrl: "/modelvillage/Rectangle (1).png",
    grid4Heading: "Building a Sustainable Village",
    grid4Description:
      "IHDUA's Model Village project focuses on Chikkahundi village in Gundlupet taluk, supporting holistic development through sustainable agriculture, organic farming and eco-friendly activities.\n\nDocumented activities include soil health training, vermicompost production, fruit sapling distribution, veterinary camps, toilet construction and solar street-light installation.",
    grid4Image1Url: "/modelvillage/sustainablevillage1.png",
    grid4Image2Url: "/modelvillage/sustainablevillage2.png",
    grid4Image3Url: "/modelvillage/sustainablevillage3.png",
    grid4Image4Url: "/modelvillage/sustainablevillage4.png",
    galleryHeading: "Sustainable Village Moments",
    galleryImages: [
      { src: "/modelvillage/sustainablevillage1.png" },
      { src: "/modelvillage/sustainablevillage2.png" },
      { src: "/modelvillage/sustainablevillage3.png" },
      { src: "/modelvillage/sustainablevillage4.png" },
    ],
  },
  "farmers": {
    heroHeading: "Farmers Support & Sustainable Agriculture",
    heroDescription:
      "Guiding rural smallholder farmers in drip irrigation, natural pest management, and seed conservation.",
    heroImageUrl: "/modelvillage/modelvillagebg.png",
    heroMobileImageUrl: "/modelvillage/modelvillagemobilebg.png",
    highlightLabel: "MODEL VILLAGE",
    highlightHeading: "Farmers Support",
    highlightDescription:
      "Empowering farming collectives with organic methods, soil rejuvenation, and cooperative marketing.",
    missionHeading: "Eco-Farming",
    missionDescription: "Vermicompost, bio-pesticides, and crop rotation for high yield.",
    missionIcon: "trees",
    beneficiariesHeading: "Farmer Groups",
    beneficiariesDescription: "43 Farmer Self-Help Groups formed and trained",
    beneficiariesIcon: "users",
    stats: [
      { value: "43", label: "Farmer Groups", icon: "users" },
      { value: "100%", label: "Organic Transition", icon: "trending" },
    ],
    story1Title: "Preserving Soil Health & Groundwater",
    story1Description:
      "IHDUA trains farmers in water harvesting and natural manure production to reduce chemical dependency and secure agricultural livelihoods.",
    story1ImageUrl: "/modelvillage/Rectangle (1).png",
    grid4Heading: "Agriculture & Training Highlights",
    grid4Description:
      "Hands-on farmer training sessions in compost pits, livestock health, and sustainable yield enhancement.",
    grid4Image1Url: "/modelvillage/sustainablevillage1.png",
    grid4Image2Url: "/modelvillage/sustainablevillage2.png",
    grid4Image3Url: "/modelvillage/sustainablevillage3.png",
    grid4Image4Url: "/modelvillage/sustainablevillage4.png",
    galleryHeading: "Farmer Fields & Training Gallery",
    galleryImages: [
      { src: "/modelvillage/sustainablevillage1.png" },
      { src: "/modelvillage/sustainablevillage2.png" },
    ],
  },
  "increase-the-green-cover": {
    heroHeading: "Increase the Green Cover",
    heroDescription:
      "Planting indigenous trees and rejuvenating biodiversity across arid Karnataka rural belts.",
    heroImageUrl: "/modelvillage/modelvillagebg.png",
    heroMobileImageUrl: "/modelvillage/modelvillagemobilebg.png",
    highlightLabel: "ENVIRONMENT",
    highlightHeading: "Green Cover Expansion",
    highlightDescription:
      "Mass tree planting drives and community nurseries to protect native flora and groundwater.",
    missionHeading: "Afforestation",
    missionDescription: "Planting native shade, fruit, and medicinal trees.",
    missionIcon: "trees",
    beneficiariesHeading: "Trees Planted",
    beneficiariesDescription: "Thousands of saplings thriving under community care",
    beneficiariesIcon: "award",
    stats: [
      { value: "1,500+", label: "Fruit Saplings Distributed", icon: "trees" },
      { value: "12", label: "Village Groves Restored", icon: "pin" },
    ],
    story1Title: "Community-Led Greening",
    story1Description:
      "Partnering with school students and farmer groups to nurture young saplings, creating green belts around village commons.",
    story1ImageUrl: "/modelvillage/sustainablevillage4.png",
    grid4Heading: "Green Cover Drives",
    grid4Description:
      "Community volunteers and students planting saplings to combat deforestation and soil erosion.",
    grid4Image1Url: "/modelvillage/sustainablevillage1.png",
    grid4Image2Url: "/modelvillage/sustainablevillage2.png",
    grid4Image3Url: "/modelvillage/sustainablevillage3.png",
    grid4Image4Url: "/modelvillage/sustainablevillage4.png",
    galleryHeading: "Plantation Gallery",
    galleryImages: [
      { src: "/modelvillage/sustainablevillage4.png" },
      { src: "/modelvillage/sustainablevillage1.png" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// Main Initiative Editor Modal
// ─────────────────────────────────────────────────────────────
export function InitiativeEditorModal({
  isOpen,
  editingItem,
  defaultCategoryId,
  categories,
  actionLoading,
  onClose,
  onSave,
}: InitiativeEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");

  // Tab 1: Basic Info
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState<ContentStatus>("published");
  const [isSlugManual, setIsSlugManual] = useState(false);

  // Tab 2: Hero Banner
  const [heroHeading, setHeroHeading] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroMobileImageUrl, setHeroMobileImageUrl] = useState("");
  const [heroMobileImageFile, setHeroMobileImageFile] = useState<File | null>(null);

  // Tab 3: Highlights & Stats
  const [highlightLabel, setHighlightLabel] = useState("");
  const [highlightHeading, setHighlightHeading] = useState("");
  const [highlightDescription, setHighlightDescription] = useState("");

  const [missionHeading, setMissionHeading] = useState("Mission");
  const [missionDescription, setMissionDescription] = useState("");
  const [missionIcon, setMissionIcon] = useState("target");

  const [beneficiariesHeading, setBeneficiariesHeading] = useState("Beneficiaries");
  const [beneficiariesDescription, setBeneficiariesDescription] = useState("");
  const [beneficiariesIcon, setBeneficiariesIcon] = useState("users");

  const [stats, setStats] = useState<InitiativeStatItem[]>([
    { value: "", label: "", icon: "school" },
  ]);

  // Tab 4: Stories & Media
  const [story1Title, setStory1Title] = useState("");
  const [story1Description, setStory1Description] = useState("");
  const [story1ImageUrl, setStory1ImageUrl] = useState("");
  const [story1ImageFile, setStory1ImageFile] = useState<File | null>(null);

  const [story2Title, setStory2Title] = useState("");
  const [story2Description, setStory2Description] = useState("");
  const [story2ImageUrl, setStory2ImageUrl] = useState("");
  const [story2ImageFile, setStory2ImageFile] = useState<File | null>(null);
  const [story2ButtonLabel, setStory2ButtonLabel] = useState("");
  const [story2ButtonUrl, setStory2ButtonUrl] = useState("");

  // Women Empowerment Specific: 2-Image Section (WomenOpportunities)
  const [womenStoryHeading, setWomenStoryHeading] = useState("");
  const [womenStoryTopDesc, setWomenStoryTopDesc] = useState("");
  const [womenStoryImage1Url, setWomenStoryImage1Url] = useState("");
  const [womenStoryImage1File, setWomenStoryImage1File] = useState<File | null>(null);
  const [womenStoryImage2Url, setWomenStoryImage2Url] = useState("");
  const [womenStoryImage2File, setWomenStoryImage2File] = useState<File | null>(null);
  const [womenStoryBottomDesc, setWomenStoryBottomDesc] = useState("");

  // Health / Model Village Specific: 4-Image Grid Section (AwarenessGallery)
  const [grid4Heading, setGrid4Heading] = useState("");
  const [grid4Description, setGrid4Description] = useState("");
  const [grid4Image1Url, setGrid4Image1Url] = useState("");
  const [grid4Image1File, setGrid4Image1File] = useState<File | null>(null);
  const [grid4Image2Url, setGrid4Image2Url] = useState("");
  const [grid4Image2File, setGrid4Image2File] = useState<File | null>(null);
  const [grid4Image3Url, setGrid4Image3Url] = useState("");
  const [grid4Image3File, setGrid4Image3File] = useState<File | null>(null);
  const [grid4Image4Url, setGrid4Image4Url] = useState("");
  const [grid4Image4File, setGrid4Image4File] = useState<File | null>(null);

  // Tab 5: Gallery (Pure Image Upload, No Text)
  const [galleryHeading, setGalleryHeading] = useState("Photo Gallery");
  const [galleryImages, setGalleryImages] = useState<InitiativeGalleryPhoto[]>([]);

  // Validation
  const [errors, setErrors] = useState<{ name?: string; slug?: string; categoryId?: string }>({});

  useEffect(() => {
    if (!isOpen) return;

    setActiveTab("basic");

    if (editingItem) {
      const preset = KNOWN_INITIATIVE_PRESETS[editingItem.slug] || {};

      setName(editingItem.name);
      setSlug(editingItem.slug);
      setCategoryId(editingItem.categoryId);
      setDisplayOrder(editingItem.displayOrder ?? 1);
      setStatus(editingItem.status ?? "published");
      setIsSlugManual(true);

      // Hero
      setHeroHeading(editingItem.heroHeading || preset.heroHeading || editingItem.name);
      setHeroDescription(editingItem.heroDescription || preset.heroDescription || "");
      setHeroImageUrl(editingItem.heroImageUrl || preset.heroImageUrl || "");
      setHeroImageFile(null);
      setHeroMobileImageUrl(editingItem.heroMobileImageUrl || preset.heroMobileImageUrl || "");
      setHeroMobileImageFile(null);

      // Highlights & Stats
      setHighlightLabel(
        editingItem.highlightLabel ||
          preset.highlightLabel ||
          (editingItem.category?.name || "EDUCATION").toUpperCase(),
      );
      setHighlightHeading(
        editingItem.highlightHeading ||
          preset.highlightHeading ||
          editingItem.name,
      );
      setHighlightDescription(
        editingItem.highlightDescription || preset.highlightDescription || "",
      );

      setMissionHeading(editingItem.missionHeading || preset.missionHeading || "Mission");
      setMissionDescription(editingItem.missionDescription || preset.missionDescription || "");
      setMissionIcon(editingItem.missionIcon || preset.missionIcon || "target");

      setBeneficiariesHeading(editingItem.beneficiariesHeading || preset.beneficiariesHeading || "Beneficiaries");
      setBeneficiariesDescription(editingItem.beneficiariesDescription || preset.beneficiariesDescription || "");
      setBeneficiariesIcon(editingItem.beneficiariesIcon || preset.beneficiariesIcon || "users");

      setStats(
        editingItem.stats && editingItem.stats.length > 0
          ? editingItem.stats.map((s) => ({ ...s, icon: s.icon || "school" }))
          : preset.stats && preset.stats.length > 0
          ? preset.stats.map((s) => ({ ...s, icon: s.icon || "school" }))
          : [{ value: "", label: "", icon: "school" }],
      );

      // Stories
      setStory1Title(editingItem.story1Title || preset.story1Title || "");
      setStory1Description(editingItem.story1Description || preset.story1Description || "");
      setStory1ImageUrl(editingItem.story1ImageUrl || preset.story1ImageUrl || "");
      setStory1ImageFile(null);

      setStory2Title(editingItem.story2Title || preset.story2Title || "");
      setStory2Description(editingItem.story2Description || preset.story2Description || "");
      setStory2ImageUrl(editingItem.story2ImageUrl || preset.story2ImageUrl || "");
      setStory2ImageFile(null);
      setStory2ButtonLabel(editingItem.story2ButtonLabel || preset.story2ButtonLabel || "");
      setStory2ButtonUrl(editingItem.story2ButtonUrl || preset.story2ButtonUrl || "");

      // Women 2-Image Story
      setWomenStoryHeading(editingItem.womenStoryHeading || preset.womenStoryHeading || "");
      setWomenStoryTopDesc(editingItem.womenStoryTopDesc || preset.womenStoryTopDesc || "");
      setWomenStoryImage1Url(editingItem.womenStoryImage1Url || preset.womenStoryImage1Url || "");
      setWomenStoryImage1File(null);
      setWomenStoryImage2Url(editingItem.womenStoryImage2Url || preset.womenStoryImage2Url || "");
      setWomenStoryImage2File(null);
      setWomenStoryBottomDesc(editingItem.womenStoryBottomDesc || preset.womenStoryBottomDesc || "");

      // 4-Image Grid
      setGrid4Heading(editingItem.grid4Heading || preset.grid4Heading || "");
      setGrid4Description(editingItem.grid4Description || preset.grid4Description || "");
      setGrid4Image1Url(editingItem.grid4Image1Url || preset.grid4Image1Url || "");
      setGrid4Image1File(null);
      setGrid4Image2Url(editingItem.grid4Image2Url || preset.grid4Image2Url || "");
      setGrid4Image2File(null);
      setGrid4Image3Url(editingItem.grid4Image3Url || preset.grid4Image3Url || "");
      setGrid4Image3File(null);
      setGrid4Image4Url(editingItem.grid4Image4Url || preset.grid4Image4Url || "");
      setGrid4Image4File(null);

      // Gallery (pure images)
      setGalleryHeading(editingItem.galleryHeading || preset.galleryHeading || "Photo Gallery");
      setGalleryImages(
        editingItem.galleryImages && editingItem.galleryImages.length > 0
          ? editingItem.galleryImages.map((g) => ({ src: g.src }))
          : preset.galleryImages && preset.galleryImages.length > 0
          ? preset.galleryImages.map((g) => ({ src: g.src }))
          : [],
      );
    } else {
      const activeCat = categories.find((c) => c.id === defaultCategoryId) || categories[0];
      setName("");
      setSlug("");
      setCategoryId(defaultCategoryId || (categories[0]?.id ?? ""));
      setDisplayOrder(1);
      setStatus("published");
      setIsSlugManual(false);

      setHeroHeading("");
      setHeroDescription("");
      setHeroImageUrl("");
      setHeroImageFile(null);
      setHeroMobileImageUrl("");
      setHeroMobileImageFile(null);

      setHighlightLabel((activeCat?.name || "EDUCATION").toUpperCase());
      setHighlightHeading("");
      setHighlightDescription("");

      setMissionHeading("Mission");
      setMissionDescription("");
      setMissionIcon("target");

      setBeneficiariesHeading("Beneficiaries");
      setBeneficiariesDescription("");
      setBeneficiariesIcon("users");

      setStats([{ value: "", label: "", icon: "school" }]);

      setStory1Title("");
      setStory1Description("");
      setStory1ImageUrl("");
      setStory1ImageFile(null);

      setStory2Title("");
      setStory2Description("");
      setStory2ImageUrl("");
      setStory2ImageFile(null);
      setStory2ButtonLabel("");
      setStory2ButtonUrl("");

      setWomenStoryHeading("");
      setWomenStoryTopDesc("");
      setWomenStoryImage1Url("");
      setWomenStoryImage1File(null);
      setWomenStoryImage2Url("");
      setWomenStoryImage2File(null);
      setWomenStoryBottomDesc("");

      setGrid4Heading("");
      setGrid4Description("");
      setGrid4Image1Url("");
      setGrid4Image1File(null);
      setGrid4Image2Url("");
      setGrid4Image2File(null);
      setGrid4Image3Url("");
      setGrid4Image3File(null);
      setGrid4Image4Url("");
      setGrid4Image4File(null);

      setGalleryHeading("Photo Gallery");
      setGalleryImages([]);
    }
    setErrors({});
  }, [isOpen, editingItem, defaultCategoryId, categories]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
    if (!heroHeading || heroHeading === name) {
      setHeroHeading(val);
    }
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManual(true);
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: undefined }));
    }
  };

  // Stats Handlers
  const handleAddStat = () => {
    setStats((prev) => [...prev, { value: "", label: "", icon: "school" }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStatChange = (
    index: number,
    field: "value" | "label" | "icon",
    val: string,
  ) => {
    setStats((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item)),
    );
  };

  // Gallery Handlers
  const handleAddPhotos = (newPhotos: InitiativeGalleryPhoto[]) => {
    setGalleryImages((prev) => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; slug?: string; categoryId?: string } = {};

    const trimmedName = name.trim();
    const trimmedSlug = (slug.trim() || slugify(trimmedName)).trim();

    if (!trimmedName) {
      newErrors.name = "Initiative name is required.";
      setActiveTab("basic");
    }

    if (!trimmedSlug) {
      newErrors.slug = "URL slug is required.";
      setActiveTab("basic");
    }

    if (!categoryId) {
      newErrors.categoryId = "Category selection is required.";
      setActiveTab("basic");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const cleanedStats = stats.filter(
        (s) => s.value.trim() !== "" || s.label.trim() !== "",
      );
      const cleanedPhotos = galleryImages.filter((p) => p.src.trim() !== "");

      onSave({
        name: trimmedName,
        slug: trimmedSlug,
        categoryId,
        displayOrder: Number(displayOrder) || 1,
        status,
        heroHeading: heroHeading.trim() || trimmedName,
        heroDescription: heroDescription.trim(),
        heroImageUrl: heroImageUrl.trim(),
        heroImageFile,
        heroMobileImageUrl: heroMobileImageUrl.trim(),
        heroMobileImageFile,
        highlightLabel: highlightLabel.trim(),
        highlightHeading: highlightHeading.trim(),
        highlightDescription: highlightDescription.trim(),
        missionHeading: missionHeading.trim(),
        missionDescription: missionDescription.trim(),
        missionIcon,
        beneficiariesHeading: beneficiariesHeading.trim(),
        beneficiariesDescription: beneficiariesDescription.trim(),
        beneficiariesIcon,
        stats: cleanedStats,
        story1Title: story1Title.trim(),
        story1Description: story1Description.trim(),
        story1ImageUrl: story1ImageUrl.trim(),
        story1ImageFile,
        story2Title: story2Title.trim(),
        story2Description: story2Description.trim(),
        story2ImageUrl: story2ImageUrl.trim(),
        story2ImageFile,
        story2ButtonLabel: story2ButtonLabel.trim(),
        story2ButtonUrl: story2ButtonUrl.trim(),
        womenStoryHeading: womenStoryHeading.trim(),
        womenStoryTopDesc: womenStoryTopDesc.trim(),
        womenStoryImage1Url: womenStoryImage1Url.trim(),
        womenStoryImage1File,
        womenStoryImage2Url: womenStoryImage2Url.trim(),
        womenStoryImage2File,
        womenStoryBottomDesc: womenStoryBottomDesc.trim(),
        grid4Heading: grid4Heading.trim(),
        grid4Description: grid4Description.trim(),
        grid4Image1Url: grid4Image1Url.trim(),
        grid4Image1File,
        grid4Image2Url: grid4Image2Url.trim(),
        grid4Image2File,
        grid4Image3Url: grid4Image3Url.trim(),
        grid4Image3File,
        grid4Image4Url: grid4Image4Url.trim(),
        grid4Image4File,
        galleryHeading: galleryHeading.trim() || "Photo Gallery",
        galleryImages: cleanedPhotos,
      });
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const activePhotosCount = galleryImages.filter((p) => p.src.trim()).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] font-figtree overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 bg-[#FAF8F4]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#9739A8] border border-[#E5E0D8] shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
                  {editingItem ? `Edit: ${editingItem.name}` : "Add New Initiative Page"}
                </h2>
                {selectedCategory && (
                  <span className="rounded-full bg-[#FAF8F4] border border-[#D9D3C9] px-2.5 py-0.5 text-[11px] font-semibold text-[#9739A8]">
                    {selectedCategory.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5F6C6D]">
                Upload banner images, configure icons & metrics, stories, and photo gallery.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#5F6C6D] hover:bg-white hover:text-[#0F1C1D] transition-colors cursor-pointer border border-transparent hover:border-[#E5E0D8]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#E5E0D8] bg-[#F4F1EA] px-6 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "basic"
                ? "border-[#9739A8] text-[#9739A8] bg-white rounded-t-lg font-bold"
                : "border-transparent text-[#5F6C6D] hover:text-[#0F1C1D]"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>1. Basic Info</span>
            {(errors.name || errors.slug || errors.categoryId) && (
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "hero"
                ? "border-[#9739A8] text-[#9739A8] bg-white rounded-t-lg font-bold"
                : "border-transparent text-[#5F6C6D] hover:text-[#0F1C1D]"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>2. Hero Banner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "stats"
                ? "border-[#9739A8] text-[#9739A8] bg-white rounded-t-lg font-bold"
                : "border-transparent text-[#5F6C6D] hover:text-[#0F1C1D]"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>3. Highlights & Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stories")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "stories"
                ? "border-[#9739A8] text-[#9739A8] bg-white rounded-t-lg font-bold"
                : "border-transparent text-[#5F6C6D] hover:text-[#0F1C1D]"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>4. Stories & Media</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "gallery"
                ? "border-[#9739A8] text-[#9739A8] bg-white rounded-t-lg font-bold"
                : "border-transparent text-[#5F6C6D] hover:text-[#0F1C1D]"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>5. Photo Gallery</span>
            {activePhotosCount > 0 && (
              <span className="rounded-full bg-[#9739A8]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#9739A8]">
                {activePhotosCount}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                  Category & Template <span className="text-rose-600">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2.5 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden transition-all"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.slug})
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <p className="mt-1.5 text-[11px] text-[#5F6C6D]">
                    Renders with template:{" "}
                    <span className="font-semibold text-[#9739A8]">
                      {selectedCategory.slug.charAt(0).toUpperCase() +
                        selectedCategory.slug.slice(1)}
                      Template.tsx
                    </span>
                  </p>
                )}
                {errors.categoryId && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                  Initiative Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Adarsha Academy KRS"
                  className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* URL Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#0F1C1D]">
                    URL Path (Slug) <span className="text-rose-600">*</span>
                  </label>
                  {!isSlugManual && (
                    <span className="text-[11px] text-[#8A847A] italic">
                      Auto-generated from name
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8A847A]">
                    /
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="adarsha-academy-krs"
                    className="w-full rounded-lg border border-[#D9D3C9] bg-white pl-6 pr-3.5 py-2.5 font-mono text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
                  />
                </div>
                {slug && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#5F6C6D]">
                    <Globe className="h-3 w-3 text-[#9739A8]" />
                    <span>Live Page: </span>
                    <a
                      href={`/${slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[#9739A8] hover:underline inline-flex items-center gap-0.5"
                    >
                      /{slug}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                )}
                {errors.slug && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">
                    {errors.slug}
                  </p>
                )}
              </div>

              {/* Display Order & Publication Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2.5 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden transition-all"
                  />
                  <p className="mt-1 text-[11px] text-[#8A847A]">
                    Lower numbers display first within this category.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ContentStatus)}
                    className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2.5 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden transition-all"
                  >
                    <option value="published">Published (Visible to public)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO BANNER (Image Upload) */}
          {activeTab === "hero" && (
            <div className="space-y-5">
              <div className="rounded-xl bg-[#FAF8F4] p-3.5 border border-[#E5E0D8]">
                <p className="text-xs text-[#5F6C6D]">
                  Upload high-resolution banner images for desktop and mobile displays.
                </p>
              </div>

              {/* Hero Heading */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                  Hero Banner Heading
                </label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  placeholder={name || "e.g. Adarsha Academy KRS"}
                  className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
                />
              </div>

              {/* Hero Description */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                  Hero Tagline / Description
                </label>
                <textarea
                  rows={3}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="e.g. Creating opportunities to learn, grow and build brighter futures for rural children and communities."
                  className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
                />
              </div>

              {/* Desktop Banner Image Upload */}
              <ImageUploadBox
                label="Desktop Banner Image"
                sublabel="Primary full-width header image"
                previewUrl={heroImageUrl}
                onFileSelect={(file) => {
                  setHeroImageFile(file);
                  setHeroImageUrl(URL.createObjectURL(file));
                }}
                onRemove={() => {
                  setHeroImageFile(null);
                  setHeroImageUrl("");
                }}
              />

              {/* Mobile Banner Image Upload */}
              <ImageUploadBox
                label="Mobile Banner Image (Optional)"
                sublabel="Vertical/mobile cropped image"
                previewUrl={heroMobileImageUrl}
                onFileSelect={(file) => {
                  setHeroMobileImageFile(file);
                  setHeroMobileImageUrl(URL.createObjectURL(file));
                }}
                onRemove={() => {
                  setHeroMobileImageFile(null);
                  setHeroMobileImageUrl("");
                }}
              />
            </div>
          )}

          {/* TAB 3: HIGHLIGHTS & STATS (With Icon Pickers) */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              {/* Feature Highlight Section: Left-Side Header */}
              <div className="rounded-xl border border-[#E5E0D8] p-4 bg-[#FAF8F4] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F1C1D]">
                  <Layers className="h-3.5 w-3.5 text-[#9739A8]" />
                  <span>Feature Highlight Section: Left-Side Header</span>
                </div>
                <p className="text-[11px] text-[#5F6C6D]">
                  This section tag, main title, and narrative description appear prominently on the left side, directly beside the highlight cards.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Section Tag / Label
                    </label>
                    <input
                      type="text"
                      value={highlightLabel}
                      onChange={(e) => setHighlightLabel(e.target.value)}
                      placeholder="e.g. EDUCATION or WOMEN EMPOWERMENT"
                      className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D] uppercase"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Section Main Heading
                    </label>
                    <input
                      type="text"
                      value={highlightHeading}
                      onChange={(e) => setHighlightHeading(e.target.value)}
                      placeholder="e.g. Adarsha Academy or Self Help Group & Federation"
                      className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Section Narrative Description
                    </label>
                    <textarea
                      rows={2}
                      value={highlightDescription}
                      onChange={(e) => setHighlightDescription(e.target.value)}
                      placeholder="e.g. A rural private school providing education to children from villages in the vicinity of the Krishnarajasagara (KRS) Dam."
                      className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                    />
                  </div>
                </div>
              </div>

              {/* Highlight Card 1: Mission */}
              <div className="rounded-xl border border-[#E5E0D8] p-4 bg-[#FAF8F4] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F1C1D]">
                    <Sparkles className="h-3.5 w-3.5 text-[#9739A8]" />
                    <span>Highlight Card 1 (Mission / Purpose)</span>
                  </div>
                  <IconPickerDropdown
                    value={missionIcon}
                    onChange={(iconKey) => setMissionIcon(iconKey)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Label / Title
                    </label>
                    <input
                      type="text"
                      value={missionHeading}
                      onChange={(e) => setMissionHeading(e.target.value)}
                      placeholder="e.g. Mission"
                      className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={missionDescription}
                      onChange={(e) => setMissionDescription(e.target.value)}
                      placeholder="e.g. Providing quality primary education for children in rural communities."
                      className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                    />
                  </div>
                </div>
              </div>

              {/* Highlight Card 2: Beneficiaries */}
              <div className="rounded-xl border border-[#E5E0D8] p-4 bg-[#FAF8F4] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F1C1D]">
                    <Sparkles className="h-3.5 w-3.5 text-[#9739A8]" />
                    <span>Highlight Card 2 (Beneficiaries / Reach)</span>
                  </div>
                  <IconPickerDropdown
                    value={beneficiariesIcon}
                    onChange={(iconKey) => setBeneficiariesIcon(iconKey)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Label / Title
                    </label>
                    <input
                      type="text"
                      value={beneficiariesHeading}
                      onChange={(e) => setBeneficiariesHeading(e.target.value)}
                      placeholder="e.g. Beneficiaries"
                      className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={beneficiariesDescription}
                      onChange={(e) => setBeneficiariesDescription(e.target.value)}
                      placeholder="e.g. More than 380 students since 2010"
                      className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                    />
                  </div>
                </div>
              </div>

              {/* Metric Counter Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#0F1C1D]">
                      Key Metric Numbers & Counters
                    </h3>
                    <p className="text-[11px] text-[#5F6C6D]">
                      Pick an icon and add numbers (e.g. 380+ Students, 100% Pass Rate).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#FAF8F4] border border-[#D9D3C9] px-2.5 py-1.5 text-xs font-semibold text-[#9739A8] hover:bg-[#F4F1EA] transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Stat</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center gap-2.5 rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-2xs"
                    >
                      {/* Icon Picker for Stat */}
                      <IconPickerDropdown
                        value={stat.icon || "school"}
                        onChange={(iconKey) =>
                          handleStatChange(idx, "icon", iconKey)
                        }
                      />

                      {/* Metric Value */}
                      <div className="sm:w-1/3">
                        <label className="block text-[10px] font-semibold text-[#8A847A] mb-0.5">
                          Metric Value (e.g. 380+, ₹9.14 Cr)
                        </label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) =>
                            handleStatChange(idx, "value", e.target.value)
                          }
                          placeholder="e.g. 380+"
                          className="w-full rounded-md border border-[#D9D3C9] px-2.5 py-1.5 font-bold font-figtree text-xs text-[#9739A8] focus:outline-hidden"
                        />
                      </div>

                      {/* Metric Label */}
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-[#8A847A] mb-0.5">
                          Metric Label / Description
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) =>
                            handleStatChange(idx, "label", e.target.value)
                          }
                          placeholder="e.g. Students Since 2010"
                          className="w-full rounded-md border border-[#D9D3C9] px-2.5 py-1.5 font-figtree text-xs text-[#0F1C1D] focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveStat(idx)}
                        disabled={stats.length === 1 && !stat.value && !stat.label}
                        className="self-end sm:self-center rounded-md p-2 text-[#8A847A] hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove stat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STORIES & MEDIA (With Image Uploads) */}
          {activeTab === "stories" && (() => {
            const isTwoImageCategory =
              selectedCategory?.slug === "women-empowerment" ||
              selectedCategory?.slug === "skills-employment" ||
              selectedCategory?.slug === "skills-and-employment";

            const isGrid4Category =
              selectedCategory?.slug === "health" ||
              selectedCategory?.slug === "model-village";

            return (
              <div className="space-y-6">
                {/* Layout Mode Information */}
                <div className="rounded-xl bg-[#FAF8F4] p-3.5 border border-[#E5E0D8]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F1C1D]">
                      Layout Mode: {selectedCategory?.name || "Education"}
                    </span>
                    <span className="rounded-md bg-[#9739A8]/10 text-[#9739A8] px-2 py-0.5 text-[10px] font-semibold">
                      {isTwoImageCategory
                        ? "2-Image Story Section"
                        : isGrid4Category
                        ? "4-Image 2x2 Grid Section"
                        : "Standard 2-Story Layout"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#5F6C6D]">
                    {isTwoImageCategory
                      ? "Strictly follows the design with Story 1 + the 2-image side-by-side story showcase (WomenOpportunities / Building Skills)."
                      : isGrid4Category
                      ? "Strictly follows the Healthcare / Model Village design with Story 1 + the 4-image 2x2 awareness grid."
                      : "Strictly follows the Education design with Story 1 (image right) and Story 2 (image left with Gallery action CTA button)."}
                  </p>
                </div>

                {/* Story 1 (Always Available) */}
                <div className="rounded-xl border border-[#E5E0D8] p-4 bg-white space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F1C1D]">
                    <BookOpen className="h-4 w-4 text-[#9739A8]" />
                    <span>
                      Story 1: {selectedCategory?.slug === "women-empowerment" ? "The Power of Collective Action" : "Opportunities & Setting"} (Image Right)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Story 1 Title
                    </label>
                    <input
                      type="text"
                      value={story1Title}
                      onChange={(e) => setStory1Title(e.target.value)}
                      placeholder="e.g. Education in a Rural Setting or The Power of Collective Action"
                      className="w-full rounded-lg border border-[#D9D3C9] px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                      Story 1 Description / Paragraphs
                    </label>
                    <textarea
                      rows={3}
                      value={story1Description}
                      onChange={(e) => setStory1Description(e.target.value)}
                      placeholder="Enter narrative paragraphs describing this initiative's impact and work..."
                      className="w-full rounded-lg border border-[#D9D3C9] px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                    />
                  </div>

                  {/* Story 1 Image Upload */}
                  <ImageUploadBox
                    label="Story 1 Photo"
                    sublabel="Action photo for Story 1"
                    previewUrl={story1ImageUrl}
                    onFileSelect={(file) => {
                      setStory1ImageFile(file);
                      setStory1ImageUrl(URL.createObjectURL(file));
                    }}
                    onRemove={() => {
                      setStory1ImageFile(null);
                      setStory1ImageUrl("");
                    }}
                  />
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    Case A: Women Empowerment OR Skills & Employment (2-Image Story Section: WomenOpportunities)
                    ───────────────────────────────────────────────────────────── */}
                {isTwoImageCategory && (
                  <div className="rounded-xl border border-[#9739A8]/40 bg-[#FAF8F4]/60 p-4 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#9739A8]">
                        <Heart className="h-4 w-4" />
                        <span>
                          {selectedCategory?.slug === "women-empowerment"
                            ? "Women Empowerment: 2-Image Story Section (WomenOpportunities)"
                            : "Skills & Employment: 2-Image Story Section (Building Skills for a Brighter Future)"}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold bg-[#9739A8]/10 text-[#9739A8] px-2 py-0.5 rounded-md">
                        2 Images Side-by-Side
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={womenStoryHeading}
                        onChange={(e) => setWomenStoryHeading(e.target.value)}
                        placeholder={
                          selectedCategory?.slug === "women-empowerment"
                            ? "e.g. Creating Financial Independence for Rural Women"
                            : "e.g. Building Skills for a Brighter Future"
                        }
                        className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                        Top Narrative Description (Displayed above the 2 images)
                      </label>
                      <textarea
                        rows={2}
                        value={womenStoryTopDesc}
                        onChange={(e) => setWomenStoryTopDesc(e.target.value)}
                        placeholder={
                          selectedCategory?.slug === "women-empowerment"
                            ? "e.g. IHDUA's Self-Help Groups help rural women save together, keep group records and take part in collective decisions..."
                            : "e.g. IHDUA’s Skill Development Project provides rural students with training in computer skills, Tally, GST and spoken English..."
                        }
                        className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                      />
                    </div>

                    {/* 2 Images Upload Side-by-Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ImageUploadBox
                        label="Story Photo 1 (Left Image)"
                        sublabel="First photo in 2-image layout"
                        previewUrl={womenStoryImage1Url}
                        onFileSelect={(file) => {
                          setWomenStoryImage1File(file);
                          setWomenStoryImage1Url(URL.createObjectURL(file));
                        }}
                        onRemove={() => {
                          setWomenStoryImage1File(null);
                          setWomenStoryImage1Url("");
                        }}
                      />
                      <ImageUploadBox
                        label="Story Photo 2 (Right Image)"
                        sublabel="Second photo in 2-image layout"
                        previewUrl={womenStoryImage2Url}
                        onFileSelect={(file) => {
                          setWomenStoryImage2File(file);
                          setWomenStoryImage2Url(URL.createObjectURL(file));
                        }}
                        onRemove={() => {
                          setWomenStoryImage2File(null);
                          setWomenStoryImage2Url("");
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                        Bottom Narrative Description (Displayed below the 2 images)
                      </label>
                      <textarea
                        rows={2}
                        value={womenStoryBottomDesc}
                        onChange={(e) => setWomenStoryBottomDesc(e.target.value)}
                        placeholder={
                          selectedCategory?.slug === "women-empowerment"
                            ? "e.g. IHDUA's Microfinance Initiative makes it possible for rural women to become informed financial decision-makers..."
                            : "e.g. The organisation also offers vocational training in tailoring, Aari work, Lippan art, Vision Assistant training and Thanjavur painting..."
                        }
                        className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                      />
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    Case B: Health or Model Village (4-Image 2x2 Grid: AwarenessGallery)
                    ───────────────────────────────────────────────────────────── */}
                {isGrid4Category && (
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50/20 p-4 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <Camera className="h-4 w-4" />
                        <span>
                          {selectedCategory?.slug === "health" ? "Healthcare Awareness" : "Sustainable Village"}: 4-Image 2x2 Grid
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        4 Images in 2x2 Grid
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={grid4Heading}
                        onChange={(e) => setGrid4Heading(e.target.value)}
                        placeholder={
                          selectedCategory?.slug === "health"
                            ? "e.g. Creating Awareness Through Education"
                            : "e.g. Building a Sustainable Village"
                        }
                        className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                        Narrative Descriptions (Paragraphs)
                      </label>
                      <textarea
                        rows={3}
                        value={grid4Description}
                        onChange={(e) => setGrid4Description(e.target.value)}
                        placeholder="Enter narrative paragraphs describing the field activities or awareness sessions..."
                        className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                      />
                    </div>

                    {/* 4 Image Upload Boxes in a 2x2 Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ImageUploadBox
                        label="Grid Photo 1 (Top-Left)"
                        sublabel="Awareness moment 1"
                        previewUrl={grid4Image1Url}
                        onFileSelect={(file) => {
                          setGrid4Image1File(file);
                          setGrid4Image1Url(URL.createObjectURL(file));
                        }}
                        onRemove={() => {
                          setGrid4Image1File(null);
                          setGrid4Image1Url("");
                        }}
                      />
                      <ImageUploadBox
                        label="Grid Photo 2 (Top-Right)"
                        sublabel="Awareness moment 2"
                        previewUrl={grid4Image2Url}
                        onFileSelect={(file) => {
                          setGrid4Image2File(file);
                          setGrid4Image2Url(URL.createObjectURL(file));
                        }}
                        onRemove={() => {
                          setGrid4Image2File(null);
                          setGrid4Image2Url("");
                        }}
                      />
                      <ImageUploadBox
                        label="Grid Photo 3 (Bottom-Left)"
                        sublabel="Awareness moment 3"
                        previewUrl={grid4Image3Url}
                        onFileSelect={(file) => {
                          setGrid4Image3File(file);
                          setGrid4Image3Url(URL.createObjectURL(file));
                        }}
                        onRemove={() => {
                          setGrid4Image3File(null);
                          setGrid4Image3Url("");
                        }}
                      />
                      <ImageUploadBox
                        label="Grid Photo 4 (Bottom-Right)"
                        sublabel="Awareness moment 4"
                        previewUrl={grid4Image4Url}
                        onFileSelect={(file) => {
                          setGrid4Image4File(file);
                          setGrid4Image4Url(URL.createObjectURL(file));
                        }}
                        onRemove={() => {
                          setGrid4Image4File(null);
                          setGrid4Image4Url("");
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    Case C: Education (Story 2: Image Left + Action Button)
                    ───────────────────────────────────────────────────────────── */}
                {!isTwoImageCategory && !isGrid4Category && (
                  <div className="rounded-xl border border-[#E5E0D8] p-4 bg-white space-y-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0F1C1D]">
                      <BookOpen className="h-4 w-4 text-[#9739A8]" />
                      <span>Story 2: In-Depth Narrative with Action CTA (Image Left)</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                        Story 2 Title
                      </label>
                      <input
                        type="text"
                        value={story2Title}
                        onChange={(e) => setStory2Title(e.target.value)}
                        placeholder="e.g. Education for Rural Children"
                        className="w-full rounded-lg border border-[#D9D3C9] px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                        Story 2 Description / Paragraphs
                      </label>
                      <textarea
                        rows={3}
                        value={story2Description}
                        onChange={(e) => setStory2Description(e.target.value)}
                        placeholder="Enter in-depth story paragraphs..."
                        className="w-full rounded-lg border border-[#D9D3C9] px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                      />
                    </div>

                    {/* Story 2 Image Upload */}
                    <ImageUploadBox
                      label="Story 2 Photo"
                      sublabel="Featured photo for Story 2"
                      previewUrl={story2ImageUrl}
                      onFileSelect={(file) => {
                        setStory2ImageFile(file);
                        setStory2ImageUrl(URL.createObjectURL(file));
                      }}
                      onRemove={() => {
                        setStory2ImageFile(null);
                        setStory2ImageUrl("");
                      }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                          Action Button Label (Optional)
                        </label>
                        <input
                          type="text"
                          value={story2ButtonLabel}
                          onChange={(e) => setStory2ButtonLabel(e.target.value)}
                          placeholder="e.g. View Gallery or Learn More"
                          className="w-full rounded-lg border border-[#D9D3C9] px-3 py-2 font-figtree text-xs text-[#0F1C1D]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#5F6C6D] mb-1">
                          Action Button Link URL
                        </label>
                        <input
                          type="text"
                          value={story2ButtonUrl}
                          onChange={(e) => setStory2ButtonUrl(e.target.value)}
                          placeholder="e.g. /adarsha-academy-krs/gallery"
                          className="w-full rounded-lg border border-[#D9D3C9] px-3 py-2 font-mono text-xs text-[#0F1C1D]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 5: PHOTO GALLERY (Pure Image Uploads, No Text) */}
          {activeTab === "gallery" && (
            <div className="space-y-5">
              <div className="rounded-xl bg-[#FAF8F4] p-3.5 border border-[#E5E0D8]">
                <p className="text-xs text-[#5F6C6D]">
                  Select or drag & drop multiple photos from your computer to create an interactive photo gallery carousel on this page. No text or captions needed.
                </p>
              </div>

              {/* Gallery Section Heading */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                  Gallery Section Heading
                </label>
                <input
                  type="text"
                  value={galleryHeading}
                  onChange={(e) => setGalleryHeading(e.target.value)}
                  placeholder="e.g. Photo Gallery or Moments From The Field"
                  className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2.5 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden transition-all"
                />
              </div>

              {/* Multi-Image Upload & Photo Grid */}
              <MultiImageGalleryUpload
                photos={galleryImages}
                onAddPhotos={handleAddPhotos}
                onRemovePhoto={handleRemovePhoto}
              />
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
            <div className="flex items-center gap-2">
              {activeTab !== "basic" && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === "gallery") setActiveTab("stories");
                    else if (activeTab === "stories") setActiveTab("stats");
                    else if (activeTab === "stats") setActiveTab("hero");
                    else if (activeTab === "hero") setActiveTab("basic");
                  }}
                  className="rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs font-semibold text-[#5F6C6D] hover:text-[#0F1C1D] transition-colors cursor-pointer"
                >
                  ← Back
                </button>
              )}

              {activeTab !== "gallery" && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === "basic") setActiveTab("hero");
                    else if (activeTab === "hero") setActiveTab("stats");
                    else if (activeTab === "stats") setActiveTab("stories");
                    else if (activeTab === "stories") setActiveTab("gallery");
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] px-3.5 py-2 font-figtree text-xs font-semibold text-[#0F1C1D] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={actionLoading}
                className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-2 font-figtree text-xs font-semibold text-[#5F6C6D] hover:text-[#0F1C1D] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-5 py-2 font-figtree text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] disabled:opacity-50 transition-all cursor-pointer"
              >
                {actionLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>{editingItem ? "Save Changes" : "Create Initiative Page"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
