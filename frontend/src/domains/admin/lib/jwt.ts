export type JwtPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

/**
 * Safely decodes the payload of a JWT token on the client side without external dependencies.
 * Handles base64url decoding, padding, and UTF-8 characters gracefully.
 */
export function decodeJwtPayload<T = JwtPayload>(token: string | null | undefined): T | null {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Pad with '=' so string length is a multiple of 4
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    // Decode base64 to string
    const decodedBinary = atob(base64);

    // Handle multi-byte UTF-8 sequences properly
    const bytes = Uint8Array.from(decodedBinary, (char) => char.charCodeAt(0));
    const decodedString = new TextDecoder().decode(bytes);

    return JSON.parse(decodedString) as T;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to decode JWT payload:", error);
    }
    return null;
  }
}

/**
 * Returns true if the token is null, invalid, or expired.
 * A buffer in seconds (default 10s) can be provided to consider the token expired slightly before actual exp time.
 */
export function isTokenExpired(
  token: string | null | undefined,
  bufferSeconds: number = 10,
): boolean {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;

  const currentTimestampSeconds = Math.floor(Date.now() / 1000);
  return payload.exp - bufferSeconds <= currentTimestampSeconds;
}

/**
 * Returns remaining milliseconds until the token expires.
 * Returns 0 if already expired or invalid.
 */
export function getTokenRemainingMs(token: string | null | undefined): number {
  if (!token) return 0;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return 0;

  const expiryMs = payload.exp * 1000;
  const remaining = expiryMs - Date.now();
  return remaining > 0 ? remaining : 0;
}

/**
 * Returns the exact Date when the token expires, or null if unknown.
 */
export function getJwtExpiryDate(token: string | null | undefined): Date | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return new Date(payload.exp * 1000);
}
