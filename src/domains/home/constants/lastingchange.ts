export const LASTING_CHANGE = {
  headline: "Small Actions Can Create Lasting Change Together",
  body: "IHDUA provided clinics drip-irrigation infrastructure and trained farmers in organic practices, strengthening livelihoods and food security across partner villages.",
  ctaText:
    "IHDUA works with rural communities to create opportunities, strengthen livelihoods, and build a sustainable future.",
  ctaHref: "/GetInvolved",
  yellowCard: {
    title: "Create Lasting Impact",
    description:
      "Support rural communities and help create sustainable opportunities.",
    seal: "/home/impact-seal.png",
  },
  purpleCard: {
    stat: "59+",
    label: "Villages Reached",
    note: "Community trust",
    years: ["2024", "2025", "2026"] as const,
  },
  imageCards: [
    {
      id: "community",
      label: "Community Empowerment",
      image: "/home/community-empowerment.png",
    },
    {
      id: "livelihoods",
      label: "Sustainable Livelihoods",
      image: "/home/sustainable-livelihoods.png",
    },
    {
      id: "education",
      label: "Education for All",
      image: "/home/education-for-all.png",
    },
  ],
} as const;
