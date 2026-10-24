export const VOLUNTEER_AREAS_OF_INTEREST = [
  "Teaching & Education",
  "Healthcare & Medical Camps",
  "Community Outreach",
  "Women Empowerment",
  "Agriculture & Sustainability",
  "Youth Development",
  "Event Support",
  "Design & Digital Marketing",
  "Administration & Operations",
  "Other",
] as const;

export type VolunteerAreaOfInterest = (typeof VOLUNTEER_AREAS_OF_INTEREST)[number];
