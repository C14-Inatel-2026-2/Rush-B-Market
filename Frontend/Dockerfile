#
# Imagem de PRODUCAO do rush-b-market (usada no deploy do J5).
# Para desenvolvimento com hot reload, use o Dockerfile.dev (docker compose up).
#
# Usa o output "standalone" do Next (ver next.config.ts): a imagem final leva
# so o server.js e os arquivos rastreados no build, sem node_modules completo.

ARG NODE_VERSION=24-alpine

# ---------------------------------------------------------------- base
FROM node:${NODE_VERSION} AS base
# libc6-compat: binarios nativos (SWC/Turbopack) esperam simbolos glibc no Alpine
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---------------------------------------------------------------- deps
# So os manifestos entram aqui: o `npm ci` so roda de novo quando
# package.json / package-lock.json mudam (cache de camada).
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------- build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------------------------------------------------------------- runner
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# O server.js do standalone nao copia public/ nem .next/static sozinho
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

# Sem root: o servidor roda como usuario sem privilegio
USER node

EXPOSE 3000

# O J5 espera o container ficar "healthy" para considerar o deploy concluido
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
