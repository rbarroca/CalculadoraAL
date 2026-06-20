import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title?: string;
  items: FAQItem[];
}

export default function FAQAccordion({ title = 'Perguntas Frequentes', items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{title}</h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm overflow-hidden">
            {items.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-base font-bold text-gray-900 pr-6 flex-1 tracking-tight">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                    {openIndex === index
                      ? <ChevronUp className="h-5 w-5 text-orange-600" />
                      : <ChevronDown className="h-5 w-5 text-orange-600" />
                    }
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
