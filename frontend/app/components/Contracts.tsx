import { ContractRow } from "./ContractRow";
import { SectionHeading } from "./SectionHeading";
import { contracts } from "../data";

export function Contracts() {
  return (
    <section aria-labelledby="contracts-heading" className="space-y-6">
      <SectionHeading
        id="contracts-heading"
        title="Contracts"
        subtitle="Five Clarity contracts live on Stacks mainnet (Clarity 3, epoch 3.1)."
      />
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
              address={c.address}
              isLast={i === contracts.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
