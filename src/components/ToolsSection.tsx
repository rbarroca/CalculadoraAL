import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart2, FileText } from 'lucide-react';

const ferramentas = [
  {
    to: '/mais-valias',
    icon: TrendingUp,
    titulo: 'Simulador de Mais-Valias',
    descricao: 'Calcule o imposto na venda do seu imóvel AL. Compare a taxa liberatória de 28% com o englobamento IRS e descubra a opção mais vantajosa.',
    query: 'simulador mais-valias alojamento local',
  },
  {
    to: '/taxa-ocupacao',
    icon: BarChart2,
    titulo: 'Calculadora de Taxa de Ocupação',
    descricao: 'Analise a ocupação mês a mês e compare com os benchmarks de Lisboa, Porto e Algarve. Descubra a receita que está a deixar escapar.',
    query: 'calculo de taxa de ocupação alojamento local',
  },
  {
    to: '/impostos',
    icon: FileText,
    titulo: 'Simulador de Impostos AL',
    descricao: 'Calcule IRS (Categoria B), CEAL e obrigações de IVA. Compare o regime simplificado com contabilidade organizada.',
    query: 'simulador impostos alojamento local',
  },
];

export default function ToolsSection() {
  return (
    <section className="py-20 lg:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
            Mais Ferramentas de AL
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Todas as calculadoras que precisa para gerir o seu Alojamento Local em Portugal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {ferramentas.map(({ to, icon: Icon, titulo, descricao }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl w-fit mb-5 group-hover:from-orange-200 group-hover:to-red-200 transition-colors">
                <Icon className="h-6 w-6 text-orange-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {titulo}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {descricao}
              </p>
              <p className="mt-4 text-sm font-semibold text-orange-500 group-hover:text-orange-600 flex items-center gap-1">
                Abrir calculadora
                <span aria-hidden="true">→</span>
              </p>
            </Link>
          ))}
        </div>
        <p className="text-center text-gray-600 text-base leading-relaxed">
          Ainda a pensar em abrir o seu Alojamento Local? Consulte o{' '}
          <a
            href="https://tudosobrealojamentolocal.pt"
            className="text-orange-600 hover:text-orange-700 font-medium underline transition-colors"
          >
            guia de alojamento local em Portugal
          </a>{' '}
          com tudo o que precisa de saber sobre registo, fiscalidade e legislação.
        </p>
      </div>
    </section>
  );
}
