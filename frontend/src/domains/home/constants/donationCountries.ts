import countries from "world-countries";
import { getCountryCallingCode, CountryCode } from "libphonenumber-js";

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

const CURRENCY_CODES = DONATION_CURRENCIES.map((c) => c.code);

const PINNED_COUNTRIES = ["IN", "US", "GB", "AE", "SG", "AU", "CA", "DE", "FR"];

function buildCountryList(): DonationCountry[] {
  const mapped = countries.map((c) => {
    let dial = "";
    try {
      dial = `+${getCountryCallingCode(c.cca2 as CountryCode)}`;
    } catch {
      dial = c.idd.root ? `${c.idd.root}${c.idd.suffixes?.[0] || ""}` : "+";
    }

    let currency: DonationCurrency = "USD";
    const countryCurrencies = Object.keys(c.currencies || {});
    if (countryCurrencies.length > 0) {
      const first = countryCurrencies[0] as DonationCurrency;
      if (CURRENCY_CODES.includes(first)) {
        currency = first;
      }
    }

    return {
      code: c.cca2,
      name: c.name.common,
      dial,
      currency,
    };
  });

  const pinned = PINNED_COUNTRIES.map((code) => mapped.find((c) => c.code === code)).filter(Boolean) as DonationCountry[];
  
  const rest = mapped
    .filter((c) => !PINNED_COUNTRIES.includes(c.code))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [...pinned, ...rest];
}

export const DONATION_COUNTRIES = buildCountryList();

export const DEFAULT_COUNTRY = DONATION_COUNTRIES.find(c => c.code === "IN") || DONATION_COUNTRIES[0];
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
