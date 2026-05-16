"use client";

import { useState } from "react";
import { ChevronDownIcon } from "./icons";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

export function FAQItem({ question, answer, index }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  const id = `faq-answer-${index}`;

  return (
    <div className="border-b border-[#1e293b] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-white hover:text-[#818cf8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-inset"
      >
        <span>{question}</span>
        <ChevronDownIcon
          className={`shrink-0 text-[#94a3b8] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={id}
        role="region"
        aria-label={question}
        hidden={!open}
        className="px-6 pb-4 text-sm text-[#94a3b8] leading-relaxed"
      >
        {answer}
      </div>
    </div>
  );
}
