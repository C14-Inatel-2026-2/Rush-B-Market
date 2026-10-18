import type { NextConfig } from "next";

// Fallback de file watching. O watcher nativo do Turbopack cobre o bind mount
// do Docker Desktop, entao o padrao e nao fazer polling (mais rapido e sem CPU
// ociosa). Em ambientes onde os eventos de filesystem nao chegam (WSL2 com o
// codigo no disco do Windows, VM remota, NFS), suba com
// NEXT_WATCH_POLL_INTERVAL_MS=1000 para forcar polling.
const pollIntervalMs = Number(process.env.NEXT_WATCH_POLL_INTERVAL_MS);
const usePolling = Number.isFinite(pollIntervalMs) && pollIntervalMs > 0;

const nextConfig: NextConfig = {
  // Gera .next/standalone no build: servidor minimo (server.js) usado pela
  // imagem de producao (Dockerfile) no deploy do J5. Nao afeta o `next dev`.
  output: "standalone",
  ...(usePolling ? { watchOptions: { pollIntervalMs } } : {}),
};

export default nextConfig;
