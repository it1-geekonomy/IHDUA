export const DONATION_SECTION_ID = "cta-donate";

export const CTA_PRESET_AMOUNTS = ["₹500", "₹1500", "₹2500", "₹5000"] as const;
export type CtaPresetAmount = (typeof CTA_PRESET_AMOUNTS)[number];

export const DONATION_COPY = {
  sectionTitle: "Help Create Opportunities For Stronger Communities",
  sectionBody:
    "Every contribution helps create opportunities for rural communities through education, healthcare, sustainable livelihoods, and community development.",
  exploreCta: "Explore Our Work",
  exploreHref: "#focus-areas",
  exploreTargetId: "focus-areas",
  cardTitle: "Make a Difference Today",
  cardBody:
    "Your support helps create opportunities through education, healthcare, sustainable livelihoods and stronger communities.",
  chooseAmount: "Choose an amount",
  otherAmountPlaceholder: "Other amount",
  donateNow: "Donate Now",
  chosenAmount: "Chosen Amount",
  edit: "EDIT",
  fullName: "Full Name",
  mobile: "Mobile Number",
  email: "Email Address",
  paySecurely: "Pay Securely",
  trustLine: "🔒 Secure Payment • Trusted by Thousands",
  confirmBeforeContinue: "Please confirm this contribution amount before you continue.",
  confirmBeforePay: "Please confirm this contribution amount before you pay.",
  bgImage: "/CTAsection/ctabgimg.jpg",
} as const;

export function isCtaPresetAmount(amount: string): amount is CtaPresetAmount {
  return (CTA_PRESET_AMOUNTS as readonly string[]).includes(amount);
}
