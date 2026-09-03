import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Info, TrendingUp, BarChart2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';
import FAQAccordion from '../components/FAQAccordion';

// Escalões IRS 2025
const ESCALOES = [
  { limite: 7703,    taxa: 0.1300, label: 'até €7.703'        },
  { limite: 11623,   taxa: 0.1800, label: '€7.703 – €11.623'  },
  { limite: 16472,   taxa: 0.2300, label: '€11.623 – €16.472' },
  { limite: 21321,   taxa: 0.2600, label: '€16.472 – €21.321' },
  { limite: 27146,   taxa: 0.3275, label: '€21.321 – €27.146' },
  { limite: 39791,   taxa: 0.3700, label: '€27.146 – €39.791' },
  { limite: 51997,   taxa: 0.4350, label: '€39.791 – €51.997' },
  { limite: 81199,   taxa: 0.4500, label: '€51.997 – €81.199' },
  { limite: Infinity, taxa: 0.4800, label: 'acima de €81.199' },
];

function taxaMarginal(rendimento: number): number {
  for (const e of ESCALOES) {
    if (rendimento <= e.limite) return e.taxa;
  }
  return 0.48;
}

function impostoProgressivo(rendimento: number): number {
  let imposto = 0;
  let anterior = 0;
  for (const e of ESCALOES) {
    if (rendimento <= anterior) break;
    const trib = Math.min(rendimento, e.limite) - anterior;
    imposto += trib * e.taxa;
    anterior = e.limite;
  }
  return imposto;
}

const LIMIAR_IVA = 14500; // artigo 53.º CIVA (valor 2025)

// Coeficientes regime simplificado (art. 31.º CIRS)
const COEFICIENTES: Record<string, { label: string; valor: number; descricao: string }> = {
  al_urbano: {
    label: 'AL em zona urbana/pressão',
    valor: 0.35,
    descricao: 'Coeficiente 0,35 aplica-se a rendimentos de AL em regime simplificado'
  },
  al_rural: {
    label: 'AL em área rural / interior',
    valor: 0.35,
    descricao: 'Coeficiente 0,35 aplica-se; CEAL com taxa reduzida'
  },
  turismo_rural: {
    label: 'Turismo rural / TER',
    valor: 0.15,
    descricao: 'Coeficiente 0,15 para turismo no espaço rural (art. 31.º n.º 1 b)'
  },
};

// Taxas CEAL (Contribuição Extraordinária sobre o Alojamento Local)
const CEAL_TAXAS: Record<string, { label: string; taxa: number; descricao: string }> = {
  pressao_alta: {
    label: 'Zona de pressão habitacional (ex: Lisboa, Porto)',
    taxa: 0.15,
    descricao: 'Municípios declarados como zonas de pressão habitacional'
  },
  pressao_media: {
    label: 'Município com pressão moderada',
    taxa: 0.10,
    descricao: 'Municípios com pressão habitacional moderada'
  },
  sem_pressao: {
    label: 'Zona interior / sem pressão habitacional',
    taxa: 0.04,
    descricao: 'Interior e municípios fora de zonas de pressão'
  },
  isento: {
    label: 'Isento (ex: habitação própria, imóvel novo)',
    taxa: 0,
    descricao: 'Isenção aplicável em determinadas situações (art. 21.º Lei 56/2023)'
  },
};

interface FormData {
  receitaAnualAL: number;
  outrosRendimentos: number;
  regime: string;
  zonaCEAL: string;
  pagaIVA: boolean;
  deducoesDespesas: number; // só no regime contabilidade organizada
}

interface Resultado {
  rendimentoTributavelIRS: number;
  baseIRS: number;
  impostoIRS: number;
  taxaMarginalEfetiva: number;
  ceal: number;
  totalImposto: number;
  taxaEfetivaSobreReceita: number;
  alertaIVA: boolean;
  receitaLiquida: number;
}

function calcular(f: FormData): Resultado {
  const coef = COEFICIENTES[f.regime];
  const receitaTrib = f.regime === 'contab_organizada'
    ? Math.max(0, f.receitaAnualAL - f.deducoesDespesas)
    : f.receitaAnualAL * coef.valor;

  const baseIRS = f.outrosRendimentos + receitaTrib;
  const impostoTotal = impostoProgressivo(baseIRS);
  const impostoSoOutros = impostoProgressivo(f.outrosRendimentos);
  const impostoIRS = impostoTotal - impostoSoOutros;

  const taxaEfetiva = receitaTrib > 0 ? impostoIRS / receitaTrib : 0;

  const ceal = f.receitaAnualAL * CEAL_TAXAS[f.zonaCEAL].taxa;
  const total = impostoIRS + ceal;

  return {
    rendimentoTributavelIRS: receitaTrib,
    baseIRS,
    impostoIRS,
    taxaMarginalEfetiva: taxaEfetivaSobreReceita(receitaTrib, f.outrosRendimentos),
    ceal,
    totalImposto: total,
    taxaEfetivaSobreReceita: f.receitaAnualAL > 0 ? total / f.receitaAnualAL : 0,
    alertaIVA: f.receitaAnualAL > LIMIAR_IVA && !f.pagaIVA,
    receitaLiquida: f.receitaAnualAL - total,
  };
}

function taxaEfetivaSobreReceita(rendAL: number, outrosRend: number): number {
  if (rendAL === 0) return 0;
  const total = impostoProgressivo(outrosRend + rendAL);
  const soOutros = impostoProgressivo(outrosRend);
  return (total - soOutros) / rendAL;
}

function fmt(n: number): string {
  return n.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function pct(n: number, casas = 1): string {
  return (n * 100).toFixed(casas) + '%';
}

export default function Impostos() {
  const [form, setForm] = useState<FormData>({
    receitaAnualAL: 18000,
    outrosRendimentos: 22000,
    regime: 'al_urbano',
    zonaCEAL: 'pressao_alta',
    pagaIVA: false,
    deducoesDespesas: 5000,
  });

  const [resultado, setResultado] = useState<Resultado>(calcular(form));

  useEffect(() => {
    setResultado(calcular(form));
  }, [form]);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  const inputClass = 'w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors font-medium text-gray-900 bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  const isContab = form.regime === 'contab_organizada';

  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Simulador IVA Alojamento Local — IRS, CEAL e IVA em Portugal 2025"
        description="Simule o IVA, IRS e CEAL do seu Alojamento Local em Portugal. Calcule automaticamente se ultrapassou o limiar de IVA (€14.500), o imposto a pagar e o regime mais vantajoso. Gratuito."
        canonical="https://calculadoraal.pt/impostos/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Simulador de Impostos de Alojamento Local",
          "url": "https://calculadoraal.pt/impostos/",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "description": "Simulador gratuito que calcula IRS Categoria B, CEAL e obrigações de IVA do Alojamento Local em Portugal, com suporte para regime simplificado e contabilidade organizada.",
          "featureList": [
            "Cálculo de IRS Categoria B (regime simplificado e contabilidade organizada)",
            "Simulação da CEAL com taxas por município",
            "Verificação do limiar de IVA (artigo 53.º CIVA)",
            "Comparação entre regimes fiscais",
            "Coeficientes atualizados para 2025"
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Como funciona o simulador de IVA para alojamento local?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O simulador verifica automaticamente se a sua receita bruta anual de AL ultrapassa o limiar de isenção de IVA (€14.500 em 2025, artigo 53.º do CIVA). Se ultrapassar, calcula o IVA à taxa de 6% sobre os serviços de alojamento e mostra o impacto na receita líquida. Insira a receita bruta anual no campo acima para obter o resultado imediato."
              }
            },
            {
              "@type": "Question",
              "name": "Qual é o limiar de IVA para alojamento local em Portugal?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Em 2025, o limiar de isenção de IVA é €14.500 de faturação anual (artigo 53.º do CIVA). Abaixo deste valor está isento — não cobra nem paga IVA. Acima deste valor, é obrigatório registar-se no regime de IVA e liquidar 6% sobre os serviços de alojamento. A vantagem é poder deduzir o IVA dos custos operacionais (plataformas, limpeza, etc.)."
              }
            },
            {
              "@type": "Question",
              "name": "O que é a CEAL e quem tem de pagar?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A CEAL (Contribuição Extraordinária sobre o Alojamento Local) foi criada em 2023 e incide sobre a receita bruta anual do AL. A taxa varia entre 4% (zonas sem pressão habitacional) e 15% (Lisboa, Porto e outros municípios de alta pressão). Estão isentos imóveis em habitação própria permanente e imóveis em zonas do interior."
              }
            },
            {
              "@type": "Question",
              "name": "Quando sou obrigado a pagar IVA no alojamento local?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "É obrigado a registar-se no regime de IVA quando a faturação anual de AL ultrapassa €14.500 (limiar de isenção do artigo 53.º do CIVA em 2025). A taxa de IVA para serviços de alojamento é de 6%. Abaixo deste valor, está isento mas não pode deduzir IVA dos custos."
              }
            },
            {
              "@type": "Question",
              "name": "Qual a diferença entre regime simplificado e contabilidade organizada no AL?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No regime simplificado, aplica-se o coeficiente 0,35 à receita bruta para determinar o rendimento tributável — simples mas sem dedução de custos reais. Na contabilidade organizada, deduzem-se os custos efetivos (limpeza, plataformas, seguros, manutenção). Compensa quando os custos reais superam 65% da receita."
              }
            },
            {
              "@type": "Question",
              "name": "Como se calcula o IRS do alojamento local?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No regime simplificado: Receita bruta × 0,35 = Rendimento tributável AL. Este valor soma-se aos outros rendimentos do ano e aplica-se a tabela progressiva de IRS (13% a 48%). O simulador acima calcula automaticamente o IRS, CEAL e obrigações de IVA com base na sua receita e localização."
              }
            },
            {
              "@type": "Question",
              "name": "Quanto IRS pago num alojamento local em Lisboa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Em Lisboa (zona de alta pressão), um AL com €20.000/ano de receita paga em regime simplificado: Rendimento tributável = €20.000 × 0,35 = €7.000; IRS sobre €7.000 ≈ €910 (escalão 13%); CEAL = €20.000 × 15% = €3.000. Total de impostos sobre receita: cerca de €3.910 (19,6%). Use o simulador para calcular o valor exato com os seus dados."
              }
            },
            {
              "@type": "Question",
              "name": "Como declarar o alojamento local no IRS?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Os rendimentos de AL declaram-se no Anexo B do IRS (rendimentos empresariais e profissionais, Categoria B). No regime simplificado, preenche o quadro 4 com a receita bruta — o AT aplica automaticamente o coeficiente 0,35. Na contabilidade organizada, entrega o Anexo C com o resultado apurado pelo contabilista. O prazo de entrega é abril/junho do ano seguinte."
              }
            },
            {
              "@type": "Question",
              "name": "O alojamento local paga sempre IVA?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Não. Está isento de IVA enquanto a faturação anual não ultrapassar €14.500 (artigo 53.º CIVA, valor de 2025). Acima deste limiar, o AL passa a liquidar IVA à taxa de 6% sobre os serviços de alojamento e é obrigado a emitir fatura com IVA. A vantagem de ser sujeito passivo de IVA é poder deduzir o IVA dos custos operacionais."
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
              <FileText className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                Simulador de Impostos
                <span className="block text-orange-500">Alojamento Local</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Calcule o IRS, CEAL e obrigações de IVA do seu AL em Portugal. Compare regimes fiscais e descubra o peso total dos impostos sobre a sua receita.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mt-3">
                O Simulador de Impostos de Alojamento Local da CalculadoraAL é uma ferramenta gratuita para proprietários em Portugal. Suporta regime simplificado (coeficiente 0,35) e contabilidade organizada, calcula a CEAL por município com taxas 2025, e verifica automaticamente o limiar de IVA do artigo 53.º do CIVA.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Simulador de IVA incluído
                </span>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Limiar €14.500 calculado automaticamente
                </span>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Coeficientes IRS 2025
                </span>
              </div>
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

              {/* Receitas */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Rendimentos</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="receitaAL">Receita bruta anual de AL</label>
                    <div className="relative">
                      <input
                        id="receitaAL"
                        type="number"
                        min={0}
                        value={form.receitaAnualAL || ''}
                        onChange={e => set('receitaAnualAL', Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="Receita bruta anual de alojamento local em euros"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                    <p className={`text-xs mt-1 font-medium ${form.receitaAnualAL > LIMIAR_IVA ? 'text-orange-600' : 'text-gray-500'}`}>
                      {form.receitaAnualAL > LIMIAR_IVA
                        ? `⚠ Acima do limiar de IVA (€${fmt(LIMIAR_IVA)})`
                        : `Limiar de isenção de IVA: €${fmt(LIMIAR_IVA)}/ano`}
                    </p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="outrosRend">Outros rendimentos anuais (salário, rendas, etc.)</label>
                    <div className="relative">
                      <input
                        id="outrosRend"
                        type="number"
                        min={0}
                        value={form.outrosRendimentos || ''}
                        onChange={e => set('outrosRendimentos', Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="Outros rendimentos anuais em euros"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Usado para determinar a taxa marginal de IRS aplicável ao AL</p>
                  </div>
                </div>
              </div>

              {/* Regime fiscal */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Regime Fiscal (IRS)</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="regime">Regime de tributação</label>
                    <select
                      id="regime"
                      value={form.regime}
                      onChange={e => set('regime', e.target.value)}
                      className={inputClass}
                    >
                      {Object.entries(COEFICIENTES).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                      <option value="contab_organizada">Contabilidade organizada</option>
                    </select>
                    {!isContab && (
                      <p className="text-xs text-gray-500 mt-1">
                        {COEFICIENTES[form.regime]?.descricao} — coeficiente {COEFICIENTES[form.regime]?.valor}
                      </p>
                    )}
                  </div>

                  {isContab && (
                    <div>
                      <label className={labelClass} htmlFor="deducoes">Despesas dedutíveis (contabilidade organizada)</label>
                      <div className="relative">
                        <input
                          id="deducoes"
                          type="number"
                          min={0}
                          value={form.deducoesDespesas || ''}
                          onChange={e => set('deducoesDespesas', Number(e.target.value))}
                          onFocus={e => e.target.select()}
                          className={inputClass + ' pr-8'}
                          aria-label="Despesas dedutíveis em euros"
                        />
                        <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Limpeza, manutenção, comissões, seguros, IMI, etc.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CEAL */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-gray-900">CEAL</h2>
                  <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">Desde 2023</span>
                </div>
                <p className="text-sm text-gray-500 mb-5">Contribuição Extraordinária sobre o Alojamento Local</p>
                <div>
                  <label className={labelClass} htmlFor="zonaCEAL">Classificação do município</label>
                  <select
                    id="zonaCEAL"
                    value={form.zonaCEAL}
                    onChange={e => set('zonaCEAL', e.target.value)}
                    className={inputClass}
                  >
                    {Object.entries(CEAL_TAXAS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {CEAL_TAXAS[form.zonaCEAL].descricao}
                    {CEAL_TAXAS[form.zonaCEAL].taxa > 0 && ` — taxa ${pct(CEAL_TAXAS[form.zonaCEAL].taxa, 0)} sobre a receita bruta`}
                  </p>
                </div>
              </div>

              {/* IVA */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">IVA</h2>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.pagaIVA}
                    onChange={e => set('pagaIVA', e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-orange-500"
                    aria-label="Já está enquadrado no regime de IVA"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Já está enquadrado no regime de IVA</span>
                    <p className="text-xs text-gray-500 mt-0.5">Se faturar mais de €{fmt(LIMIAR_IVA)}/ano, a inscrição no IVA é obrigatória (taxa 6% para alojamento)</p>
                  </div>
                </label>
              </div>

              {/* Nota */}
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">Simulação indicativa</p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Valores calculados com base na legislação fiscal de 2025 (IRS, CEAL). Não inclui deduções à coleta, segurança social, IMI adicional municipal nem situações de isenção específicas. Consulte um contabilista certificado para a sua situação concreta.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="lg:col-span-7 space-y-6">

              {/* Resumo principal */}
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl p-8 shadow-lg text-white">
                <p className="text-orange-100 font-semibold text-sm uppercase tracking-wider mb-1">Total de Impostos Estimado</p>
                <p className="text-5xl font-bold mb-1">€{fmt(resultado.totalImposto)}</p>
                <p className="text-orange-100 text-sm">
                  {pct(resultado.taxaEfetivaSobreReceita)} da receita bruta de AL
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-orange-100 text-xs font-medium mb-1">IRS sobre AL</p>
                    <p className="text-white font-bold text-xl">€{fmt(resultado.impostoIRS)}</p>
                    <p className="text-orange-200 text-xs">taxa marginal {pct(taxaMarginal(resultado.baseIRS))}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-orange-100 text-xs font-medium mb-1">CEAL</p>
                    <p className="text-white font-bold text-xl">€{fmt(resultado.ceal)}</p>
                    <p className="text-orange-200 text-xs">
                      {CEAL_TAXAS[form.zonaCEAL].taxa > 0 ? pct(CEAL_TAXAS[form.zonaCEAL].taxa, 0) + ' sobre receita bruta' : 'isento'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Alerta IVA */}
              {resultado.alertaIVA && (
                <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-orange-800 mb-1">Atenção: limiar de IVA ultrapassado</p>
                      <p className="text-sm text-orange-700">
                        A sua receita anual (€{fmt(form.receitaAnualAL)}) ultrapassa o limiar de isenção de IVA (€{fmt(LIMIAR_IVA)}). É obrigatório o enquadramento no regime de IVA com taxa de 6% para serviços de alojamento. Contacte um contabilista para regularizar a sua situação.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {form.receitaAnualAL <= LIMIAR_IVA && (
                <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-green-700 font-medium">
                      Dentro do limiar de isenção de IVA (€{fmt(LIMIAR_IVA)}/ano). Não é obrigatório o enquadramento no IVA.
                    </p>
                  </div>
                </div>
              )}

              {/* Detalhe do cálculo */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Detalhe do Cálculo</h3>

                {/* IRS */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">IRS — Categoria B</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Receita bruta AL', value: `€${fmt(form.receitaAnualAL)}` },
                      {
                        label: isContab
                          ? 'Despesas dedutíveis'
                          : `Coeficiente regime simplificado (×${COEFICIENTES[form.regime]?.valor ?? '—'})`,
                        value: isContab
                          ? `− €${fmt(form.deducoesDespesas)}`
                          : `×${COEFICIENTES[form.regime]?.valor ?? '—'}`,
                        neg: isContab,
                      },
                      { label: 'Rendimento tributável AL', value: `€${fmt(resultado.rendimentoTributavelIRS)}`, bold: true },
                      { label: 'Outros rendimentos', value: `€${fmt(form.outrosRendimentos)}` },
                      { label: 'Base tributável total', value: `€${fmt(resultado.baseIRS)}`, bold: true },
                      { label: 'IRS imputável ao AL', value: `€${fmt(resultado.impostoIRS)}`, highlight: true },
                    ].map(({ label, value, bold, neg, highlight }) => (
                      <div
                        key={label}
                        className={`flex justify-between py-2 border-b border-gray-100 last:border-0 ${highlight ? 'bg-orange-50 -mx-3 px-3 rounded-lg' : ''}`}
                      >
                        <span className={`text-sm ${bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{label}</span>
                        <span className={`text-sm font-semibold ${highlight ? 'text-orange-600' : neg ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CEAL */}
                {CEAL_TAXAS[form.zonaCEAL].taxa > 0 && (
                  <div className="mb-6 pt-4 border-t border-gray-100">
                    <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">CEAL</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Receita bruta AL', value: `€${fmt(form.receitaAnualAL)}` },
                        { label: `Taxa CEAL (${pct(CEAL_TAXAS[form.zonaCEAL].taxa, 0)})`, value: `×${pct(CEAL_TAXAS[form.zonaCEAL].taxa, 0)}` },
                        { label: 'CEAL a pagar', value: `€${fmt(resultado.ceal)}`, highlight: true },
                      ].map(({ label, value, highlight }) => (
                        <div
                          key={label}
                          className={`flex justify-between py-2 border-b border-gray-100 last:border-0 ${highlight ? 'bg-orange-50 -mx-3 px-3 rounded-lg' : ''}`}
                        >
                          <span className="text-sm text-gray-600">{label}</span>
                          <span className={`text-sm font-semibold ${highlight ? 'text-orange-600' : 'text-gray-900'}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resumo final */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                    {[
                      { label: 'Receita bruta AL', value: `€${fmt(form.receitaAnualAL)}` },
                      { label: 'IRS sobre AL', value: `− €${fmt(resultado.impostoIRS)}`, neg: true },
                      { label: 'CEAL', value: `− €${fmt(resultado.ceal)}`, neg: true },
                    ].map(({ label, value, neg }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className={`text-sm font-semibold ${neg ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-bold text-gray-900">Receita líquida (após impostos)</span>
                      <span className="text-xl font-bold text-green-700">€{fmt(resultado.receitaLiquida)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Taxa efetiva de imposto sobre a receita: {pct(resultado.taxaEfetivaSobreReceita)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Escalões IRS de referência */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Escalões IRS 2025</h3>
                <div className="space-y-2">
                  {ESCALOES.filter(e => e.limite !== Infinity || resultado.baseIRS > 51997).map(e => {
                    const ativo = resultado.baseIRS > (ESCALOES[ESCALOES.indexOf(e) - 1]?.limite ?? 0) && resultado.baseIRS <= (e.limite === Infinity ? Infinity : e.limite);
                    return (
                      <div
                        key={e.label}
                        className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm ${ativo ? 'bg-orange-50 border border-orange-200' : ''}`}
                      >
                        <span className={ativo ? 'font-semibold text-orange-800' : 'text-gray-600'}>{e.label}</span>
                        <span className={`font-bold ${ativo ? 'text-orange-600' : 'text-gray-700'}`}>
                          {pct(e.taxa, 0)}
                          {ativo && <span className="text-xs ml-1 font-normal text-orange-500">(o seu escalão)</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion
        title="Perguntas Frequentes sobre Impostos AL"
        items={[
          {
            question: 'Como funciona o simulador de IVA para alojamento local?',
            answer: 'O simulador verifica automaticamente se a sua receita bruta anual de AL ultrapassa o limiar de isenção de IVA (€14.500 em 2025, artigo 53.º do CIVA). Se ultrapassar, calcula o IVA à taxa de 6% sobre os serviços de alojamento e mostra o impacto na receita líquida. Insira a receita bruta anual no campo acima para obter o resultado imediato.'
          },
          {
            question: 'Qual é o limiar de IVA para alojamento local em Portugal?',
            answer: 'Em 2025, o limiar de isenção de IVA é €14.500 de faturação anual (artigo 53.º do CIVA). Abaixo deste valor está isento — não cobra nem paga IVA. Acima deste valor, é obrigatório registar-se no regime de IVA e liquidar 6% sobre os serviços de alojamento. A vantagem é poder deduzir o IVA dos custos operacionais (plataformas, limpeza, etc.).'
          },
          {
            question: 'O que é a CEAL e quem tem de pagar?',
            answer: 'A CEAL (Contribuição Extraordinária sobre o Alojamento Local) foi criada em 2023 e incide sobre a receita bruta anual do AL. A taxa varia entre 4% (zonas sem pressão habitacional) e 15% (Lisboa, Porto e outros municípios de alta pressão). Estão isentos imóveis em habitação própria permanente e imóveis em zonas do interior.'
          },
          {
            question: 'Quando sou obrigado a pagar IVA no alojamento local?',
            answer: 'É obrigado a registar-se no regime de IVA quando a faturação anual de AL ultrapassa €14.500 (limiar de isenção do artigo 53.º do CIVA em 2025). A taxa de IVA para serviços de alojamento é de 6%. Abaixo deste valor, está isento mas não pode deduzir IVA dos custos.'
          },
          {
            question: 'Qual a diferença entre regime simplificado e contabilidade organizada no AL?',
            answer: 'No regime simplificado, aplica-se o coeficiente 0,35 à receita bruta para determinar o rendimento tributável — simples mas sem dedução de custos reais. Na contabilidade organizada, deduzem-se os custos efetivos (limpeza, plataformas, seguros, manutenção). Compensa quando os custos reais superam 65% da receita.'
          },
          {
            question: 'Como se calcula o IRS do alojamento local?',
            answer: 'No regime simplificado: Receita bruta × 0,35 = Rendimento tributável AL. Este valor soma-se aos outros rendimentos do ano e aplica-se a tabela progressiva de IRS (13% a 48%). O simulador acima calcula automaticamente o IRS, CEAL e obrigações de IVA com base na sua receita e localização.'
          },
          {
            question: 'Quanto IRS pago num alojamento local em Lisboa?',
            answer: 'Em Lisboa (zona de alta pressão), um AL com €20.000/ano de receita paga em regime simplificado: Rendimento tributável = €20.000 × 0,35 = €7.000; IRS sobre €7.000 ≈ €910; CEAL = €20.000 × 15% = €3.000. Total: cerca de €3.910 (19,6% da receita). Use o simulador acima para calcular o valor exato com os seus dados.'
          },
          {
            question: 'Como declarar o alojamento local no IRS?',
            answer: 'Os rendimentos de AL declaram-se no Anexo B do IRS (Categoria B — rendimentos empresariais e profissionais). No regime simplificado, preenche o quadro 4 com a receita bruta — o AT aplica automaticamente o coeficiente 0,35. Na contabilidade organizada, entrega o Anexo C com o resultado apurado pelo contabilista. O prazo de entrega é abril a junho do ano seguinte.'
          },
          {
            question: 'O alojamento local paga sempre IVA?',
            answer: 'Não. Está isento de IVA enquanto a faturação anual não ultrapassar €14.500 (artigo 53.º CIVA, 2025). Acima deste limiar, o AL passa a liquidar IVA à taxa de 6% sobre os serviços de alojamento. A vantagem de ser sujeito passivo de IVA é poder deduzir o IVA dos custos operacionais (limpeza, plataformas, etc.).'
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
              <FileText className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Simulador de Mais-Valias
            </Link>
            <Link
              to="/taxa-ocupacao"
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-900 font-semibold px-7 py-3.5 rounded-xl transition-all"
            >
              <BarChart2 className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Taxa de Ocupação
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
