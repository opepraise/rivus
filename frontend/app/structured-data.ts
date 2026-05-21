export function buildProtocolSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rivus",
    description:
      "On-chain payment streaming protocol on Stacks. Stream STX per block for payroll, vesting, and subscriptions.",
    url: "https://rivus.xyz",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: "opepraise",
      url: "https://github.com/opepraise",
    },
    license: "https://opensource.org/licenses/MIT",
    codeRepository: "https://github.com/opepraise/rivus",
    programmingLanguage: ["Clarity", "TypeScript"],
    keywords: "payment streaming, stacks, bitcoin, STX, DeFi, payroll, vesting",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
