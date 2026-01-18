import React from 'react';
import { MapPin, DollarSign, Calendar, Percent } from 'lucide-react';

interface CalculatorFormProps {
  data: any;
  setData: (data: any) => void;
  result: any;
  locations: any[];
  onLocationChange: (location: string) => void;
}

const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.value = '';
};

export default function CalculatorForm({
  data,
  setData,
  result,
  locations,
  onLocationChange
}: CalculatorFormProps) {
  const handleNumberInputChange = (field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [field]: value === '' ? 0 : Number(value)
    }));
  };

  return (
    <section id="calculator" className="py-20 lg:py-24 scroll-smooth">
      <div className="mb-16 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
          Simule o Rendimento do Seu AL
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          Ajuste os parâmetros abaixo e veja os resultados instantaneamente
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-10 tracking-tight">Dados do Imóvel</h3>

            <div className="space-y-7">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Localização
                </label>
                <select
                  value={data.location}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 font-medium transition-all"
                >
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label} (€{location.avgPrice}/noite)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-orange-500" />
                  Preço por Noite
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={data.pricePerNight}
                    onChange={(e) => setData((prev: any) => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                    onFocus={handleInputFocus}
                    className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 font-medium transition-all"
                    min="0"
                  />
                  <span className="absolute right-5 top-4 text-gray-400 font-medium">€</span>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Taxa de Ocupação
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={data.occupancyRate}
                    onChange={(e) => setData((prev: any) => ({ ...prev, occupancyRate: Number(e.target.value) }))}
                    onFocus={handleInputFocus}
                    className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 font-medium transition-all"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-5 top-4 text-gray-400 font-medium">%</span>
                </div>
                <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">Média Portugal: 60-75%</p>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-10 pt-10">
              <h4 className="text-lg font-bold text-gray-900 mb-8 tracking-tight">Custos Mensais</h4>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Taxa Limpeza</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={data.cleaningFee}
                        onChange={(e) => setData((prev: any) => ({ ...prev, cleaningFee: Number(e.target.value) }))}
                        onFocus={handleInputFocus}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-all"
                        min="0"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-400 text-xs">€</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Manutenção</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={data.maintenanceCosts}
                        onChange={(e) => setData((prev: any) => ({ ...prev, maintenanceCosts: Number(e.target.value) }))}
                        onFocus={handleInputFocus}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-all"
                        min="0"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-400 text-xs">€</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Comissão Plataforma</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={data.platformCommission}
                        onChange={(e) => setData((prev: any) => ({ ...prev, platformCommission: Number(e.target.value) }))}
                        onFocus={handleInputFocus}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-all"
                        min="0"
                        max="30"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-400 text-xs">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Seguro/Ano</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={data.insurance}
                        onChange={(e) => setData((prev: any) => ({ ...prev, insurance: Number(e.target.value) }))}
                        onFocus={handleInputFocus}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-all"
                        min="0"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-400 text-xs">€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Utilities/Mês</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.utilities}
                      onChange={(e) => setData((prev: any) => ({ ...prev, utilities: Number(e.target.value) }))}
                      onFocus={handleInputFocus}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-all"
                      min="0"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400 text-xs">€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-10 pt-10">
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Renda Tradicional/Mês (Comparação)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={data.traditionalRent === 0 ? '' : data.traditionalRent}
                  onChange={(e) => handleNumberInputChange('traditionalRent', e.target.value)}
                  onFocus={handleInputFocus}
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium transition-all"
                  min="0"
                />
                <span className="absolute right-5 top-4 text-gray-400 font-medium">€</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {result && (
            <div className="space-y-8 lg:sticky lg:top-24">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl p-10 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-8 tracking-tight">Resultados da Simulação</h3>

                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-white/80 mb-2">Receita Bruta/Mês</p>
                    <p className="text-3xl lg:text-4xl font-bold tracking-tight">€{result.grossMonthlyRevenue.toFixed(0)}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-white/80 mb-2">Custos/Mês</p>
                    <p className="text-3xl lg:text-4xl font-bold tracking-tight">€{result.totalMonthlyCosts.toFixed(0)}</p>
                  </div>
                </div>

                <div className="bg-white/15 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                  <p className="text-sm font-semibold text-white/80 mb-3">Lucro Líquido/Mês</p>
                  <p className="text-5xl lg:text-6xl font-bold tracking-tight">€{result.netMonthlyProfit.toFixed(0)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
                <h4 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Projeção Anual</h4>

                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-5 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold text-base">Receita Bruta Anual</span>
                    <span className="text-2xl font-bold text-gray-900">€{result.grossAnnualRevenue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-5 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold text-base">Custos Totais Anuais</span>
                    <span className="text-2xl font-bold text-gray-900">€{result.totalAnnualCosts.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-bold text-base">Lucro Líquido Anual</span>
                    <span className="text-3xl font-bold text-orange-600">€{result.netAnnualProfit.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
                <h4 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Análise & Comparação</h4>

                <div className="space-y-5">
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base font-semibold text-gray-700">AL vs Arrendamento</span>
                      <span className={`text-xl font-bold ${result.alAdvantage > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                        {result.alAdvantage > 0 ? '+' : ''}{result.alAdvantage.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {result.alAdvantage > 0
                        ? `AL rende €${(result.netMonthlyProfit - result.traditionalMonthlyIncome).toFixed(0)}/mês a mais`
                        : `Arrendamento rende €${(result.traditionalMonthlyIncome - result.netMonthlyProfit).toFixed(0)}/mês a mais`}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base font-semibold text-gray-700">Ponto de Equilíbrio</span>
                      <span className="text-xl font-bold text-blue-600">{result.breakEvenDays} dias/mês</span>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Mínimo necessário para cobrir os custos
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base font-semibold text-gray-700">Ocupação Atual</span>
                      <span className="text-xl font-bold text-green-600">{data.occupancyRate}%</span>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {Math.round((30 * data.occupancyRate) / 100)} dias ocupados por mês
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
