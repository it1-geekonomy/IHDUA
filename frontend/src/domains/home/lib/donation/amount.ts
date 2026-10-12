/** Digit-only money helpers — avoid Number() for large gifts. */

const ONE_CRORE_DIGITS = "10000000";

export function toAmountDigits(raw: string) {
  return raw.replace(/\D/g, "");
}

export function normalizeAmountDigits(digits: string) {
  return digits.replace(/^0+/, "");
}

/** Indian grouping (e.g. ₹12,34,567). */
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

/** Western grouping (e.g. $1,250). */
export function formatWestern(digits: string, symbol: string) {
  const d = normalizeAmountDigits(toAmountDigits(digits));
  if (!d) return "";

  const withCommas = d.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${symbol}${withCommas}`;
}

export function formatDonationAmount(
  digits: string,
  currency: string,
  symbol: string,
) {
  if (currency === "INR") return formatINR(digits);
  return formatWestern(digits, symbol);
}

export function isCroreOrAbove(digits: string) {
  const d = normalizeAmountDigits(toAmountDigits(digits));
  if (!d) return false;
  if (d.length !== ONE_CRORE_DIGITS.length) {
    return d.length > ONE_CRORE_DIGITS.length;
  }
  return d >= ONE_CRORE_DIGITS;
}

export function ensureRupeePrefix(amount: string) {
  const trimmed = amount.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("₹") ? trimmed : `₹${trimmed}`;
}
