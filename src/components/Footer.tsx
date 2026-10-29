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
          © {currentYear} Calculadora de Alojamento Local. Todos os direitos reservados.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed max-w-3xl mx-auto">
          As simulações são indicativas, baseadas em dados médios e na legislação em vigor, e não constituem aconselhamento fiscal, jurídico ou financeiro. Consulte um contabilista certificado para a sua situação.
        </p>
        <p className="text-sm text-gray-500">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('al:cookie-settings'))}
            className="underline hover:text-gray-300 transition-colors"
          >
            Preferências de cookies
          </button>
        </p>
      </div>
    </footer>
  );
}
