export interface BlogSection {
  heading?: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  image: string;
  imageAlt: string;
  excerpt?: string;
  leadParagraph?: string;
  canonicalUrl?: string;
  contentSections?: BlogSection[];
}
