# Uso de IA — André Araújo

**Ferramenta:** Claude Code (Claude Opus; o Header foi feito com o Claude Sonnet)

## Header (PR #10)

- **Pedi:** implementar o header a partir do layout gerado por IA no Figma, depois ajustado em algumas rodadas até ficar igual ao mock (logo `AX` dourado, borda em cada filtro, filtro ativo em azul).
- **Resultado:** `app/_components/Header.tsx`, com o `<Header />` adicionado em `app/layout.tsx` e o boilerplate de `app/page.tsx` trocado por um placeholder.
- **Prompt:** gerar o header com base na imagem do Figma em anexo e, nos prompts seguintes, ajustar o logo, as bordas dos filtros e o estado selecionado.

## Testes do Header (PR #39)

- **Pedi:** testes unitários e com mock para o componente Header.
- **Resultado:** `header.test.tsx` e `header.mock.test.tsx`.
- **Prompt:** "Preciso fazer os testes do header, o teste mock e o teste unitário."

## Testes do ItemCard e do Grid (PR #40)

- **Pedi:** testes unitários e com mock para o ItemCard e o Grid da página principal.
- **Resultado:** `itemCard.test.tsx`, `itemCard.mock.test.tsx`, `grid.test.tsx` e `grid.mock.test.tsx`.
- **Prompt:** "Testar os componentes base de UI e o Grid da página principal (unit). Tem como fazer mock também?"

## Deploy do Frontend (PR #57)

- **Pedi:** o deploy do frontend como job no Jenkins.
- **Resultado:** `Frontend/Dockerfile` de produção e `CI-CD/J5-Deploy-Frontend.Jenkinsfile`.
- **Prompt:** "Preciso fazer o deploy do front-end no Jenkins."

## Documentação e user story (PR #64)

- **Pedi:** requisitos funcionais e não funcionais para o README e uma user story com critérios de aceite.
- **Resultado:** README da raiz e a história US-05 — Pesquisar e filtrar skins (KAN-6).
- **Prompt:** "Me ajuda a documentar o projeto no README e a criar a minha user story no Jira."

## Refactoring do Header (PR #78)

- **Pedi:** um plano de refactoring do Header, passo a passo e didático, sem mudar o comportamento, para eu mesmo executar.
- **Resultado:** `Header.tsx` dividido em `Logo`, `SectionNav`, `MarketStats`, `CategoryFilters` e `SearchBox`. O estado continua no `Header` e vai para os filhos por props, e as classes Tailwind passam a ter nome no objeto `STYLES`.
- **Prompt:** "Vamos fazer o refactoring. Quero deixar da forma mais didática possível: me passa o planejamento, passo a passo, do refactoring das coisas que eu fiz."

## Refactoring dos testes do Header e do Grid (PR #79)

- **Pedi:** ajustes nos testes que eu tinha feito e, depois da revisão do Luís, juntar as verificações do teste 1 do `grid.mock.test.tsx` em um único assert.
- **Resultado:** em `header.mock.test.tsx`, o mock do `useState` só substitui os dois estados do Header, e o resto usa o React de verdade. Em `grid.test.tsx`, o teste de ids repetidos passa a verificar os links renderizados na tela. Em `grid.mock.test.tsx`, os imports foram organizados, a variável sem uso saiu e o teste 1 virou um único `toEqual`.
- **Prompt:** "O Luís revisou o PR e pediu duas coisas: melhorar a mensagem de falha e trocar o `toHaveLength` e o loop por um único assert."

## Restauração dos testes do Header e do Grid (PR #84)

- **Pedi:** uma análise do PR #80 (busca e filtros), para ver se ele tinha desfeito algo do que eu fiz, e depois um ajuste só no que se perdeu na resolução de conflito, sem refazer o resto.
- **Resultado:** em `grid.mock.test.tsx`, o teste 1 volta a comparar as props de todos os cards com um único `toEqual`. Em `header.mock.test.tsx`, voltam os 2 testes negativos, agora usando o mock do `useMarketFilters`. Os comentários de positivo/negativo voltam nos dois arquivos.
- **Prompt:** "O PR do Gabriel mexeu no meu Header e nos meus testes. Vê se ele desfez alguma coisa e me ajuda a arrumar só o que se perdeu, sem refazer tudo."