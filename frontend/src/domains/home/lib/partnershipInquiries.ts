export type PartnershipInquiryPayload = {
  yourName: string;
  orgName: string;
  phone: string;
  partnershipType: string;
  proposal?: string;
};

export type PartnershipInquiry = {
  id: string;
  yourName: string;
  orgName: string;
  phone: string;
  partnershipType: string;
  proposal: string | null;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function submitPartnershipInquiry(
  payload: PartnershipInquiryPayload,
  signal?: AbortSignal,
): Promise<PartnershipInquiry> {
  const body: PartnershipInquiryPayload = {
    yourName: payload.yourName.trim(),
    orgName: payload.orgName.trim(),
    phone: payload.phone.replace(/[\s-]/g, ""),
    partnershipType: payload.partnershipType,
  };
  // Only send proposal when filled, so we don't send an empty string
  if (payload.proposal?.trim()) body.proposal = payload.proposal.trim();

  const res = await fetch(`${API_URL}/partnership-inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // NestJS errors: { statusCode, message: string | string[], error }
    const msg = Array.isArray(json?.message) ? json.message.join(", ") : json?.message;
    throw new Error(msg || `Something went wrong (${res.status}). Please try again.`);
  }

  // Handles both { statusCode, data: {...} } and a bare object
  return json?.data ?? json;
}