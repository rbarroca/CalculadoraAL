import React from 'react';
import { TrendingUp, PieChart, DollarSign, Calendar, Home, Users } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Receita Mensal e Anual',
    description: 'Calcule receitas baseadas na ocupação e preço por noite'
  },
  {
    icon: PieChart,
    title: 'Custos Fixos e Variáveis',
    description: 'Inclui limpeza, manutenção, comissões e seguros'
  },
  {
    icon: DollarSign,
    title: 'Lucro Líquido',
    description: 'Receita menos todos os custos operacionais'
  },
  {
    icon: Calendar,
    title: 'Ponto de Equilíbrio',
    description: 'Quantos dias precisa ter ocupado para não ter prejuízo'
  },
  {
    icon: Home,
    title: 'Comparação com Arrendamento',
    description: 'Veja qual opção é mais rentável para o seu caso'
  },
  {
    icon: Users,
    title: 'Análise de Cenários',
    description: 'Teste preços, ocupação e custos variados'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          O que Pode Calcular
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          Funcionalidades completas para análise profissional do seu investimento
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-10 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-orange-100 to-red-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
