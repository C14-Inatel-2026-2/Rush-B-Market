// Cliente HTTP unico da API do backend. Todas as chamadas rodam no servidor do
// Next (nao dependem de CORS) e sem cache, para a vitrine refletir a API na hora.

// URL da API vista pelo servidor do Next. No Docker o compose aponta para o
// host; na Vercel vem das variaveis de ambiente do projeto.
export const API_URL = process.env.API_URL ?? "http://localhost:8080";

export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${path}`, { cache: "no-store", ...init });
}

export function apiError(method: string, path: string, status: number): Error {
  return new Error(`${method} ${path} falhou: ${status}`);
}

// GET que devolve o JSON da resposta; qualquer status fora de 2xx vira erro.
export async function getJson<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) throw apiError("GET", path, res.status);
  return res.json();
}

// Igual ao getJson, mas devolve null quando o recurso nao existe (404) ou o id
// e invalido (400), para a pagina mostrar "nao encontrado" em vez de erro.
export async function getJsonOrNull<T>(path: string): Promise<T | null> {
  const res = await apiFetch(path);
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw apiError("GET", path, res.status);
  return res.json();
}
