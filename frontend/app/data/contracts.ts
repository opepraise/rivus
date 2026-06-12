const OWNER = "SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R";

export interface Contract {
  name: string;
  role: string;
  address?: string;
  explorerUrl?: string;
}

export const contracts: Contract[] = [
  { name: "sip010-trait",    role: "SIP-010 fungible token standard interface" },
  { name: "rvus-token",      role: "RVUS — the protocol native token" },
  { name: "stream-vault",    role: "Holds STX for active streams; only registry can move funds" },
  { name: "stream-registry", role: "Open / withdraw / cancel / pause / resume / top-up streams" },
  { name: "stream-factory",  role: "Batch helpers: payroll schedules and vesting streams" },
];
