import { lookup } from "node:dns/promises";
import net from "node:net";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = (process.env.DOWNLOAD_ALLOWED_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  if (net.isIPv6(ip)) {
    const l = ip.toLowerCase();
    if (l.startsWith("::ffff:")) {
      const v4 = l.slice(7);
      return net.isIPv4(v4) ? isPrivateIp(v4) : true;
    }
    return (
      l === "::1" ||
      l === "::" ||
      l.startsWith("fc") ||
      l.startsWith("fd") ||
      l.startsWith("fe80")
    );
  }
  return true;
}

const fail = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  const rawName = req.nextUrl.searchParams.get("name") || "document.pdf";

  if (!target) return fail("Missing url", 400);

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return fail("Invalid url", 400);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return fail("Invalid protocol", 400);
  }

  const host = parsed.hostname.toLowerCase();

  if (ALLOWED_HOSTS.length > 0) {
    const allowed =
      host === req.nextUrl.hostname.toLowerCase() ||
      ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
    if (!allowed) {
      return fail(
        `Host "${host}" is not in DOWNLOAD_ALLOWED_HOSTS. Add it to the env var or remove the var to allow all public hosts.`,
        403,
      );
    }
  }

  if (process.env.NODE_ENV === "production") {
    try {
      const addresses = await lookup(host, { all: true });
      if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
        return fail("Blocked: host resolves to a private/internal address", 403);
      }
    } catch {
      return fail("Could not resolve host", 502);
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), { redirect: "error", cache: "no-store" });
  } catch {
    return fail("Could not fetch file", 502);
  }

  if (!upstream.ok || !upstream.body) return fail("File not available", 502);

  const contentType = upstream.headers.get("content-type") || "application/pdf";
  if (contentType.toLowerCase().includes("text/html")) {
    return fail("Not a downloadable file", 415);
  }

  const length = Number(upstream.headers.get("content-length") || 0);
  if (length > MAX_BYTES) return fail("File too large", 413);

  const cleanName = rawName.replace(/[\r\n"\\/]+/g, "").trim() || "document.pdf";
  const asciiName = cleanName.replace(/[^\x20-\x7E]/g, "_");

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(cleanName)}`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (length > 0) headers["Content-Length"] = String(length);

  return new NextResponse(upstream.body, { headers });
}