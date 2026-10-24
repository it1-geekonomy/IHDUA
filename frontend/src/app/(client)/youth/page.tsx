import Bannersection from "@/domains/youth/components/bannersection";
import YouthSkills from "@/domains/youth/components/youthskills";
import WhyYouthskillsmatters from "@/domains/youth/components/whyYouthskill";
import BuildingSkills from "@/domains/youth/components/buildingskills";
import Skillstogether from "@/domains/youth/components/SkillsTogetherSection";
import Impactwemake from "@/domains/youth/components/impactwemake";
import NewsletterSection from "@/shared/components/Newsletter";

export default function OurTeamPage() {
  return (
    <> 
      <Bannersection />
      <YouthSkills />
      <WhyYouthskillsmatters />
      <BuildingSkills />
      <Skillstogether />
      <Impactwemake />
      <NewsletterSection />
    </>
  );
}