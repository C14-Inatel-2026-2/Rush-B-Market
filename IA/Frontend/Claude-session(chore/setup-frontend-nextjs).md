# Sessão Claude Code — Setup do Frontend

**Projeto:** Rush B Market (monorepo: `Frontend/` Next.js + `Backend/` Spring Boot)
**Data:** 31/08/2026
**Ferramenta:** Claude Code (modelo Opus 5)
**Branch:** `chore/setup-frontend-nextjs`
**Objetivo:** criar o frontend do projeto e um ambiente de desenvolvimento em
Docker com atualização automática ao salvar o código (hot reload).

---

## Resumo

A sessão teve quatro etapas: criação do projeto Next.js, containerização para
desenvolvimento, depuração de um problema real de hot reload dentro do
container e documentação do setup. Todo comando documentado foi executado e
verificado antes de ser registrado no README.

---

## Modelo e IA utilizados

| Item | Detalhe |
| --- | --- |
| Provedor | Anthropic |
| Modelo | Claude Opus 5 (identificador `claude-opus-5`) |
| Interface | Claude Code, CLI oficial da Anthropic para engenharia de software |
| Versão do CLI | 2.1.251 |
| Ambiente | macOS (Darwin 25.5.0), terminal zsh |
| Modo de operação | Agente autônomo com acesso ao sistema de arquivos e ao terminal |

Diferente de um chat comum, o Claude Code atua como um **agente**: ele não
apenas sugere código, mas executa comandos na máquina e usa o resultado para
decidir o próximo passo. Nesta sessão isso foi essencial — a causa raiz do
problema de hot reload só apareceu porque o agente pôde rodar os experimentos,
ler os logs do container e medir os tempos, em vez de apenas propor hipóteses.

Ferramentas usadas ao longo da sessão:

| Ferramenta | Uso nesta sessão |
| --- | --- |
| Execução de comandos (shell) | `create-next-app`, `docker build`, `docker compose`, `curl`, `git`, `npm` |
| Leitura e escrita de arquivos | Criação do `Dockerfile.dev`, `compose.yaml`, `.dockerignore` e README |
| Leitura da documentação local | Inspeção do `node_modules/next` para confirmar como o Next.js 16 expõe as opções de file watching, em vez de confiar na memória do modelo |

Todo o código e a documentação foram gerados pelo modelo sob orientação e
revisão do desenvolvedor, que definiu os requisitos, interrompeu o trabalho
quando o resultado não estava adequado e validou a entrega final.

---

## Prompts utilizados e resultados

| # | Prompt (resumido) | Resultado |
| --- | --- | --- |
| 1 | Iniciar projeto Next.js chamado `rush-b-market` na pasta `Frontend`, com TypeScript e Tailwind, apenas o padrão | Projeto criado com `create-next-app`; build de produção validado |
| 2 | Criar container Docker de desenvolvimento, com boas práticas, e atualização automática ao salvar | `Dockerfile.dev`, `compose.yaml` e `.dockerignore` criados; hot reload **não** funcionou de primeira |
| 3 | (interrupção) "este container está demorando demais" | Trabalho interrompido, arquivos de teste revertidos e o problema relatado com honestidade, sem alegar sucesso |
| 4 | Resolver o problema, deixando tudo rodando com um `docker compose` para facilitar a vida dos outros desenvolvedores | Causa raiz encontrada e corrigida; hot reload validado em 1–2s |
| 5 | Verificar se há dois repositórios Git no monorepo e remover o do frontend | Investigado: existe **apenas um** repositório, na raiz. Nada foi apagado |
| 6 | Reescrever o README com o setup detalhado, com e sem Docker, incluindo comandos úteis | README reescrito (327 linhas), com todos os comandos testados |

---

## O que foi entregue

| Arquivo | Função |
| --- | --- |
| `Frontend/` (projeto completo) | Next.js 16.3.3, React 19.2.8, TypeScript 5, Tailwind CSS 4, App Router |
| `Frontend/Dockerfile.dev` | Imagem de desenvolvimento em 3 estágios (`base`, `deps`, `dev`) |
| `Frontend/compose.yaml` | Serviço `web`: portas, volumes e variáveis de ambiente |
| `Frontend/.dockerignore` | Reduz o build context enviado ao Docker |
| `Frontend/next.config.ts` | Fallback opcional de file watching por polling, via variável de ambiente |
| `Frontend/package.json` | Scripts `docker:dev`, `docker:stop` e `docker:reset` |
| `Frontend/README.md` | Setup completo com e sem Docker, comandos úteis e solução de problemas |

Para um desenvolvedor novo no projeto, tudo se resume a um comando — sem
precisar de Node instalado na máquina:

```bash
cd Frontend && docker compose up
```

---

## Boas práticas aplicadas na imagem Docker

- **Build em múltiplos estágios**, com o `npm ci` isolado em um estágio próprio:
  a camada de dependências é reaproveitada enquanto o `package-lock.json` não
  muda, então alterar código-fonte não dispara reinstalação.
- **Instalação reproduzível** com `npm ci` a partir do lockfile, em vez de
  `npm install`.
- **Execução sem privilégios de root**: o servidor roda como o usuário `node`
  (uid 1000).
- **Volumes nomeados** para `node_modules` e `.next`, isolando os binários
  compilados para Linux dos binários do host (macOS/arm64) — sem isso, o bind
  mount do código sobrescreveria as dependências do container.
- **Healthcheck** no container e `init: true` no Compose (PID 1 real, para que
  `Ctrl+C` e `docker stop` encerrem o processo corretamente).
- **Imagem base e dependências com versão fixada**; a versão do Node é
  parametrizável via `--build-arg NODE_VERSION`.
- **Configuração parametrizável** por variáveis de ambiente com valores padrão
  (`WEB_PORT`, `NODE_VERSION` e as de polling).

---

## O problema técnico da sessão: hot reload não disparava

**Sintoma:** o container subia e servia a aplicação normalmente, mas salvar um
arquivo no host não recompilava nada. Nenhum log de compilação aparecia.

**Hipótese inicial (errada):** bind mounts do Docker Desktop em macOS não
propagam eventos de filesystem para dentro do container, então seria preciso
ligar o *polling* do file watcher. Essa é a recomendação mais comum na internet
para Next.js em Docker, e foi o que eu configurei primeiro
(`watchOptions.pollIntervalMs` + `WATCHPACK_POLLING`).

**Investigação:** em vez de tentar soluções no escuro, isolei as variáveis:

1. Confirmei que a alteração do arquivo **chegava** ao container (`grep` no
   arquivo dentro do container mostrava a mudança em 3 segundos). Logo, o
   problema não era o bind mount.
2. Confirmei nos logs que o polling estava mesmo ativo — e junto dele apareciam
   erros: `watch error (["/app/src"]): Io(Os { code: 2, kind: NotFound })`.
3. Editei um arquivo **de dentro** do container, onde os eventos nativos de
   filesystem certamente funcionam. Também não recompilou — o que descartava a
   propagação host→container como causa e apontava para o próprio watcher.
4. Desliguei o polling e repeti os dois testes: recompilou em 1 segundo nos
   dois casos.

**Causa raiz:** o polling era a causa, não a solução. Ao definir
`watchOptions.pollIntervalMs`, o watcher do Turbopack falha ao registrar os
diretórios e deixa de detectar qualquer alteração. O watcher nativo funciona
normalmente no Docker Desktop, que já propaga os eventos do host.

**Correção:** polling desligado por padrão, mantido como recurso opcional
(via variável de ambiente) para ambientes onde os eventos realmente não chegam
— WSL2 com o código no disco do Windows, VMs remotas, NFS. A decisão e o
motivo ficaram documentados em comentário no `compose.yaml` e na seção de
solução de problemas do README.

**Lição:** a recomendação mais repetida para um problema nem sempre se aplica
ao seu caso. Isolar as variáveis uma a uma custou poucos minutos e evitou uma
configuração que degradaria o desempenho de todos os desenvolvedores do time
sem resolver nada.

---

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| Build de produção do projeto (`npm run build`) | Passou — rotas `/` e `/_not-found` |
| Subida do zero (sem imagem e sem volumes) até HTTP 200 | 108s |
| Subidas seguintes (`docker compose up`) | 3s |
| Hot reload com edição no host (7 execuções) | Refletido em 1–2s |
| Hot reload com edição dentro do container | Refletido em 1s |
| Usuário do processo no container | `uid=1000(node)` — sem root |
| Healthcheck do container | `healthy` |
| ESLint e `tsc --noEmit`, dentro e fora do container | Sem erros |
| `docker build` direto e com `--build-arg NODE_VERSION=22-alpine` | Construiu; container reportou `v22.23.2` |
| `docker run` sem Compose, com volumes anônimos | Respondeu em 4s |
| Build de produção dentro do container | Exigiu `-e NODE_ENV=production`; documentado |

Todos os arquivos usados como cobaia nos testes foram restaurados ao estado
original ao final da sessão.

---

## Observações sobre o uso do Claude Code

- O agente **interrompeu o trabalho e relatou o fracasso** quando o hot reload
  não funcionava, em vez de declarar a tarefa concluída. O problema só foi dado
  como resolvido depois de medido.
- A verificação por conta própria pegou um erro que passaria despercebido: o
  comando de build de produção via Compose falha sem `NODE_ENV=production`.
  Documentar sem testar teria deixado um comando quebrado no README.
- No pedido de remover "o segundo repositório Git", o agente investigou antes
  de executar e constatou que existia apenas um repositório — nada foi apagado.
  Comandos destrutivos merecem verificação prévia.
