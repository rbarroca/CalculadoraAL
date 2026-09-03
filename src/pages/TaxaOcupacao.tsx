import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, ArrowLeft, Calendar, TrendingUp, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';
import FAQAccordion from '../components/FAQAccordion';

// Benchmarks de taxa de ocupação por destino (fonte: dados médios mercado PT)
const BENCHMARKS: Record<string, { label: string; anual: number; verao: number; inverno: number }> = {
  lisboa:   { label: 'Lisboa',   anual: 78, verao: 88, inverno: 65 },
  porto:    { label: 'Porto',    anual: 74, verao: 84, inverno: 60 },
  algarve:  { label: 'Algarve', anual: 68, verao: 92, inverno: 35 },
  cascais:  { label: 'Cascais', anual: 70, verao: 90, inverno: 45 },
  sintra:   { label: 'Sintra',  anual: 65, verao: 82, inverno: 48 },
  aveiro:   { label: 'Aveiro',  anual: 58, verao: 70, inverno: 42 },
  coimbra:  { label: 'Coimbra', anual: 60, verao: 72, inverno: 46 },
  madeira:  { label: 'Madeira', anual: 72, verao: 82, inverno: 60 },
  acores:   { label: 'Açores',  anual: 62, verao: 78, inverno: 44 },
  outro:    { label: 'Outro',   anual: 55, verao: 70, inverno: 38 },
};

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

interface FormData {
  destino: string;
  diasDisponiveis: number;
  diasOcupados: number[]; // por mês
  precoMedio: number;
}

interface Resultado {
  taxaAnual: number;
  taxaMedia: number;
  diasTotaisOcupados: number;
  diasTotaisDisponiveis: number;
  receitaBruta: number;
  receitaPorDiaDisponivel: number;
  benchmark: { anual: number; verao: number; inverno: number; label: string };
  diffBenchmark: number;
  receitaPotencial: number;
  receitaPerdida: number;
}

function calcular(f: FormData): Resultado {
  const diasTotaisOcupados = f.diasOcupados.reduce((a, b) => a + b, 0);
  const diasTotaisDisponiveis = f.diasDisponiveis * 12;
  const taxaAnual = diasTotaisDisponiveis > 0
    ? (diasTotaisOcupados / diasTotaisDisponiveis) * 100
    : 0;

  const mesesComDados = f.diasOcupados.filter((_, i) => f.diasOcupados[i] >= 0);
  const taxaMedia = mesesComDados.length > 0
    ? mesesComDados.reduce((acc, d) => acc + (d / f.diasDisponiveis) * 100, 0) / mesesComDados.length
    : 0;

  const receitaBruta = diasTotaisOcupados * f.precoMedio;
  const receitaPorDiaDisponivel = diasTotaisDisponiveis > 0 ? receitaBruta / diasTotaisDisponiveis : 0;

  const bench = BENCHMARKS[f.destino] ?? BENCHMARKS.outro;
  const diffBenchmark = taxaAnual - bench.anual;
  const receitaPotencial = (bench.anual / 100) * diasTotaisDisponiveis * f.precoMedio;
  const receitaPerdida = Math.max(0, receitaPotencial - receitaBruta);

  return {
    taxaAnual,
    taxaMedia,
    diasTotaisOcupados,
    diasTotaisDisponiveis,
    receitaBruta,
    receitaPorDiaDisponivel,
    benchmark: bench,
    diffBenchmark,
    receitaPotencial,
    receitaPerdida,
  };
}

function fmt(n: number): string {
  return n.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function pct(n: number): string {
  return n.toFixed(1) + '%';
}

// Dias úteis (máximo) por mês
const DIAS_MES = [31,28,31,30,31,30,31,31,30,31,30,31];

export default function TaxaOcupacao() {
  const [form, setForm] = useState<FormData>({
    destino: 'lisboa',
    diasDisponiveis: 28,
    diasOcupados: [18,16,20,22,24,26,28,28,24,20,16,14],
    precoMedio: 85,
  });

  const [resultado, setResultado] = useState<Resultado>(calcular(form));

  useEffect(() => {
    setResultado(calcular(form));
  }, [form]);

  function setMes(i: number, val: number) {
    const novo = [...form.diasOcupados];
    novo[i] = Math.min(val, form.diasDisponiveis);
    setForm(prev => ({ ...prev, diasOcupados: novo }));
  }

  const inputClass = 'w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors font-medium text-gray-900 bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  const taxaColor = resultado.taxaAnual >= 70 ? 'text-green-600' : resultado.taxaAnual >= 50 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Taxa de Ocupação Alojamento Local — Calculadora e Benchmarks Portugal 2025"
        description="Calcule a taxa de ocupação do seu AL mês a mês e compare com os benchmarks de Lisboa (78%), Porto (74%) e Algarve (68%). Descubra quanto está a deixar de ganhar. Gratuito."
        canonical="https://calculadoraal.pt/taxa-ocupacao/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Qual é a taxa de ocupação média do Algarve em 2025?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No Algarve, a taxa de ocupação média anual situa-se em torno de 68% para alojamentos bem posicionados. No verão (junho a setembro) pode atingir 90–95%, enquanto no inverno (novembro a fevereiro) desce para 30–40%. A forte sazonalidade algarvia exige uma estratégia de preço dinâmico para maximizar a receita anual."
              }
            },
            {
              "@type": "Question",
              "name": "Como aumentar a taxa de ocupação num alojamento local em Portugal?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "As estratégias mais eficazes são: adoptar preço dinâmico por temporada (ferramentas como Pricelabs), reduzir a estadia mínima na época baixa, estar presente em múltiplas plataformas (Airbnb, Booking.com, VRBO), investir em fotografias profissionais, e acumular reviews para melhorar o ranking. Em épocas baixas, oferecer descontos de estadia prolongada (semanas ou meses) pode manter a ocupação elevada."
              }
            },
            {
              "@type": "Question",
              "name": "Qual é a taxa de ocupação média de um alojamento local em Portugal?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A taxa de ocupação média em Portugal varia entre 60% e 80% nas principais cidades turísticas. Lisboa tem benchmark anual de 78%, Porto de 74%, e Algarve de 68% (com pico de 92% no verão). No interior e zonas rurais, a média situa-se entre 40% e 60%."
              }
            },
            {
              "@type": "Question",
              "name": "Como se calcula a taxa de ocupação de um alojamento local?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A taxa de ocupação calcula-se dividindo o número de noites vendidas pelo total de noites disponíveis no período, multiplicado por 100. Por exemplo: 18 noites vendidas em 28 disponíveis = 64,3% de ocupação. A nossa calculadora faz este cálculo mês a mês e compara com os benchmarks do mercado."
              }
            },
            {
              "@type": "Question",
              "name": "O que é o RevPAR num alojamento local?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "RevPAR (Revenue Per Available Room/Day) é a receita por dia disponível — independentemente de o alojamento estar ocupado ou não. Calcula-se dividindo a receita bruta total pelo número de dias disponíveis. É uma métrica mais completa do que a taxa de ocupação porque combina ocupação e preço."
              }
            },
            {
              "@type": "Question",
              "name": "Como melhorar a taxa de ocupação do meu AL?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "As principais estratégias são: otimizar o preço por temporada (preço dinâmico), melhorar as fotos e descrição nos listings, aumentar o número de plataformas (Airbnb, Booking, VRBO), reduzir a estadia mínima em períodos de baixa procura, e recolher mais reviews para melhorar o posicionamento nas plataformas."
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
              <BarChart2 className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                Calculadora de Taxa de Ocupação
                <span className="block text-orange-500">Alojamento Local</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Calcule a taxa de ocupação do seu AL mês a mês, compare com os benchmarks do mercado português e descubra a receita que está a deixar escapar.
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

              {/* Configuração base */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Configuração do Alojamento</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="destino">Destino / Localização</label>
                    <select
                      id="destino"
                      value={form.destino}
                      onChange={e => setForm(prev => ({ ...prev, destino: e.target.value }))}
                      className={inputClass}
                    >
                      {Object.entries(BENCHMARKS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Benchmark mercado: {BENCHMARKS[form.destino].anual}% anual · {BENCHMARKS[form.destino].verao}% verão · {BENCHMARKS[form.destino].inverno}% inverno
                    </p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="diasDisponiveis">Dias disponíveis por mês</label>
                    <div className="relative">
                      <input
                        id="diasDisponiveis"
                        type="number"
                        min={1}
                        max={31}
                        value={form.diasDisponiveis}
                        onChange={e => setForm(prev => ({ ...prev, diasDisponiveis: Math.min(31, Number(e.target.value)) }))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-16'}
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">dias</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Exclui dias para uso próprio ou manutenção</p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="precoMedio">Preço médio por noite</label>
                    <div className="relative">
                      <input
                        id="precoMedio"
                        type="number"
                        min={0}
                        value={form.precoMedio}
                        onChange={e => setForm(prev => ({ ...prev, precoMedio: Number(e.target.value) }))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ocupação mensal */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Dias ocupados por mês</h2>
                <div className="grid grid-cols-2 gap-3">
                  {MESES.map((mes, i) => {
                    const taxa = form.diasDisponiveis > 0 ? (form.diasOcupados[i] / form.diasDisponiveis) * 100 : 0;
                    const barColor = taxa >= 70 ? 'bg-green-400' : taxa >= 50 ? 'bg-orange-400' : 'bg-red-400';
                    return (
                      <div key={mes}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{mes}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={form.diasDisponiveis}
                            value={form.diasOcupados[i]}
                            onChange={e => setMes(i, Number(e.target.value))}
                            onFocus={e => e.target.select()}
                            className="w-16 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-gray-900 text-center"
                            aria-label={`Dias ocupados em ${mes}`}
                          />
                          <div className="flex-1">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${barColor}`}
                                style={{ width: `${Math.min(100, taxa)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{pct(taxa)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="lg:col-span-7 space-y-6">

              {/* Taxa anual — destaque */}
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl p-8 shadow-lg text-white">
                <p className="text-orange-100 font-semibold text-sm uppercase tracking-wider mb-1">Taxa de Ocupação Anual</p>
                <p className="text-6xl font-bold mb-1">{pct(resultado.taxaAnual)}</p>
                <p className="text-orange-100 text-sm">
                  {resultado.diasTotaisOcupados} dias ocupados de {resultado.diasTotaisDisponiveis} disponíveis
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-orange-100 text-xs font-medium mb-1">Receita bruta anual</p>
                    <p className="text-white font-bold text-xl">€{fmt(resultado.receitaBruta)}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-orange-100 text-xs font-medium mb-1">RevPAR (receita/dia disponível)</p>
                    <p className="text-white font-bold text-xl">€{fmt(resultado.receitaPorDiaDisponivel)}</p>
                  </div>
                </div>
              </div>

              {/* Comparação benchmark */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5">
                  Comparação com {resultado.benchmark.label}
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'O seu AL', taxa: resultado.taxaAnual, destaque: true },
                    { label: `Benchmark anual (${resultado.benchmark.label})`, taxa: resultado.benchmark.anual },
                    { label: 'Benchmark verão', taxa: resultado.benchmark.verao },
                    { label: 'Benchmark inverno', taxa: resultado.benchmark.inverno },
                  ].map(({ label, taxa, destaque }) => {
                    const barColor = taxa >= 70 ? 'bg-green-500' : taxa >= 50 ? 'bg-orange-400' : 'bg-red-400';
                    return (
                      <div key={label}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${destaque ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{label}</span>
                          <span className={`text-sm font-bold ${destaque ? taxaColor : 'text-gray-700'}`}>{pct(taxa)}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${destaque ? 'bg-orange-500' : barColor}`}
                            style={{ width: `${Math.min(100, taxa)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={`mt-5 rounded-xl p-4 border ${resultado.diffBenchmark >= 0 ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                  <p className={`text-sm font-semibold ${resultado.diffBenchmark >= 0 ? 'text-green-700' : 'text-orange-700'}`}>
                    {resultado.diffBenchmark >= 0
                      ? `${pct(Math.abs(resultado.diffBenchmark))} acima do benchmark — boa performance!`
                      : `${pct(Math.abs(resultado.diffBenchmark))} abaixo do benchmark do mercado`}
                  </p>
                </div>
              </div>

              {/* Receita potencial */}
              {resultado.receitaPerdida > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-5">Potencial de Crescimento</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Receita atual</p>
                      <p className="text-2xl font-bold text-gray-900">€{fmt(resultado.receitaBruta)}</p>
                      <p className="text-sm text-gray-500 mt-1">{pct(resultado.taxaAnual)} ocupação</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Ao benchmark ({pct(resultado.benchmark.anual)})</p>
                      <p className="text-2xl font-bold text-gray-900">€{fmt(resultado.receitaPotencial)}</p>
                      <p className="text-sm text-green-600 font-medium mt-1">+€{fmt(resultado.receitaPerdida)}/ano</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex gap-3">
                      <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-blue-700">
                        Para atingir o benchmark de {resultado.benchmark.label} precisaria de mais {fmt(resultado.diasTotaisDisponiveis * (resultado.benchmark.anual / 100) - resultado.diasTotaisOcupados)} dias ocupados por ano, ou seja, mais {pct((resultado.benchmark.anual - resultado.taxaAnual))} nos dias disponíveis.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance mensal */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Performance Mensal</h3>
                <div className="space-y-2">
                  {MESES.map((mes, i) => {
                    const taxa = form.diasDisponiveis > 0 ? (form.diasOcupados[i] / form.diasDisponiveis) * 100 : 0;
                    const receita = form.diasOcupados[i] * form.precoMedio;
                    const cor = taxa >= 70 ? 'text-green-600' : taxa >= 50 ? 'text-orange-500' : 'text-red-500';
                    const barColor = taxa >= 70 ? 'bg-green-400' : taxa >= 50 ? 'bg-orange-400' : 'bg-red-400';
                    return (
                      <div key={mes} className="flex items-center gap-3 py-1.5">
                        <span className="text-sm text-gray-600 w-20 shrink-0">{mes}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, taxa)}%` }} />
                        </div>
                        <span className={`text-sm font-bold w-12 text-right shrink-0 ${cor}`}>{pct(taxa)}</span>
                        <span className="text-sm text-gray-500 w-20 text-right shrink-0">€{fmt(receita)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-sm font-bold text-gray-900">Total anual</span>
                  <span className="text-sm font-bold text-gray-900">€{fmt(resultado.receitaBruta)}</span>
                </div>
              </div>
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
                Taxa de ocupação em Portugal: o que dizem os dados do mercado
              </h2>
              <p className="text-gray-600 leading-relaxed">
                A taxa de ocupação é o indicador mais directo da saúde de um alojamento local. Em Portugal,
                os mercados urbanos e turísticos apresentam taxas médias anuais entre 60% e 80%, com
                variações significativas por destino e sazonalidade. Conhecer os benchmarks do seu mercado
                é essencial para perceber se o seu AL está a operar abaixo do potencial.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Benchmarks por destino em Portugal
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Os valores abaixo representam médias anuais para alojamentos bem posicionados nas
                plataformas (boas fotos, reviews sólidas, preço competitivo). Um AL novo ou com
                posicionamento fraco pode estar 15–20 pontos abaixo destes valores.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { destino: 'Lisboa', anual: '78%', verao: '92%', inverno: '65%', nota: 'Mercado urbano, procura estável todo o ano' },
                  { destino: 'Porto', anual: '74%', verao: '88%', inverno: '62%', nota: 'Forte crescimento turístico, sazonalidade moderada' },
                  { destino: 'Algarve', anual: '68%', verao: '95%', inverno: '35%', nota: 'Alta sazonalidade — verão compensa o inverno' },
                  { destino: 'Madeira', anual: '72%', verao: '85%', inverno: '60%', nota: 'Clima favorável reduz sazonalidade' },
                  { destino: 'Cascais / Sintra', anual: '70%', verao: '88%', inverno: '55%', nota: 'Proximidade a Lisboa sustenta procura off-season' },
                  { destino: 'Interior / Rural', anual: '45%', verao: '65%', inverno: '28%', nota: 'Potencial de nicho — turismo natureza e slow travel' },
                ].map(b => (
                  <div key={b.destino} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{b.destino}</h3>
                      <span className="text-2xl font-bold text-orange-500">{b.anual}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 mb-2">
                      <span>Verão: <strong>{b.verao}</strong></span>
                      <span>Inverno: <strong>{b.inverno}</strong></span>
                    </div>
                    <p className="text-xs text-gray-500">{b.nota}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Como interpretar a taxa de ocupação do seu AL
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                A taxa de ocupação bruta (noites vendidas ÷ noites disponíveis) é um ponto de partida,
                mas não conta toda a história. Para uma análise completa, combine com:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">ADR (Average Daily Rate)</strong> — preço médio por noite vendida. Uma taxa de ocupação alta com ADR baixo pode gerar menos receita do que ocupação média com ADR premium.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">RevPAR (Revenue Per Available Day)</strong> — receita por dia disponível, independentemente da ocupação. É a métrica que combina os dois factores e permite comparações reais entre propriedades.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Sazonalidade</strong> — uma taxa anual de 65% pode esconder 95% no verão e 35% no inverno. A rentabilidade real depende de como gere a época baixa.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Dias bloqueados</strong> — dias de uso próprio ou manutenção reduzem os dias disponíveis mas não devem contar como "não vendidos". A calculadora acima permite excluir estes dias para um cálculo preciso.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Estratégias para melhorar a taxa de ocupação
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Se a sua taxa de ocupação está abaixo do benchmark do seu mercado, as causas mais comuns são:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Preço fora do mercado</strong> — demasiado alto afasta reservas; demasiado baixo atrai hóspedes de menor qualidade e não compensa. Use ferramentas de preço dinâmico como Pricelabs ou Wheelhouse.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Estadia mínima elevada</strong> — nas épocas baixas, reduzir de 3 para 2 noites pode aumentar significativamente a ocupação sem reduzir o ADR.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Poucas plataformas</strong> — presença apenas no Airbnb limita o alcance. Booking.com e VRBO cobrem segmentos diferentes de hóspedes.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  <span><strong className="text-gray-900">Fotografias fracas</strong> — é o factor com maior impacto no CTR dos listings. Fotos profissionais recuperam o custo em 1–2 reservas adicionais.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <FAQAccordion
        title="Perguntas Frequentes sobre Taxa de Ocupação"
        items={[
          {
            question: 'Qual é a taxa de ocupação média do Algarve em 2025?',
            answer: 'No Algarve, a taxa de ocupação média anual situa-se em torno de 68% para alojamentos bem posicionados. No verão (junho a setembro) pode atingir 90–95%, enquanto no inverno (novembro a fevereiro) desce para 30–40%. A forte sazonalidade algarvia exige uma estratégia de preço dinâmico para maximizar a receita anual.'
          },
          {
            question: 'Como aumentar a taxa de ocupação num alojamento local em Portugal?',
            answer: 'As estratégias mais eficazes são: adoptar preço dinâmico por temporada (ferramentas como Pricelabs), reduzir a estadia mínima na época baixa, estar presente em múltiplas plataformas (Airbnb, Booking.com, VRBO), investir em fotografias profissionais, e acumular reviews para melhorar o ranking. Em épocas baixas, oferecer descontos de estadia prolongada (semanas ou meses) pode manter a ocupação elevada.'
          },
          {
            question: 'Qual é a taxa de ocupação média de um alojamento local em Portugal?',
            answer: 'A taxa média varia entre 60% e 80% nas principais cidades turísticas. Lisboa tem benchmark anual de 78%, Porto de 74%, e Algarve de 68% (com pico de 92% no verão). No interior e zonas rurais, a média situa-se entre 40% e 60%.'
          },
          {
            question: 'Como se calcula a taxa de ocupação de um alojamento local?',
            answer: 'Divide-se o número de noites vendidas pelo total de noites disponíveis no período, multiplicado por 100. Por exemplo: 18 noites vendidas em 28 disponíveis = 64,3% de ocupação. A calculadora acima faz este cálculo mês a mês e compara com os benchmarks do mercado português.'
          },
          {
            question: 'O que é o RevPAR num alojamento local?',
            answer: 'RevPAR (Revenue Per Available Day) é a receita por dia disponível — independentemente de o alojamento estar ocupado ou não. Calcula-se dividindo a receita bruta total pelo número de dias disponíveis. É uma métrica mais completa do que a taxa de ocupação porque combina ocupação e preço médio.'
          },
          {
            question: 'Como melhorar a taxa de ocupação do meu AL?',
            answer: 'As principais estratégias são: preço dinâmico por temporada, melhores fotos e descrição nos listings, presença em múltiplas plataformas (Airbnb, Booking, VRBO), reduzir a estadia mínima em períodos de baixa procura, e acumular reviews para melhorar o ranking nas plataformas.'
          }
        ]}
      />

      {/* Links para outras calculadoras */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-5">Explore as outras ferramentas</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
              Calculadora de Rentabilidade
            </Link>
            <Link
              to="/mais-valias"
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-900 font-semibold px-7 py-3.5 rounded-xl transition-all"
            >
              <BarChart2 className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Simulador de Mais-Valias
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
