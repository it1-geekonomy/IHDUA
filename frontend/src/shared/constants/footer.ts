export type FooterLink = {
  label: string;
  href: string;
};

export const FOOTER_WHAT_WE_DO: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Our Impact", href: "/#our-impact" },
  { label: "Blogs & Stories", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];


export const FOOTER_GET_INVOLVED: FooterLink[] = [
  { label: "Donate", href: "/" },
  { label: "Volunteer", href: "/" },
  { label: "Partner", href: "/" },
];

export const FOOTER_HEADQUARTERS = {
  address: "IHDUA Center, Mysore-Ooty Road, Mysore, Karnataka 570008, India",
  email: "info@ihdua.org",
  emailLink: "mailto:info@ihdua.org",
  phone: "+91 821 248 1234",
  phoneLink: "tel:+918212481234",
};

export const FOOTER_SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/ihduadigital?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw%3D%3D", icon: "/footer/instagramicon.png" },
  { name: "Twitter", href: "https://twitter.com/", icon: "/footer/twittericon.png" },
  { name: "LinkedIn", href: "https://www.linkedin.com/", icon: "/footer/linkedinicon.png" },
];