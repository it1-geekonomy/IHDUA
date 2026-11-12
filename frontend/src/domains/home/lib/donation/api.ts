import {
  normalizeAmountDigits,
  toAmountDigits,
} from "@/domains/home/lib/donation/amount";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:6061/api";

export type CreateDonationOrderPayload = {
  fullName: string;
  phone: string;
  email: string;
  amount: string;
  currency?: string;
  countryCode?: string;
  countryName?: string;
  pan?: string;
  address?: string;
  city?: string;
  message?: string;
  donationCategory?: string;
};

export type CreateDonationOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type VerifyDonationPaymentPayload = {
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
  donationCategory?: string;
};

export type DonationFrequency = "monthly" | "quarterly" | "yearly";

export type CreateSubscriptionResponse = {
  subscriptionId: string;
  frequency: DonationFrequency;
  amount: string;
  amountPaise: number;
  currency: string;
  keyId: string;
};

export type VerifySubscriptionPayload = {
  razorpaySubscriptionId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type VerifySubscriptionResponse = {
  subscription: {
    id: string;
    status: string;
    frequency: DonationFrequency;
    amount: string;
    nextChargeAt: string | null;
  };
  /** Null when the bank only approved the mandate; the first charge follows shortly. */
  donor: Omit<VerifyDonationPaymentResponse, "status"> | null;
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
  const json = await res.json();
  return (json?.data ?? json) as CreateDonationOrderResponse;
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
  const json = await res.json();
  return (json?.data ?? json) as VerifyDonationPaymentResponse;
}

export async function createDonationSubscription(
  payload: CreateDonationOrderPayload & { frequency: DonationFrequency },
) {
  const res = await fetch(`${API_BASE}/donation-subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await parseError(res));
  const json = await res.json();
  return (json?.data ?? json) as CreateSubscriptionResponse;
}

export async function verifyDonationSubscription(
  payload: VerifySubscriptionPayload,
) {
  const res = await fetch(`${API_BASE}/donation-subscriptions/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await parseError(res));
  const json = await res.json();
  return (json?.data ?? json) as VerifySubscriptionResponse;
}

/** Whole-rupee digits from a display amount like "₹2,500". */
export function amountDigitsFromDisplay(amount: string) {
  return normalizeAmountDigits(toAmountDigits(amount));
}
