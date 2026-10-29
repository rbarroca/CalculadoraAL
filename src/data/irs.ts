// Escalões IRS 2026, continente (rendimento coletável e taxa normal).
// Limites: OE2026 (Lei n.º 73-A/2025). Taxas: tabela reduzida do 1.º ao 6.º escalão
// aprovada em outubro de 2026 (Lei n.º 64-B/2026), com efeitos a 1 de janeiro.
export const ESCALOES_IRS = [
  { limite: 8342, taxa: 0.122 },
  { limite: 12587, taxa: 0.152 },
  { limite: 17838, taxa: 0.207 },
  { limite: 23089, taxa: 0.236 },
  { limite: 29397, taxa: 0.306 },
  { limite: 43090, taxa: 0.346 },
  { limite: 46566, taxa: 0.431 },
  { limite: 86634, taxa: 0.446 },
  { limite: Infinity, taxa: 0.48 },
];

// Imposto adicional que resulta de somar `acrescimo` a `base`, escalão a escalão
export function impostoMarginal(acrescimo: number, base: number): number {
  const total = base + acrescimo;
  let imposto = 0;
  let anterior = 0;
  for (const { limite, taxa } of ESCALOES_IRS) {
    const inicio = Math.max(anterior, base);
    const fim = Math.min(limite, total);
    if (fim > inicio) imposto += (fim - inicio) * taxa;
    anterior = limite;
    if (total <= limite) break;
  }
  return imposto;
}
