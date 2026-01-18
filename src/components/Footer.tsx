import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h3 className="text-white font-bold mb-4">Calculadora de Alojamento Local</h3>
          <p className="text-sm leading-relaxed">
            A ferramenta mais completa para simular a rentabilidade do seu alojamento local em Portugal.
          </p>
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
