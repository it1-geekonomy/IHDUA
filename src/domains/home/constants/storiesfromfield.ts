export type FieldStory = {
  id: string;
  image: string;
  category: string;
  date: string;
  title: string;
  description: string;
  href: string;
};

/** Featured + side pool; UI always shows 2 side stories */
export const FIELD_STORIES: FieldStory[] = [
  {
    id: "grama-sabha",
    image: "/home/featured-story-image.png",
    category: "Community Leadership",
    date: "March 2, 2026",
    title: "The Grama Sabha Revival: Village Assemblies Take Charge of Education",
    description:
      "Through democratic consensus building, three regional councils have successfully assumed independent fiscal and curriculum oversight of municipal schools.",
    href: "/Stories",
  },
  {
    id: "tank-desiltation",
    image: "/home/story-thumb.png",
    category: "Agricultural Update",
    date: "February 12, 2026",
    title: "How Traditional Tank Desiltation Revived 30 Smallholdings in Hanur",
    description:
      "Community-led desiltation restored irrigation capacity across Hanur, bringing thirty smallholdings back into productive cultivation this season.",
    href: "/Stories",
  },
  {
    id: "handloom-export",
    image: "/home/story-thumb-2.png",
    category: "Self-Help Success",
    date: "January 28, 2026",
    title: "Mysore Women's Guild Exports First Hand-Loom Batch to Bangalore Partner",
    description:
      "A women-led self-help guild completed its first wholesale hand-loom shipment, opening a steady market link with a Bangalore retail partner.",
    href: "/Stories",
  },
];
