export const ADMIN_NAV = [
  { href: "/admin/users", label: "Users", icon: "users" as const },
  { href: "/admin/donations", label: "Donations", icon: "donations" as const },
] as const;

export const ADMIN_COPY = {
  brand: "IHDUA CMS",
  loginTitle: "Admin Login",
  loginSubtitle: "Sign in to manage users and donations.",
  email: "Email",
  password: "Password",
  signIn: "Sign in",
  signingIn: "Signing in…",
  logout: "Log out",
  usersTitle: "Users",
  usersSubtitle: "Admin accounts with access to the CMS.",
  donationsTitle: "Donations",
  donationsSubtitle: "All donor payments and their status.",
  emptyUsers: "No users found.",
  emptyDonations: "No donations yet.",
  loading: "Loading…",
} as const;
