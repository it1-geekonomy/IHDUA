export const VISIT_OFFICE_DEFAULTS = {
  label: "Find Us",
  heading: "Visit Our Office",
  description:
    "We are located in Mysore, Karnataka. You are welcome to visit us to learn more about our work, explore collaboration opportunities or discuss how you can get involved.",
  buttonText: "Get Direction",
  address: "IHDUA Center, Mysore-Ooty Road, Mysore, Karnataka 570008, India",
};

export const getDirectionsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

export const getMapEmbedUrl = (address: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;