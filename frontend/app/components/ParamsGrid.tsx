import { StatCard } from "./StatCard";

const params = [
  { label: "Min Stream",     value: "10,000 uSTX" },
  { label: "Min Duration",   value: "10 blocks" },
  { label: "Rate",           value: "Per-block linear" },
  { label: "Blocks/Month",   value: "4,320" },
  { label: "Stream Token",   value: "STX" },
  { label: "Protocol Token", value: "RVUS" },
];

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
