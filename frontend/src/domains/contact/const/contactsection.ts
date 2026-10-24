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
    iconSrc: "/contact/office.png",
    alt: "Office",
    title: "Our Offices",
    lines: [
      { text: "IHDUA Center, Mysore–Ooty Road," },
      { text: "Mysore, Karnataka 570008, India", flagSrc: "/contact/india.png", flagAlt: "India" },
    ],
  },
  {
    iconSrc: "/contact/office.png",
    alt: "Office",
    title: "",
    lines: [
      { text: "IHDUA - 360 E Randolph St, Apt 3701" },
      { text: "Chicago, IL 60601" },
      { text: "+1 (312) 819-0691", flagSrc: "/contact/usa.png", flagAlt: "United States" },
    ],
  },
  { iconSrc: "/contact/phone.png", alt: "Phone", title: "Phone", lines: [{ text: "+91 821 248 1234" }] },
  { iconSrc: "/contact/message.png", alt: "Email", title: "Email", lines: [{ text: "info@ihdua.org" }] },
  {
    iconSrc: "/contact/clock.png",
    alt: "Office Hours",
    title: "Office Hours",
    lines: [{ text: "Monday – Saturday" }, { text: "9:00 AM – 5:00 PM" }],
  },
];

export const FIELD_CLASS =
  "w-full border border-[#E5DDF3] bg-[#FDFBFD] px-4 py-3 font-figtree text-sm text-[#00191B] placeholder:text-[#8A9596] focus:border-[#9739A8] focus:outline-none";