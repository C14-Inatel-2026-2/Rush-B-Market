import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { Item } from "../data/mockItems";

// Formato devolvido por GET /skins (SkinResponseDTO do backend)
export interface SkinResponse {
  id: number;
  name: string;
  floatValue: string;
  price: number;
  rarity: string;
  weapon: string;
  playerId: number | null;
}

// URL da API vista pelo servidor do Next (a busca roda no servidor, entao nao
// depende de CORS no backend). No Docker o compose aponta para o host.
export const API_URL = process.env.API_URL ?? "http://localhost:8080";

export const PLACEHOLDER_IMAGE = "/skin-placeholder.svg";

const PISTOLS = new Set([
  "glock-18", "usp-s", "p2000", "p250", "desert eagle", "five-seven",
  "tec-9", "cz75-auto", "dual berettas", "r8 revolver",
]);

// Faixas de desgaste do CS: FN < 0.07 <= MW < 0.15 <= FT < 0.38 <= WW < 0.45 <= BS
export function wearFromFloat(floatValue: string): string {
  const f = Number(floatValue);
  if (!Number.isFinite(f)) return "?";
  if (f < 0.07) return "FN";
  if (f < 0.15) return "MW";
  if (f < 0.38) return "FT";
  if (f < 0.45) return "WW";
  return "BS";
}

// A API nao tem "categoria": derivamos de raridade + tipo de arma, no mesmo
// formato dos dados de exemplo ("COVERT KNIVES") e dos filtros do RF12.
export function categoryFor(rarity: string, weapon: string): string {
  let group = "RIFLES";
  if (/knife|karambit|bayonet|dagger/i.test(weapon)) group = "KNIVES";
  else if (/glove|wrap/i.test(weapon)) group = "GLOVES";
  else if (PISTOLS.has(weapon.toLowerCase())) group = "PISTOLS";
  return `${rarity.toUpperCase()} ${group}`;
}

export function toItem(skin: SkinResponse, image: string): Item {
  return {
    id: skin.id,
    name: skin.name,
    category: categoryFor(skin.rarity, skin.weapon),
    price: skin.price,
    image,
    wearLabel: wearFromFloat(skin.floatValue),
    floatValue: skin.floatValue,
  };
}

// Quebra o nome em palavras ignorando maiusculas, espacos, "|" e pontuacao:
// "Karambit | Doppler" e "Karambit Doppler.png" viram ["karambit", "doppler"].
const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

// A API nao tem imagem: cruzamos o nome da skin com os arquivos de
// /public/skins. Prioridade: mesmas palavras; senao, arquivo cujas palavras
// comecam com as da skin (variantes como "Karambit Doppler Blue"). A
// comparacao e por palavra inteira, entao "AK-47 | Red" nao pega "AK-47
// Redline". Sem match -> null (o card usa o placeholder).
export function findImageFile(skinName: string, files: string[]): string | null {
  const key = words(skinName);
  const fileWords = (f: string) => words(f.replace(/\.[^.]+$/, ""));
  const startsWithKey = (w: string[]) => key.every((k, i) => w[i] === k);
  const exact = files.find((f) => fileWords(f).length === key.length && startsWithKey(fileWords(f)));
  if (exact) return exact;
  return files.find((f) => startsWithKey(fileWords(f))) ?? null;
}

const SKINS_DIR = path.join(process.cwd(), "public", "skins");

export function imageFor(name: string): string {
  // Lido a cada requisicao para pegar imagens novas sem reiniciar o servidor
  const files = existsSync(SKINS_DIR)
    ? readdirSync(SKINS_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()
    : [];
  const file = findImageFile(name, files);
  return file ? `/skins/${file}` : PLACEHOLDER_IMAGE;
}

export async function getSkins(): Promise<Item[]> {
  const res = await fetch(`${API_URL}/skins`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /skins falhou: ${res.status}`);
  const skins: SkinResponse[] = await res.json();
  return skins.map((skin) => toItem(skin, imageFor(skin.name)));
}

// Detalhe de uma skin: o Item do card mais os campos crus da API
export type SkinDetail = Item & Pick<SkinResponse, "rarity" | "weapon" | "playerId">;

export function toSkinDetail(skin: SkinResponse): SkinDetail {
  return {
    ...toItem(skin, imageFor(skin.name)),
    rarity: skin.rarity,
    weapon: skin.weapon,
    playerId: skin.playerId,
  };
}

// GET /skins/{id}. Devolve null quando a skin nao existe (404).
export async function getSkin(id: string | number): Promise<SkinDetail | null> {
  const res = await fetch(`${API_URL}/skins/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`GET /skins/${id} falhou: ${res.status}`);
  return toSkinDetail(await res.json());
}
