import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 mt-24 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-base leading-relaxed">
          Quer saber mais sobre registo, fiscalidade e legislação?{' '}
          <a
            href="https://tudosobrealojamentolocal.pt"
            className="text-orange-400 hover:text-orange-300 underline transition-colors"
          >
            Guia de Alojamento Local em Portugal
          </a>
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          © {currentYear} Calculadora de Alojamento Local. Simulações baseadas em dados médios do mercado. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
