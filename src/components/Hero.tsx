import React from 'react';

export default function Hero() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Descubra o Potencial do Seu Imóvel
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light">
              Simule receitas, custos e lucros do seu alojamento local em Portugal. Compare com arrendamento tradicional e tome decisões informadas sobre o seu investimento.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" className="w-5 h-5 text-green-500 flex-shrink-0">
                  <path fill="currentColor" d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425z"/>
                </svg>
                <span className="text-sm font-medium">Cálculo em Tempo Real</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" className="w-5 h-5 text-green-500 flex-shrink-0">
                  <path fill="currentColor" d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425z"/>
                </svg>
                <span className="text-sm font-medium">Dados Atualizados</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" className="w-5 h-5 text-green-500 flex-shrink-0">
                  <path fill="currentColor" d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425z"/>
                </svg>
                <span className="text-sm font-medium">100% Gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
