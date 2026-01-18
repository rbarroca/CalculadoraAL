import React from 'react';

export default function Hero() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Descubra o Potencial do Seu Imóvel
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light">
              Simule receitas, custos e lucros do seu alojamento local em Portugal. Compare com arrendamento tradicional e tome decisões informadas sobre o seu investimento.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Cálculo em Tempo Real</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Dados Atualizados</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">100% Gratuito</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <img src="/calculadora_al.png" alt="Calculadora de Alojamento Local - Simulador de Rentabilidade" className="w-full max-w-md rounded-2xl shadow-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
