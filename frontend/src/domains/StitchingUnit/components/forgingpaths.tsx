import Videosection from "@/shared/components/Videosection";

export default function Page() {
  return (
   <Videosection
  heading="Forging Paths to Economic Engagement"
  topDescription={[
    "Village women are fully invested in the success of their family farms, and they perform multiple roles on a daily basis out in the fields and in the homes. But beyond the boundary lines of their family plots, these women find few opportunities to apply their farming and animal husbandry skills in supplementary money-generating activities.",
    "In order to provide an additional avenue for rural women to earn more money, we have established a vocational training program that provides instruction in tailoring, a craft that is in perennial demand in southern India",
  ]}
  videos={[
    { src: "/Stitchingunit/video1.mp4", title: "Tailoring uniforms" },
    { src: "/Stitchingunit/video2.mp4", title: "Women learning tailoring" },
  ]}
/>
  );
}