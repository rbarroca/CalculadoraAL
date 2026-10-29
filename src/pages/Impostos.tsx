import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';
import FAQAccordion from '../components/FAQAccordion';
import OtherTools from '../components/OtherTools';
import { ESCALOES_IRS, impostoMarginal } from '../data/irs';

const LIMIAR_IVA = 15000; // artigo 53.º CIVA (valor em vigor em 2026)
const LIMIAR_IVA_IMEDIATO = LIMIAR_IVA * 1.25; // acima disto a saída da isenção é imediata

// Coeficientes do regime simplificado (art. 31.º CIRS)
const COEFICIENTES: Record<string, { label: string; valor: number; descricao: string }> = {
  al_moradia: {
    label: 'AL em moradia ou apartamento',
    valor: 0.35,
    descricao: 'Coeficiente 0,35 sobre a receita bruta'
  },
  al_contencao: {
    label: 'AL em moradia ou apartamento, em área de contenção',
    valor: 0.50,
    descricao: 'Coeficiente 0,50 sobre a receita bruta (art. 31.º, n.º 1, al. h) do CIRS)'
  },
  al_quartos: {
    label: 'AL em quartos (estabelecimento de hospedagem)',
    valor: 0.15,
    descricao: 'Coeficiente 0,15 sobre a receita bruta'
  },
};

function taxaMarginal(rendimento: number): number {
  return (ESCALOES_IRS.find(e => rendimento <= e.limite) ?? ESCALOES_IRS[ESCALOES_IRS.length - 1]).taxa;
}

interface FormData {
  receitaAnualAL: number;
  outrosRendimentos: number;
  regime: string;
  pagaIVA: boolean;
  deducoesDespesas: number; // só no regime contabilidade organizada
}

interface Resultado {
  rendimentoTributavelIRS: number;
  baseIRS: number;
  impostoIRS: number;
  taxaEfetivaSobreReceita: number;
  alertaIVA: boolean;
  receitaLiquida: number;
}

function calcular(f: FormData): Resultado {
  const coef = COEFICIENTES[f.regime];
  const receitaTrib = f.regime === 'contab_organizada'
    ? Math.max(0, f.receitaAnualAL - f.deducoesDespesas)
    : f.receitaAnualAL * coef.valor;

  const impostoIRS = impostoMarginal(receitaTrib, f.outrosRendimentos);

  return {
    rendimentoTributavelIRS: receitaTrib,
    baseIRS: f.outrosRendimentos + receitaTrib,
    impostoIRS,
    taxaEfetivaSobreReceita: f.receitaAnualAL > 0 ? impostoIRS / f.receitaAnualAL : 0,
    alertaIVA: f.receitaAnualAL > LIMIAR_IVA && !f.pagaIVA,
    receitaLiquida: f.receitaAnualAL - impostoIRS,
  };
}

function rotuloEscalao(i: number): string {
  const inferior = i === 0 ? 0 : ESCALOES_IRS[i - 1].limite;
  const { limite } = ESCALOES_IRS[i];
  if (i === 0) return `até €${fmt(limite)}`;
  if (limite === Infinity) return `acima de €${fmt(inferior)}`;
  return `€${fmt(inferior)} – €${fmt(limite)}`;
}

const FAQ_ITEMS = [
  {
    question: 'Como funciona o simulador de IVA para alojamento local?',
    answer: 'O simulador compara a sua receita bruta anual de AL com o limiar de isenção de IVA (€15.000 em 2026, artigo 53.º do CIVA) e avisa se o ultrapassar. Acima deste valor deixa de poder beneficiar da isenção e passa a liquidar IVA à taxa de 6% sobre os serviços de alojamento. Insira a receita bruta anual no campo acima para obter o resultado imediato.'
  },
  {
    question: 'Qual é o limiar de IVA para alojamento local em Portugal?',
    answer: 'Em 2026, o limiar de isenção de IVA é de €15.000 de volume de negócios anual (artigo 53.º do CIVA). Abaixo deste valor está isento: não cobra IVA, mas também não o pode deduzir nos custos. Acima, passa a liquidar 6% sobre os serviços de alojamento e pode deduzir o IVA dos custos operacionais (plataformas, limpeza, etc.).'
  },
  {
    question: 'A CEAL ainda existe?',
    answer: 'Não. A Contribuição Extraordinária sobre o Alojamento Local (CEAL) foi criada em 2023 pelo programa Mais Habitação e revogada em 2024 pelo Decreto-Lei n.º 57/2024, de 10 de setembro, ao abrigo da Lei n.º 35/2024. Por isso, o simulador já não a inclui.'
  },
  {
    question: 'Quando sou obrigado a pagar IVA no alojamento local?',
    answer: 'É obrigado a enquadrar-se no regime de IVA quando o volume de negócios anual de AL ultrapassa €15.000 (artigo 53.º do CIVA, valor de 2026). A taxa de IVA para serviços de alojamento é de 6%. Se ultrapassar €15.000 mas não €18.750 (limiar + 25%), o regime normal de IVA aplica-se a partir de 1 de janeiro do ano seguinte; acima de €18.750, a saída da isenção é imediata. Confirme a sua situação com um contabilista.'
  },
  {
    question: 'Qual a diferença entre regime simplificado e contabilidade organizada no AL?',
    answer: 'No regime simplificado, aplica-se um coeficiente à receita bruta para determinar o rendimento tributável: 0,35 num AL em moradia ou apartamento (0,50 se estiver em área de contenção) e 0,15 num AL em quartos. É simples, mas sem dedução de custos reais. Na contabilidade organizada, deduzem-se os custos efetivos (limpeza, plataformas, seguros, manutenção). Compensa quando os custos reais superam 65% da receita (50% em área de contenção e 85% no caso dos quartos).'
  },
  {
    question: 'Como se calcula o IRS do alojamento local?',
    answer: 'No regime simplificado, num AL em moradia ou apartamento: receita bruta × 0,35 = rendimento tributável. Este valor soma-se aos outros rendimentos do ano e aplica-se a tabela progressiva de IRS (de 12,2% a 48% em 2026, no continente). O simulador acima calcula o IRS com base na sua receita e nos seus outros rendimentos.'
  },
  {
    question: 'Quanto IRS pago num alojamento local?',
    answer: 'Um AL em apartamento com €20.000/ano de receita, em regime simplificado, tem um rendimento tributável de €20.000 × 0,35 = €7.000. Se não tiver outros rendimentos, o IRS é de cerca de €854 (12,2% no 1.º escalão), ou seja, 4,3% da receita. Com outros rendimentos, o imposto sobe, porque o AL entra em escalões mais altos. Use o simulador acima para calcular o valor com os seus dados.'
  },
  {
    question: 'Como declarar o alojamento local no IRS?',
    answer: 'Os rendimentos de AL declaram-se como rendimentos empresariais e profissionais (Categoria B): no Anexo B, no regime simplificado, ou no Anexo C, na contabilidade organizada. A declaração entrega-se de abril a junho do ano seguinte.'
  },
  {
    question: 'O alojamento local paga sempre IVA?',
    answer: 'Não. Está isento de IVA enquanto o volume de negócios anual não ultrapassar €15.000 (artigo 53.º do CIVA, valor de 2026). Acima deste limiar, o AL passa a liquidar IVA à taxa de 6% sobre os serviços de alojamento. A vantagem de ser sujeito passivo de IVA é poder deduzir o IVA dos custos operacionais (limpeza, plataformas, etc.).'
  }
];

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
    regime: 'al_moradia',
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
        title="Simulador de Impostos Alojamento Local: IRS e IVA em Portugal 2026"
        description="Simule o IRS e o IVA do seu Alojamento Local em Portugal. Calcule o imposto a pagar no regime simplificado ou na contabilidade organizada e veja se ultrapassou o limiar de IVA (€15.000). Gratuito."
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
          "description": "Simulador gratuito que calcula IRS Categoria B e obrigações de IVA do Alojamento Local em Portugal, com suporte para regime simplificado e contabilidade organizada.",
          "featureList": [
            "Cálculo de IRS Categoria B (regime simplificado e contabilidade organizada)",
            "Verificação do limiar de IVA (artigo 53.º CIVA)",
            "Comparação entre regimes fiscais",
            "Escalões de IRS e coeficientes atualizados para 2026"
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_ITEMS.map(({ question, answer }) => ({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": { "@type": "Answer", "text": answer }
          }))
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
                Calcule o IRS e as obrigações de IVA do seu AL em Portugal. Compare regimes fiscais e descubra o peso dos impostos sobre a sua receita.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mt-3">
                O Simulador de Impostos de Alojamento Local da CalculadoraAL é uma ferramenta gratuita para proprietários em Portugal. Suporta regime simplificado (coeficientes 0,35, 0,50 e 0,15) e contabilidade organizada, usa os escalões de IRS de 2026 e verifica automaticamente o limiar de IVA do artigo 53.º do CIVA.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Simulador de IVA incluído
                </span>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Limiar €15.000 calculado automaticamente
                </span>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Escalões IRS 2026
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
                        {COEFICIENTES[form.regime]?.descricao}
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
                      Valores calculados com base na legislação fiscal de 2026 (IRS, continente). Taxas do 1.º ao 6.º escalão reduzidas pela Lei n.º 64-B/2026, a aguardar decreto-lei. Não inclui deduções à coleta, segurança social, IMI e AIMI nem situações de isenção específicas. Consulte um contabilista certificado para a sua situação concreta.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="lg:col-span-7 space-y-6">

              {/* Resumo principal */}
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl p-8 shadow-lg text-white">
                <p className="text-orange-100 font-semibold text-sm uppercase tracking-wider mb-1">IRS Estimado</p>
                <p className="text-5xl font-bold mb-1">€{fmt(resultado.impostoIRS)}</p>
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
                    <p className="text-orange-100 text-xs font-medium mb-1">Rendimento tributável AL</p>
                    <p className="text-white font-bold text-xl">€{fmt(resultado.rendimentoTributavelIRS)}</p>
                    <p className="text-orange-200 text-xs">soma-se aos outros rendimentos</p>
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
                        A sua receita anual (€{fmt(form.receitaAnualAL)}) ultrapassa o limiar de isenção de IVA (€{fmt(LIMIAR_IVA)}). Deixa de poder beneficiar da isenção e passa a liquidar IVA à taxa de 6% sobre os serviços de alojamento. {form.receitaAnualAL > LIMIAR_IVA_IMEDIATO ? `Como ultrapassa €${fmt(LIMIAR_IVA_IMEDIATO)} (limiar + 25%), a saída da isenção é imediata.` : `Como não ultrapassa €${fmt(LIMIAR_IVA_IMEDIATO)} (limiar + 25%), o regime normal de IVA aplica-se a partir de 1 de janeiro do ano seguinte.`} Contacte um contabilista para confirmar a sua situação.
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

                {/* Resumo final */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                    {[
                      { label: 'Receita bruta AL', value: `€${fmt(form.receitaAnualAL)}` },
                      { label: 'IRS sobre AL', value: `− €${fmt(resultado.impostoIRS)}`, neg: true },
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
                <h3 className="text-lg font-bold text-gray-900 mb-5">Escalões IRS 2026</h3>
                <div className="space-y-2">
                  {ESCALOES_IRS.map((e, i) => {
                    const ativo = resultado.baseIRS > (ESCALOES_IRS[i - 1]?.limite ?? 0) && resultado.baseIRS <= e.limite;
                    return (
                      <div
                        key={e.limite}
                        className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm ${ativo ? 'bg-orange-50 border border-orange-200' : ''}`}
                      >
                        <span className={ativo ? 'font-semibold text-orange-800' : 'text-gray-600'}>{rotuloEscalao(i)}</span>
                        <span className={`font-bold ${ativo ? 'text-orange-600' : 'text-gray-700'}`}>
                          {pct(e.taxa)}
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
        items={FAQ_ITEMS}
      />

      <OtherTools current="impostos" />

      <Footer />
    </div>
  );
}
