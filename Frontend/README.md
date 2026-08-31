This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Desenvolvimento com Docker (recomendado)

Único requisito na máquina: Docker Desktop (ou Docker Engine + Compose v2).
Não é preciso ter Node nem rodar `npm install`.

```bash
docker compose up
```

A aplicação sobe em [http://localhost:3000](http://localhost:3000). Edite
qualquer arquivo — `app/page.tsx`, por exemplo — e salve: a página recarrega
sozinha em 1 a 2 segundos. O código do host é montado no container, então o
editor, o Git e as ferramentas continuam rodando normalmente na sua máquina.

Para parar: `Ctrl+C`, ou `docker compose down` em outro terminal.

### Comandos

| Comando | O que faz |
| --- | --- |
| `docker compose up` | Sobe o ambiente de dev (build automático na primeira vez) |
| `docker compose up --build` | Força rebuild da imagem (após mudar o `Dockerfile.dev`) |
| `docker compose down` | Para e remove o container |
| `docker compose down -v` | Idem, e apaga os volumes (`node_modules` e cache do Next) |
| `docker compose exec web sh` | Abre um shell dentro do container |
| `docker compose logs -f web` | Acompanha os logs |

Os mesmos comandos existem como atalhos npm: `npm run docker:dev`,
`npm run docker:stop` e `npm run docker:reset`.

### Depois de mexer nas dependências

`node_modules` vive em um volume nomeado (para não misturar binários Linux com
os do seu host). Depois de alterar `package.json` / `package-lock.json`:

```bash
docker compose down -v && docker compose up --build   # ou: npm run docker:reset
```

### Variáveis de ambiente

Todas opcionais, passadas na hora do `up` ou via arquivo `.env`:

| Variável | Padrão | Para quê |
| --- | --- | --- |
| `WEB_PORT` | `3000` | Porta exposta no host, caso a 3000 esteja ocupada |
| `NODE_VERSION` | `24-alpine` | Tag da imagem base do Node |
| `NEXT_WATCH_POLL_INTERVAL_MS` | `0` (desligado) | Liga polling do file watcher, em ms |
| `WATCHPACK_POLLING` | `false` | Polling do watcher em JS |

As duas últimas só são necessárias em ambientes onde o container não recebe os
eventos de filesystem do host (WSL2 com o código no disco do Windows, VM
remota, NFS). No Docker Desktop em macOS/Windows e no Linux o watcher nativo
funciona, e polling só gastaria CPU. Se salvar um arquivo não recarregar a
página, tente:

```bash
NEXT_WATCH_POLL_INTERVAL_MS=1000 WATCHPACK_POLLING=true docker compose up
```

### Arquivos

- `Dockerfile.dev` — imagem de desenvolvimento (estágios `base`, `deps`, `dev`).
  Não serve para produção: instala devDependencies e roda `next dev`.
- `compose.yaml` — o serviço `web`, os volumes e as portas.
- `.dockerignore` — o que fica fora do build context.

## Rodando sem Docker

Rode o servidor de desenvolvimento direto na máquina (precisa de Node 20.9+):

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
