# Uso de IA — Luis Teles

**Ferramenta:** Claude Code (CLI e extensão do VS Code), da Anthropic
**Modelos:** Claude Opus 5 no início do projeto; Claude Opus 5.5 a partir de novembro

O registro detalhado da primeira sessão (setup do frontend) está em
[Claude-session(chore/setup-frontend-nextjs).md](<Claude-session(chore/setup-frontend-nextjs).md>).

---

## Ferramentas e extensões

O Claude Code funciona como um **agente**: além de sugerir código, ele roda comandos
no terminal (git, npm, docker, jest), lê os resultados e decide o próximo passo a partir deles.
Uso o Claude Code com as extensões abaixo:

| Extensão | Tipo | Para que uso |
| --- | --- | --- |
| **superpowers** | plugin | Skills de processo: `brainstorming` antes de criar algo novo, `test-driven-development`, `systematic-debugging` para bugs, `verification-before-completion` (só dar a tarefa como pronta depois de rodar os testes e o build) e `requesting-code-review` |
| **claude-mem** | plugin | Memória entre sessões: registra o que foi feito em cada sessão, para a próxima já começar com o contexto do projeto |
| **vercel-react-best-practices** | skill | Boas práticas de React/Next.js (data fetching, Server Components, desempenho) |
| **vercel-composition-patterns** | skill | Padrões de composição de componentes React |
| **web-design-guidelines** | skill | Revisão de UI: acessibilidade e boas práticas de interface |
| **graphify** | skill | Gera um grafo de conhecimento do código, para entender a arquitetura e a relação entre arquivos |
| **find-skills** | skill | Encontrar e instalar novas skills quando preciso de algo que ainda não tenho |

---

## Como uso a IA (hábitos)

- **Branch e PR, nunca direto na `homolog`/`main`.** Peço para a IA criar uma branch
  (`feat/*`, `fix/*`, `test/*`) e abrir o PR. Ela não faz push sem a minha confirmação.
- **Verificar antes de dar como pronto.** Peço para rodar os testes, o `tsc`, o build e,
  quando faz sentido, subir a aplicação no Docker e testar o fluxo no navegador.
  Só considero a tarefa concluída com essa evidência.
- **Documentação local em vez da memória do modelo.** O Next.js do projeto (16) tem
  mudanças em relação ao que o modelo conhece, então a IA consulta
  `node_modules/next/dist/docs/` antes de escrever código.
- **Investigar antes de executar comandos destrutivos.** Em pedidos como "remover
  repositório" ou "resolver o conflito", a IA primeiro confere o estado real
  (git log, git blame, diff) e só depois age.
- **IA também para estudar.** Uso o Claude Code para me explicar o código e os testes
  em detalhes (conceitos de teste, mock, POO, boas práticas de engenharia de software),
  não só para gerar código.
- **Conferir o que a IA afirma.** Quando ela diz algo sobre o projeto, confiro no git.
  Exemplo: ela atribuiu a mim todos os testes do ItemCard; o `git blame` mostrou que
  o André também é autor e a informação foi corrigida.

---

## Onde usei a IA no projeto

| Data | Tarefa | O que a IA fez | O que eu precisei ajustar ou conferir |
| --- | --- | --- | --- |
| 31/08 | Setup do frontend | Criou o projeto Next.js (TypeScript + Tailwind), o ambiente Docker com hot reload e o README | O hot reload não funcionou de primeira; a IA isolou as variáveis e descobriu que o polling era a causa, não a solução ([registro da sessão](<Claude-session(chore/setup-frontend-nextjs).md>)) |
| 17/10 | Job de testes do frontend no Jenkins (issue #47, PR #55) | `CI-CD/J2-Testes-Frontend.Jenkinsfile` e o `jest-junit`, que gera o relatório para o Jenkins | — |
| 13/11 | Vitrine consumindo a API (RF14, PR #70) | `lib/skinsApi.ts`, `lib/playersApi.ts`, páginas de detalhe da skin e de players, imagens do seed e os testes `skinsApi`, `playersApi` e `skinGrid` | A busca da imagem pelo nome casava prefixos parciais e pegava a imagem de outra skin; foi corrigida e ganhou um teste para esse caso |
| 13/11 | Conflito `homolog` → `main` (PRs #71, #72 e #73) | Achou a causa (o revert do PR #37 tinha apagado arquivos), restaurou os arquivos e corrigiu um erro de TypeScript no build | Conferi os testes, o build e a aplicação completa rodando no Docker antes do merge |
| 13/11 | Estudo dos testes | Explicou em detalhes um teste unitário e um com mock, as boas práticas e como a POO aparece neles | A IA disse que eu era autor de todos os testes do ItemCard; conferi com `git blame` e ela corrigiu |
