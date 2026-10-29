# Decisões

Cada entrada tem o raciocínio, não só o resultado, para não voltarmos a discutir o mesmo.

## 2026-10-29

**Mostrar só o englobamento nas mais-valias, sem comparar com 28%.**
Escolhido porque a taxa autónoma de 28% foi revogada para imóveis em 2023. Comparar duas opções, uma das quais já
não existe, levava o utilizador a esperar uma poupança que não existe.

**Manter a tabela de IRS reduzida (1.º ao 6.º escalão) com uma nota no site.**
A Lei n.º 64-B/2026 só autoriza o Governo a baixar as taxas, e não encontrámos o diploma que as concretiza. Mantida
porque a lei foi aprovada com efeitos a 1 de janeiro de 2026 e o IRS de 2026 declara-se em 2027. A diferença é de 0,3 a 0,5
pontos nas taxas. Se o diploma sair com valores diferentes, mudam-se 6 números em `src/data/irs.ts`.

**Remover a CEAL em vez de a mostrar a zero.**
Está revogada. Uma FAQ ("A CEAL ainda existe?") ficou para responder a quem ainda a procura.

**Benchmarks de ocupação passam a "estimativas orientativas".**
Não há fonte oficial por região para o AL (o INE não cobre AL com menos de 10 camas). Preferimos dizer isso a
apresentar os valores como estatística.

**Banner de cookies já, página de privacidade depois.**
O consentimento corrige a exposição mais grave (Analytics a carregar sem autorização). A política precisa do nome e do
contacto do responsável, que não temos. O banner não tem ligação para a política até ela existir.

**Manter o FAQPage em schema.**
Segundo as skills, os rich results de FAQ deixaram de aparecer em maio de 2026, mas o markup continua válido e
corresponde ao conteúdo visível. Custo zero, sem remoção.

**Pacote de skills instalado só neste projeto, fora do git.**
É um teste. Se os resultados forem bons, decide-se instalar para todos os projetos.

**IVA: modelo para o continente, com o preço ao hóspede já a incluir IVA.**
IVA do alojamento a 6% (verba 2.17 da Lista I) só no continente: as fontes divergem nas Regiões Autónomas (4% e 5%).
Assume-se que o preço cobrado ao hóspede já inclui IVA, que é o normal nas plataformas.
