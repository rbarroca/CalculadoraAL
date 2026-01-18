import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 mt-24 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-base leading-relaxed">
          © {currentYear} Calculadora de Alojamento Local. Simulações baseadas em dados médios do mercado. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
