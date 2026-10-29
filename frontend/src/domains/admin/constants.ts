export const ADMIN_NAV_SECTIONS = [
  {
    title: "Financials",
    items: [
      { href: "/admin/donations", label: "Donations", icon: "donations" as const },
    ],
  },
  {
    title: "Forms & Inquiries",
    items: [
      { href: "/admin/forms/contact", label: "Contact Leads", icon: "contact" as const },
      { href: "/admin/forms/volunteer", label: "Volunteer Leads", icon: "volunteer" as const },
      { href: "/admin/forms/partnership", label: "Partnership Inquiries", icon: "partnership" as const },
      { href: "/admin/newsletter-subscribers", label: "Newsletter Subscribers", icon: "newsletter" as const },
    ],
  },
  {
    title: "Blogs & Stories",
    items: [
      { href: "/admin/blog-categories", label: "Blog Categories", icon: "categories" as const },
      { href: "/admin/blogs-and-stories", label: "Blogs & Stories", icon: "blogs" as const },
    ],
  },
  {
    title: "Content & Legal",
    items: [
      { href: "/admin/organizational-documents", label: "Organizational Documents", icon: "orgDocs" as const },
      { href: "/admin/annual-reports", label: "Annual Reports", icon: "reports" as const },
      { href: "/admin/milestones", label: "Key Milestones", icon: "milestones" as const },
      { href: "/admin/terms-and-conditions", label: "Terms & Conditions", icon: "terms" as const },
      { href: "/admin/privacy-policy", label: "Privacy Policy", icon: "privacy" as const },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/users", label: "Users & Admins", icon: "users" as const },
    ],
  },
] as const;

export const ADMIN_NAV = [
  { href: "/admin/donations", label: "Donations", icon: "donations" as const },
  { href: "/admin/forms/contact", label: "Contact Leads", icon: "contact" as const },
  { href: "/admin/forms/volunteer", label: "Volunteer Leads", icon: "volunteer" as const },
  { href: "/admin/forms/partnership", label: "Partnership Inquiries", icon: "partnership" as const },
  { href: "/admin/newsletter-subscribers", label: "Newsletter Subscribers", icon: "newsletter" as const },
  { href: "/admin/blog-categories", label: "Blog Categories", icon: "categories" as const },
  { href: "/admin/blogs-and-stories", label: "Blogs & Stories", icon: "blogs" as const },
  { href: "/admin/organizational-documents", label: "Organizational Documents", icon: "orgDocs" as const },
  { href: "/admin/annual-reports", label: "Annual Reports", icon: "reports" as const },
  { href: "/admin/milestones", label: "Key Milestones", icon: "milestones" as const },
  { href: "/admin/terms-and-conditions", label: "Terms & Conditions", icon: "terms" as const },
  { href: "/admin/privacy-policy", label: "Privacy Policy", icon: "privacy" as const },
  { href: "/admin/users", label: "Users", icon: "users" as const },
] as const;

export const CONTACT_SUBJECTS = [
  "General Enquiry",
  "Programme Information",
  "Donation Enquiry",
  "Volunteer Opportunities",
  "Partnership & Collaboration",
  "CSR Projects",
  "Education Programmes",
  "Healthcare Initiatives",
  "Women's Empowerment",
  "Other",
] as const;

export const VOLUNTEER_AREAS = [
  "Teaching & Education",
  "Healthcare & Medical Camps",
  "Community Outreach",
  "Women Empowerment",
  "Agriculture & Sustainability",
  "Youth Development",
  "Event Support",
  "Design & Digital Marketing",
  "Administration & Operations",
  "Other",
] as const;

export const PARTNERSHIP_TYPES = [
  "CSR Partnership",
  "NGO / Non-Profit Collaboration",
  "Academic Partnership",
  "Corporate Partnership",
  "Programme Sponsorship",
  "Infrastructure Development",
  "Other",
] as const;

export const ADMIN_COPY = {
  brand: "IHDUA CMS",
  portalTitle: "Administrative Portal",
  loginTitle: "Sign in to IHDUA Portal",
  loginSubtitle: "Secure access for academy administrators and authorized personnel.",
  email: "Email Address",
  emailPlaceholder: "name@ihdua.org",
  password: "Password",
  passwordPlaceholder: "••••••••••••",
  rememberMe: "Remember this device",
  signIn: "Sign in to Dashboard",
  signingIn: "Verifying credentials…",
  logout: "Sign out",
  sessionExpiredTitle: "Session Expired",
  sessionExpiredMessage: "Your session has timed out for security. Please sign in again to continue.",
  loggedOutTitle: "Signed Out",
  loggedOutMessage: "You have securely signed out of your administrator account.",
  crossTabTitle: "Session Ended",
  crossTabMessage: "Your session was terminated in another browser window.",
  usersTitle: "Users & Administrators",
  usersSubtitle: "Authorized admin accounts with system management privileges.",
  donationsTitle: "Donation Transactions",
  donationsSubtitle: "Real-time ledger of online donor contributions and payment statuses.",
  emptyUsers: "No admin users found.",
  emptyDonations: "No donations recorded yet.",
  loading: "Loading portal…",
} as const;
