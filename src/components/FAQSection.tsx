import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQSectionProps {
  trackFAQOpen: (question: string) => void;
}

const faqData = [
  {
    question: 'Quanto rende o Alojamento Local em Lisboa, Porto ou Algarve?',
    answer: 'A rentabilidade varia conforme a localização: Lisboa tem preços médios de €80-100/noite, Porto €60-80/noite, e Algarve €90-130/noite. A taxa de ocupação média situa-se entre 60-80% nas principais cidades turísticas.'
  },
  {
    question: 'O que é mais rentável: AL ou arrendamento tradicional?',
    answer: 'O AL pode ser 2-3x mais rentável que o arrendamento tradicional, mas requer mais gestão. Depende da localização, sazonalidade e capacidade de manter alta ocupação. Use a calculadora para comparar cenários específicos.'
  },
  {
    question: 'Que impostos tenho de pagar no AL em Portugal?',
    answer: 'No AL paga IRS sobre os rendimentos, IVA se faturar mais de €12.500/ano, e contribuição extraordinária sobre o património de 7,5% para prédios urbanos. Pode haver também IMI adicional.'
  },
  {
    question: 'Preciso de licença para abrir um AL?',
    answer: 'Sim, precisa de registo no RNAL (Registo Nacional de Alojamento Local) e cumprir requisitos de segurança, acessibilidade e localização definidos pela câmara municipal local.'
  },
  {
    question: 'Como calcular a taxa de ocupação média de um AL?',
    answer: 'A taxa média em Portugal varia entre 40-80%. Cidades turísticas como Lisboa, Porto e Algarve têm taxas mais altas. Considere sazonalidade: verão 70-90%, inverno 30-60%.'
  },
  {
    question: 'Quais os principais custos de um AL?',
    answer: 'Limpeza (€15-30/estadia), manutenção (2-5% receita), comissões plataformas (12-18%), seguros (€200-500/ano), utilities, consumíveis e gestão se terceirizada (10-25%).'
  }
];

export default function FAQSection({ trackFAQOpen }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    if (openIndex !== index) {
      trackFAQOpen(faqData[index].question);
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Perguntas Frequentes
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          Respostas às dúvidas mais comuns sobre alojamento local em Portugal
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm overflow-hidden">
          {faqData.map((faq, index) => (
            <div key={index} className="transition-all duration-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-10 py-7 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <h3 className="text-lg font-bold text-gray-900 pr-6 flex-1 tracking-tight">{faq.question}</h3>
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-orange-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-10 py-7 bg-gray-50 border-t border-gray-200 animate-in fade-in duration-200">
                  <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
