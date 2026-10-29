# calculadoraal.pt

React + Vite + Netlify, SSG.

## Regra do push

Nunca fazer `git push` sem antes:

1. Mostrar ao Rui a lista de ficheiros alterados (`git status` / `git diff --stat`).
2. Esperar a confirmação explícita dele no chat.

Commits locais são permitidos. O push só acontece depois da confirmação, e a confirmação vale só para esse push.

## Registo SEO e conteúdo

Antes de mexer em títulos, descrições, tabelas fiscais ou conteúdo que o Google indexa, ler `docs/seo/`:
- `CHANGELOG.md`: o que mudou, quando e porquê, com a linha de base do Search Console.
- `DECISIONS.md`: decisões e o raciocínio por trás delas.
- `OPEN-FLAGS.md`: o que está por confirmar e quando rever.

Atualizar estes ficheiros no fim de cada alteração relevante, como último passo do trabalho.
