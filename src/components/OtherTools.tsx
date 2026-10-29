import { Link } from 'react-router-dom';
import { TrendingUp, BarChart2, FileText, Calculator } from 'lucide-react';

type ToolId = 'home' | 'mais-valias' | 'taxa-ocupacao' | 'impostos';

const tools: { id: ToolId; to: string; label: string; icon: typeof TrendingUp }[] = [
  { id: 'home', to: '/', label: 'Calculadora de Rentabilidade', icon: Calculator },
  { id: 'impostos', to: '/impostos/', label: 'Simulador de Impostos AL', icon: FileText },
  { id: 'mais-valias', to: '/mais-valias/', label: 'Simulador de Mais-Valias', icon: TrendingUp },
  { id: 'taxa-ocupacao', to: '/taxa-ocupacao/', label: 'Taxa de Ocupação', icon: BarChart2 },
];

export default function OtherTools({ current }: { current: ToolId }) {
  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600 mb-5">Explore as outras ferramentas</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {tools
            .filter(t => t.id !== current)
            .map(({ id, to, label, icon: Icon }) => (
              <Link
                key={id}
                to={to}
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-900 font-semibold px-7 py-3.5 rounded-xl transition-all"
              >
                <Icon className="h-5 w-5 text-orange-500" aria-hidden="true" />
                {label}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
