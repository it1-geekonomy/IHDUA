import MovementMarquee from "@/domains/home/components/Movementmarquee";
import { FooterLegalBar } from "./FooterLegalBar";
import { FooterMain } from "./FooterMain";

export default function FooterShell() {
  return (
    <footer className="bg-[#9739A8] text-white">
      <MovementMarquee />
      <FooterMain />
      <FooterLegalBar />
    </footer>
  );
}
