import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Info, ArrowLeft, Calculator, Home, Euro } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';
import FAQAccordion from '../components/FAQAccordion';

// Coeficientes de desvalorização monetária publicados pela AT (aproximados até 2025)
const COEFICIENTES: Record<number, number> = {
  2025: 1.00,
  2024: 1.02,
  2023: 1.07,
  2022: 1.14,
  2021: 1.21,
  2020: 1.23,
  2019: 1.26,
  2018: 1.28,
  2017: 1.30,
  2016: 1.32,
  2015: 1.34,
  2014: 1.37,
  2013: 1.39,
  2012: 1.41,
  2011: 1.44,
  2010: 1.48,
  2009: 1.52,
  2008: 1.54,
  2007: 1.60,
  2006: 1.64,
  2005: 1.68,
  2004: 1.73,
  2003: 1.77,
  2002: 1.83,
  2001: 1.91,
  2000: 1.97,
  1999: 2.03,
  1998: 2.08,
  1997: 2.14,
  1996: 2.22,
  1995: 2.31,
};

function getCoeficiente(ano: number): number {
  if (ano >= 2025) return 1.00;
  if (ano <= 1995) return 2.31;
  return COEFICIENTES[ano] ?? 1.00;
}

// Escalões IRS 2025 (taxa marginal)
const ESCALOES_IRS = [
  { limite: 7703, taxa: 0.13 },
  { limite: 11623, taxa: 0.18 },
  { limite: 16472, taxa: 0.23 },
  { limite: 21321, taxa: 0.26 },
  { limite: 27146, taxa: 0.3275 },
  { limite: 39791, taxa: 0.37 },
  { limite: 51997, taxa: 0.435 },
  { limite: 81199, taxa: 0.45 },
  { limite: Infinity, taxa: 0.48 },
];

function calcularImpostoMarginal(rendimentoColectavel: number, rendimentoOutros: number): number {
  const base = rendimentoOutros + rendimentoColectavel;
  let impostoTotal = 0;
  let anterior = 0;
  for (const escalao of ESCALOES_IRS) {
    if (rendimentoOutros >= escalao.limite) {
      anterior = escalao.limite;
      continue;
    }
    const inicio = Math.max(anterior, rendimentoOutros);
    const fim = Math.min(escalao.limite, base);
    if (fim <= inicio) break;
    impostoTotal += (fim - inicio) * escalao.taxa;
    anterior = escalao.limite;
    if (base <= escalao.limite) break;
  }
  return impostoTotal;
}

interface FormData {
  valorAquisicao: number;
  anoAquisicao: number;
  imtIsSelo: number;
  encargosValorizacao: number;
  valorRealizacao: number;
  comissaoImobiliaria: number;
  rendimentoAnualOutros: number;
}

interface Resultado {
  coeficiente: number;
  valorAquisicaoCorrigido: number;
  despesasAquisicao: number;
  despesasAlienacao: number;
  maisValiaBreuta: number;
  maisValiaTributavel: number;
  impostoTaxaFlat: number;
  impostoTaxaMarginal: number;
  taxaMarginalEfetiva: number;
  melhorOpcao: 'flat' | 'marginal';
  lucroLiquido: number;
}

function calcular(f: FormData): Resultado | null {
  if (!f.valorAquisicao || !f.valorRealizacao || !f.anoAquisicao) return null;

  const coeficiente = getCoeficiente(f.anoAquisicao);
  const valorAquisicaoCorrigido = f.valorAquisicao * coeficiente;
  const despesasAquisicao = f.imtIsSelo + f.encargosValorizacao;
  const despesasAlienacao = (f.valorRealizacao * f.comissaoImobiliaria) / 100;

  const maisValiaBreuta =
    f.valorRealizacao - valorAquisicaoCorrigido - despesasAquisicao - despesasAlienacao;

  // 50% da mais-valia é tributável (regra geral para imóveis detidos > 2 anos)
  const maisValiaTributavel = Math.max(0, maisValiaBreuta * 0.5);

  // Opção 1: taxa liberatória de 28%
  const impostoTaxaFlat = maisValiaTributavel * 0.28;

  // Opção 2: englobamento (taxa marginal)
  const impostoMarginalTotal = calcularImpostoMarginal(
    maisValiaTributavel,
    f.rendimentoAnualOutros
  );
  const impostoTaxaMarginal = impostoMarginalTotal;
  const taxaMarginalEfetiva =
    maisValiaTributavel > 0 ? impostoMarginalTotal / maisValiaTributavel : 0;

  const melhorOpcao: 'flat' | 'marginal' =
    impostoTaxaFlat <= impostoTaxaMarginal ? 'flat' : 'marginal';
  const impostoOtimizado = Math.min(impostoTaxaFlat, impostoTaxaMarginal);
  const lucroLiquido = f.valorRealizacao - f.valorAquisicao - despesasAquisicao - despesasAlienacao - impostoOtimizado;

  return {
    coeficiente,
    valorAquisicaoCorrigido,
    despesasAquisicao,
    despesasAlienacao,
    maisValiaBreuta,
    maisValiaTributavel,
    impostoTaxaFlat,
    impostoTaxaMarginal,
    taxaMarginalEfetiva,
    melhorOpcao,
    lucroLiquido,
  };
}

function fmt(n: number): string {
  return n.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function pct(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

const anoAtual = new Date().getFullYear();
const anos = Array.from({ length: anoAtual - 1994 }, (_, i) => anoAtual - i);

export default function MaisValias() {
  const [form, setForm] = useState<FormData>({
    valorAquisicao: 150000,
    anoAquisicao: 2015,
    imtIsSelo: 6000,
    encargosValorizacao: 10000,
    valorRealizacao: 280000,
    comissaoImobiliaria: 5,
    rendimentoAnualOutros: 25000,
  });

  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    setResultado(calcular(form));
  }, [form]);

  function set(field: keyof FormData, value: number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const inputClass =
    'w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors font-medium text-gray-900 bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Simulador de Mais-Valias Alojamento Local — Calcule o Imposto na Venda"
        description="Calcule o imposto sobre mais-valias na venda do seu imóvel de Alojamento Local em Portugal. Compare taxa liberatória 28% vs englobamento IRS e descubra a opção mais vantajosa."
        canonical="https://calculadoraal.pt/mais-valias/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Tenho de pagar mais-valias se vender o meu imóvel de alojamento local?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sim, se o valor de venda for superior ao valor de aquisição corrigido (após deduzir despesas), há lugar a imposto sobre mais-valias. Apenas 50% da mais-valia bruta é tributável. Use o simulador para calcular o valor exato no seu caso."
              }
            },
            {
              "@type": "Question",
              "name": "O que é o coeficiente de desvalorização monetária nas mais-valias?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "É um fator publicado anualmente pela AT que corrige o valor de compra do imóvel pela inflação acumulada. Por exemplo, um imóvel comprado em 2010 tem coeficiente 1,48 — o valor de aquisição é multiplicado por 1,48 antes de calcular a mais-valia, reduzindo o imposto a pagar."
              }
            },
            {
              "@type": "Question",
              "name": "Posso deduzir as obras de remodelação nas mais-valias do AL?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sim, as obras e encargos de valorização realizados nos últimos 12 anos são dedutíveis, desde que comprovados por fatura. Também são dedutíveis o IMT, Imposto de Selo, despesas notariais pagas na compra, e a comissão da imobiliária na venda."
              }
            },
            {
              "@type": "Question",
              "name": "É melhor pagar 28% de taxa liberatória ou englobar as mais-valias no IRS?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Depende dos seus outros rendimentos anuais. Se a sua taxa marginal de IRS for inferior a 28% (rendimentos abaixo de ~€27.000), o englobamento pode ser mais vantajoso. Para rendimentos superiores, a taxa liberatória de 28% poupa imposto. O simulador compara automaticamente as duas opções."
              }
            }
          ]
        })}</script>
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à Calculadora de Rentabilidade
          </Link>
          <div className="flex items-start gap-5">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-2xl shadow-lg shrink-0">
              <TrendingUp className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                Simulador de Mais-Valias
                <span className="block text-orange-500">Alojamento Local</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Calcule o imposto sobre mais-valias na venda do seu imóvel de AL em Portugal. Compare a taxa liberatória (28%) com o englobamento e descubra a opção mais vantajosa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora */}
      <section id="calculadora" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">

            {/* Formulário */}
            <div className="lg:col-span-5 space-y-8">

              {/* Aquisição */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Home className="h-5 w-5 text-orange-600" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Dados de Aquisição</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="valorAquisicao">Valor de aquisição</label>
                    <div className="relative">
                      <input
                        id="valorAquisicao"
                        type="number"
                        min={0}
                        value={form.valorAquisicao || ''}
                        onChange={e => set('valorAquisicao', Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="Valor de aquisição em euros"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Valor escriturado na compra (sem impostos)</p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="anoAquisicao">Ano de aquisição</label>
                    <select
                      id="anoAquisicao"
                      value={form.anoAquisicao}
                      onChange={e => set('anoAquisicao', Number(e.target.value))}
                      className={inputClass}
                      aria-label="Ano de aquisição do imóvel"
                    >
                      {anos.map(ano => (
                        <option key={ano} value={ano}>{ano}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Coeficiente de desvalorização: ×{getCoeficiente(form.anoAquisicao).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="imtIsSelo">IMT + IS + Escritura pagos</label>
                    <div className="relative">
                      <input
                        id="imtIsSelo"
                        type="number"
                        min={0}
                        value={form.imtIsSelo || ''}
                        onChange={e => set('imtIsSelo', Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="IMT, Imposto de Selo e despesas de escritura em euros"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Impostos e despesas notariais na compra</p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="encargosValorizacao">Obras e encargos de valorização</label>
                    <div className="relative">
                      <input
                        id="encargosValorizacao"
                        type="number"
                        min={0}
                        value={form.encargosValorizacao || ''}
                        onChange={e => set('encargosValorizacao', Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="Encargos de valorização em euros"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Remodelações comprovadas nos últimos 12 anos</p>
                  </div>
                </div>
              </div>

              {/* Alienação */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Euro className="h-5 w-5 text-orange-600" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Dados de Venda</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="valorRealizacao">Valor de realização (venda)</label>
                    <div className="relative">
                      <input
                        id="valorRealizacao"
                        type="number"
                        min={0}
                        value={form.valorRealizacao || ''}
                        onChange={e => set('valorRealizacao', Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="Valor de venda em euros"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="comissaoImobiliaria">Comissão imobiliária</label>
                    <div className="relative">
                      <input
                        id="comissaoImobiliaria"
                        type="number"
                        min={0}
                        max={10}
                        step={0.5}
                        value={form.comissaoImobiliaria || ''}
                        onChange={e => set('comissaoImobiliaria', Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="Comissão da agência imobiliária em percentagem"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Habitualmente entre 3% e 6%</p>
                  </div>
                </div>
              </div>

              {/* IRS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Calculator className="h-5 w-5 text-orange-600" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Dados de IRS</h2>
                </div>
                <div>
                  <label className={labelClass} htmlFor="rendimentoAnualOutros">Outros rendimentos anuais (IRS)</label>
                  <div className="relative">
                    <input
                      id="rendimentoAnualOutros"
                      type="number"
                      min={0}
                      value={form.rendimentoAnualOutros || ''}
                      onChange={e => set('rendimentoAnualOutros', Number(e.target.value))}
                      onFocus={e => e.target.select()}
                      className={inputClass + ' pr-8'}
                      aria-label="Outros rendimentos anuais para cálculo do englobamento"
                    />
                    <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Salário, rendas, etc. — usado para calcular a taxa marginal no englobamento</p>
                </div>
              </div>

              {/* Nota legal */}
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">Nota informativa</p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Simulação baseada no regime geral de mais-valias (Categoria G, CIRS). Para imóveis registados como AL que tenham beneficiado de deduções específicas, consulte um contabilista. Valores meramente indicativos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="lg:col-span-7 space-y-6">
              {resultado && (
                <>
                  {/* Mais-valia e imposto — destaque */}
                  <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl p-8 shadow-lg text-white">
                    <p className="text-orange-100 font-semibold text-sm uppercase tracking-wider mb-1">Mais-Valia Bruta</p>
                    <p className={`text-5xl font-bold mb-1 ${resultado.maisValiaBreuta < 0 ? 'text-red-200' : ''}`}>
                      {resultado.maisValiaBreuta < 0 ? '−' : ''}€{fmt(Math.abs(resultado.maisValiaBreuta))}
                    </p>
                    {resultado.maisValiaBreuta < 0 && (
                      <p className="text-orange-100 text-sm">Menos-valia — não há imposto a pagar</p>
                    )}
                    {resultado.maisValiaBreuta >= 0 && (
                      <p className="text-orange-100 text-sm">
                        Valor tributável (50%): €{fmt(resultado.maisValiaTributavel)}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-orange-100 text-xs font-medium mb-1">Valor de compra corrigido</p>
                        <p className="text-white font-bold text-lg">€{fmt(resultado.valorAquisicaoCorrigido)}</p>
                        <p className="text-orange-200 text-xs">×{resultado.coeficiente.toFixed(2)} desvalorização</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-orange-100 text-xs font-medium mb-1">Despesas deduzidas</p>
                        <p className="text-white font-bold text-lg">€{fmt(resultado.despesasAquisicao + resultado.despesasAlienacao)}</p>
                        <p className="text-orange-200 text-xs">Aquisição + alienação</p>
                      </div>
                    </div>
                  </div>

                  {/* Comparação de opções fiscais */}
                  {resultado.maisValiaBreuta > 0 && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Taxa liberatória 28% */}
                        <div className={`rounded-2xl border-2 p-6 ${resultado.melhorOpcao === 'flat' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-bold text-gray-900">Taxa Liberatória</p>
                            {resultado.melhorOpcao === 'flat' && (
                              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                Mais vantajosa
                              </span>
                            )}
                          </div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">€{fmt(resultado.impostoTaxaFlat)}</p>
                          <p className="text-sm text-gray-600">28% sobre €{fmt(resultado.maisValiaTributavel)}</p>
                          <p className="text-xs text-gray-500 mt-2">Não necessita de englobar no IRS</p>
                        </div>

                        {/* Englobamento */}
                        <div className={`rounded-2xl border-2 p-6 ${resultado.melhorOpcao === 'marginal' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-bold text-gray-900">Englobamento IRS</p>
                            {resultado.melhorOpcao === 'marginal' && (
                              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                Mais vantajosa
                              </span>
                            )}
                          </div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">€{fmt(resultado.impostoTaxaMarginal)}</p>
                          <p className="text-sm text-gray-600">Taxa efetiva: {pct(resultado.taxaMarginalEfetiva)}</p>
                          <p className="text-xs text-gray-500 mt-2">Inclui todos os rendimentos do ano</p>
                        </div>
                      </div>

                      {/* Resumo final */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-5">Resumo da Operação</h3>
                        <div className="space-y-3">
                          {[
                            { label: 'Valor de venda', value: `€${fmt(form.valorRealizacao)}` },
                            { label: `Valor de compra corrigido (×${resultado.coeficiente.toFixed(2)})`, value: `− €${fmt(resultado.valorAquisicaoCorrigido)}`, neg: true },
                            { label: 'Despesas de aquisição (IMT + IS + obras)', value: `− €${fmt(resultado.despesasAquisicao)}`, neg: true },
                            { label: 'Comissão imobiliária', value: `− €${fmt(resultado.despesasAlienacao)}`, neg: true },
                            { label: 'Mais-valia bruta', value: `€${fmt(resultado.maisValiaBreuta)}`, bold: true },
                            { label: 'Valor tributável (50%)', value: `€${fmt(resultado.maisValiaTributavel)}` },
                            {
                              label: `Imposto (opção ${resultado.melhorOpcao === 'flat' ? '28% liberatória' : 'englobamento'})`,
                              value: `− €${fmt(Math.min(resultado.impostoTaxaFlat, resultado.impostoTaxaMarginal))}`,
                              neg: true,
                            },
                          ].map(({ label, value, neg, bold }) => (
                            <div key={label} className={`flex justify-between py-2.5 border-b border-gray-100 last:border-0 ${bold ? 'font-bold' : ''}`}>
                              <span className={`text-sm ${neg ? 'text-gray-600' : 'text-gray-700'}`}>{label}</span>
                              <span className={`text-sm font-semibold ${neg ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 bg-green-50 rounded-xl p-5 border border-green-100">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">Lucro líquido estimado</span>
                            <span className="text-2xl font-bold text-green-700">€{fmt(resultado.lucroLiquido)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Após deduzir custo de compra original, despesas e imposto otimizado</p>
                        </div>
                      </div>

                      {/* Poupança fiscal */}
                      {resultado.melhorOpcao !== 'flat' || resultado.impostoTaxaFlat !== resultado.impostoTaxaMarginal ? (
                        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                          <p className="text-sm font-semibold text-blue-800 mb-1">
                            💡 Poupança potencial: €{fmt(Math.abs(resultado.impostoTaxaFlat - resultado.impostoTaxaMarginal))}
                          </p>
                          <p className="text-sm text-blue-700">
                            Ao escolher a opção {resultado.melhorOpcao === 'flat' ? 'taxa liberatória (28%)' : 'englobamento'}, poupa €{fmt(Math.abs(resultado.impostoTaxaFlat - resultado.impostoTaxaMarginal))} em imposto. Confirme com o seu contabilista.
                          </p>
                        </div>
                      ) : null}
                    </>
                  )}

                  {resultado.maisValiaBreuta < 0 && (
                    <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
                      <p className="text-lg font-bold text-green-800 mb-2">Não há imposto a pagar</p>
                      <p className="text-sm text-green-700">
                        A venda resulta numa menos-valia de €{fmt(Math.abs(resultado.maisValiaBreuta))}. Não é devido qualquer imposto sobre mais-valias. A menos-valia pode ser reportada em certas condições — consulte um contabilista.
                      </p>
                    </div>
                  )}
                </>
              )}

              {!resultado && (
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Preencha os dados do imóvel para calcular a mais-valia</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo editorial */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-10">

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                O que são mais-valias no Alojamento Local?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Quando vende um imóvel que estava registado como Alojamento Local, pode ser devido
                imposto sobre as mais-valias realizadas. A mais-valia é a diferença positiva entre o valor de
                venda e o valor de aquisição corrigido pela inflação (coeficientes AT). O regime fiscal
                português permite deduzir despesas de compra e venda, e tributa apenas 50% do ganho.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Como funciona o cálculo do imposto?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                O imposto sobre mais-valias imobiliárias em Portugal incide sobre 50% da mais-valia bruta.
                Existem duas formas de tributação:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Taxa liberatória de 28%</strong> — aplica-se diretamente aos 50% tributáveis, sem necessidade de englobar no IRS.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Englobamento no IRS</strong> — os 50% tributáveis somam-se aos restantes rendimentos e são tributados à taxa marginal. Pode ser vantajoso para rendimentos mais baixos.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Coeficientes de desvalorização</strong> — a AT publica anualmente coeficientes que corrigem o valor de compra pela inflação acumulada, reduzindo a mais-valia tributável.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Despesas dedutíveis</strong> — IMT, Imposto de Selo, escritura, obras de valorização comprovadas nos últimos 12 anos e comissão imobiliária.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quando compensa o englobamento?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                O englobamento é vantajoso quando a taxa marginal de IRS do contribuinte é inferior a 28%.
                Em 2025, isso acontece para rendimentos coletáveis anuais abaixo de aproximadamente
                €27.000. Para rendimentos superiores, a taxa liberatória de 28% é geralmente mais
                favorável. O nosso simulador calcula automaticamente as duas opções e recomenda a mais
                vantajosa para o seu caso.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Particularidades do AL na venda do imóvel
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Imóveis afetos ao Alojamento Local que tenham beneficiado de deduções de IRS em anos
                anteriores podem estar sujeitos a regras específicas de recaptura. Além disso, imóveis em
                regime de propriedade plural ou em condomínio podem ter obrigações adicionais.
                Recomendamos sempre a consulta a um contabilista certificado antes de tomar decisões
                fiscais com base nesta simulação.
              </p>
            </div>

          </div>
        </div>
      </section>

      <FAQAccordion
        title="Perguntas Frequentes sobre Mais-Valias AL"
        items={[
          {
            question: 'Tenho de pagar mais-valias se vender o meu imóvel de alojamento local?',
            answer: 'Sim, se o valor de venda for superior ao valor de aquisição corrigido (após deduzir despesas), há lugar a imposto sobre mais-valias. Apenas 50% da mais-valia bruta é tributável. Use o simulador acima para calcular o valor exato no seu caso.'
          },
          {
            question: 'O que é o coeficiente de desvalorização monetária nas mais-valias?',
            answer: 'É um fator publicado anualmente pela AT que corrige o valor de compra do imóvel pela inflação acumulada. Por exemplo, um imóvel comprado em 2010 tem coeficiente 1,48 — o valor de aquisição é multiplicado por 1,48 antes de calcular a mais-valia, reduzindo o imposto a pagar.'
          },
          {
            question: 'Posso deduzir as obras de remodelação nas mais-valias do AL?',
            answer: 'Sim, as obras e encargos de valorização realizados nos últimos 12 anos são dedutíveis, desde que comprovados por fatura. Também são dedutíveis o IMT, Imposto de Selo, despesas notariais pagas na compra, e a comissão da imobiliária na venda.'
          },
          {
            question: 'É melhor pagar 28% de taxa liberatória ou englobar as mais-valias no IRS?',
            answer: 'Depende dos seus outros rendimentos anuais. Se a sua taxa marginal de IRS for inferior a 28% (rendimentos abaixo de ~€27.000), o englobamento pode ser mais vantajoso. Para rendimentos superiores, a taxa liberatória de 28% poupa imposto. O simulador compara automaticamente as duas opções.'
          }
        ]}
      />

      {/* Link para homepage */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">Quer também simular a rentabilidade do seu AL antes de vender?</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Calculator className="h-5 w-5" aria-hidden="true" />
            Calculadora de Rentabilidade AL
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
