import type { Metadata } from "next";
import Developmentpage from "@/domains/home/components/Developmentpage";
import Statsection from "@/domains/home/components/Statsection";
import OurConviction from "@/domains/home/components/Ourconviction";
import FocusAreaSection from "@/domains/home/components/FocusAreaSection";
import MovementMarquee from "@/domains/home/components/Movementmarquee";
import HowCanYouHelpSection from "@/domains/home/components/HowCanYouHelpSection";
import Missionsection from "@/domains/home/components/Missionsection";
import GeographicFootprint from "@/domains/home/components/GeographicFootprint";
import ThreePathsSection from "@/domains/home/components/ThreePathsSection";
import StoriesFromField from "@/domains/home/components/StoriesFromField";
import LastingChangeSection from "@/domains/home/components/LastingChangeSection";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/" });

export default function ClientHomePage() {
	return (
		<div>
			<Developmentpage />
			<Statsection />
			<OurConviction />
			<FocusAreaSection />
			<div className="lg:pb-12">
				<MovementMarquee />
			</div>
			<HowCanYouHelpSection />
			<Missionsection />
			{/* <RippleEffectSection /> */}
			<LastingChangeSection />
			<GeographicFootprint />
			<StoriesFromField />
			
			<ThreePathsSection />
		</div>
	);
}
