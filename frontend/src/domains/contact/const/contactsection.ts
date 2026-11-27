export const SUBJECTS = [
  "General Enquiry",
  "Programme Information",
  "Donation Enquiry",
  "Volunteer Opportunities",
  "Partnership & Collaboration",
  "CSR Projects",
  "Education Programmes",
  "Healthcare Initiatives",
  "Women's Empowerment",
  "Other",
];

export interface ContactLine {
  text: string;
  flagSrc?: string;
  flagAlt?: string;
}

export interface ContactItem {
  iconSrc: string;
  alt: string;
  title: string;
  lines: ContactLine[];
}

export const CONTACT_ITEMS: ContactItem[] = [
  {
    iconSrc: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795413016097-39tcg-fi_798008.svg",
    alt: "Office",
    title: "Our Offices",
    lines: [
      { text: "IHDUA Center, Mysore–Ooty Road," },
      { text: "Mysore, Karnataka 570008, India", flagSrc: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795413052598-ro23c-fi_14009677.svg", flagAlt: "India" },
    ],
  },
  {
    iconSrc: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795413016097-39tcg-fi_798008.svg",
    alt: "Office",
    title: "",
    lines: [
      { text: "IHDUA - 360 E Randolph St, Apt 3701" },
      { text: "Chicago, IL 60601" },
      { text: "+1 (312) 819-0691", flagSrc:"https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795413080047-mrvti-group-1-.svg", flagAlt: "United States" },
    ],
  },
  { iconSrc: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795413125006-lqs97-fi_10146676.svg", alt: "Phone", title: "Phone", lines: [{ text: "+91 821 248 1234" }] },
  { iconSrc:  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795413212940-1y6n8-fi_11502370.svg", alt: "Email", title: "Email", lines: [{ text: "admin@ihdua.org" }] },
  {
    iconSrc: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795413248573-qrvt6-fi_3416094.svg",
    alt: "Office Hours",
    title: "Office Hours",
    lines: [{ text: "Monday – Saturday" }, { text: "9:00 AM – 5:00 PM" }],
  },
];

export const FIELD_CLASS =
  "w-full border border-[#E5DDF3] bg-[#FDFBFD] px-4 py-3 font-figtree text-sm text-[#00191B] placeholder:text-[#8A9596] focus:border-[#9739A8] focus:outline-none";