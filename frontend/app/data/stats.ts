export interface ProtocolStat {
  label: string;
  value: string;
  desc: string;
  live?: boolean;
}

export const protocolStats: ProtocolStat[] = [
  {
    label: "Streams created",
    value: "0",
    live: true,
    desc: "Total payment streams opened on mainnet since launch",
  },
  {
    label: "Contracts",
    value: "5",
    desc: "Deployed Clarity contracts — vault, registry, factory, token, and trait",
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
