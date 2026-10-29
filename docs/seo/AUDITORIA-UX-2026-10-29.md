# Auditoria de UX e navegação (2026-10-29)

Âmbito: estrutura, navegação e descoberta das ferramentas. Medido no preview local (desktop 1440x900 e telemóvel 375x812) e no código.
Skills usadas à mão: `internal-linking-audit` (Bevizio) e critérios de `design:design-critique` e `design:accessibility-review`.
Não é uma auditoria de acessibilidade completa (contraste e leitor de ecrã por testar).

## Números medidos
| | Desktop | Telemóvel |
|---|---|---|
| Altura do header | 95 px | 127 px (16% do ecrã) |
| Altura total da home | 6.243 px | 11.251 px (cerca de 14 ecrãs) |
| Onde começa "Mais Ferramentas de AL" | 4.149 px (66% da página) | 7.608 px (68%) |
| Onde começa a calculadora | 695 px (abaixo do Hero de 600 px) | 851 px (abaixo da dobra de 812 px) |
| Ligações dentro do header | 0 | 0 |

## Problemas, por impacto
1. **Descoberta das ferramentas (alto).** As 4 ferramentas só aparecem a 66% da home. Quem chega por "simulador de IMT" ou "mais-valias" nunca sabe que existem as outras.
2. **Header sem navegação (alto).** O logótipo e o nome não são ligação. Nas páginas interiores o único caminho é "Voltar à Calculadora de Rentabilidade" (pequeno, cinzento, por cima do título).
3. **Hero sem ação (alto).** Ocupa 600 px (desktop) e o ecrã inteiro no telemóvel, só com texto e 3 selos. Não tem botão nem pista de que há mais ferramentas.
4. **Telemóvel (médio).** Header de 127 px, título do Hero em 4 linhas, calculadora fora do primeiro ecrã.
5. **Salto de teclado quebrado (médio, acessibilidade).** O link "Saltar para o calculador" aponta para `#calculator`, que só existe na home. Nas outras 4 páginas o id é `#calculadora`, por isso o link não faz nada.
6. **Sem migalhas de pão (baixo).** Ajudariam o Google e quem navega.
7. **Fim de resultado sem próximo passo (baixo).** Depois do resultado não se propõe a ferramenta seguinte (IMT -> Impostos -> Mais-valias).

## Estado das ligações internas
- Corrigido hoje (commit local `e0b343c`, ainda sem push): ligações contextuais no corpo entre `/imt/`, `/mais-valias/` e `/impostos/`.
- Antes disso, a única ligação entre ferramentas era o bloco "Explore as outras ferramentas" no fundo de cada página.
- `/taxa-ocupacao/` ainda não tem ligações contextuais para as outras.

## Soluções propostas
- **A. Logótipo e nome a ligar à home** (poucas linhas).
- **B. Menu "Ferramentas" no header**, com as 5 ferramentas e uma descrição de uma linha; hambúrguer no telemóvel; ferramenta atual realçada.
- **C. Cartões das ferramentas logo a seguir ao Hero**, com perguntas ("Quanto pago de IMT?").
- **D. Segundo botão no Hero** ("Ver todas as ferramentas") e botão para a calculadora.
- **E. Header mais baixo**, sobretudo no telemóvel (uma linha).
- **F. Corrigir o salto de teclado** (usar o mesmo id em todas as páginas ou um alvo por página).
- **G. Próxima ferramenta depois do resultado** e migalhas de pão.

Ordem sugerida: A, B, C, D, F juntos; depois E e G.

## O que medir depois
Cliques no menu e nos cartões (evento GA4, só com consentimento), páginas por sessão e taxa de saída da home. Linha de base: não existe ainda, e só há dados com consentimento de cookies.
