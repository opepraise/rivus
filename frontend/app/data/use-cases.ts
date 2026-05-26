export interface UseCase {
  icon: string;
  title: string;
  desc: string;
}

export const useCases: UseCase[] = [
  {
    icon: "01",
    title: "Payroll",
    desc: "Pay contributors automatically. STX flows every block until cancelled — no cron jobs, no trust required.",
  },
  {
    icon: "02",
    title: "Vesting",
    desc: "Define a cliff then stream linearly. Beneficiaries withdraw earned amounts at any time.",
  },
  {
    icon: "03",
    title: "Subscriptions",
    desc: "Protocol fees, SaaS billing, DAO memberships — any recurring payment can be a stream.",
  },
  {
    icon: "04",
    title: "Grant disbursement",
    desc: "Stream grant funding to recipients over time. Unused funds stay with the grantor if milestones are missed.",
  },
  {
    icon: "05",
    title: "DAO treasury",
    desc: "Replace lump-sum proposals with continuous disbursements. DAOs can cancel streams if contributors go inactive.",
  },
  {
    icon: "06",
    title: "Token distribution",
    desc: "Stream RVUS or STX rewards to community members continuously instead of periodic batch drops.",
  },
];
