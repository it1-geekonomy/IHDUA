export const STATS = [
  {
    icon: "/statsection/locationicon.png",
    bg: "#9739A8",
    target: 202,
    suffix: "+",
    label: "Villages Reached",
  },
  {
    icon: "/statsection/groupicon.png",
    bg: "#FFD638",
    target: 600,
    suffix: "+",
    label: "Self-Help Groups Supported",
  },
  {
    icon: "/statsection/homeicon.png",
    bg: "#9739A8",
    target: 25,
    suffix: "+",
    label: "Livelihood Initiatives",
  },
  {
    icon: "/statsection/trainedicon.png",
    bg: "#FFD638",
    target: 5000,
    suffix: "+",
    label: "People Trained",
  },
] as const;

export interface StatValue {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * Each set fills the same 4 slots (icons come from STATS).
 * Set 0 = default stats, the rest appear one by one while scrolling.
 */
export const STAT_SETS: StatValue[][] = [
  STATS.map((s) => ({ value: s.target, suffix: s.suffix, label: s.label })),
  [
    { value: 3305, suffix: "+", label: "Learners Trained" },
    { value: 2174, suffix: "+", label: "Tailoring Training" },
    { value: 514, suffix: "+", label: "Computer Course" },
    { value: 267, suffix: "+", label: "Nursing Care Assistants (GDA)" },
  ],
  [
    { value: 2766, suffix: "+", label: "Women Reached" },
    { value: 697, suffix: "+", label: "SHGs Formed" },
    { value: 7578, suffix: "+", label: "SHG Members" },
    { value: 18, label: "Federations" },
  ],
  [
    { value: 663, suffix: "+", label: "Income Generation Activities" },
    { value: 218, suffix: "+", label: "Bank Credit Linkages" },
    { value: 9.14, decimals: 2, prefix: "₹", suffix: " Cr", label: "Loans Facilitated" },
    { value: 43, label: "Farmer SHGs" },
  ],
  [
    { value: 150, suffix: "+", label: "Villages Covered" },
    { value: 135, label: "Schools Reached" },
    { value: 28, label: "Health Camps" },
    { value: 3487, suffix: "+", label: "Health Beneficiaries" },
  ],
];