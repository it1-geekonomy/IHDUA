import Developmentpage from "@/domains/home/components/Developmentpage";
import Statsection from "@/domains/home/components/Statsection";
import OurConviction from "@/domains/home/components/Ourconviction";
import FocusAreaSection from "@/domains/home/components/FocusAreaSection";
import MovementMarquee from "@/domains/home/components/Movementmarquee";
import HowCanYouHelpSection from "@/domains/home/components/HowCanYouHelpSection";
import Missionsection from "@/domains/home/components/Missionsection";
import RippleEffectSection from "@/domains/home/components/RippleEffectSection";
import GeographicFootprint from "@/domains/home/components/GeographicFootprint";
import ThreePathsSection from "@/domains/home/components/ThreePathsSection";
import CTAsection from "@/domains/home/components/CTAsection";

export default function ClientHomePage() {
	return (
		<div>
			<Developmentpage />
			<Statsection />
			<OurConviction />
			<FocusAreaSection />
			<MovementMarquee />
			<HowCanYouHelpSection />
			<Missionsection />
			<RippleEffectSection />
			{/* <GeographicFootprint /> */}
			<ThreePathsSection />
			<CTAsection />
		</div>
	);
}
