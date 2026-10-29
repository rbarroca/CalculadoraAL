// IVA no alojamento local (continente).
// Limiar: artigo 53.º do CIVA (DL n.º 35/2025). Taxa: verba 2.17 da Lista I do CIVA.
// As Regiões Autónomas têm taxas diferentes e não estão cobertas.
export const LIMIAR_IVA = 15000;
export const LIMIAR_IVA_IMEDIATO = LIMIAR_IVA * 1.25; // acima disto a saída da isenção é imediata
export const TAXA_IVA_ALOJAMENTO = 0.06;
export const TAXA_IVA_CUSTOS = 0.23; // taxa normal, aplicada aos custos (limpeza, manutenção, comissões)

export interface ResultadoIVA {
  receitaSemIVA: number;
  liquidado: number; // IVA incluído no preço cobrado aos hóspedes
  custosSemIVA: number;
  recuperavel: number; // IVA dos custos que o regime normal permite deduzir
  aEntregar: number; // liquidado menos recuperável (negativo = a recuperar)
  resultadoIsento: number; // receita menos custos, sem qualquer IVA recuperado
  resultadoNormal: number;
  diferenca: number; // a favor do regime normal quando positivo
}

// Assume que o preço cobrado ao hóspede já inclui o IVA de 6%, como nas plataformas
export function calcularIVA(receita: number, custos: number): ResultadoIVA {
  const receitaSemIVA = receita / (1 + TAXA_IVA_ALOJAMENTO);
  const custosSemIVA = custos / (1 + TAXA_IVA_CUSTOS);
  const liquidado = receita - receitaSemIVA;
  const recuperavel = custos - custosSemIVA;
  const resultadoIsento = receita - custos;
  const resultadoNormal = receitaSemIVA - custosSemIVA;
  return {
    receitaSemIVA,
    liquidado,
    custosSemIVA,
    recuperavel,
    aEntregar: liquidado - recuperavel,
    resultadoIsento,
    resultadoNormal,
    diferenca: resultadoNormal - resultadoIsento,
  };
}

// Custos (em percentagem da receita) a partir dos quais o regime normal deixa mais dinheiro
export function limiteCustosRegimeNormal(): number {
  return (1 - 1 / (1 + TAXA_IVA_ALOJAMENTO)) / (1 - 1 / (1 + TAXA_IVA_CUSTOS));
}
