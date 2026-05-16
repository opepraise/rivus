import { HowItWorksStep } from "./HowItWorksStep";
import { howItWorksSteps } from "../data/how-it-works";

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="space-y-6">
      <div>
        <h2 id="how-it-works-heading" className="text-2xl font-semibold text-white">
          How it works
        </h2>
        <p className="mt-2 text-[#94a3b8]">Four steps from deposit to withdrawal.</p>
      </div>
      <ol aria-label="Steps to stream payments with Rivus">
        {howItWorksSteps.map((step, i) => (
          <HowItWorksStep
            key={step.number}
            number={step.number}
            title={step.title}
            desc={step.desc}
            isLast={i === howItWorksSteps.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}
