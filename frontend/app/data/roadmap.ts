export type RoadmapStatus = "done" | "in-progress" | "planned";

export interface RoadmapItem {
  title: string;
  desc: string;
  status: RoadmapStatus;
}

export const roadmapItems: RoadmapItem[] = [
  {
    title: "Core streaming contracts",
    desc: "stream-vault, stream-registry, and stream-factory deployed on simnet with full test coverage.",
    status: "done",
  },
  {
    title: "RVUS token",
    desc: "SIP-010 compliant native protocol token with mint and transfer support.",
    status: "done",
  },
  {
    title: "Testnet deployment",
    desc: "All contracts deployed and verified on Stacks testnet.",
    status: "done",
  },
  {
    title: "Third-party audit",
    desc: "Formal security audit of all Clarity contracts before mainnet launch.",
    status: "planned",
  },
  {
    title: "Mainnet deployment",
    desc: "All five contracts live on Stacks mainnet under SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.",
    status: "done",
  },
  {
    title: "Governance module",
    desc: "On-chain voting for protocol parameter changes using RVUS token.",
    status: "planned",
  },
  {
    title: "TypeScript SDK",
    desc: "rivus-sdk on npm — read-only queries and transaction builders for all registry, factory, vault, and token functions.",
    status: "in-progress",
  },
  {
    title: "Stream dashboard",
    desc: "Web app for opening, monitoring, and managing streams with wallet integration.",
    status: "planned",
  },
];
