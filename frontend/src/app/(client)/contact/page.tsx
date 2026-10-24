import BannerSection from "@/domains/contact/components/Bannersection";
import ContactSection from "@/domains/contact/components/ContactSection";
import VisitOfficeSection from "@/domains/contact/components/VisitOfficeSection";
import NewsletterSection from "@/shared/components/Newsletter";

export default function ContactPage() {
  return (
    <>
      <BannerSection />
      <ContactSection />
      <VisitOfficeSection />
      <NewsletterSection />
    </>
  );
}