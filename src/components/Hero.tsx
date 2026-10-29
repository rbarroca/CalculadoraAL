
import { Link } from 'react-router-dom';
import { FERRAMENTAS } from '../data/ferramentas';

export default function Hero() {
  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Calcular Rendimento de Alojamento Local
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
              Simulador gratuito para proprietários e investidores em Portugal. Calcule receitas, custos e lucro líquido do seu AL, simule o IRS, e compare com arrendamento tradicional — com dados atualizados para Lisboa, Porto, Algarve e mais.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <a
                href="#calculator"
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Calcular agora
              </a>
              <a
                href="#ferramentas"
                className="inline-flex items-center bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-900 font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Ver todas as ferramentas
              </a>
            </div>
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

        <nav aria-label="Outras ferramentas" className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {FERRAMENTAS.filter(f => f.to !== '/').map(({ to, icon: Icon, nome, pergunta }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md p-4 transition-all"
            >
              <Icon className="h-5 w-5 text-orange-600 mb-2" aria-hidden="true" />
              <span className="block text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{nome}</span>
              <span className="block text-xs text-gray-600 mt-0.5">{pergunta}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
