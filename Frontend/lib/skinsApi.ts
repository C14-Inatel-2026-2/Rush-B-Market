import { existsSync } from "node:fs";
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
const API_URL = process.env.API_URL ?? "http://localhost:8080";

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

// A API tambem nao tem imagem: usamos /public/skins/<nome sem "|">.png quando
// existe, senao um placeholder.
function imageFor(name: string): string {
  const file = `/skins/${name.replace(/\s*\|\s*/, " ")}.png`;
  return existsSync(path.join(process.cwd(), "public", file)) ? file : PLACEHOLDER_IMAGE;
}

export async function getSkins(): Promise<Item[]> {
  const res = await fetch(`${API_URL}/skins`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /skins falhou: ${res.status}`);
  const skins: SkinResponse[] = await res.json();
  return skins.map((skin) => toItem(skin, imageFor(skin.name)));
}
