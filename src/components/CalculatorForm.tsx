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
    <section className="py-16 lg:py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          Simule o Rendimento do Seu AL
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Ajuste os parâmetros abaixo e veja os resultados instantaneamente
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-8">Dados do Imóvel</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  Localização
                </label>
                <select
                  value={data.location}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 font-medium transition-all"
                >
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label} (€{location.avgPrice}/noite)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  Preço por Noite
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={data.pricePerNight}
                    onChange={(e) => setData((prev: any) => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                    onFocus={handleInputFocus}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 font-medium transition-all"
                    min="0"
                  />
                  <span className="absolute right-4 top-3 text-gray-400 font-medium">€</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  Taxa de Ocupação
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={data.occupancyRate}
                    onChange={(e) => setData((prev: any) => ({ ...prev, occupancyRate: Number(e.target.value) }))}
                    onFocus={handleInputFocus}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 font-medium transition-all"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-4 top-3 text-gray-400 font-medium">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Média Portugal: 60-75%</p>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-8">
              <h4 className="font-bold text-gray-900 mb-6">Custos Mensais</h4>

              <div className="space-y-4">
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

            <div className="border-t border-gray-200 mt-8 pt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Renda Tradicional/Mês (Comparação)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={data.traditionalRent === 0 ? '' : data.traditionalRent}
                  onChange={(e) => handleNumberInputChange('traditionalRent', e.target.value)}
                  onFocus={handleInputFocus}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium transition-all"
                  min="0"
                />
                <span className="absolute right-4 top-3 text-gray-400 font-medium">€</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {result && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-6">Resultados da Simulação</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs font-medium text-white/70 mb-1">Receita Bruta/Mês</p>
                    <p className="text-2xl lg:text-3xl font-bold">€{result.grossMonthlyRevenue.toFixed(0)}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs font-medium text-white/70 mb-1">Custos/Mês</p>
                    <p className="text-2xl lg:text-3xl font-bold">€{result.totalMonthlyCosts.toFixed(0)}</p>
                  </div>
                </div>

                <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <p className="text-xs font-medium text-white/70 mb-2">Lucro Líquido/Mês</p>
                  <p className="text-4xl lg:text-5xl font-bold">€{result.netMonthlyProfit.toFixed(0)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Projeção Anual</h4>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Receita Bruta Anual</span>
                    <span className="text-xl font-bold text-gray-900">€{result.grossAnnualRevenue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Custos Totais Anuais</span>
                    <span className="text-xl font-bold text-gray-900">€{result.totalAnnualCosts.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-bold">Lucro Líquido Anual</span>
                    <span className="text-2xl font-bold text-orange-600">€{result.netAnnualProfit.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Análise & Comparação</h4>

                <div className="space-y-3">
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">AL vs Arrendamento</span>
                      <span className={`text-lg font-bold ${result.alAdvantage > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                        {result.alAdvantage > 0 ? '+' : ''}{result.alAdvantage.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.alAdvantage > 0
                        ? `AL rende €${(result.netMonthlyProfit - result.traditionalMonthlyIncome).toFixed(0)}/mês a mais`
                        : `Arrendamento rende €${(result.traditionalMonthlyIncome - result.netMonthlyProfit).toFixed(0)}/mês a mais`}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Ponto de Equilíbrio</span>
                      <span className="text-lg font-bold text-blue-600">{result.breakEvenDays} dias/mês</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Mínimo necessário para cobrir os custos
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Ocupação Atual</span>
                      <span className="text-lg font-bold text-green-600">{data.occupancyRate}%</span>
                    </div>
                    <p className="text-sm text-gray-600">
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
