import { UseCaseCard } from "./UseCaseCard";
import { useCases } from "../data";

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
