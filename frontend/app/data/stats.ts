export interface ProtocolStat {
  label: string;
  value: string;
  desc: string;
}

export const protocolStats: ProtocolStat[] = [
  {
    label: "Contracts",
    value: "5",
    desc: "Deployed Clarity contracts — vault, registry, factory, token, and trait",
  },
  {
    label: "Test coverage",
    value: "100%",
    desc: "Every public function covered by Clarinet unit tests",
  },
  {
    label: "Lines of Clarity",
    value: "~400",
    desc: "Total contract code across all five Clarity files",
  },
  {
    label: "Min stream",
    value: "0.01 STX",
    desc: "Minimum deposit to open a payment stream (10,000 uSTX)",
  },
];
