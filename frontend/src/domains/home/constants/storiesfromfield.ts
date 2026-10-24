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
    image: "/home/Fstory1.png",
    category: "Community Leadership",
    date: "March 2, 2026",
    title: "The Grama Sabha Revival: Village Assemblies Take Charge of Education",
    description:
      "Through democratic consensus building, three regional councils have successfully assumed independent fiscal and curriculum oversight of municipal schools.",
    href: "/Stories",
  },
  {
    id: "tank-desiltation",
    image: "/home/storythumb1.png",
    category: "Building Stronger Villages",
    date: "February 12, 2026",
    title: "Village meetings bring communities together to address local challenges.",
    description:
      "Community-led desiltation restored irrigation capacity across Hanur, bringing thirty smallholdings back into productive cultivation this season.",
    href: "/Stories",
  },
  {
    id: "handloom-export",
    image: "/home/storythumb2.png",
    category: "Skills for Tomorrow",
    date: "January 28, 2026",
    title: "Training helps rural youth develop skills and explore opportunities.",
    description:
      "A women-led self-help guild completed its first wholesale hand-loom shipment, opening a steady market link with a Bangalore retail partner.",
    href: "/Stories",
  },
];
