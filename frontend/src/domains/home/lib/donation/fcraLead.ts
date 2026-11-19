type FcraLeadPayload = {
  name: string;
  email: string;
  mobile: string;
  message: string;
};

/**
 * Capture an overseas remittance intent in CMS via contact leads.
 */
export async function submitFcraRemittanceLead(
  payload: FcraLeadPayload,
): Promise<void> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:6061/api";
  const res = await fetch(`${baseUrl}/leads-contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      subject: "Donation Enquiry",
      message: payload.message,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message || "Failed to submit remittance details",
    );
  }
}
