import { ArchitectureLayer } from "./ArchitectureLayer";
import { architectureLayers } from "../data/architecture";

export function Architecture() {
  return (
    <section aria-labelledby="architecture-heading" className="space-y-6">
      <div>
        <h2 id="architecture-heading" className="text-2xl font-semibold text-white">
          Architecture
        </h2>
        <p className="mt-2 text-[#94a3b8]">
          Layered design with strict authorization boundaries between contracts.
        </p>
      </div>
      <div className="rounded-xl border border-[#1e293b] overflow-hidden">
        {architectureLayers.map((layer, i) => (
          <ArchitectureLayer
            key={layer.label}
            label={layer.label}
            components={layer.components}
            desc={layer.desc}
            isLast={i === architectureLayers.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
