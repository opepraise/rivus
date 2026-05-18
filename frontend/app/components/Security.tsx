import { securityProperties } from "../data";

export function Security() {
  return (
    <section
      aria-labelledby="security-heading"
      className="rounded-xl border border-[#6366f1]/20 bg-[#0d1117] p-8 space-y-4 hover:border-[#6366f1]/40 transition-colors"
    >
      <h2 id="security-heading" className="text-xl font-semibold text-white">
        Security properties
      </h2>
      <ul className="space-y-2 text-sm text-[#94a3b8]" aria-label="Security guarantees">
        {securityProperties.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-[#6366f1] mt-0.5 shrink-0" aria-hidden="true">
              &#8594;
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
