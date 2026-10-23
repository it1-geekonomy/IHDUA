export const DOCUMENTS_LABEL = "Transparency";
export const DOCUMENTS_HEADING = "Our Documents";
export const DOCUMENTS_DESCRIPTION =
  "We are committed to transparency and accountability. Access our key organizational documents and annual reports to learn more about our governance, compliance and progress.";

// Number of PDFs shown per card. Pagination appears only when a card has more than this.
export const DOCUMENTS_PAGE_SIZE = 4;

export const PDF_ICON = "/aboutus/pdf.png";

export type DocumentVariant = "organizational" | "annual";

export type DocumentFile = {
  id: string | number;
  title: string;
  url: string; // PDF url coming from the CMS
};

export type DocumentGroup = {
  id: string | number;
  variant: DocumentVariant;
  title: string;
  description: string;
  items: DocumentFile[];
};

// Static theme per card type (colors + icons). Content comes from the CMS.
export const DOCUMENT_THEMES: Record<
  DocumentVariant,
  {
    card: string;
    headerIconBg: string;
    headerIcon: string;
    button: string;
    buttonIcon: string;
    pageActive: string;
    pageInactive: string;
  }
> = {
  organizational: {
    card: "bg-[#FAF6FD] border-[#F5E8FF]",
    headerIconBg: "bg-[#E6D9F0]",
    headerIcon: "/aboutus/arrowdown1.png",
    button: "bg-[#E6D9F0]",
    buttonIcon: "/aboutus/download1.png",
    pageActive: "bg-[#E6D9F0] text-[#311645]",
    pageInactive: "text-[#7E7783] hover:bg-[#E6D9F0]/50",
  },
  annual: {
    card: "bg-[#FEFBF7] border-[#FFF3E3]",
    headerIconBg: "bg-[#E5DACB]",
    headerIcon: "/aboutus/arrowdown2.png",
    button: "bg-[#E5DACB]",
    buttonIcon: "/aboutus/download2.png",
    pageActive: "bg-[#E5DACB] text-[#311645]",
    pageInactive: "text-[#7E7783] hover:bg-[#E5DACB]/50",
  },
};

// Dummy data. Replace with CMS data (same shape) by passing `groups` to <OurDocuments />.
export const DOCUMENT_GROUPS: DocumentGroup[] = [
  {
    id: "organizational",
    variant: "organizational",
    title: "Organizational Documents",
    description: "Key registrations and compliance documents.",
    items: [
      { id: 1, title: "Private Trust Certificate (India)", url: "/documents/dummy-1.pdf" },
      { id: 2, title: "80G Certificate (India)", url: "/documents/dummy-2.pdf" },
      { id: 3, title: "FCRA Certificate (India)", url: "/documents/dummy-3.pdf" },
    ],
  },
  {
    id: "annual",
    variant: "annual",
    title: "Annual Reports",
    description: "Explore our annual reports to see our progress over the years.",
    items: [
      { id: 1, title: "Annual Report 2018", url: "/documents/dummy-4.pdf" },
      { id: 2, title: "Annual Report 2017", url: "/documents/dummy-5.pdf" },
      { id: 3, title: "Annual Report 2016", url: "/documents/dummy-6.pdf" },
      { id: 4, title: "Annual Report 2015", url: "/documents/dummy-7.pdf" },
    ],
  },
];