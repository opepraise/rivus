import { LifecycleRow } from "./LifecycleRow";
import { lifecycleSteps } from "../data";

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
          {lifecycleSteps.map((l, i) => (
            <LifecycleRow
              key={l.step}
              step={l.step}
              actor={l.actor}
              desc={l.desc}
              isLast={i === lifecycleSteps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
