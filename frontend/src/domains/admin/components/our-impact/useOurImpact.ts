"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createAdminImpactInitiative,
  fetchAdminImpactCategories,
  fetchAdminImpactInitiatives,
  updateAdminImpactInitiative,
  type AdminImpactCategoryItem,
  type AdminImpactInitiativeItem,
} from "@/domains/admin/lib/api";
import type { CategoryGroup, InitiativeFormValues } from "./types";

const DEFAULT_CATEGORIES: AdminImpactCategoryItem[] = [
  {
    id: "cat-edu",
    name: "Education",
    slug: "education",
    displayOrder: 1,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-women",
    name: "Women Empowerment",
    slug: "women-empowerment",
    displayOrder: 2,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-skills",
    name: "Skills & Employment",
    slug: "skills-employment",
    displayOrder: 3,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-village",
    name: "Model Village",
    slug: "model-village",
    displayOrder: 4,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-health",
    name: "Health",
    slug: "health",
    displayOrder: 5,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_INITIATIVES: AdminImpactInitiativeItem[] = [
  {
    id: "init-adarsha",
    categoryId: "cat-edu",
    name: "Adarsha Academy KRS",
    slug: "adarsha-academy-krs",
    displayOrder: 1,
    status: "published",
    heroHeading: "Adarsha Academy",
    heroDescription:
      "A rural private school providing education to children from villages in the vicinity of the Krishnarajasagara (KRS) Dam.",
    heroImageUrl: "/Rural Education/Frame 648 (7).png",
    heroMobileImageUrl: "/Rural Education/Frame 695.png",
    missionHeading: "Mission",
    missionDescription:
      "Providing quality primary education for children in rural communities.",
    beneficiariesHeading: "Beneficiaries",
    beneficiariesDescription: "More than 380 students since 2010",
    stats: [
      { value: "380+", label: "Students Since 2010" },
      { value: "100%", label: "Pass Rate" },
      { value: "7", label: "Villages Served" },
    ],
    story1Title: "Education in a Rural Setting",
    story1Description:
      "The Adarsha Academy is a kindergarten through 8th grade rural private school providing full-time education to children from seven villages.",
    story1ImageUrl: "/Rural Education/Rectangle 51 (2).png",
    story2Title: "Education for Rural Children",
    story2Description:
      "Equal learning opportunities with science labs, computer education, and extracurricular activities.",
    story2ImageUrl: "/Rural Education/Rectangle 51 (3).png",
    story2ButtonLabel: "View Gallery",
    story2ButtonUrl: "/adarsha-academy-krs/gallery",
    galleryHeading: "Adarsha Academy Campus & Moments",
    galleryImages: [
      { src: "/Rural Education/Frame 648 (7).png", alt: "Adarsha Academy Main Campus" },
      { src: "/Rural Education/Rectangle 51 (2).png", alt: "Classroom Learning Sessions" },
      { src: "/Rural Education/Rectangle 51 (3).png", alt: "Science Laboratory Experiments" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-vinayaka",
    categoryId: "cat-edu",
    name: "Vinayaka Jnana Vidyashale",
    slug: "vinayakagnana-vidyashale-mysore",
    displayOrder: 2,
    status: "published",
    heroHeading: "Vinayaka Jnana Vidyashale",
    heroDescription:
      "Rural community school in Mysore providing affordable English and Kannada medium education.",
    heroImageUrl: "/Rural Education/Frame 648 (7).png",
    missionHeading: "Mission",
    missionDescription:
      "Empowering underprivileged children through comprehensive primary education and holistic care.",
    beneficiariesHeading: "Beneficiaries",
    beneficiariesDescription: "250+ Children supported yearly",
    stats: [
      { value: "250+", label: "Students Supported" },
      { value: "15+", label: "Dedicated Teachers" },
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-shg",
    categoryId: "cat-women",
    name: "Self-Help Group & Federation",
    slug: "self-help-group-federation",
    displayOrder: 1,
    status: "published",
    heroHeading: "Self-Help Groups & Federation",
    heroDescription:
      "Empowering rural women through grassroots financial collectives and community leadership.",
    heroImageUrl: "/Rural Education/Rectangle 51 (2).png",
    missionHeading: "Federation Model",
    missionDescription:
      "Fostering financial self-reliance through weekly savings, micro-credit, and solidarity.",
    beneficiariesHeading: "Active Members",
    beneficiariesDescription: "7,578+ Rural women across 18 Federations",
    stats: [
      { value: "7,578+", label: "Women Members" },
      { value: "697+", label: "SHG Groups Formed" },
      { value: "18", label: "Registered Federations" },
    ],
    story1Title: "Financial Autonomy at Grassroots",
    story1Description:
      "Weekly savings circles liberate rural families from predatory local moneylenders.",
    story1ImageUrl: "/Rural Education/Rectangle 51 (2).png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-micro",
    categoryId: "cat-women",
    name: "Microfinance Initiatives",
    slug: "micro-finance-initiatives",
    displayOrder: 2,
    status: "published",
    heroHeading: "Microfinance & Bank Credit Linkages",
    heroDescription:
      "Connecting rural women entrepreneurs to formal bank loans for sustainable livelihood creation.",
    heroImageUrl: "/Rural Education/Rectangle 51 (3).png",
    missionHeading: "Credit Access",
    missionDescription:
      "Enabling women to fund dairy farms, grocery stores, and tailoring micro-enterprises.",
    beneficiariesHeading: "Total Credit",
    beneficiariesDescription: "₹9.14+ Crores in bank loans facilitated",
    stats: [
      { value: "₹9.14 Cr", label: "Loans Facilitated" },
      { value: "218+", label: "Bank Credit Linkages" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-youth",
    categoryId: "cat-skills",
    name: "Youth Skill Development",
    slug: "youth",
    displayOrder: 1,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-women-skill",
    categoryId: "cat-skills",
    name: "Women / Stitching Unit",
    slug: "stitching-unit",
    displayOrder: 2,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-rejuvenation",
    categoryId: "cat-village",
    name: "Rejuvenation of Villages",
    slug: "rejuvenation-of-villages",
    displayOrder: 1,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-farmers",
    categoryId: "cat-village",
    name: "Farmers",
    slug: "farmers",
    displayOrder: 2,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-green",
    categoryId: "cat-village",
    name: "Increase the Green Cover",
    slug: "increase-the-green-cover",
    displayOrder: 3,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-health-aware",
    categoryId: "cat-health",
    name: "Health Awareness",
    slug: "health-awareness",
    displayOrder: 1,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-health-camps",
    categoryId: "cat-health",
    name: "Health Camps",
    slug: "health-camps",
    displayOrder: 2,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useOurImpact() {
  const { token } = useAdminAuth();

  const [categories, setCategories] = useState<AdminImpactCategoryItem[]>([]);
  const [initiatives, setInitiatives] = useState<AdminImpactInitiativeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminImpactInitiativeItem | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string | undefined>(undefined);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catsRes, initsRes] = await Promise.all([
        fetchAdminImpactCategories(token),
        fetchAdminImpactInitiatives(token, { limit: 100 }),
      ]);

      const mergedCats = catsRes && catsRes.length > 0 ? catsRes : DEFAULT_CATEGORIES;
      const mergedInits = initsRes?.data && initsRes.data.length > 0 ? initsRes.data : DEFAULT_INITIATIVES;

      setCategories(mergedCats);
      setInitiatives(mergedInits);
    } catch {
      // Graceful fallback to default screen initiatives if API is still migrating
      setCategories(DEFAULT_CATEGORIES);
      setInitiatives(DEFAULT_INITIATIVES);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-dismiss success message
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const openCreate = (catId?: string) => {
    setEditingItem(null);
    setTargetCategoryId(catId);
    setIsEditorOpen(true);
  };

  const openEdit = (item: AdminImpactInitiativeItem) => {
    setEditingItem(item);
    setTargetCategoryId(item.categoryId);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
    setTargetCategoryId(undefined);
  };

  const handleSave = async (values: InitiativeFormValues) => {
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem && token) {
        await updateAdminImpactInitiative(token, editingItem.id, values);
        setSuccessMessage(`Updated initiative "${values.name}" successfully.`);
      } else if (token) {
        await createAdminImpactInitiative(token, values);
        setSuccessMessage(`Created initiative "${values.name}" successfully.`);
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save initiative.");
    } finally {
      setActionLoading(false);
    }
  };

  // Group initiatives under categories
  const filteredInitiatives = initiatives.filter((init) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      init.name.toLowerCase().includes(term) ||
      init.slug.toLowerCase().includes(term)
    );
  });

  const categoryGroups: CategoryGroup[] = categories.map((cat) => {
    const inits = filteredInitiatives
      .filter((i) => i.categoryId === cat.id || i.category?.slug === cat.slug)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return {
      category: cat,
      initiatives: inits,
    };
  });

  return {
    categories,
    initiatives,
    categoryGroups,
    loading,
    actionLoading,
    error,
    successMessage,
    searchTerm,
    setSearchTerm,
    isEditorOpen,
    editingItem,
    targetCategoryId,
    loadData,
    openCreate,
    openEdit,
    closeEditor,
    handleSave,
  };
}

