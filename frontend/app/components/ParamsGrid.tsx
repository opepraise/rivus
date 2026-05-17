import { StatCard } from "./StatCard";
import { params } from "../data";

export function ParamsGrid() {
  return (
    <section aria-labelledby="params-heading">
      <h2 id="params-heading" className="sr-only">Protocol parameters</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {params.map((p) => (
          <StatCard key={p.label} label={p.label} value={p.value} />
        ))}
      </div>
    </section>
  );
}
