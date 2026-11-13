"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { createPlayer, deletePlayer } from "../../lib/playersApi";

export type CreatePlayerState = { error?: string; created?: string };

export async function createPlayerAction(
  _prev: CreatePlayerState,
  formData: FormData,
): Promise<CreatePlayerState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // A validacao de verdade (e-mail valido, senha >= 6, e-mail unico) e do
  // backend; aqui so devolvemos a mensagem dele para o formulario.
  const result = await createPlayer(email, password);
  if ("error" in result) return { error: result.error };

  refresh();
  return { created: result.player.email };
}

export async function deletePlayerAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  await deletePlayer(id);
  // Do detalhe volta para a lista; na lista apenas recarrega
  if (formData.get("redirect") === "list") redirect("/players");
  refresh();
}
