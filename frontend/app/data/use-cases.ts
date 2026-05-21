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
];
