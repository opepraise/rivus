import { FAQItem } from "./FAQItem";
import { faqItems } from "../data/faq";

export function FAQ() {
  return (
    <section aria-labelledby="faq-heading" className="space-y-6">
      <div>
        <h2 id="faq-heading" className="text-2xl font-semibold text-white">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-[#94a3b8]">Everything you need to know about Rivus.</p>
      </div>
      <div
        className="rounded-xl border border-[#1e293b] overflow-hidden"
        role="list"
        aria-label="Frequently asked questions"
      >
        {faqItems.map((item, i) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
