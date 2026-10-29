// IMT 2026. Fonte: Ofício-Circulado n.º 40129/2026 (AT), tabelas práticas em vigor
// desde 1 de janeiro de 2026, após as alterações do OE2026 (Lei n.º 73-A/2025).
// Fórmula de cada escalão: IMT = valor x taxa - parcela a abater.

export type Regiao = 'continente' | 'ilhas';
export type TipoImovel = 'hpp' | 'secundaria' | 'urbano_outros' | 'rustico';

export interface Escalao {
  ate: number;
  taxa: number;
  abater: number;
}

export interface Tabela {
  id: string;
  nome: string;
  escaloes: Escalao[];
}

const UNICAS_CONTINENTE: Escalao[] = [
  { ate: 1150853, taxa: 0.06, abater: 0 },
  { ate: Infinity, taxa: 0.075, abater: 0 },
];

const UNICAS_ILHAS: Escalao[] = [
  { ate: 1438566, taxa: 0.06, abater: 0 },
  { ate: Infinity, taxa: 0.075, abater: 0 },
];

export const TABELAS: Record<string, Tabela> = {
  I: {
    id: 'I',
    nome: 'Continente, habitação própria e permanente',
    escaloes: [
      { ate: 106346, taxa: 0, abater: 0 },
      { ate: 145470, taxa: 0.02, abater: 2126.92 },
      { ate: 198347, taxa: 0.05, abater: 6491.02 },
      { ate: 330539, taxa: 0.07, abater: 10457.96 },
      { ate: 660982, taxa: 0.08, abater: 13763.35 },
      ...UNICAS_CONTINENTE,
    ],
  },
  II: {
    id: 'II',
    nome: 'Continente, habitação própria e permanente, jovens até 35 anos',
    escaloes: [
      { ate: 330539, taxa: 0, abater: 0 },
      { ate: 660982, taxa: 0.08, abater: 26443.12 },
      ...UNICAS_CONTINENTE,
    ],
  },
  III: {
    id: 'III',
    nome: 'Continente, habitação (secundária, arrendamento ou AL)',
    escaloes: [
      { ate: 106346, taxa: 0.01, abater: 0 },
      { ate: 145470, taxa: 0.02, abater: 1063.46 },
      { ate: 198347, taxa: 0.05, abater: 5427.56 },
      { ate: 330539, taxa: 0.07, abater: 9394.5 },
      { ate: 633931, taxa: 0.08, abater: 12699.89 },
      ...UNICAS_CONTINENTE,
    ],
  },
  IV: {
    id: 'IV',
    nome: 'Açores e Madeira, habitação própria e permanente',
    escaloes: [
      { ate: 132933, taxa: 0, abater: 0 },
      { ate: 181838, taxa: 0.02, abater: 2658.66 },
      { ate: 247934, taxa: 0.05, abater: 8113.8 },
      { ate: 413174, taxa: 0.07, abater: 13072.48 },
      { ate: 826228, taxa: 0.08, abater: 17204.22 },
      ...UNICAS_ILHAS,
    ],
  },
  V: {
    id: 'V',
    nome: 'Açores e Madeira, habitação própria e permanente, jovens até 35 anos',
    escaloes: [
      { ate: 413174, taxa: 0, abater: 0 },
      { ate: 826228, taxa: 0.08, abater: 33053.92 },
      ...UNICAS_ILHAS,
    ],
  },
  VI: {
    id: 'VI',
    nome: 'Açores e Madeira, habitação (secundária, arrendamento ou AL)',
    escaloes: [
      { ate: 132933, taxa: 0.01, abater: 0 },
      { ate: 181838, taxa: 0.02, abater: 1329.33 },
      { ate: 247934, taxa: 0.05, abater: 6784.47 },
      { ate: 413174, taxa: 0.07, abater: 11743.15 },
      { ate: 792414, taxa: 0.08, abater: 15874.89 },
      ...UNICAS_ILHAS,
    ],
  },
};

export const TAXA_RUSTICO = 0.05;
export const TAXA_URBANO_OUTROS = 0.065;
export const TAXA_NAO_RESIDENTE = 0.075; // DL n.º 97/2026, aquisições de habitação desde 25 de maio de 2026
export const TAXA_SELO = 0.008; // Imposto do Selo, verba 1.1 da TGIS

// IMT Jovem: até `isento` não há IMT nem Imposto do Selo; até `fim` o Selo incide só sobre o excedente
const JOVEM: Record<Regiao, { isento: number; fim: number }> = {
  continente: { isento: 330539, fim: 660982 },
  ilhas: { isento: 413174, fim: 826228 },
};

export interface EntradaIMT {
  preco: number;
  vpt: number; // valor patrimonial tributário; 0 se não indicado
  regiao: Regiao;
  tipo: TipoImovel;
  jovem: boolean;
  naoResidente: boolean;
}

export interface ResultadoIMT {
  base: number;
  imt: number;
  selo: number;
  total: number;
  custoTotal: number;
  taxaEfetiva: number;
  tabela: Tabela | null;
  descricao: string;
  escalaoIndex: number; // índice do escalão aplicado na tabela, -1 se não houver tabela
  seloIsento: boolean;
  baseSelo: number; // valor sobre o qual incide o Imposto do Selo
}

export function calcularIMT(e: EntradaIMT): ResultadoIMT {
  const base = Math.max(e.preco, e.vpt);
  const habitacao = e.tipo === 'hpp' || e.tipo === 'secundaria';

  let imt = 0;
  let tabela: Tabela | null = null;
  let descricao = '';
  let escalaoIndex = -1;

  if (habitacao && e.naoResidente) {
    imt = base * TAXA_NAO_RESIDENTE;
    descricao = 'Taxa fixa de 7,5% para compradores não residentes fiscais (sem escalões nem isenções)';
  } else if (habitacao) {
    const jovem = e.tipo === 'hpp' && e.jovem;
    const id =
      e.regiao === 'continente'
        ? jovem ? 'II' : e.tipo === 'hpp' ? 'I' : 'III'
        : jovem ? 'V' : e.tipo === 'hpp' ? 'IV' : 'VI';
    tabela = TABELAS[id];
    escalaoIndex = tabela.escaloes.findIndex(x => base <= x.ate);
    const { taxa, abater } = tabela.escaloes[escalaoIndex];
    imt = Math.max(0, base * taxa - abater);
    descricao = `Tabela ${tabela.id}: ${tabela.nome}`;
  } else if (e.tipo === 'rustico') {
    imt = base * TAXA_RUSTICO;
    descricao = 'Prédios rústicos: taxa de 5%';
  } else {
    imt = base * TAXA_URBANO_OUTROS;
    descricao = 'Prédios urbanos não habitacionais e outras aquisições onerosas: taxa de 6,5%';
  }

  // Imposto do Selo: no IMT Jovem fica isento até ao limite e incide só sobre o excedente até ao fim do benefício
  let baseSelo = base;
  if (e.tipo === 'hpp' && e.jovem && !e.naoResidente) {
    const { isento, fim } = JOVEM[e.regiao];
    if (base <= fim) baseSelo = Math.max(0, base - isento);
  }
  const seloIsento = baseSelo === 0;
  const selo = baseSelo * TAXA_SELO;

  const total = imt + selo;
  return {
    base,
    imt,
    selo,
    total,
    custoTotal: e.preco + total,
    taxaEfetiva: e.preco > 0 ? total / e.preco : 0,
    tabela,
    descricao,
    escalaoIndex,
    seloIsento,
    baseSelo,
  };
}
