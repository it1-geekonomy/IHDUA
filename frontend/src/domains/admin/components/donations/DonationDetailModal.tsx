"use client";

import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  HandCoins,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DONATION_STATUS_CONFIG,
  formatDonationAmount,
  formatDonationDate,
  type AdminDonationRow,
} from "./types";

interface DonationDetailModalProps {
  isOpen: boolean;
  donation: AdminDonationRow | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function DonationDetailModal({
  isOpen,
  donation,
  loading,
  error,
  onClose,
}: DonationDetailModalProps) {
  if (!isOpen || !donation) return null;

  const statusCfg =
    DONATION_STATUS_CONFIG[donation.status.toLowerCase()] ||
    DONATION_STATUS_CONFIG.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-figtree overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <HandCoins className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-bold text-[#0F1C1D]">
                Donation Details
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-[#5F6C6D]">
                  {donation.receiptNumber || "Pending Receipt"}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[10px] font-semibold capitalize",
                    statusCfg.badgeCls,
                  )}
                >
                  <span className={cn("h-1 w-1 rounded-full", statusCfg.dotCls)} />
                  {statusCfg.label}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#5F6C6D]">
            <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
            <p className="mt-2 text-xs">Fetching complete transaction data…</p>
          </div>
        ) : error ? (
          <div className="my-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {error}
          </div>
        ) : (
          <div className="mt-5 space-y-5 text-xs">
            {/* Amount & Key Summary Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-[#FAF8F4] border border-[#E5E0D8] p-4 gap-3">
              <div>
                <p className="text-[11px] font-medium text-[#5F6C6D]">
                  Contribution Amount
                </p>
                <p className="font-mono text-2xl font-bold text-[#0F1C1D] mt-0.5">
                  {formatDonationAmount(donation.amount, donation.currency)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[11px] font-medium text-[#5F6C6D]">
                  Allocation
                </p>
                <p className="font-semibold text-xs text-[#9739A8] mt-0.5">
                  {donation.donationCategory || "General Donation"}
                </p>
              </div>
            </div>

            {/* Donor Profile Section */}
            <div className="rounded-xl border border-[#E5E0D8] p-4">
              <h3 className="font-semibold text-xs text-[#0F1C1D] mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-[#9739A8]" />
                <span>Donor Profile</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-[#8A847A] block">Full Name</span>
                  <span className="font-semibold text-[#0F1C1D]">
                    {donation.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8A847A] block">Email Address</span>
                  <div className="flex items-center gap-1.5 text-[#0F1C1D]">
                    <Mail className="h-3.5 w-3.5 text-[#8A847A]" />
                    <span>{donation.email || "—"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-[#8A847A] block">Phone Number</span>
                  <div className="flex items-center gap-1.5 text-[#0F1C1D]">
                    <Phone className="h-3.5 w-3.5 text-[#8A847A]" />
                    <span>{donation.phone || "—"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-[#8A847A] block">PAN / Aadhaar</span>
                  <div className="flex items-center gap-1.5 text-[#0F1C1D] font-mono">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#8A847A]" />
                    <span>{donation.pan || "Not provided"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-[#8A847A] block">Location</span>
                  <div className="flex items-center gap-1.5 text-[#0F1C1D]">
                    <MapPin className="h-3.5 w-3.5 text-[#8A847A]" />
                    <span>{donation.city || "—"}</span>
                  </div>
                </div>
                {donation.address && (
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-[#8A847A] block">Address</span>
                    <span className="text-[#0F1C1D]">{donation.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment & Razorpay Gateway Details */}
            <div className="rounded-xl border border-[#E5E0D8] p-4">
              <h3 className="font-semibold text-xs text-[#0F1C1D] mb-3 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-[#9739A8]" />
                <span>Gateway & Transaction Identifiers</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-[#8A847A] block">Receipt Number</span>
                  <span className="font-mono text-[#0F1C1D]">
                    {donation.receiptNumber || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8A847A] block">Transaction Timestamp</span>
                  <div className="flex items-center gap-1.5 text-[#0F1C1D]">
                    <Calendar className="h-3.5 w-3.5 text-[#8A847A]" />
                    <span>{formatDonationDate(donation.createdAt)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-[#8A847A] block">Razorpay Payment ID</span>
                  <span className="font-mono text-[#0F1C1D]">
                    {donation.razorpayPaymentId || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8A847A] block">Razorpay Order ID</span>
                  <span className="font-mono text-[#0F1C1D]">
                    {donation.razorpayOrderId || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Donor Note / Message */}
            {donation.message && (
              <div className="rounded-xl border border-[#E5E0D8] p-4 bg-[#FAF8F4]/50">
                <span className="text-[11px] text-[#8A847A] block mb-1">Donor Message</span>
                <p className="text-xs text-[#0F1C1D] italic">
                  &ldquo;{donation.message}&rdquo;
                </p>
              </div>
            )}

            {/* Document Downloads (Certificate & 80G Receipt) */}
            <div className="rounded-xl border border-[#E5E0D8] p-4 bg-white">
              <h3 className="font-semibold text-xs text-[#0F1C1D] mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#9739A8]" />
                <span>Generated Documents & Receipts</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Donation Certificate */}
                <div className="rounded-lg border border-[#E5E0D8] p-3 flex flex-col justify-between gap-2.5 bg-[#FAF8F4]/30">
                  <div>
                    <span className="font-semibold text-xs text-[#0F1C1D] block">
                      Donation Certificate
                    </span>
                    <span className="text-[11px] text-[#8A847A] block mt-0.5">
                      Official IHDUA Certificate of Appreciation.
                    </span>
                  </div>
                  {donation.certificateUrl ? (
                    <a
                      href={donation.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#9739A8] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#832e92] transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Certificate</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#8A847A] italic">
                      <Clock className="h-3 w-3" />
                      <span>Generating certificate…</span>
                    </span>
                  )}
                </div>

                {/* 80G Tax Exemption Receipt */}
                <div className="rounded-lg border border-[#E5E0D8] p-3 flex flex-col justify-between gap-2.5 bg-[#FAF8F4]/30">
                  <div>
                    <span className="font-semibold text-xs text-[#0F1C1D] block">
                      80G Tax Exemption Receipt
                    </span>
                    <span className="text-[11px] text-[#8A847A] block mt-0.5">
                      Section 80G receipt for Indian income tax deduction.
                    </span>
                  </div>
                  {donation.receiptUrl ? (
                    <a
                      href={donation.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#1F6B45]/30 bg-[#E7F6EE] px-3 py-1.5 text-xs font-semibold text-[#1F6B45] shadow-2xs hover:bg-[#d8f0e2] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Download 80G Receipt</span>
                    </a>
                  ) : donation.pan ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#8A847A] italic">
                      <Clock className="h-3 w-3" />
                      <span>Generating 80G receipt…</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#8A847A] italic">
                      Not applicable (PAN not provided)
                    </span>
                  )}
                </div>
              </div>

              {/* Email Delivery Status */}
              {donation.receiptEmailStatus && (
                <div className="mt-3 flex items-center gap-2 pt-3 border-t border-[#E5E0D8] text-[11px] text-[#5F6C6D]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>
                    Receipt email delivery status:{" "}
                    <strong className="text-[#0F1C1D] uppercase">
                      {donation.receiptEmailStatus}
                    </strong>
                    {donation.receiptEmailSentAt && (
                      <> on {formatDonationDate(donation.receiptEmailSentAt)}</>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end border-t border-[#E5E0D8] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-2 text-xs font-semibold text-[#5F6C6D] hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

