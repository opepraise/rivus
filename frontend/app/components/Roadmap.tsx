import { RoadmapItem } from "./RoadmapItem";
import { roadmapItems } from "../data/roadmap";

export function Roadmap() {
  return (
    <section aria-labelledby="roadmap-heading" className="space-y-6">
      <div>
        <h2 id="roadmap-heading" className="text-2xl font-semibold text-white">
          Roadmap
        </h2>
        <p className="mt-2 text-[#94a3b8]">
          Where we are and where we&apos;re going.
        </p>
      </div>
      <div className="rounded-xl border border-[#1e293b] overflow-hidden">
        {roadmapItems.map((item) => (
          <RoadmapItem
            key={item.title}
            title={item.title}
            desc={item.desc}
            status={item.status}
          />
        ))}
      </div>
    </section>
  );
}
