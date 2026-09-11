/** Digit-only INR helpers — never use Number() (float precision corrupts large gifts). */

const ONE_CRORE = 10_000_000n;

export function toAmountDigits(raw: string) {
  return raw.replace(/\D/g, "");
}

export function normalizeAmountDigits(digits: string) {
  return digits.replace(/^0+/, "");
}

/** Indian grouping (e.g. ₹12,34,567) via string ops — safe for any length. */
export function formatINR(digits: string) {
  const d = normalizeAmountDigits(toAmountDigits(digits));
  if (!d) return "";

  let rest = d;
  let out = rest.slice(-3);
  rest = rest.slice(0, -3);
  while (rest.length) {
    out = `${rest.slice(-2)},${out}`;
    rest = rest.slice(0, -2);
  }
  return `₹${out}`;
}

export function isCroreOrAbove(digits: string) {
  const d = normalizeAmountDigits(toAmountDigits(digits));
  if (!d) return false;
  try {
    return BigInt(d) >= ONE_CRORE;
  } catch {
    return false;
  }
}

export function ensureRupeePrefix(amount: string) {
  const trimmed = amount.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("₹") ? trimmed : `₹${trimmed}`;
}
