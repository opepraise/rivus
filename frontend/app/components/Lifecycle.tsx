import { LifecycleRow } from "./LifecycleRow";
import { SectionHeading } from "./SectionHeading";
import { lifecycleSteps } from "../data";

export function Lifecycle() {
  return (
    <section aria-labelledby="lifecycle-heading" className="space-y-6">
      <SectionHeading
        id="lifecycle-heading"
        title="Stream lifecycle"
        subtitle="Every action is an on-chain transaction."
      />
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
