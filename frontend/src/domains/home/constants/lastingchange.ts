export const LASTING_CHANGE = {
  headline: "Small Actions Can Create Lasting Change Together",
  body: "IHDUA provided direct drip-irrigation infrastructure combined with intensive organic multi-cropping and bio-nutrient training, helping rural farmers improve productivity, adopt sustainable agricultural practices, strengthen household livelihoods, and create lasting opportunities within their communities.",
  ctaText:
    "IHDUA works with rural communities to create opportunities, strengthen livelihoods, and build a sustainable future.",
  ctaHref: "/",
  yellowCard: {
    title: "Create Lasting Impact",
    description:
      "Support rural communities and help create sustainable opportunities.",
    seal: "/home/impact-seal.png",
  },
  purpleCard: {
    /** Numeric value used for count-up animation */
    statValue: 202,
    statSuffix: "+",
    label: "Villages Reached",
    note: "Community trust",
    years: ["2024", "2025", "2026"] as const,
  },
  imageCards: [
    {
      id: "community",
      label: "Community Empowerment",
      image: "/home/lasting1.png",
    },
    {
      id: "livelihoods",
      label: "Healthcare for All",
      image: "/home/lasting2.png",
    },
    {
      id: "education",
      label: "Education for All",
      image: "/home/lasting3.png",
    },
  ],
} as const;
