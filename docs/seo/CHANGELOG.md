# Registo de alterações SEO e conteúdo

Uma entrada por alteração relevante: o que mudou, quando e porquê. Entradas mais recentes no topo.
Atualizar no fim de cada trabalho, não depois. Decisões com raciocínio ficam em `DECISIONS.md`;
o que está por confirmar fica em `OPEN-FLAGS.md`.

## Linha de base antes das alterações de 2026-10-29

Fonte: export do Search Console de 2026-10-29 (período 2026-04-28 a 2026-10-29, só Web).

| Período de 28 dias | Cliques | Impressões |
|---|---|---|
| 2026-10-02 a 2026-10-29 | 37 | 1.341 |
| 2026-09-04 a 2026-10-01 | 59 | 1.607 |
| 2026-08-07 a 2026-09-03 | 62 | 1.088 |
| 2026-07-10 a 2026-08-06 | 65 | 1.308 |
| 2026-06-12 a 2026-07-09 | 77 | 863 |

- O último dia do export (2026-10-29) vem com 0 impressões: dados incompletos.
- Volume de 1 a 2 cliques por dia: demasiado baixo para medir o efeito de um ajuste de título.
  Esperar pelo menos 4 semanas completas e comparar em intervalo, não em valor único.
- Páginas com cliques (6 meses): `/` 247, `/mais-valias/` 54, `/impostos/` 33, `/impostos` (sem barra) 24, `/taxa-ocupacao/` 6.
- Consultas relevantes sem cliques: "simulador de iva" e variantes (~120 impressões, posição ~8), consultas de IMT
  (~80 impressões, antes de a página existir), "simulador venda imovel" (83, posição ~31).

## 2026-10-29

Todas as alterações abaixo foram feitas no mesmo dia, por isso não se conseguem separar umas das outras
nos números do Search Console. Tratar como uma única janela de mudança.

### Fiscalidade (factos corrigidos)
- **Mais-valias:** removida a opção "taxa liberatória de 28%". Desde 2023 os 50% da mais-valia são sempre
  englobados no IRS (residentes e não residentes). Exemplo prático, FAQ e JSON-LD refeitos.
- **Coeficientes de desvalorização:** passam a ser os da Portaria n.º 457/2026/1, de 15 de outubro (vendas em 2026).
  Os valores anteriores estavam todos errados.
- **Escalões de IRS 2026:** novo `src/data/irs.ts`, partilhado por Impostos e Mais-Valias.
- **Impostos:** removida a CEAL (revogada pelo DL n.º 57/2024). Limiar de IVA de 14.500 para 15.000 (art. 53.º CIVA,
  DL n.º 35/2025). Coeficiente 0,50 para AL em área de contenção e 0,15 para quartos (art. 31.º CIRS).
- **IMT:** nova página `/imt/` com as tabelas I a VI do Ofício-Circulado n.º 40129/2026, não residentes (7,5%) e IMT Jovem.
- **Home:** removida a menção à "contribuição extraordinária sobre o património" (CEAL).
- **Rendas:** texto "IRS 28% sobre rendas" passou a "taxa autónoma de 25%, com taxas reduzidas em renda moderada".

### Técnico
- Redirect `/impostos` para `/impostos/`: já existia em produção (Netlify), sem alteração.
- Favicon, `favicon.ico` e og:image reais (os anteriores eram ficheiros de texto).
- Página `404.html` real e remoção da regra `/* -> /index.html 200` (URLs inexistentes devolviam 200).
- Sitemap: `lastmod` de todas as páginas para 2026-10-29; `/imt/` incluída.
- H1 das 4 páginas de simuladores com espaço entre as duas linhas.
- Erros do `tsc` resolvidos (imports não usados, tipo do contexto do helmet).

### Títulos e descrições alterados (afetam a leitura dos dados do Search Console)
- Home: título sem travessão; descrição em tom formal e com IMT.
- `/mais-valias/`: título sem travessão e descrição sem "taxa liberatória".
- `/impostos/`: título passou a "Simulador de Impostos Alojamento Local: IRS e IVA em Portugal 2026" (antes tinha "Simulador IVA" à frente).
- `/taxa-ocupacao/`: título sem "2025" e sem travessão; benchmarks apresentados como estimativas orientativas.

### Legal e privacidade
- Google Analytics só carrega depois de aceitação (novo banner de cookies com Aceitar e Recusar).
- Aviso no rodapé de que as simulações não são aconselhamento fiscal, jurídico ou financeiro.
- Página de política de privacidade: **não feita** (falta o nome e o contacto do responsável). Ver `OPEN-FLAGS.md`.

### IVA na página de Impostos (mesmo dia, depois das alterações acima)
- Novo cálculo de IVA em `src/data/iva.ts` e na página `/impostos/`: IVA liquidado a 6% (continente), IVA recuperável nos custos a 23%,
  comparação lado a lado entre isenção e regime normal, e regra prática (~30% de custos). Porquê: a página prometia "Simulador de IVA"
  mas só avisava quando se passava o limiar; as consultas "simulador de iva" (~120 impressões, posição ~8) tinham zero cliques.
- Se o utilizador já estiver no regime normal (ou ultrapassar €18.750), o IRS passa a usar a receita sem IVA.
- Nova FAQ "Compensa estar no regime normal de IVA no alojamento local?"; descrição da página alterada para mencionar IVA liquidado e recuperável.
- Linha de base para estas consultas: ver a tabela do topo (28 dias até 2026-10-29).

### Ferramentas
- Pacote Bevizio SEO skills v1.3.0 instalado em `.claude/skills/` (só este projeto, fora do git via `.git/info/exclude`).

### Search Console (2026-10-29, depois do deploy)
- Pedida a indexação de `/imt/` (Inspeção de URL).
- Sitemap `sitemap.xml` reconhecido com 5 páginas. Não é preciso submeter outro.

### Ligações internas no corpo do texto (2026-10-29)
- `/imt/`, `/mais-valias/` e `/impostos/` passam a ligar entre si dentro do texto (antes só havia o bloco "Explore as outras ferramentas"):
  IMT -> calculadora de rentabilidade, mais-valias e impostos; mais-valias -> IMT (duas vezes) e impostos; impostos -> IMT e mais-valias.
- Porquê: ligações contextuais com texto âncora descritivo ajudam o Google a perceber a relação entre páginas e a descobrir `/imt/`, que é nova.
- Ainda por fazer: alargar `/mais-valias/` para "venda de casa", página de rendas, e rever o guia do tudosobrealojamentolocal.pt.

### Navegação e descoberta das ferramentas (2026-10-29)
- Header: logótipo e nome passam a ligar à home; menu "Ferramentas" com as 5 ferramentas e uma pergunta por ferramenta (as ligações estão sempre no HTML, o menu fecha com Escape ou clique fora); header mais baixo (69 px no telemóvel, antes 127 px).
- Hero: botões "Calcular agora" e "Ver todas as ferramentas" e 4 cartões das ferramentas logo abaixo do Hero (antes só a 66% da página). Título do Hero mais pequeno no telemóvel.
- Salto de teclado corrigido (aponta para `#calculator` na home e `#calculadora` nas outras páginas).
- Dados partilhados em `src/data/ferramentas.ts`. Ver `AUDITORIA-UX-2026-10-29.md`.
- Por medir depois: páginas por sessão e cliques no menu (sem dados ainda, o GA só mede quem aceita cookies). Ligações em todas as páginas ajudam também a `/imt/`.
- Ainda por fazer da auditoria: migalhas de pão e "próxima ferramenta" depois do resultado.
