# Rush B Market — Frontend

Aplicação web do Rush B Market, construída com Next.js (App Router).
Faz parte do monorepo `Rush-B-Market`, ao lado de `Backend/` (Spring Boot).

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16.3.3 (App Router, Turbopack) |
| UI | React 19.2.8 |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS 4 |
| Lint | ESLint 9 + `eslint-config-next` |
| Runtime | Node.js 20.9+ (imagem Docker usa Node 24 LTS) |

Existem dois caminhos para rodar o projeto: **com Docker** (recomendado, não
exige Node instalado) ou **direto na máquina**. Os dois entregam o mesmo
resultado — servidor de desenvolvimento em `http://localhost:3000` com hot
reload — e podem conviver: o `node_modules` do container fica em um volume
separado e não conflita com o da sua máquina.

---

## Setup com Docker (recomendado)

### Pré-requisitos

- **Docker Desktop** (macOS/Windows) ou **Docker Engine + Compose v2** (Linux).
  Confira com `docker compose version` — precisa ser v2.x ou superior.
- Nada mais. Node, npm e as dependências do projeto ficam todos dentro da imagem.

### Passo a passo

```bash
# 1. Clone o monorepo
git clone <url-do-repositorio> Rush-B-Market
cd Rush-B-Market/Frontend

# 2. Suba o ambiente
docker compose up
```

Pronto. Abra <http://localhost:3000>.

O que acontece na primeira execução (leva ~2 minutos):

1. O Docker constrói a imagem a partir do `Dockerfile.dev`.
2. Roda `npm ci` dentro da imagem, instalando as dependências travadas no
   `package-lock.json` — compiladas para Linux, não para o seu sistema.
3. Sobe o container executando `next dev`, com a pasta `Frontend/` montada
   dentro dele.

Nas execuções seguintes a imagem já está pronta e o servidor responde em ~3
segundos.

### Hot reload

Edite qualquer arquivo do projeto no seu editor de sempre — por exemplo
`app/page.tsx` — e salve. A página no navegador atualiza sozinha em 1 a 2
segundos. Não é preciso reiniciar o container nem rodar nada.

O código do host é montado no container (`.:/app`), então editor, Git e todas
as suas ferramentas continuam rodando normalmente na sua máquina; só a execução
acontece no container.

Se salvar um arquivo **não** recarregar a página, veja
[Solução de problemas](#solução-de-problemas).

### Parar o ambiente

```bash
# Se subiu em primeiro plano: Ctrl+C no terminal
docker compose down          # para e remove o container
docker compose down -v       # idem, e apaga os volumes (node_modules e cache)
```

### Variáveis de ambiente

Todas são opcionais e têm valor padrão. Podem ser passadas na linha de comando
ou em um arquivo `.env` nesta pasta (o `.env` já está no `.gitignore`).

| Variável | Padrão | Para que serve |
| --- | --- | --- |
| `WEB_PORT` | `3000` | Porta exposta no host. Use outra se a 3000 já estiver ocupada |
| `NODE_VERSION` | `24-alpine` | Tag da imagem base do Node usada no build |
| `NEXT_WATCH_POLL_INTERVAL_MS` | `0` (desligado) | Intervalo de polling do file watcher, em ms |
| `WATCHPACK_POLLING` | `false` | Liga o polling do watcher em JavaScript |

Exemplo:

```bash
WEB_PORT=3001 docker compose up
```

As duas últimas variáveis são um recurso de emergência para hot reload — leia a
seção de solução de problemas antes de ligá-las. Com o watcher nativo
funcionando, polling só consome CPU à toa.

---

## Setup sem Docker

### Pré-requisitos

- **Node.js 20.9 ou superior** (recomendado: 24 LTS). Confira com `node -v`.
- **npm 10+** (vem junto com o Node). Confira com `npm -v`.

### Passo a passo

```bash
# 1. Clone o monorepo
git clone <url-do-repositorio> Rush-B-Market
cd Rush-B-Market/Frontend

# 2. Instale as dependências exatamente como estão no lockfile
npm ci

# 3. Suba o servidor de desenvolvimento
npm run dev
```

Abra <http://localhost:3000>. O hot reload funciona da mesma forma: salvou,
atualizou.

Para usar outra porta: `npm run dev -- -p 3001`.

> `npm ci` instala a partir do `package-lock.json` e é o comando correto para
> reproduzir o ambiente. Use `npm install` apenas quando a intenção for
> **adicionar ou atualizar** uma dependência.

---

## Comandos úteis

### Docker Compose (dia a dia)

| Comando | O que faz |
| --- | --- |
| `docker compose up` | Sobe o ambiente em primeiro plano (logs na tela, `Ctrl+C` encerra) |
| `docker compose up -d` | Sobe em segundo plano |
| `docker compose up --build` | Força rebuild da imagem antes de subir |
| `docker compose down` | Para e remove o container |
| `docker compose down -v` | Para, remove e apaga os volumes (`node_modules`, cache do Next) |
| `docker compose restart web` | Reinicia só o serviço `web` |
| `docker compose ps` | Mostra status, portas e saúde do container |
| `docker compose logs -f web` | Acompanha os logs em tempo real |
| `docker compose logs --tail=50 web` | Mostra as últimas 50 linhas de log |
| `docker compose exec web sh` | Abre um shell dentro do container em execução |
| `docker compose exec web npm run lint` | Roda o ESLint dentro do container |
| `docker compose exec web npx tsc --noEmit` | Checa os tipos dentro do container |
| `docker compose config` | Mostra o compose já com as variáveis resolvidas |
| `docker compose build --no-cache` | Rebuild ignorando todo o cache de camadas |

Atalhos equivalentes no `package.json`:

| Script | Equivale a |
| --- | --- |
| `npm run docker:dev` | `docker compose up --build` |
| `npm run docker:stop` | `docker compose down` |
| `npm run docker:reset` | `docker compose down -v && docker compose up --build` |

### Docker "puro" (sem Compose)

Útil para depurar a imagem ou rodar em um ambiente sem Compose.

```bash
# Construir a imagem de desenvolvimento
docker build -f Dockerfile.dev --target dev -t rush-b-market/web:dev .

# Construir com outra versão do Node
docker build -f Dockerfile.dev --target dev \
  --build-arg NODE_VERSION=22-alpine -t rush-b-market/web:dev .

# Rodar a imagem com o código montado e hot reload
docker run --rm -it -p 3000:3000 \
  -v "$PWD":/app -v /app/node_modules -v /app/.next \
  rush-b-market/web:dev

# Abrir um shell na imagem sem subir o servidor
docker run --rm -it rush-b-market/web:dev sh
```

Os dois `-v` sem caminho no host (`-v /app/node_modules` e `-v /app/.next`)
criam volumes anônimos que protegem esses diretórios do bind mount — sem eles,
o `node_modules` do host sobrescreveria o do container e os binários nativos
(SWC/Turbopack) quebrariam por serem de outro sistema operacional.

### Build de produção

O `Dockerfile.dev` **não** serve para produção: instala devDependencies e roda
`next dev`. Para validar que o build de produção passa, rode-o dentro do
container de desenvolvimento:

```bash
docker compose run --rm -e NODE_ENV=production web npm run build
```

Ou, sem Docker:

```bash
npm run build     # gera o build otimizado em .next/
npm run start     # serve o build gerado em http://localhost:3000
```

> O `-e NODE_ENV=production` é obrigatório no comando via Compose: o serviço de
> desenvolvimento define `NODE_ENV=development`, e `next build` falha na
> geração das páginas de erro se rodar com esse valor.

### Manutenção do ambiente Docker

| Comando | O que faz |
| --- | --- |
| `docker compose ps -a` | Lista os containers do projeto, inclusive parados |
| `docker volume ls \| grep rush-b-market` | Lista os volumes do projeto |
| `docker image ls rush-b-market/web` | Mostra a imagem construída e seu tamanho |
| `docker stats rush-b-market-web-1` | CPU e memória do container em tempo real |
| `docker image rm rush-b-market/web:dev` | Remove a imagem (força rebuild do zero) |
| `docker system df` | Quanto espaço o Docker está ocupando |
| `docker system prune -f` | Limpa containers parados, redes e cache de build sem uso |

---

## Depois de mexer nas dependências

O `node_modules` do container vive em um **volume nomeado**, que não é
recriado automaticamente quando a imagem muda. Sempre que alterar
`package.json` ou `package-lock.json` (seu ou de outra pessoa, ao dar `git
pull`), recrie o volume:

```bash
docker compose down -v && docker compose up --build
# ou, com o atalho:
npm run docker:reset
```

Sem Docker, basta `npm ci`.

---

## Solução de problemas

**`Bind for 0.0.0.0:3000 failed: port is already allocated`**
Alguma coisa já ocupa a porta 3000. Descubra o que é com
`lsof -nP -iTCP:3000 -sTCP:LISTEN` (macOS/Linux) ou suba em outra porta:
`WEB_PORT=3001 docker compose up`.

**Salvei o arquivo e a página não atualizou**
O container não está recebendo os eventos de filesystem do host. Acontece em
WSL2 com o código no disco do Windows, VMs remotas e volumes NFS. Ligue o
polling:

```bash
NEXT_WATCH_POLL_INTERVAL_MS=1000 WATCHPACK_POLLING=true docker compose up
```

Se resolver, coloque as duas variáveis em um `.env` local para não precisar
repetir. Não ligue o polling "por precaução": com o watcher nativo funcionando
ele apenas gasta CPU.

**`Module not found` ou erro de dependência logo após um `git pull`**
O lockfile mudou e o volume de `node_modules` ficou desatualizado. Rode
`npm run docker:reset`.

**`Error: Cannot find module '../lightningcss.<plataforma>.node'` (ou erro
parecido com binário nativo)**
Sinal de `node_modules` do host vazando para dentro do container. Confirme que
os volumes nomeados estão no lugar (`docker compose config`) e recrie o
ambiente com `npm run docker:reset`.

**Quero começar do absoluto zero**

```bash
docker compose down -v
docker image rm rush-b-market/web:dev
docker compose up --build
```

---

## Estrutura do projeto

```
Frontend/
├── app/                  # App Router: rotas, layouts e páginas
│   ├── favicon.ico
│   ├── globals.css       # estilos globais + diretivas do Tailwind
│   ├── layout.tsx        # layout raiz da aplicação
│   └── page.tsx          # rota "/"
├── public/               # arquivos estáticos servidos como estão
├── compose.yaml          # serviço de desenvolvimento (Docker Compose)
├── Dockerfile.dev        # imagem de desenvolvimento (estágios base/deps/dev)
├── .dockerignore         # o que fica fora do build context
├── eslint.config.mjs     # configuração do ESLint (flat config)
├── next.config.ts        # configuração do Next.js
├── postcss.config.mjs    # PostCSS + Tailwind
└── tsconfig.json         # TypeScript (alias "@/*" aponta para a raiz)
```

## Scripts do `package.json`

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção otimizado, em `.next/` |
| `npm run start` | Serve o build de produção (exige `npm run build` antes) |
| `npm run lint` | ESLint em todo o projeto |
| `npm run docker:dev` | `docker compose up --build` |
| `npm run docker:stop` | `docker compose down` |
| `npm run docker:reset` | Recria volumes e imagem, e sobe o ambiente |

## Como a imagem de desenvolvimento é construída

O `Dockerfile.dev` tem três estágios:

1. **`base`** — Node 24 Alpine + `libc6-compat` (os binários nativos do
   SWC/Turbopack esperam símbolos glibc, que o Alpine não traz por padrão).
2. **`deps`** — copia apenas `package.json` e `package-lock.json` e roda
   `npm ci`. Isolar esse passo faz o Docker reaproveitar a camada enquanto as
   dependências não mudarem: alterar código-fonte não dispara reinstalação.
3. **`dev`** — junta as dependências e o código, ajusta permissões e troca para
   o usuário `node` (sem privilégios de root), expõe a porta 3000 e define o
   healthcheck.

## Documentação

- [Next.js](https://nextjs.org/docs) — App Router, rotas e renderização
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Docker Compose](https://docs.docker.com/compose/)
