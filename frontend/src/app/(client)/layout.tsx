import type { ReactNode } from "react";
import Navbar from "@/shared/components/navbar/NavbarShell";
import Footer from "@/shared/components/footer";
import CTAsection from "@/shared/components/CTAsection";
import { DonationPopupShell } from "@/shared/components/DonationPopupShell";
import { ChatbotWidget } from "@/shared/components/chatbot";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <CTAsection />
      <Footer />
      <DonationPopupShell />
      <ChatbotWidget />
    </div>
  );
}

