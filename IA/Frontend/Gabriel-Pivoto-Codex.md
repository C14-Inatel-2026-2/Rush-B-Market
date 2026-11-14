# Uso de IA — Gabriel Pivoto

**Ferramenta:** OpenAI Codex (modelo GPT-6), usado para entender o projeto, implementar alterações no frontend, revisar testes e preparar documentação. As alterações foram feitas a partir das tarefas definidas para o projeto e revisadas antes de abrir os PRs.

## Componente de card de item (Issue #9, PR #13)

- **Pedi:** ajuda para criar e estilizar um card reutilizável para a loja, seguindo o design do Figma.
- **Resultado:** `ItemCard` reutilizável, dados mockados para a vitrine, renderização dos cards na página inicial em um grid responsivo e imagens de exemplo das skins.
- **Arquivos principais:** `Frontend/app/_components/ItemCard.tsx`, `Frontend/data/mockItems.ts` e `Frontend/app/page.tsx`.
- **Prompt:** “Como posso criar o componente de card de item para a loja/menu seguindo as especificações de design do Figma?”
- **PR:** [#13 — componente de card de item e mock da loja](https://github.com/C14-Inatel-2026-2/Rush-B-Market/pull/13), mesclado.

## Testes do layout raiz e da página inicial (Issue #23, PR #36)

- **Pedi:** testes unitários para `app/layout.tsx` e `app/page.tsx`, incluindo mocks para verificar a renderização de `children` e dos cards.
- **Resultado:** testes para o layout raiz e a vitrine com dados disponíveis ou lista vazia, além da configuração do Jest, setup do Testing Library e script `npm test`.
- **Arquivos principais:** `Frontend/__tests__/layout.test.tsx`, `Frontend/__tests__/page.test.tsx`, `Frontend/jest.config.mjs` e `Frontend/jest.setup.js`.
- **Prompt:** “Preciso criar testes unitários para o `layout.tsx` e `page.tsx` no Next.js garantindo a renderização correta das rotas e filhos. Como fazer a estrutura com mock?”
- **PR:** [#36 — testes unitários de layout e home](https://github.com/C14-Inatel-2026-2/Rush-B-Market/pull/36), mesclado.

## Build do backend no Jenkins (Issue #50, PR #55)

- **Pedi:** ajuda para configurar o job do Jenkins que compila o backend Spring Boot com JDK 21 e Maven 3, usando um PAT do GitHub armazenado como credencial do Jenkins.
- **Resultado:** atualização do `Jenkinsfile` com as ferramentas JDK/Maven, checkout autenticado por `credentialsId: 'github-pat-token'` e etapa de build Maven do backend. O PR registra evidência de execução com `BUILD SUCCESS`.
- **Prompt:** “Preciso configurar o job de build do backend no Jenkins de forma segura e profissional sem deixar o repositório público. Como fazer a integração com PAT do GitHub e o Jenkinsfile?”
- **PR:** [#55 — configuração do build do backend](https://github.com/C14-Inatel-2026-2/Rush-B-Market/pull/55), mesclado.

## Busca e filtros de skins (US-05, PR #80)

- **Pedi:** implementar no frontend os filtros por categoria e a busca de skins descritos na US-05.
- **Resultado:** filtros por categoria e por nome conectados à vitrine, com busca sem diferenciar maiúsculas de minúsculas, combinação entre categoria e busca, estado ativo da categoria e mensagem para resultado vazio. O Enter na busca não recarrega a página.
- **Arquivos principais:** `Frontend/app/_components/MarketFiltersContext.tsx`, `Frontend/app/_components/Header.tsx` e `Frontend/app/_components/SkinGrid.tsx`.
- **Prompt (resumido):** “Filtros e busca em GET /skins: fazer os filtros de busca de skin no front-end.” Depois, forneci os critérios de aceite da US-05 e pedi para verificar se todos estavam cobertos.
- **Testes:** foram adicionados e ajustados testes dos critérios de busca e filtro. A suíte completa passou com 12 suítes e 59 testes após a resolução dos conflitos com `homolog`.
- **PR:** [#80 — busca e filtros da vitrine](https://github.com/C14-Inatel-2026-2/Rush-B-Market/pull/80), mesclado.

## Testes das páginas de skins e players (PR #81)

- **Pedi:** criar testes de renderização para `/skin/[id]`, `/players` e `/players/[id]`, mockando `getSkin`, `getPlayers` e `getPlayer`.
- **Resultado:** testes para carregamento normal, listas ou inventários vazios, API indisponível e respostas 404 nas páginas de detalhe. As páginas de detalhe também passaram a exibir mensagens claras quando a API falha.
- **Arquivos principais:** `Frontend/__tests__/skinPage.test.tsx`, `Frontend/__tests__/playersPage.test.tsx`, `Frontend/__tests__/playerPage.test.tsx` e as duas páginas de detalhe em `Frontend/app/`.
- **Prompt (resumido):** pedi para cobrir o caso normal, a lista vazia e a API fora do ar, seguindo o estilo de `page.test.tsx`.
- **Validação registrada no PR:** `npm test -- --runInBand` — 14 suítes e 63 testes passaram.
- **PR:** [#81 — testes das páginas de skins e players](https://github.com/C14-Inatel-2026-2/Rush-B-Market/pull/81), mesclado.

## Correção do teste de detalhe do player (PR #85)

- **Pedi:** investigar por que `playerPage.test.tsx` falhava após a integração dos filtros e corrigir com o menor impacto possível.
- **Resultado:** o teste de renderização passou a envolver a página com `MarketFiltersProvider`, como acontece no layout real. A alteração ficou restrita ao teste; nenhum componente de produção foi modificado.
- **Prompt (resumido):** “O teste `playerPage.test` quebrou; confira a falha e cuidado para não mexer muito no PR.”
- **Validação local:** o teste direcionado passou (4 testes) e a suíte completa passou (15 suítes e 69 testes).
- **PR:** [#85 — corrigir provider no teste da página do player](https://github.com/C14-Inatel-2026-2/Rush-B-Market/pull/85), aberto contra `main`.

## Documentação para executar o frontend com a API (PR #83)

- **Pedi:** atualizar o README do frontend para explicar como iniciar o banco e a API, e documentar a variável `API_URL`.
- **Resultado:** seção “Rodando com o backend” no `Frontend/README.md`, com passos para iniciar PostgreSQL, API Spring Boot e frontend, além dos endereços padrão para execução com Docker e diretamente na máquina.
- **Prompt (resumido):** “README do frontend: subir a API, com os passos do banco e da API e a variável API_URL.”
- **Validação:** revisão do diff e `git diff --check`; por ser uma alteração documental, não foram executados testes automatizados.
- **PR:** [#83 — documentação para executar com o backend](https://github.com/C14-Inatel-2026-2/Rush-B-Market/pull/83), aberto.

## Exemplos de prompts

- “Cobrir o caso normal, a lista vazia e a API fora do ar nas páginas de skin e players, com as funções de API mockadas.”
- “Ao digitar na busca, filtrar pelo nome sem diferenciar maiúsculas de minúsculas; combinar a busca com a categoria e impedir que Enter recarregue a página.”
- “O teste `playerPage.test` quebrou; confira a falha e cuidado para não mexer muito no PR.”
- “Explicar como subir o banco e a API para o frontend funcionar, incluindo a variável `API_URL`.”

## Forma de trabalho

- Usei o Codex para discutir a abordagem, implementar as alterações e revisar o diff e os resultados dos testes.
- Trabalhei em branches próprias e Pull Requests; os PRs #80 e #81 foram mesclados em `homolog`, e o PR #85 foi aberto para `main` conforme o fluxo definido para a fase final.
- O Codex também ajudou a explicar o fluxo de execução com Docker e o fluxo de branches e PRs para que eu pudesse acompanhar e revisar o trabalho.
