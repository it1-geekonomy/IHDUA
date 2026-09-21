export type DonationCurrency =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "AED"
  | "SGD"
  | "AUD"
  | "CAD";

export type DonationCountry = {
  code: string;
  name: string;
  dial: string;
  currency: DonationCurrency;
};

/** Curated list for dial code + default currency. */
export const DONATION_COUNTRIES: DonationCountry[] = [
  { code: "IN", name: "India", dial: "+91", currency: "INR" },
  { code: "US", name: "United States", dial: "+1", currency: "USD" },
  { code: "GB", name: "United Kingdom", dial: "+44", currency: "GBP" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", currency: "AED" },
  { code: "SG", name: "Singapore", dial: "+65", currency: "SGD" },
  { code: "AU", name: "Australia", dial: "+61", currency: "AUD" },
  { code: "CA", name: "Canada", dial: "+1", currency: "CAD" },
  { code: "DE", name: "Germany", dial: "+49", currency: "EUR" },
  { code: "FR", name: "France", dial: "+33", currency: "EUR" },
  { code: "NL", name: "Netherlands", dial: "+31", currency: "EUR" },
  { code: "IE", name: "Ireland", dial: "+353", currency: "EUR" },
  { code: "NZ", name: "New Zealand", dial: "+64", currency: "AUD" },
  { code: "MY", name: "Malaysia", dial: "+60", currency: "SGD" },
  { code: "QA", name: "Qatar", dial: "+974", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", currency: "AED" },
  { code: "OTHER", name: "Other / International", dial: "+", currency: "USD" },
];

export const DONATION_CURRENCIES: {
  code: DonationCurrency;
  label: string;
  symbol: string;
  presets: string[];
}[] = [
  { code: "INR", label: "INR (₹)", symbol: "₹", presets: ["500", "1500", "2500", "5000"] },
  { code: "USD", label: "USD ($)", symbol: "$", presets: ["10", "25", "50", "100"] },
  { code: "EUR", label: "EUR (€)", symbol: "€", presets: ["10", "25", "50", "100"] },
  { code: "GBP", label: "GBP (£)", symbol: "£", presets: ["10", "25", "50", "100"] },
  { code: "AED", label: "AED (د.إ)", symbol: "د.إ", presets: ["25", "50", "100", "250"] },
  { code: "SGD", label: "SGD (S$)", symbol: "S$", presets: ["15", "30", "50", "100"] },
  { code: "AUD", label: "AUD (A$)", symbol: "A$", presets: ["15", "30", "50", "100"] },
  { code: "CAD", label: "CAD (C$)", symbol: "C$", presets: ["15", "30", "50", "100"] },
];

export const DEFAULT_COUNTRY = DONATION_COUNTRIES[0];
export const DEFAULT_CURRENCY: DonationCurrency = "INR";

export function getCurrencyMeta(code: DonationCurrency) {
  return (
    DONATION_CURRENCIES.find((c) => c.code === code) ?? DONATION_CURRENCIES[0]
  );
}

export function getCountryByCode(code: string) {
  return DONATION_COUNTRIES.find((c) => c.code === code) ?? DEFAULT_COUNTRY;
}

export function formatPresetLabel(digits: string, currency: DonationCurrency) {
  const { symbol } = getCurrencyMeta(currency);
  if (currency === "INR") {
    // keep Indian-style commas for INR presets in UI chips
    let rest = digits;
    let out = rest.slice(-3);
    rest = rest.slice(0, -3);
    while (rest.length) {
      out = `${rest.slice(-2)},${out}`;
      rest = rest.slice(0, -2);
    }
    return `${symbol}${out}`;
  }
  return `${symbol}${digits}`;
}
