import { Helmet } from 'react-helmet-async';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Como calcular o rendimento de um alojamento local?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para calcular o rendimento do seu AL, multiplique o preço por noite pela taxa de ocupação mensal e subtraia os custos operacionais (limpeza, plataformas, manutenção, seguros, IMI). Use a nossa calculadora para simular cenários específicos por localização em Portugal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como simular os impostos de alojamento local?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No AL paga IRS sobre os rendimentos (coeficiente 0,35 no regime simplificado), CEAL (Contribuição Extraordinária AL) entre 4% e 15% conforme a zona, e IVA se faturar mais de €14.500/ano. O nosso simulador de impostos AL calcula automaticamente cada encargo.',
      },
    },
    {
      '@type': 'Question',
      name: 'O AL é mais rentável do que o arrendamento tradicional?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O AL pode gerar 2 a 3 vezes mais rendimento do que o arrendamento tradicional, mas requer mais gestão ativa. Depende da localização, sazonalidade e taxa de ocupação. Use a calculadora para comparar os dois cenários com os dados reais do seu imóvel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como calcular a rentabilidade de um imóvel para arrendamento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A rentabilidade bruta do arrendamento calcula-se dividindo a renda anual pelo valor do imóvel. Para a rentabilidade líquida, desconte IRS (28% sobre rendas), IMI, manutenção e seguros. Compare sempre com o cenário AL para escolher a melhor opção.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como calcular a taxa de ocupação de um alojamento local?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A taxa de ocupação é o número de noites vendidas a dividir pelo total de noites disponíveis. Em Portugal, a média varia entre 60-80% nas cidades turísticas (Lisboa, Porto, Algarve). A nossa calculadora de taxa de ocupação permite análise mês a mês com benchmarks por destino.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como funciona o simulador de mais-valias do alojamento local?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O simulador calcula o imposto sobre mais-valias na venda do imóvel AL aplicando os coeficientes de desvalorização monetária da AT, deduzindo despesas de aquisição e alienação, e comparando a taxa liberatória de 28% com o englobamento IRS para encontrar a opção mais vantajosa.',
      },
    },
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Calculadora de Alojamento Local',
  url: 'https://calculadoraal.pt/',
  description:
    'Simulador gratuito para calcular o rendimento de Alojamento Local em Portugal. Calcule receitas, custos, impostos e compare AL com arrendamento tradicional.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  inLanguage: 'pt-PT',
  author: { '@type': 'Organization', name: 'CalculadoraAL', url: 'https://calculadoraal.pt/' },
};

export default function HomeSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
    </Helmet>
  );
}
