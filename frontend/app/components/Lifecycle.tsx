import { LifecycleRow } from "./LifecycleRow";

const lifecycle = [
  { step: "open-stream",          actor: "sender",    desc: "Lock STX in vault, set rate per block" },
  { step: "withdraw-from-stream", actor: "recipient", desc: "Claim earned balance at any time" },
  { step: "top-up-stream",        actor: "sender",    desc: "Add more STX, rate recalculates" },
  { step: "pause-stream",         actor: "sender",    desc: "Pause accrual; blocks stop counting" },
  { step: "resume-stream",        actor: "sender",    desc: "Restart accrual from current block" },
  { step: "cancel-stream",        actor: "sender",    desc: "Refund unstreamed portion, pay earned" },
];

export function Lifecycle() {
  return (
    <section aria-labelledby="lifecycle-heading" className="space-y-6">
      <div>
        <h2 id="lifecycle-heading" className="text-2xl font-semibold text-white">
          Stream lifecycle
        </h2>
        <p className="mt-2 text-[#94a3b8]">Every action is an on-chain transaction.</p>
      </div>
      <div
        role="table"
        aria-label="Stream lifecycle operations"
        className="rounded-xl border border-[#1e293b] overflow-hidden"
      >
        <div role="rowgroup">
          {lifecycle.map((l, i) => (
            <LifecycleRow
              key={l.step}
              step={l.step}
              actor={l.actor}
              desc={l.desc}
              isLast={i === lifecycle.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
