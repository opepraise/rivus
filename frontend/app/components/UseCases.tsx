import { UseCaseCard } from "./UseCaseCard";
import { SectionHeading } from "./SectionHeading";
import { useCases } from "../data";

export function UseCases() {
  return (
    <section aria-labelledby="use-cases-heading" className="space-y-10">
      <SectionHeading
        id="use-cases-heading"
        title="Use cases"
        subtitle="Any recurring payment can be a stream."
      />
      <div className="grid gap-6 sm:grid-cols-3">
        {useCases.map((u) => (
          <UseCaseCard key={u.title} icon={u.icon} title={u.title} desc={u.desc} />
        ))}
      </div>
    </section>
  );
}
