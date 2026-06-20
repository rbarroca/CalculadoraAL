import React from 'react';

interface ResultsDisplayProps {
  result: any;
  data: any;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  if (!result || result.netMonthlyProfit <= 500) return null;

  return (
    <section className="mt-8 mb-4">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
            O seu AL tem potencial
          </p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Quer maximizar os seus €{Math.round(result.netMonthlyProfit).toLocaleString('pt-PT')}/mês?
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Encontre uma empresa de gestão de alojamento local certificada para gerir reservas, limpezas e hóspedes — sem preocupações.
          </p>
        </div>
        <a
          href="https://findamanageral.com"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm whitespace-nowrap"
        >
          Encontrar gestor de AL →
        </a>
      </div>
    </section>
  );
}
