import Link from "next/link";
import { notFound } from "next/navigation";
import SkinGrid from "../../_components/SkinGrid";
import { getPlayer, type PlayerWithSkins } from "../../../lib/playersApi";
import { deletePlayerAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  let player: PlayerWithSkins | null;
  try {
    player = await getPlayer(id);
  } catch {
    return (
      <main className="flex-1 p-6 font-mono md:p-8">
        <p role="alert" className="mx-auto max-w-4xl text-[11px] tracking-[0.15em] text-[#d4a72c]">
          NÃO FOI POSSÍVEL CARREGAR O PLAYER. VERIFIQUE SE A API ESTÁ NO AR.
        </p>
      </main>
    );
  }
  if (!player) notFound();

  const total = player.skins.reduce((sum, skin) => sum + skin.price, 0);

  return (
    <main className="flex-1 p-6 font-mono md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/players" className="text-[10px] tracking-[0.15em] text-[#5a6069] hover:text-[#35c9d8]">
          ← PLAYERS
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-[15px] tracking-[0.1em] text-[#e8eaed]">{player.email}</h1>
            <p className="mt-1 text-[10px] tracking-[0.15em] text-[#5a6069]">
              #{player.id} · DESDE {new Date(player.createdAt).toLocaleDateString("pt-BR")} · {player.skins.length}/5 SKINS ·
              INVENTÁRIO ${total.toFixed(2)}
            </p>
          </div>
          <form action={deletePlayerAction}>
            <input type="hidden" name="id" value={player.id} />
            <input type="hidden" name="redirect" value="list" />
            <button
              type="submit"
              className="border border-[#2a2f37] px-3 py-1.5 text-[10px] tracking-[0.15em] text-[#5a6069] hover:border-[#e05d5d] hover:text-[#e05d5d]"
            >
              EXCLUIR PLAYER
            </button>
          </form>
        </div>

        {player.skins.length === 0 ? (
          <p className="text-[11px] tracking-[0.1em] text-[#5a6069]">INVENTÁRIO VAZIO.</p>
        ) : (
          <SkinGrid items={player.skins} />
        )}
      </div>
    </main>
  );
}
