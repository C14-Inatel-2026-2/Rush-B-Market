# Uso de IA — Gabriel Pivoto

**Ferramenta:** OpenAI Codex (modelo GPT-6), usado para entender o projeto, implementar alterações no frontend, revisar testes e preparar documentação. As alterações foram feitas a partir das tarefas definidas para o projeto e revisadas antes de abrir os PRs.

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

## Documentação para executar o frontend com a API (PR #83)

- **Pedi:** atualizar o README do frontend para explicar como iniciar o banco e a API, e documentar a variável `API_URL`.
- **Resultado:** seção “Rodando com o backend” no `Frontend/README.md`, com passos para iniciar PostgreSQL, API Spring Boot e frontend, além dos endereços padrão para execução com Docker e diretamente na máquina.
- **Prompt (resumido):** “README do frontend: subir a API, com os passos do banco e da API e a variável API_URL.”
- **Validação:** revisão do diff e `git diff --check`; por ser uma alteração documental, não foram executados testes automatizados.
- **PR:** [#83 — documentação para executar com o backend](https://github.com/C14-Inatel-2026-2/Rush-B-Market/pull/83), aberto.

## Exemplos de prompts

- “Cobrir o caso normal, a lista vazia e a API fora do ar nas páginas de skin e players, com as funções de API mockadas.”
- “Ao digitar na busca, filtrar pelo nome sem diferenciar maiúsculas de minúsculas; combinar a busca com a categoria e impedir que Enter recarregue a página.”
- “Explicar como subir o banco e a API para o frontend funcionar, incluindo a variável `API_URL`.”

## Forma de trabalho

- Usei o Codex para discutir a abordagem, implementar as alterações e revisar o diff e os resultados dos testes.
- Trabalhei em branches próprias e Pull Requests para `homolog`; os PRs #80 e #81 foram mesclados após a resolução e revisão.
- O Codex também ajudou a explicar o fluxo de execução com Docker e o fluxo de branches e PRs para que eu pudesse acompanhar e revisar o trabalho.
