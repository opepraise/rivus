export interface TechItem {
  name: string;
  purpose: string;
  url: string;
}

export const techStack: TechItem[] = [
  {
    name: "Stacks",
    purpose: "Layer-2 on Bitcoin with smart contract support",
    url: "https://stacks.co",
  },
  {
    name: "Clarity",
    purpose: "Decidable, non-Turing-complete smart contract language",
    url: "https://clarity-lang.org",
  },
  {
    name: "Clarinet",
    purpose: "Local contract development and testing framework",
    url: "https://github.com/hirosystems/clarinet",
  },
  {
    name: "Bitcoin",
    purpose: "Settlement layer providing finality to Stacks blocks",
    url: "https://bitcoin.org",
  },
];
