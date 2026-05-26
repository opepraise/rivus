import { techStack } from "../data/tech-stack";
import { ExternalLinkIcon } from "./icons";

export function TechStack() {
  return (
    <section aria-labelledby="tech-heading" className="space-y-6">
      <div>
        <h2 id="tech-heading" className="text-2xl font-semibold text-white">
          Built with
        </h2>
        <p className="mt-2 text-(--text-muted)">The technology powering Rivus.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {techStack.map((tech) => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tech.name}: ${tech.purpose} (opens in new tab)`}
            className="flex items-center justify-between gap-4 rounded-xl border border-(--border) bg-(--surface) px-5 py-4 hover:border-(--accent)/30 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-white">{tech.name}</p>
              <p className="text-xs text-(--text-muted)">{tech.purpose}</p>
            </div>
            <ExternalLinkIcon className="text-(--text-muted) group-hover:text-(--accent-muted) transition-colors shrink-0" />
          </a>
        ))}
      </div>
    </section>
  );
}
