import { UseCaseCard } from "./UseCaseCard";

const useCases = [
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
];

export function UseCases() {
  return (
    <section aria-labelledby="use-cases-heading" className="space-y-10">
      <div>
        <h2 id="use-cases-heading" className="text-2xl font-semibold text-white">
          Use cases
        </h2>
        <p className="mt-2 text-[#94a3b8]">Any recurring payment can be a stream.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {useCases.map((u) => (
          <UseCaseCard key={u.title} icon={u.icon} title={u.title} desc={u.desc} />
        ))}
      </div>
    </section>
  );
}
