import { ContractRow } from "./ContractRow";
import { contracts } from "../data";

export function Contracts() {
  return (
    <section aria-labelledby="contracts-heading" className="space-y-6">
      <div>
        <h2 id="contracts-heading" className="text-2xl font-semibold text-white">
          Contracts
        </h2>
        <p className="mt-2 text-[#94a3b8]">
          Five Clarity contracts on Stacks (Clarity 3, epoch 3.1).
        </p>
      </div>
      <div
        role="table"
        aria-label="Smart contract registry"
        className="rounded-xl border border-[#1e293b] overflow-hidden"
      >
        <div role="rowgroup">
          {contracts.map((c, i) => (
            <ContractRow
              key={c.name}
              name={c.name}
              role={c.role}
              isLast={i === contracts.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
