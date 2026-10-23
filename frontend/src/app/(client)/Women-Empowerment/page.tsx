import InitiativeBanner from "@/shared/components/InitiativeBanner";
import SupportingWomen from "@/domains/womenempowerment/components/supportingwomen";
import HowWeSupportWomen from "@/domains/womenempowerment/components/howwesupportwomen";
import WomenEmpowermentStat from "@/domains/womenempowerment/components/womenempowermentstat";

export default function WomenEmpowermentPage() {
  return (
    <>
      <InitiativeBanner
        title="Women Empowerment"
        description="Creating opportunities to learn, grow and build brighter futures for rural children and communities."
        image="/womenempowerment/banner-desktop.png"
        mobileImage="/womenempowerment/banner-mobile.png"
        imageAlt="Women Empowerment - IHDUA"
        contentClassName="max-w-[75%] sm:max-w-[50%] lg:max-w-[50%]"
      />
      <SupportingWomen />
      <HowWeSupportWomen />
      <WomenEmpowermentStat />
    </>
  );
}
