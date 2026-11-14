# Uso de IA — Luis Teles

**Ferramenta:** Claude Code (CLI e extensão do VS Code), modelos Claude Opus 5 e Claude Opus 5.5

## Setup do frontend (PR #7)

- **Pedi:** criar o projeto Next.js com TypeScript e Tailwind e um container Docker de desenvolvimento com hot reload.
- **Resultado:** projeto em `Frontend/`, `Dockerfile.dev`, `compose.yaml`, `.dockerignore` e o README do frontend.
- **Prompt:** "Iniciar projeto Next.js chamado rush-b-market na pasta Frontend, com TypeScript e Tailwind, apenas o padrão." / "Criar container Docker de desenvolvimento, com boas práticas, e atualização automática ao salvar."
- **Ajuste:** o hot reload não funcionou de primeira; a IA descobriu que o polling era a causa, e não a solução. Registro completo em [Claude-session(chore/setup-frontend-nextjs).md](<Claude-session(chore/setup-frontend-nextjs).md>).

## Testes do ItemCard (PR #41)

- **Pedi:** testes unitários e com mock para o componente ItemCard.
- **Resultado:** `itemCard.test.tsx` e `itemCard.mock.test.tsx`, com mock do `next/image`.
- **Prompt (resumido):** pedi um teste unitário e um teste com mock do ItemCard, com casos positivos e negativos.
- **Ajuste:** o André fez os mesmos arquivos ao mesmo tempo (PR #40); as duas versões foram juntadas na resolução do conflito.

## Job de testes automatizados do frontend (PR #54, issue #47)

- **Pedi:** o job do Jenkins que roda os testes do frontend.
- **Resultado:** `CI-CD/J2-Testes-Frontend.Jenkinsfile` e o `jest-junit`, que gera o `reports/junit.xml` lido pelo Jenkins (script `test:ci`).
- **Prompt (resumido):** pedi para implementar a issue #47 — testes automatizados do frontend no Jenkins.
- **Descartado:** uma primeira versão com a pipeline completa do frontend (`Frontend.Jenkinsfile` e `Dockerfile` de produção), porque ia além da minha issue; fiquei só com o job de testes.

## Vitrine consumindo a API (PR #70)

- **Pedi:** ligar a vitrine ao `GET /skins` do backend (RF14) e criar a página de detalhe da skin e as telas de players.
- **Resultado:** `lib/skinsApi.ts`, `lib/playersApi.ts`, páginas de detalhe e de players, imagens das 15 skins do seed e os testes `skinsApi.test.ts`, `playersApi.test.ts` e `skinGrid.test.tsx`.
- **Prompt:** "leave the images in the front end just cross the names from the api with the image names and use the correct image on the correct card"
- **Aceito:** a função `findImageFile` em `lib/skinsApi.ts`, que cruza o nome da skin da API com os arquivos de `public/skins`, e as imagens continuaram no frontend.
- **Ajuste:** a busca da imagem pelo nome da skin pegava a imagem de outra skin com o mesmo prefixo; pedi a correção e um teste para esse caso.

## Conflito da homolog com a main (PRs #72 e #73)

- **Pedi:** entender por que o PR #71 estava com conflito e resolver.
- **Resultado:** o revert do PR #37 tinha apagado arquivos da `main`; a branch `merge/homolog-into-main` restaurou os arquivos (PR #73) e o PR #72 corrigiu o erro de TypeScript que quebrava o build.
- **Prompt:** "can you check the conflict at the pr #71 can you also check if the features will work in the main branch will work onse the merge to main is done"
- **Aceito:** o diagnóstico do revert do PR #37 e a resolução por uma branch separada (`merge/homolog-into-main`), sem mexer direto na main.
- **Ajuste:** depois de aceitar o PR para a homolog o conflito continuou no #71 ("aceitei o pr para homolog porem o conflito ainda aparece em #71"), e foi preciso uma segunda rodada.

## Refactors do frontend (PRs #96 e #97)

- **Pedi:** dois refactors simples em código e testes que eu escrevi.
- **Resultado:** `lib/apiClient.ts` centralizando as chamadas HTTP de `skinsApi.ts` e `playersApi.ts` (#96) e os testes de `skinsApi.test.ts` e `playersApi.test.ts` reorganizados com `it.each` (#97).
- **Prompt:** "preciso fazer dois refacts nesse projeto procure nos meus prs os dois melhores resultados de preferecia apenas codifo que eu mechi e testes faca isso e faca os rects"
- **Aceito:** os dois refactors como a IA propôs, sem mudar o comportamento (os 71 testes existentes passaram sem alteração).
- **Descartado:** um arquivo de teste extra (`apiClient.test.ts`) que a IA criou; pedi para manter simples ("por favor mantenha os dois refact simples" / "e apenas 2").

## Estudo dos testes

- **Pedi:** explicação detalhada de um teste unitário e de um com mock que eu fiz, e se seguem as boas práticas de engenharia de software.
- **Resultado:** explicação dos testes do ItemCard e do `playersApi.test.ts`, incluindo os conceitos de POO.
- **Prompt:** "Selecione um de cada teste que fiz, um mock e um unitário, e explique em detalhes o que está acontecendo e se os testes estão seguindo as regras de engenharia de software."
- **Descartado:** a IA disse que todos os testes do ItemCard eram meus; conferi com o `git blame` e eles foram feitos junto com o André.

## Skills e plugins (Claude Code)

- **superpowers:** skills de processo, como brainstorming, TDD, depuração sistemática e verificação antes de concluir.
- **claude-mem:** memória entre sessões, para a IA começar já com o contexto do projeto.
- **vercel-react-best-practices** e **vercel-composition-patterns:** boas práticas de React/Next.js.
- **web-design-guidelines:** revisão de acessibilidade e de interface.
- **graphify:** grafo do código para entender a arquitetura.

## Hábitos de uso

- Sempre trabalho em branch e PR, nunca direto na homolog; a IA não faz push sem a minha confirmação.
- Peço para a IA rodar os testes, o build e a aplicação antes de considerar a tarefa pronta.
- Confiro no git o que a IA afirma sobre o projeto.
