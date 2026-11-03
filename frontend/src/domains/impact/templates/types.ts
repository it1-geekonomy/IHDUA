export interface ImpactSectionItemData {
  id?: string;
  value?: string | null;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  iconUrl?: string | null;
  displayOrder?: number;
}

export interface ImpactSectionData {
  id?: string;
  sectionType: 'HERO' | 'FEATURES' | 'CONTENT' | 'GALLERY' | 'STATS' | string;
  layout?: string | null; // e.g. 'IMAGE_LEFT' | 'IMAGE_RIGHT' | 'CARDS' | 'STEPS' | 'GRID_4'
  label?: string | null;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  settings?: Record<string, any>;
  displayOrder?: number;
  items?: ImpactSectionItemData[];
}

export interface ImpactInitiativeData {
  id?: string;
  name: string;
  slug: string;
  category?: {
    id?: string;
    name: string;
    slug: string;
    templateType?: string;
  };
  sections?: ImpactSectionData[];

  // Dynamic fields from CMS
  highlightLabel?: string;
  highlightHeading?: string;
  highlightDescription?: string;

  story1Title?: string;
  story1Description?: string;
  story1ImageUrl?: string;

  story2Title?: string;
  story2Description?: string;
  story2ImageUrl?: string;
  story2ButtonLabel?: string;
  story2ButtonUrl?: string;

  womenStoryHeading?: string;
  womenStoryTopDesc?: string;
  womenStoryImage1Url?: string;
  womenStoryImage2Url?: string;
  womenStoryBottomDesc?: string;

  grid4Heading?: string;
  grid4Description?: string;
  grid4Image1Url?: string;
  grid4Image2Url?: string;
  grid4Image3Url?: string;
  grid4Image4Url?: string;
}

export interface CategoryTemplateProps {
  data?: ImpactInitiativeData;
}

