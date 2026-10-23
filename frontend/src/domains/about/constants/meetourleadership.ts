export const LEADERSHIP_LABEL = "Meet Our Team";
export const LEADERSHIP_HEADING = "Meet Our Leadership";

export const LEADERSHIP_QUOTE =
  "Our leadership brings together a shared commitment to empowering communities and creating meaningful, sustainable change. Through their guidance and continued involvement, IHDUA works to strengthen its programmes, build community partnerships and create opportunities for people to lead healthier, more dignified and self-reliant lives.";

export type LeaderItem = {
  name: string;
  designation: string;
  image: string;
};

export const LEADERS: LeaderItem[] = [
  {
    name: "Dr. B.S. Ajaikumar",
    designation: "Chairperson",
    image: "/aboutus/Ajai.png",
  },
  {
    name: "Bhagya Ajaikumar",
    designation: "Trustee",
    image: "/aboutus/bhagya.png",
  },
];