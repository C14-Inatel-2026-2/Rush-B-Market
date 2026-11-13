import { API_URL, toSkinDetail, type SkinDetail, type SkinResponse } from "./skinsApi";

// PlayerResponseDTO / PlayerWithSkinsResponseDTO do backend
export interface Player {
  id: number;
  email: string;
  createdAt: string;
}

export interface PlayerWithSkins extends Player {
  skins: SkinDetail[];
}

export async function getPlayers(): Promise<Player[]> {
  const res = await fetch(`${API_URL}/players`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /players falhou: ${res.status}`);
  return res.json();
}

// GET /players/{id}. Devolve null quando o player nao existe (404).
export async function getPlayer(id: string | number): Promise<PlayerWithSkins | null> {
  const res = await fetch(`${API_URL}/players/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`GET /players/${id} falhou: ${res.status}`);
  const player: Player & { skins: SkinResponse[] } = await res.json();
  return { ...player, skins: player.skins.map(toSkinDetail) };
}

// Le a mensagem de erro do backend: ErrorResponse ({ message }) ou erro de
// validacao ({ errors: { campo: mensagem } }).
export function errorMessageFrom(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const b = body as { message?: unknown; errors?: unknown };
    if (b.errors && typeof b.errors === "object") {
      return Object.values(b.errors as Record<string, string>).join(" · ");
    }
    if (typeof b.message === "string" && b.message) return b.message;
  }
  return `Erro ${status}`;
}

export type CreatePlayerResult = { ok: true; player: Player } | { ok: false; error: string };

// POST /players
export async function createPlayer(email: string, password: string): Promise<CreatePlayerResult> {
  const res = await fetch(`${API_URL}/players`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) return { ok: false, error: errorMessageFrom(body, res.status) };
  return { ok: true, player: body as Player };
}

// DELETE /players/{id}
export async function deletePlayer(id: string | number): Promise<void> {
  const res = await fetch(`${API_URL}/players/${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!res.ok && res.status !== 404) throw new Error(`DELETE /players/${id} falhou: ${res.status}`);
}
