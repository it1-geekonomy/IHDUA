import type {
  AdminImpactCategoryItem,
  AdminImpactInitiativeItem,
  ContentStatus,
} from "@/domains/admin/lib/api";

export type { AdminImpactCategoryItem, AdminImpactInitiativeItem, ContentStatus };

export interface CategoryGroup {
  category: AdminImpactCategoryItem;
  initiatives: AdminImpactInitiativeItem[];
}

export interface InitiativeStatItem {
  value: string;
  label: string;
  icon?: string;
}

export interface InitiativeGalleryPhoto {
  src: string;
  file?: File;
}

export interface InitiativeFormValues {
  name: string;
  slug: string;
  categoryId: string;
  displayOrder: number;
  status: ContentStatus;

  // Hero Banner
  heroHeading?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  heroImageFile?: File | null;
  heroMobileImageUrl?: string;
  heroMobileImageFile?: File | null;

  // Feature Highlight Section (Left side: Label, Heading, Description)
  highlightLabel?: string;
  highlightHeading?: string;
  highlightDescription?: string;

  // Feature Highlight Cards (Right side: Mission, Beneficiaries with icons)
  missionHeading?: string;
  missionDescription?: string;
  missionIcon?: string;
  beneficiariesHeading?: string;
  beneficiariesDescription?: string;
  beneficiariesIcon?: string;
  stats?: InitiativeStatItem[];

  // Story 1 (Opportunity / In Action - 1 Image Right)
  story1Title?: string;
  story1Description?: string;
  story1ImageUrl?: string;
  story1ImageFile?: File | null;

  // Story 2 (Community Story with Action CTA - 1 Image Left - Education)
  story2Title?: string;
  story2Description?: string;
  story2ImageUrl?: string;
  story2ImageFile?: File | null;
  story2ButtonLabel?: string;
  story2ButtonUrl?: string;

  // Women Empowerment Specific: 2-Image Story Section (WomenOpportunities)
  womenStoryHeading?: string;
  womenStoryTopDesc?: string;
  womenStoryImage1Url?: string;
  womenStoryImage1File?: File | null;
  womenStoryImage2Url?: string;
  womenStoryImage2File?: File | null;
  womenStoryBottomDesc?: string;

  // Health / Model Village Specific: 4-Image Grid Section (AwarenessGallery)
  grid4Heading?: string;
  grid4Description?: string;
  grid4Image1Url?: string;
  grid4Image1File?: File | null;
  grid4Image2Url?: string;
  grid4Image2File?: File | null;
  grid4Image3Url?: string;
  grid4Image3File?: File | null;
  grid4Image4Url?: string;
  grid4Image4File?: File | null;

  // Gallery (Pure Image Uploads, no captions)
  galleryHeading?: string;
  galleryImages?: InitiativeGalleryPhoto[];
}
