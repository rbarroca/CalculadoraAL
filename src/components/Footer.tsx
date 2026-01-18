import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-white font-bold mb-4">Calculadora de Alojamento Local</h3>
            <p className="text-sm leading-relaxed">
              A ferramenta mais completa para simular a rentabilidade do seu alojamento local em Portugal.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/30 p-6">
            <h4 className="text-white font-bold text-lg mb-2">
              Comece já a calcular o rendimento do seu Alojamento Local
            </h4>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Use a nossa Calculadora/Simulador de AL e descubra em minutos se o seu imóvel pode ser um bom investimento.
            </p>
            <a
              href="#calculator"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Simular Agora
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            © {currentYear} Calculadora de Alojamento Local. Simulações baseadas em dados médios do mercado. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
