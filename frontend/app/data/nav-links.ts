export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "#how-it-works-heading", label: "How it works" },
  { href: "#use-cases-heading",    label: "Use cases" },
  { href: "#architecture-heading", label: "Architecture" },
  { href: "#lifecycle-heading",    label: "Lifecycle" },
  { href: "#contracts-heading",    label: "Contracts" },
  { href: "#security-heading",     label: "Security" },
  { href: "#roadmap-heading",      label: "Roadmap" },
  { href: "#faq-heading",          label: "FAQ" },
];
