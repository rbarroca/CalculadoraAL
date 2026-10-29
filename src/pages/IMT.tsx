import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ArrowLeft, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';
import FAQAccordion from '../components/FAQAccordion';
import OtherTools from '../components/OtherTools';
import { calcularIMT, TAXA_SELO, type EntradaIMT, type Regiao, type TipoImovel } from '../data/imt';

const TIPOS: { value: TipoImovel; label: string; descricao: string }[] = [
  { value: 'secundaria', label: 'Habitação secundária, arrendamento ou AL', descricao: 'Habitação que não é a sua casa de morada permanente. É o caso da maioria das compras para AL.' },
  { value: 'hpp', label: 'Habitação própria e permanente', descricao: 'A casa onde vai viver de forma permanente. Tem isenção até ao 1.º escalão.' },
  { value: 'urbano_outros', label: 'Urbano não habitacional ou terreno para construção', descricao: 'Lojas, escritórios, armazéns, terrenos para construção. Taxa de 6,5%.' },
  { value: 'rustico', label: 'Prédio rústico', descricao: 'Terreno agrícola ou florestal. Taxa de 5%.' },
];

const FAQ_ITEMS = [
  {
    question: 'Quanto IMT pago ao comprar um imóvel para alojamento local?',
    answer: 'Um imóvel para AL conta como habitação que não é a sua casa própria e permanente, por isso aplica-se a Tabela III do IMT (continente), sem isenção. O primeiro escalão paga 1% e a taxa sobe até 8%. Por exemplo, numa compra de €250.000 o IMT é de €250.000 × 7% − €9.394,50 = €8.105,50, a que se soma o Imposto do Selo de 0,8% (€2.000).'
  },
  {
    question: 'O IMT de um AL é diferente do IMT da habitação própria?',
    answer: 'Sim. Na habitação própria e permanente, os primeiros €106.346 estão isentos. Na habitação secundária, no arrendamento ou no AL, esse primeiro escalão paga 1%. A partir daí os escalões e as taxas são os mesmos, mas as parcelas a abater são diferentes.'
  },
  {
    question: 'Os compradores não residentes pagam mais IMT?',
    answer: 'Sim, desde 25 de maio de 2026. Segundo o Decreto-Lei n.º 97/2026, a compra de habitação por quem não é residente fiscal em Portugal paga uma taxa fixa de 7,5%, sem escalões nem isenções. O critério é a residência fiscal e não a nacionalidade. A exceção prevista para imóveis destinados a arrendamento habitacional com renda moderada não abrange o alojamento local. Confirme a sua situação com um contabilista.'
  },
  {
    question: 'Quanto é o Imposto do Selo na compra de um imóvel?',
    answer: 'O Imposto do Selo na aquisição de imóveis é de 0,8% sobre o valor do imóvel (verba 1.1 da Tabela Geral do Imposto do Selo). Paga-se em conjunto com o IMT, antes da escritura.'
  },
  {
    question: 'Sobre que valor incide o IMT?',
    answer: 'Incide sobre o maior de dois valores: o preço de compra ou o valor patrimonial tributário (VPT) do imóvel. Se o VPT for superior ao preço, o IMT e o Imposto do Selo calculam-se sobre o VPT. Pode consultar o VPT na caderneta predial, no Portal das Finanças.'
  },
  {
    question: 'O que é o IMT Jovem e aplica-se a um AL?',
    answer: 'O IMT Jovem isenta de IMT e de Imposto do Selo a compra da primeira habitação própria e permanente por quem tem até 35 anos, até €330.539 (continente). Entre €330.539 e €660.982 paga 8% sobre o excedente, e acima disso não há isenção. Como exige habitação própria e permanente, não se aplica a imóveis comprados para AL.'
  },
  {
    question: 'O IMT pago na compra pode ser deduzido nas mais-valias?',
    answer: 'Sim. O IMT e o Imposto do Selo pagos na aquisição são despesas de aquisição, por isso podem ser deduzidos ao calcular a mais-valia quando vender o imóvel. Use o simulador de mais-valias para ver o efeito.'
  },
  {
    question: 'As taxas são iguais nos Açores e na Madeira?',
    answer: 'As taxas marginais são as mesmas, mas os limites dos escalões são 25% mais altos nas Regiões Autónomas (as Tabelas IV, V e VI). Por isso o IMT é normalmente mais baixo para o mesmo valor. O simulador aplica a tabela da região que escolher.'
  },
];

function fmt(n: number, casas = 0): string {
  return n.toLocaleString('pt-PT', { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

function pct(n: number, casas = 1): string {
  return (n * 100).toFixed(casas).replace('.', ',') + '%';
}

export default function IMT() {
  const [preco, setPreco] = useState(250000);
  const [vpt, setVpt] = useState(0);
  const [regiao, setRegiao] = useState<Regiao>('continente');
  const [tipo, setTipo] = useState<TipoImovel>('secundaria');
  const [jovem, setJovem] = useState(false);
  const [naoResidente, setNaoResidente] = useState(false);

  const entrada: EntradaIMT = { preco, vpt, regiao, tipo, jovem, naoResidente };
  const r = useMemo(() => calcularIMT(entrada), [preco, vpt, regiao, tipo, jovem, naoResidente]);

  const habitacao = tipo === 'hpp' || tipo === 'secundaria';
  const mostraJovem = tipo === 'hpp' && !naoResidente;

  const inputClass = 'w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors font-medium text-gray-900 bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  function rotulo(i: number): string {
    const esc = r.tabela!.escaloes;
    const inferior = i === 0 ? 0 : esc[i - 1].ate;
    const { ate } = esc[i];
    if (i === 0) return `até €${fmt(ate)}`;
    if (ate === Infinity) return `acima de €${fmt(inferior)}`;
    return `€${fmt(inferior)} a €${fmt(ate)}`;
  }

  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Simulador de IMT e Imposto do Selo 2026: Compra de Imóvel para AL"
        description="Calcule o IMT e o Imposto do Selo na compra de um imóvel para alojamento local em Portugal. Tabelas oficiais de 2026, continente e ilhas, não residentes e IMT Jovem. Gratuito."
        canonical="https://calculadoraal.pt/imt/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Simulador de IMT e Imposto do Selo",
          "url": "https://calculadoraal.pt/imt/",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
          "description": "Simulador gratuito que calcula o IMT e o Imposto do Selo na compra de imóveis em Portugal, com as tabelas de 2026 para o continente e as Regiões Autónomas.",
          "featureList": [
            "Tabelas de IMT de 2026 (Ofício-Circulado n.º 40129/2026)",
            "Habitação própria, habitação secundária e AL",
            "Compradores não residentes (taxa fixa de 7,5%)",
            "IMT Jovem até 35 anos",
            "Imposto do Selo e custo total de aquisição"
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
              <Landmark className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                Simulador de IMT
                <span className="block text-orange-500">Compra de Imóvel para AL</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Calcule o IMT e o Imposto do Selo na compra do imóvel e saiba o custo total de aquisição, com as tabelas oficiais de 2026.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Tabelas IMT 2026
                </span>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Continente e ilhas
                </span>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✓ Não residentes
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
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Imóvel</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="preco">Preço de compra</label>
                    <div className="relative">
                      <input
                        id="preco"
                        type="number"
                        min={0}
                        value={preco || ''}
                        onChange={e => setPreco(Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="Preço de compra em euros"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="vpt">Valor patrimonial tributário (opcional)</label>
                    <div className="relative">
                      <input
                        id="vpt"
                        type="number"
                        min={0}
                        value={vpt || ''}
                        onChange={e => setVpt(Number(e.target.value))}
                        onFocus={e => e.target.select()}
                        className={inputClass + ' pr-8'}
                        aria-label="Valor patrimonial tributário em euros"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">€</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">O imposto incide sobre o maior entre o preço e o VPT. Consulte o VPT na caderneta predial.</p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="tipo">Tipo de imóvel</label>
                    <select
                      id="tipo"
                      value={tipo}
                      onChange={e => {
                        const t = e.target.value as TipoImovel;
                        setTipo(t);
                        if (t !== 'hpp') setJovem(false);
                        if (t !== 'hpp' && t !== 'secundaria') setNaoResidente(false);
                      }}
                      className={inputClass}
                    >
                      {TIPOS.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS.find(t => t.value === tipo)?.descricao}</p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="regiao">Localização</label>
                    <select
                      id="regiao"
                      value={regiao}
                      onChange={e => setRegiao(e.target.value as Regiao)}
                      className={inputClass}
                    >
                      <option value="continente">Continente</option>
                      <option value="ilhas">Açores ou Madeira</option>
                    </select>
                  </div>
                </div>
              </div>

              {habitacao && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Comprador</h2>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={naoResidente}
                        onChange={e => {
                          setNaoResidente(e.target.checked);
                          if (e.target.checked) setJovem(false);
                        }}
                        className="mt-0.5 h-4 w-4 accent-orange-500"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Comprador não residente fiscal em Portugal</span>
                        <p className="text-xs text-gray-500 mt-0.5">Taxa fixa de 7,5% em compras de habitação desde 25 de maio de 2026</p>
                      </div>
                    </label>

                    {mostraJovem && (
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={jovem}
                          onChange={e => setJovem(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-orange-500"
                        />
                        <div>
                          <span className="text-sm font-semibold text-gray-700">IMT Jovem (até 35 anos, primeira habitação)</span>
                          <p className="text-xs text-gray-500 mt-0.5">Só para a primeira habitação própria e permanente</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">Simulação indicativa</p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Tabelas do Ofício-Circulado n.º 40129/2026 da AT. Não inclui isenções específicas, compradores em regimes fiscais privilegiados (taxa de 10%), escritura, registo nem comissões. Confirme com um contabilista ou advogado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl p-8 shadow-lg text-white">
                <p className="text-orange-100 font-semibold text-sm uppercase tracking-wider mb-1">IMT + Imposto do Selo</p>
                <p className="text-5xl font-bold mb-1">€{fmt(r.total)}</p>
                <p className="text-orange-100 text-sm">{pct(r.taxaEfetiva)} do preço de compra</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-orange-100 text-xs font-medium mb-1">IMT</p>
                    <p className="text-white font-bold text-xl">€{fmt(r.imt)}</p>
                    <p className="text-orange-200 text-xs">{r.imt === 0 ? 'isento' : `sobre €${fmt(r.base)}`}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-orange-100 text-xs font-medium mb-1">Imposto do Selo</p>
                    <p className="text-white font-bold text-xl">€{fmt(r.selo)}</p>
                    <p className="text-orange-200 text-xs">{r.seloIsento ? 'isento (IMT Jovem)' : `${pct(TAXA_SELO)} sobre €${fmt(r.base)}`}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Resumo da Compra</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Preço de compra', value: `€${fmt(preco)}` },
                    ...(r.base > preco ? [{ label: 'Valor usado no cálculo (VPT)', value: `€${fmt(r.base)}` }] : []),
                    { label: 'IMT', value: `+ €${fmt(r.imt, 2)}` },
                    { label: 'Imposto do Selo', value: `+ €${fmt(r.selo, 2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-sm font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Custo total de aquisição</span>
                    <span className="text-2xl font-bold text-gray-900">€{fmt(r.custoTotal)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Sem escritura, registo nem comissões. O IMT e o Imposto do Selo são dedutíveis nas mais-valias, quando vender.</p>
                </div>
                <p className="text-sm text-gray-600 mt-4">{r.descricao}</p>
              </div>

              {r.tabela && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Tabela {r.tabela.id}</h3>
                  <p className="text-sm text-gray-500 mb-5">{r.tabela.nome}</p>
                  <div className="space-y-2">
                    {r.tabela.escaloes.map((e, i) => {
                      const ativo = i === r.escalaoIndex;
                      return (
                        <div
                          key={e.ate}
                          className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm ${ativo ? 'bg-orange-50 border border-orange-200' : ''}`}
                        >
                          <span className={ativo ? 'font-semibold text-orange-800' : 'text-gray-600'}>{rotulo(i)}</span>
                          <span className={`font-bold ${ativo ? 'text-orange-600' : 'text-gray-700'}`}>
                            {pct(e.taxa)}
                            {e.abater > 0 && <span className="text-xs ml-1 font-normal text-gray-500">− €{fmt(e.abater, 2)}</span>}
                            {ativo && <span className="text-xs ml-1 font-normal text-orange-500">(o seu escalão)</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Como se calcula o IMT na compra de um imóvel para AL?</h2>
              <p className="text-gray-600 leading-relaxed">
                O IMT (Imposto Municipal sobre as Transmissões Onerosas de Imóveis) calcula-se aplicando ao valor do imóvel a taxa do escalão
                correspondente e subtraindo a parcela a abater. Um imóvel comprado para AL conta como habitação que não é a sua casa própria
                e permanente, por isso não tem a isenção do primeiro escalão. A esse valor soma-se o Imposto do Selo de 0,8%.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Porque é que o IMT conta para a rentabilidade do AL?</h2>
              <p className="text-gray-600 leading-relaxed">
                O IMT e o Imposto do Selo fazem parte do investimento inicial e aumentam o tempo que o imóvel demora a pagar-se.
                Some-os ao preço de compra para comparar a rentabilidade real com o arrendamento tradicional na calculadora de rentabilidade, e
                lembre-se de que são dedutíveis ao calcular as mais-valias na venda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion title="Perguntas Frequentes sobre IMT" items={FAQ_ITEMS} />

      <OtherTools current="imt" />

      <Footer />
    </div>
  );
}
