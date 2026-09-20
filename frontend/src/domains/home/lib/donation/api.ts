import {
  normalizeAmountDigits,
  toAmountDigits,
} from "@/domains/home/lib/donation/amount";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:6061/api";

export type CreateDonationOrderPayload = {
  fullName: string;
  phone?: string;
  email?: string;
  amount: string;
  pan?: string;
};

export type CreateDonationOrderResponse = {
  donorId: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type VerifyDonationPaymentPayload = {
  donorId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type VerifyDonationPaymentResponse = {
  donorId: string;
  status: string;
  receiptNumber: string | null;
  amount: string;
  currency: string;
};

async function parseError(res: Response) {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return `Request failed (${res.status})`;
}

export async function createDonationOrder(payload: CreateDonationOrderPayload) {
  const res = await fetch(`${API_BASE}/donors/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as CreateDonationOrderResponse;
}

export async function verifyDonationPayment(
  payload: VerifyDonationPaymentPayload,
) {
  const res = await fetch(`${API_BASE}/donors/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as VerifyDonationPaymentResponse;
}

/** Whole-rupee digits from a display amount like "₹2,500". */
export function amountDigitsFromDisplay(amount: string) {
  return normalizeAmountDigits(toAmountDigits(amount));
}
