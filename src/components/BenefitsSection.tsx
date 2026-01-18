import React from 'react';
import { CheckCircle2 } from 'lucide-react';

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
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
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
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
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
