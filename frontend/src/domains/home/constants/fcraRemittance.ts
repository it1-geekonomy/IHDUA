/**
 * FCRA bank details for overseas donors.
 * Set NEXT_PUBLIC_FCRA_ACCOUNT_NUMBER (and related vars) when the live account is ready.
 */
export type FcraBankDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchAddress: string;
  ifsc: string;
  swift: string;
  branchCode: string;
  sortCode: string;
};

export const FCRA_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_FCRA_CONTACT_EMAIL?.trim() || "info@ihdua.org";

export const FCRA_BANK_DETAILS: FcraBankDetails = {
  accountName:
    process.env.NEXT_PUBLIC_FCRA_ACCOUNT_NAME?.trim() ||
    "International Human Development and Upliftment Academy",
  accountNumber:
    process.env.NEXT_PUBLIC_FCRA_ACCOUNT_NUMBER?.trim() || "Will be shared shortly",
  bankName:
    process.env.NEXT_PUBLIC_FCRA_BANK_NAME?.trim() || "State Bank of India",
  branchAddress:
    process.env.NEXT_PUBLIC_FCRA_BRANCH?.trim() ||
    "FCRA Cell, 4th Floor, State Bank of India, New Delhi Main Branch, Sansad Marg, New Delhi-110001",
  ifsc: process.env.NEXT_PUBLIC_FCRA_IFSC?.trim() || "SBIN0000691",
  swift: process.env.NEXT_PUBLIC_FCRA_SWIFT?.trim() || "SBININBB104",
  branchCode: process.env.NEXT_PUBLIC_FCRA_BRANCH_CODE?.trim() || "00691",
  sortCode: process.env.NEXT_PUBLIC_FCRA_SORT_CODE?.trim() || "60-01-59",
};

export const FCRA_HAS_PUBLIC_ACCOUNT = Boolean(
  process.env.NEXT_PUBLIC_FCRA_ACCOUNT_NUMBER?.trim(),
);

export const FCRA_DONOR_DETAIL_FIELDS = [
  "Your Name",
  "Your Contact No",
  "Your Donation Transaction Number",
  "Your Donation Amount",
  "Your Email — to send you the soft copy of the cash receipt",
  "Your Complete Postal Address",
] as const;
