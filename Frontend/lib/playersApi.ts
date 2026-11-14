import { apiError, apiFetch, getJson, getJsonOrNull } from "./apiClient";
import { toSkinDetail, type SkinDetail, type SkinResponse } from "./skinsApi";

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
  return getJson<Player[]>("/players");
}

// GET /players/{id}. Devolve null quando o player nao existe (404).
export async function getPlayer(id: string | number): Promise<PlayerWithSkins | null> {
  const player = await getJsonOrNull<Player & { skins: SkinResponse[] }>(`/players/${encodeURIComponent(id)}`);
  return player && { ...player, skins: player.skins.map(toSkinDetail) };
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
  const res = await apiFetch("/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) return { ok: false, error: errorMessageFrom(body, res.status) };
  return { ok: true, player: body as Player };
}

// DELETE /players/{id}
export async function deletePlayer(id: string | number): Promise<void> {
  const path = `/players/${encodeURIComponent(id)}`;
  const res = await apiFetch(path, { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw apiError("DELETE", path, res.status);
}
