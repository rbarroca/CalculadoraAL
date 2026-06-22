import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQSectionProps {
  trackFAQOpen: (question: string) => void;
}

const faqData = [
  {
    question: 'Como calcular o rendimento de um alojamento local?',
    answer: 'Para calcular o rendimento do seu AL, multiplique o preço por noite pela taxa de ocupação mensal e subtraia os custos operacionais (limpeza, plataformas, manutenção, seguros, IMI). Use a nossa calculadora para simular cenários específicos por localização em Portugal.'
  },
  {
    question: 'Como simular os impostos de alojamento local?',
    answer: 'No AL paga IRS sobre os rendimentos (coeficiente 0,35 no regime simplificado), CEAL (Contribuição Extraordinária AL) entre 4% e 15% conforme a zona, e IVA se faturar mais de €14.500/ano. O nosso simulador de impostos AL calcula automaticamente cada encargo.'
  },
  {
    question: 'O AL é mais rentável do que o arrendamento tradicional?',
    answer: 'O AL pode gerar 2 a 3 vezes mais rendimento do que o arrendamento tradicional, mas requer mais gestão ativa. Depende da localização, sazonalidade e taxa de ocupação. Use a calculadora para comparar os dois cenários com os dados reais do seu imóvel.'
  },
  {
    question: 'Como calcular a rentabilidade de um imóvel para arrendamento?',
    answer: 'A rentabilidade bruta do arrendamento calcula-se dividindo a renda anual pelo valor do imóvel. Para a rentabilidade líquida, desconte IRS (28% sobre rendas), IMI, manutenção e seguros. Compare sempre com o cenário AL para escolher a melhor opção.'
  },
  {
    question: 'Como calcular a taxa de ocupação de um alojamento local?',
    answer: 'A taxa de ocupação é o número de noites vendidas a dividir pelo total de noites disponíveis. Em Portugal, a média varia entre 60-80% nas cidades turísticas (Lisboa, Porto, Algarve). A nossa calculadora de taxa de ocupação permite análise mês a mês com benchmarks por destino.'
  },
  {
    question: 'Como funciona o simulador de mais-valias do alojamento local?',
    answer: 'O simulador calcula o imposto sobre mais-valias na venda do imóvel AL aplicando os coeficientes de desvalorização monetária da AT, deduzindo despesas de aquisição e alienação, e comparando a taxa liberatória de 28% com o englobamento IRS para encontrar a opção mais vantajosa.'
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
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-bold text-gray-900 pr-6 flex-1 tracking-tight">{faq.question}</h3>
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100" aria-hidden="true">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-orange-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`px-10 py-7 bg-gray-50 border-t border-gray-200 ${openIndex === index ? 'block animate-in fade-in duration-200' : 'hidden'}`}
                role="region"
                aria-hidden={openIndex !== index}
              >
                <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
