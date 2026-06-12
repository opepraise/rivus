const OWNER = "SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R";

export interface Contract {
  name: string;
  role: string;
  address?: string;
  explorerUrl?: string;
}

export const contracts: Contract[] = [
  {
    name: "sip010-trait",
    role: "SIP-010 fungible token standard interface",
    address: `${OWNER}.sip010-trait`,
    explorerUrl: `https://explorer.hiro.so/txid/${OWNER}.sip010-trait?chain=mainnet`,
  },
  {
    name: "rvus-token",
    role: "RVUS — the protocol native token",
    address: `${OWNER}.rvus-token`,
    explorerUrl: `https://explorer.hiro.so/txid/${OWNER}.rvus-token?chain=mainnet`,
  },
  {
    name: "stream-vault",
    role: "Holds STX for active streams; only registry can move funds",
    address: `${OWNER}.stream-vault`,
    explorerUrl: `https://explorer.hiro.so/txid/${OWNER}.stream-vault?chain=mainnet`,
  },
  {
    name: "stream-registry",
    role: "Open / withdraw / cancel / pause / resume / top-up streams",
    address: `${OWNER}.stream-registry`,
    explorerUrl: `https://explorer.hiro.so/txid/${OWNER}.stream-registry?chain=mainnet`,
  },
  {
    name: "stream-factory",
    role: "Batch helpers: payroll schedules and vesting streams",
    address: `${OWNER}.stream-factory`,
    explorerUrl: `https://explorer.hiro.so/txid/${OWNER}.stream-factory?chain=mainnet`,
  },
];
