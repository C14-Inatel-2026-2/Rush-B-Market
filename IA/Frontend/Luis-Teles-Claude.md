# Uso de IA — Luis Teles

**Ferramenta:** Claude Code (CLI e extensão do VS Code), modelos Claude Opus 5 e Claude Opus 5.5

## Setup do frontend (PR #7)

- **Pedi:** criar o projeto Next.js com TypeScript e Tailwind e um container Docker de desenvolvimento com hot reload.
- **Resultado:** projeto em `Frontend/`, `Dockerfile.dev`, `compose.yaml`, `.dockerignore` e o README do frontend.
- **Prompt:** "Iniciar projeto Next.js chamado rush-b-market na pasta Frontend, com TypeScript e Tailwind, apenas o padrão." / "Criar container Docker de desenvolvimento, com boas práticas, e atualização automática ao salvar."
- **Ajuste:** o hot reload não funcionou de primeira; a IA descobriu que o polling era a causa, e não a solução. Registro completo em [Claude-session(chore/setup-frontend-nextjs).md](<Claude-session(chore/setup-frontend-nextjs).md>).

## Vitrine consumindo a API (PR #70)

- **Pedi:** ligar a vitrine ao `GET /skins` do backend (RF14) e criar a página de detalhe da skin e as telas de players.
- **Resultado:** `lib/skinsApi.ts`, `lib/playersApi.ts`, páginas de detalhe e de players, imagens das 15 skins do seed e os testes `skinsApi.test.ts`, `playersApi.test.ts` e `skinGrid.test.tsx`.
- **Prompt (resumido):** pedi para integrar o frontend com a API usando os endpoints que já existem no backend, com testes.
- **Ajuste:** a busca da imagem pelo nome da skin pegava a imagem de outra skin com o mesmo prefixo; pedi a correção e um teste para esse caso.

## Conflito da homolog com a main (PRs #72 e #73)

- **Pedi:** entender por que o PR #71 estava com conflito e resolver.
- **Resultado:** o revert do PR #37 tinha apagado arquivos da `main`; a branch `merge/homolog-into-main` restaurou os arquivos (PR #73) e o PR #72 corrigiu o erro de TypeScript que quebrava o build.
- **Prompt (resumido):** pedi para abrir um PR para a homolog com a correção e outro para resolver o conflito do PR #71, sem mexer direto na main.

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
