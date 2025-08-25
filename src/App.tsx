import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Home, DollarSign, PieChart, HelpCircle, ChevronDown, ChevronUp, MapPin, Calendar, Users, Percent } from 'lucide-react';
import Analytics, { trackCalculation, trackLocationChange, trackFAQOpen, trackCTAClick } from './components/Analytics';

interface CalculatorData {
  location: string;
  pricePerNight: number;
  occupancyRate: number;
  cleaningFee: number;
  maintenanceCosts: number;
  platformCommission: number;
  insurance: number;
  utilities: number;
  traditionalRent: number;
}

interface CalculationResult {
  grossMonthlyRevenue: number;
  grossAnnualRevenue: number;
  totalMonthlyCosts: number;
  totalAnnualCosts: number;
  netMonthlyProfit: number;
  netAnnualProfit: number;
  breakEvenDays: number;
  traditionalMonthlyIncome: number;
  traditionalAnnualIncome: number;
  alAdvantage: number;
}

const locations = [
  { value: 'lisboa', label: 'Lisboa', avgPrice: 85 },
  { value: 'porto', label: 'Porto', avgPrice: 65 },
  { value: 'algarve', label: 'Algarve', avgPrice: 95 },
  { value: 'cascais', label: 'Cascais', avgPrice: 120 },
  { value: 'sintra', label: 'Sintra', avgPrice: 75 },
  { value: 'obidos', label: 'Óbidos', avgPrice: 70 },
  { value: 'aveiro', label: 'Aveiro', avgPrice: 55 },
  { value: 'coimbra', label: 'Coimbra', avgPrice: 50 }
];

const faqData = [
  {
    question: "Quanto rende o Alojamento Local em Lisboa, Porto ou Algarve?",
    answer: "A rentabilidade varia conforme a localização: Lisboa tem preços médios de €80-100/noite, Porto €60-80/noite, e Algarve €90-130/noite. A taxa de ocupação média situa-se entre 60-80% nas principais cidades turísticas."
  },
  {
    question: "O que é mais rentável: arrendamento tradicional ou Alojamento Local?",
    answer: "O AL pode ser 2-3x mais rentável que o arrendamento tradicional, mas requer mais gestão. Depende da localização, sazonalidade e capacidade de manter alta ocupação. Use nossa calculadora para comparar cenários específicos."
  },
  {
    question: "Que impostos tenho de pagar no AL em Portugal?",
    answer: "No AL paga IRS sobre os rendimentos, IVA se faturar mais de €12.500/ano, e contribuição extraordinária sobre o património de 7,5% para prédios urbanos. Pode haver também IMI adicional."
  },
  {
    question: "Preciso de licença para abrir um AL?",
    answer: "Sim, precisa de registo no RNAL (Registo Nacional de Alojamento Local) e cumprir requisitos de segurança, acessibilidade e localização definidos pela câmara municipal local."
  },
  {
    question: "Como calcular a taxa de ocupação média de um AL?",
    answer: "A taxa média em Portugal varia entre 40-80%. Cidades turísticas como Lisboa, Porto e Algarve têm taxas mais altas. Considere sazonalidade: verão 70-90%, inverno 30-60%."
  },
  {
    question: "Quais os principais custos de um AL?",
    answer: "Limpeza (€15-30/estadia), manutenção (2-5% receita), comissões plataformas (12-18%), seguros (€200-500/ano), utilities, consumíveis e gestão se terceirizada (10-25%)."
  }
];

function App() {
  const [data, setData] = useState<CalculatorData>({
    location: 'lisboa',
    pricePerNight: 85,
    occupancyRate: 65,
    cleaningFee: 25,
    maintenanceCosts: 150,
    platformCommission: 15,
    insurance: 300,
    utilities: 80,
    traditionalRent: 800
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    const selectedLocation = locations.find(loc => loc.value === data.location);
    if (selectedLocation && data.pricePerNight === 0) {
      setData(prev => ({ ...prev, pricePerNight: selectedLocation.avgPrice }));
    }
  }, [data.location]);

  const calculateProfitability = (): CalculationResult => {
    const daysPerMonth = 30;
    const monthsPerYear = 12;
    const occupiedDaysPerMonth = (daysPerMonth * data.occupancyRate) / 100;
    
    // Revenue calculations
    const grossMonthlyRevenue = occupiedDaysPerMonth * data.pricePerNight;
    const grossAnnualRevenue = grossMonthlyRevenue * monthsPerYear;
    
    // Cost calculations
    const monthlyCleaningCosts = occupiedDaysPerMonth * (data.cleaningFee * 0.7); // 70% of cleaning fee as cost
    const monthlyPlatformCommission = grossMonthlyRevenue * (data.platformCommission / 100);
    const monthlyInsurance = data.insurance / monthsPerYear;
    
    const totalMonthlyCosts = monthlyCleaningCosts + data.maintenanceCosts + monthlyPlatformCommission + monthlyInsurance + data.utilities;
    const totalAnnualCosts = totalMonthlyCosts * monthsPerYear;
    
    // Profit calculations
    const netMonthlyProfit = grossMonthlyRevenue - totalMonthlyCosts;
    const netAnnualProfit = netMonthlyProfit * monthsPerYear;
    
    // Break-even calculation
    const dailyProfit = data.pricePerNight - (totalMonthlyCosts / occupiedDaysPerMonth);
    const breakEvenDays = Math.ceil(totalMonthlyCosts / dailyProfit);
    
    // Traditional rental comparison
    const traditionalMonthlyIncome = data.traditionalRent;
    const traditionalAnnualIncome = traditionalMonthlyIncome * monthsPerYear;
    const alAdvantage = ((netMonthlyProfit - traditionalMonthlyIncome) / traditionalMonthlyIncome) * 100;
    
    return {
      grossMonthlyRevenue,
      grossAnnualRevenue,
      totalMonthlyCosts,
      totalAnnualCosts,
      netMonthlyProfit,
      netAnnualProfit,
      breakEvenDays,
      traditionalMonthlyIncome,
      traditionalAnnualIncome,
      alAdvantage
    };
  };

  const handleCalculate = () => {
    const calculatedResult = calculateProfitability();
    setResult(calculatedResult);
    
    // Track calculation event
    trackCalculation({
      location: data.location,
      pricePerNight: data.pricePerNight,
      occupancyRate: data.occupancyRate,
      monthlyProfit: calculatedResult.netMonthlyProfit,
      alAdvantage: calculatedResult.alAdvantage
    });
  };

  useEffect(() => {
    handleCalculate();
  }, [data]);

  const handleLocationChange = (location: string) => {
    const selectedLocation = locations.find(loc => loc.value === location);
    trackLocationChange(location);
    setData(prev => ({
      ...prev,
      location,
      pricePerNight: selectedLocation ? selectedLocation.avgPrice : prev.pricePerNight
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Analytics />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Calculadora de Alojamento Local
              </h1>
              <p className="text-lg text-blue-600 font-medium">
                Simulador de Rentabilidade AL em Portugal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <section className="text-center mb-12">
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Descubra quanto pode render o seu imóvel em regime de <strong>Alojamento Local</strong>. 
            A nossa <strong>calculadora de AL</strong> permite simular receitas, custos e lucros líquidos de forma rápida e simples. 
            Compare facilmente com o arrendamento tradicional e avalie a rentabilidade do seu investimento.
          </p>
        </section>

        {/* Calculator Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Simule já o rendimento do seu Alojamento Local
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Preencha os dados abaixo e descubra em segundos quanto pode ganhar com o seu AL
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Dados do seu Imóvel
              </h3>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </label>
                  <select
                    value={data.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {locations.map(location => (
                      <option key={location.value} value={location.value}>
                        {location.label} (média: €{location.avgPrice}/noite)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price per night */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Preço por Noite (€)
                  </label>
                  <input
                    type="number"
                    value={data.pricePerNight}
                    onChange={(e) => setData(prev => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                {/* Occupancy Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Taxa de Ocupação (%)
                  </label>
                  <input
                    type="number"
                    value={data.occupancyRate}
                    onChange={(e) => setData(prev => ({ ...prev, occupancyRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Média Portugal: 60-75%</p>
                </div>

                {/* Costs Section */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Custos</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Taxa Limpeza (€)
                      </label>
                      <input
                        type="number"
                        value={data.cleaningFee}
                        onChange={(e) => setData(prev => ({ ...prev, cleaningFee: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Manutenção/mês (€)
                      </label>
                      <input
                        type="number"
                        value={data.maintenanceCosts}
                        onChange={(e) => setData(prev => ({ ...prev, maintenanceCosts: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        Comissão Plataforma (%)
                      </label>
                      <input
                        type="number"
                        value={data.platformCommission}
                        onChange={(e) => setData(prev => ({ ...prev, platformCommission: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seguro/ano (€)
                      </label>
                      <input
                        type="number"
                        value={data.insurance}
                        onChange={(e) => setData(prev => ({ ...prev, insurance: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Utilities/mês (€)
                    </label>
                    <input
                      type="number"
                      value={data.utilities}
                      onChange={(e) => setData(prev => ({ ...prev, utilities: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                {/* Comparison */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renda Tradicional/mês (€) - Para Comparação
                  </label>
                  <input
                    type="number"
                    value={data.traditionalRent}
                    onChange={(e) => setData(prev => ({ ...prev, traditionalRent: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {result && (
                <>
                  {/* Main Results */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Resultados da Simulação
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-sm opacity-90">Receita Bruta/mês</p>
                        <p className="text-2xl font-bold">€{result.grossMonthlyRevenue.toFixed(0)}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-sm opacity-90">Custos/mês</p>
                        <p className="text-2xl font-bold text-red-200">€{result.totalMonthlyCosts.toFixed(0)}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 col-span-2">
                        <p className="text-sm opacity-90">Lucro Líquido/mês</p>
                        <p className="text-3xl font-bold text-green-200">€{result.netMonthlyProfit.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Annual Results */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Projeção Anual</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Receita Bruta:</span>
                        <span className="font-semibold text-green-600">€{result.grossAnnualRevenue.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Custos Totais:</span>
                        <span className="font-semibold text-red-600">€{result.totalAnnualCosts.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-medium">Lucro Líquido Anual:</span>
                        <span className="font-bold text-xl text-green-600">€{result.netAnnualProfit.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comparison & Insights */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Análise e Comparação</h4>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">AL vs Arrendamento:</span>
                          <span className={`font-semibold ${result.alAdvantage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.alAdvantage > 0 ? '+' : ''}{result.alAdvantage.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {result.alAdvantage > 0 
                            ? `O AL rende mais €${(result.netMonthlyProfit - result.traditionalMonthlyIncome).toFixed(0)}/mês que o arrendamento tradicional`
                            : `O arrendamento tradicional rende mais €${(result.traditionalMonthlyIncome - result.netMonthlyProfit).toFixed(0)}/mês`
                          }
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Ponto de Equilíbrio:</span>
                          <span className="font-semibold text-blue-600">{result.breakEvenDays} dias/mês</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Precisa de ter ocupado pelo menos {result.breakEvenDays} dias por mês para cobrir os custos
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Taxa de Ocupação Atual:</span>
                          <span className="font-semibold text-green-600">{data.occupancyRate}%</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Equivale a {Math.round((30 * data.occupancyRate) / 100)} dias ocupados por mês
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            O que pode calcular com este simulador
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Receita mensal e anual do seu Alojamento Local",
                description: "Calcule receitas baseadas na ocupação e preço por noite"
              },
              {
                icon: <PieChart className="h-6 w-6" />,
                title: "Custos fixos e variáveis",
                description: "Inclui limpeza, manutenção, comissões e seguros"
              },
              {
                icon: <DollarSign className="h-6 w-6" />,
                title: "Lucro líquido",
                description: "Receita menos todos os custos operacionais"
              },
              {
                icon: <Calendar className="h-6 w-6" />,
                title: "Ponto de equilíbrio",
                description: "Quantos dias precisa ter ocupado para não ter prejuízo"
              },
              {
                icon: <Home className="h-6 w-6" />,
                title: "Comparação com arrendamento tradicional",
                description: "Veja qual opção é mais rentável para o seu caso"
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Análise de diferentes cenários",
                description: "Teste preços, ocupação e custos variados"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Vantagens de simular o seu AL antes de começar
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[
                  {
                    title: "Planeie melhor o seu investimento imobiliário",
                    description: "Evite surpresas e tome decisões informadas baseadas em dados reais"
                  },
                  {
                    title: "Saiba se compensa mais AL ou arrendamento de longa duração",
                    description: "Compare cenários e escolha a estratégia mais rentável"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Antecipe obrigações fiscais (IRS, IVA, contribuição extraordinária)",
                    description: "Prepare-se financeiramente para todos os impostos aplicáveis"
                  },
                  {
                    title: "Teste diferentes cenários (preço/noite, sazonalidade, ocupação)",
                    description: "Experimente várias hipóteses para otimizar a rentabilidade"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Perguntas Frequentes sobre Alojamento Local e Rentabilidade
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-200">
            {faqData.map((faq, index) => (
              <div key={index} className="p-6">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  onClickCapture={() => openFAQ !== index && trackFAQOpen(faq.question)}
                  className="w-full text-left flex items-center justify-between gap-4"
                >
                  <h3 className="font-semibold text-gray-900 flex-1">{faq.question}</h3>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Comece já a calcular o rendimento do seu Alojamento Local
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Use a nossa Calculadora/Simulador de AL e descubra em minutos se o seu imóvel pode ser um bom investimento.
          </p>
          
          <button
            onClick={() => {
              trackCTAClick('scroll_to_calculator');
              document.querySelector('.bg-white.rounded-xl.shadow-lg.p-6')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <Calculator className="h-5 w-5" />
            Simular Agora
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Calculadora de Alojamento Local Portugal. Simulações baseadas em dados médios do mercado.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;