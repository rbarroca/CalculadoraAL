import React from 'react';

export default function Hero() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Calcular Rendimento de Alojamento Local
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Simulador gratuito para proprietários e investidores em Portugal. Calcule receitas, custos e lucro líquido do seu AL, simule IRS e CEAL, e compare com arrendamento tradicional — com dados atualizados para Lisboa, Porto, Algarve e mais.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2.5 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" className="w-6 h-6 text-green-500 flex-shrink-0" aria-hidden="true">
                  <path fill="currentColor" d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425z"/>
                </svg>
                <span className="text-base font-semibold">Cálculo em Tempo Real</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" className="w-6 h-6 text-green-500 flex-shrink-0" aria-hidden="true">
                  <path fill="currentColor" d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425z"/>
                </svg>
                <span className="text-base font-semibold">Dados Atualizados</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" className="w-6 h-6 text-green-500 flex-shrink-0" aria-hidden="true">
                  <path fill="currentColor" d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425z"/>
                </svg>
                <span className="text-base font-semibold">100% Gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
