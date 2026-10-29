"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Handshake, HeartHandshake, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormsCategoryHeader() {
  const pathname = usePathname();
  const isNewsletter = pathname.includes("newsletter");
  const isPartnership = !isNewsletter && pathname.includes("/forms/partnership");
  const isVolunteer = !isNewsletter && !isPartnership && pathname.includes("/forms/volunteer");
  const isContact = !isNewsletter && !isPartnership && !isVolunteer;

  return (
    <div className="flex border-b border-[#E5E0D8] pb-1 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        <Link
          href="/admin/forms/contact"
          className={cn(
            "flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-figtree text-xs font-semibold transition-all",
            isContact
              ? "bg-[#1A0F1C] text-white shadow-xs"
              : "text-[#5F6C6D] hover:bg-white hover:text-[#00191B]",
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Contact Leads</span>
        </Link>

        <Link
          href="/admin/forms/volunteer"
          className={cn(
            "flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-figtree text-xs font-semibold transition-all",
            isVolunteer
              ? "bg-[#1A0F1C] text-white shadow-xs"
              : "text-[#5F6C6D] hover:bg-white hover:text-[#00191B]",
          )}
        >
          <HeartHandshake className="h-3.5 w-3.5" />
          <span>Volunteer Leads</span>
        </Link>

        <Link
          href="/admin/forms/partnership"
          className={cn(
            "flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-figtree text-xs font-semibold transition-all",
            isPartnership
              ? "bg-[#1A0F1C] text-white shadow-xs"
              : "text-[#5F6C6D] hover:bg-white hover:text-[#00191B]",
          )}
        >
          <Handshake className="h-3.5 w-3.5" />
          <span>Partnership Inquiries</span>
        </Link>

        <Link
          href="/admin/newsletter-subscribers"
          className={cn(
            "flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-figtree text-xs font-semibold transition-all",
            isNewsletter
              ? "bg-[#1A0F1C] text-white shadow-xs"
              : "text-[#5F6C6D] hover:bg-white hover:text-[#00191B]",
          )}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Newsletter Subscribers</span>
        </Link>
      </div>
    </div>
  );
}
