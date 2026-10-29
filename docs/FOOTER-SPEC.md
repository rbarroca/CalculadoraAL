# Footer partilhado do portefólio de Alojamento Local

Objetivo: o mesmo layout e a mesma UI em todos os sites do setor (Calculadora AL, Tudo sobre Alojamento Local, Find a Manager AL e os próximos). Muda só o conteúdo.

Implementação de referência: `src/components/Footer.tsx` (calculadoraal.pt). O conteúdo está em constantes no topo do ficheiro (`MARCA`, `COLUNAS`).

## Estrutura fixa (não muda entre sites)
1. Fundo claro (`gray-50`), linha superior (`gray-200`), largura máxima 7xl, padding `pt-14 pb-8`.
2. Grelha de 3 colunas a partir de `md` (empilha no telemóvel), com `gap-10`:
   - **Coluna 1, marca:** ícone num quadrado arredondado com o gradiente do site, nome (negrito), domínio por baixo, descrição de 1 a 2 linhas.
   - **Coluna 2, ligações do site:** título em maiúsculas pequenas (`text-xs`, negrito, `tracking-wider`) e lista de ligações (`text-sm`, cinzento, laranja ou cor do site ao passar o rato), `space-y-3`.
   - **Coluna 3, ligações do ecossistema e legais:** mesmo formato.
3. Linha divisória e, por baixo, centrado: direitos de autor com o domínio ("© ANO Nome. Todos os direitos reservados. | dominio") e, quando for preciso, o aviso legal em `text-xs`.

## O que muda por site (só conteúdo)
| | Calculadora AL | Tudo sobre AL | Find a Manager AL |
|---|---|---|---|
| Coluna 2 | Ferramentas (5) | Guias populares | Regiões |
| Coluna 3 | Links úteis (Guia, Find a Manager, cookies) | Links úteis (Calculadora, Find a Manager, Política de Privacidade) | Recursos (Blog, Calculadora, Guia) |
| Aviso legal | Sim (simulações fiscais) | Conforme o site | Conforme o site |

## Regras
- Cada site liga aos outros dois do ecossistema na coluna 3, para o visitante os descobrir em qualquer página.
- Contraste mínimo 4,5:1 (texto cinzento mais claro que `gray-600` sobre `gray-50` não passa).
- Quando o site tiver política de privacidade, entra na coluna 3 ao lado de "Preferências de cookies".
- Cores de destaque e tipo de letra seguem o design system do site. O layout, o espaçamento e a hierarquia não.
- Os screenshots de referência são o footer do Tudo sobre AL (marca com ícone azul) e o do Find a Manager AL (texto "findamanageral"). As diferenças de estilo vêm da marca, não do layout.

## Para levar para outro site
Copiar `Footer.tsx`, trocar `MARCA` e `COLUNAS`, e a lista de ferramentas se existir. Se o site não usar React, replicar o HTML e as classes de Tailwind acima.
