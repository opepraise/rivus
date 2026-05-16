import { SecurityItem } from "./SecurityItem";
import { CheckIcon } from "./icons";

const securityProperties = [
  "All cross-contract auth uses contract-caller, not tx-sender — prevents principal spoofing",
  "stream-vault auth check runs before vault lookup — no state read before authorization",
  "Vault uses as-contract for safe STX custody and transfer to recipients",
  "Minimum stream amount (10,000 uSTX) and duration (10 blocks) prevent dust spam",
  "Pause/resume tracks paused duration so accrual is never double-counted",
];

export function Security() {
  return (
    <section
      aria-labelledby="security-heading"
      className="rounded-xl border border-[#6366f1]/20 bg-[#0d1117] p-8 space-y-4 hover:border-[#6366f1]/40 transition-colors"
    >
      <div className="flex items-center gap-3">
        <CheckIcon className="text-[#6366f1] h-5 w-5" />
        <h2 id="security-heading" className="text-xl font-semibold text-white">
          Security properties
        </h2>
      </div>
      <ul className="space-y-2 text-sm text-[#94a3b8]" aria-label="Security guarantees">
        {securityProperties.map((item) => (
          <SecurityItem key={item} text={item} />
        ))}
      </ul>
    </section>
  );
}
