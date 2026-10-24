export const VISIT_OFFICE_DEFAULTS = {
  label: "Find Us",
  heading: "Visit Our Office",
  description:
    "We are located in Mysore, Karnataka. You are welcome to visit us to learn more about our work, explore collaboration opportunities or discuss how you can get involved.",
  buttonText: "Get Direction",
  address: "IHDUA Center, Mysore-Ooty Road, Mysore, Karnataka 570008, India",
};

export const getDirectionsUrl = (_address?: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=Internation+Human+Development+%26+Upliftment+Academy+Trust%2C+18+%26+19%2C+Hebbal+Industrial+Estate%2C+near+Bharath+Cancer+Hospital%2C+Hebbalu%2C+Karnataka+570016`;

export const getMapEmbedUrl = (address: string) =>
  `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62358.90187617475!2d76.53474904863282!3d12.354011600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7a472273ff37%3A0xa4ff71e3199f3fa7!2sInternation%20Human%20Development%20%26%20Upliftment%20Academy%20Trust!5e0!3m2!1sen!2sus!4v1792849390127!5m2!1sen!2sus`;