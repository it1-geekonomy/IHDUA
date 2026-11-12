export type VolunteerLeadPayload = {
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  skills?: string;
  resume: File;
};

export type VolunteerLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  skills: string | null;
  resumeUrl: string | null;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Resume rules from the API docs: PDF, DOC, DOCX, max 5MB */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export async function submitVolunteerLead(
  payload: VolunteerLeadPayload,
  signal?: AbortSignal,
): Promise<VolunteerLead> {
  const body = new FormData();
  body.append("fullName", payload.fullName.trim());
  body.append("email", payload.email.trim());
  body.append("phone", payload.phone.replace(/[\s-]/g, ""));
  body.append("areaOfInterest", payload.areaOfInterest);
  // Only send skills when filled, so we don't send an empty string
  if (payload.skills?.trim()) body.append("skills", payload.skills.trim());
  body.append("resume", payload.resume, payload.resume.name);

  // Do NOT set Content-Type: the browser adds the multipart boundary itself
  const res = await fetch(`${API_URL}/leads-volunteer`, {
    method: "POST",
    body,
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