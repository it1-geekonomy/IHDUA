/**
 * FCRA bank details shown to overseas donors.
 * Override via NEXT_PUBLIC_FCRA_* env vars in production.
 */
export type FcraBankDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  ifsc: string;
  swift: string;
};

export const FCRA_BANK_DETAILS: FcraBankDetails = {
  accountName:
    process.env.NEXT_PUBLIC_FCRA_ACCOUNT_NAME?.trim() ||
    "International Human Development and Upliftment Academy",
  accountNumber:
    process.env.NEXT_PUBLIC_FCRA_ACCOUNT_NUMBER?.trim() ||
    "———— (shared after you submit)",
  bankName:
    process.env.NEXT_PUBLIC_FCRA_BANK_NAME?.trim() || "State Bank of India",
  branch:
    process.env.NEXT_PUBLIC_FCRA_BRANCH?.trim() ||
    "FCRA Cell / New Delhi Main Branch (confirm on remittance advice)",
  ifsc: process.env.NEXT_PUBLIC_FCRA_IFSC?.trim() || "SBIN0000691",
  swift: process.env.NEXT_PUBLIC_FCRA_SWIFT?.trim() || "SBININBB104",
};

export const FCRA_HAS_PUBLIC_ACCOUNT = Boolean(
  process.env.NEXT_PUBLIC_FCRA_ACCOUNT_NUMBER?.trim(),
);
