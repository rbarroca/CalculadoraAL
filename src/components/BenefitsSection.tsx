import React from 'react';

const benefits = [
  {
    title: 'Planeamento Informado',
    description: 'Evite surpresas e tome decisões baseadas em dados reais do mercado'
  },
  {
    title: 'Comparação Directa',
    description: 'Compare AL e arrendamento tradicional para escolher a estratégia ideal'
  },
  {
    title: 'Preparação Fiscal',
    description: 'Antecipe IRS, IVA e contribuição extraordinária sobre o património'
  },
  {
    title: 'Análise de Cenários',
    description: 'Teste diferentes preços, ocupação e custos para otimizar lucros'
  },
  {
    title: 'Previsão de ROI',
    description: 'Calcule quanto tempo leva para recuperar o investimento inicial'
  },
  {
    title: 'Análise de Risco',
    description: 'Identifique o ponto de equilíbrio e riscos de investimento'
  }
];

export default function BenefitsSection() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Vantagens da Simulação
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Por que usar a calculadora antes de investir no seu alojamento local
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" className="w-6 h-6 text-green-500">
                <g fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="m10.97 4.97l-.02.022l-3.473 4.425l-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                </g>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
