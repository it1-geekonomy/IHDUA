import type { Metadata } from "next";
import BannerSection from "@/domains/contact/components/Bannersection";
import ContactSection from "@/domains/contact/components/ContactSection";
import VisitOfficeSection from "@/domains/contact/components/VisitOfficeSection";
import NewsletterSection from "@/shared/components/Newsletter";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/contact" });

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