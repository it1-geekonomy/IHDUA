export const PARTNERSHIP_TYPES = [
  "CSR Partnership",
  "NGO / Non-Profit Collaboration",
  "Academic Partnership",
  "Corporate Partnership",
  "Programme Sponsorship",
  "Infrastructure Development",
  "Other",
] as const;

export type PartnershipType = (typeof PARTNERSHIP_TYPES)[number];
