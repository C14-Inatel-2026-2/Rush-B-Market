import Link from "next/link";
import { getPlayers, type Player } from "../../lib/playersApi";
import { deletePlayerAction } from "./actions";
import CreatePlayerForm from "./CreatePlayerForm";

export const dynamic = "force-dynamic";

const date = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

export default async function PlayersPage() {
  let players: Player[];
  try {
    players = await getPlayers();
  } catch {
    return (
      <main className="flex-1 p-6 font-mono md:p-8">
        <p role="alert" className="mx-auto max-w-4xl text-[11px] tracking-[0.15em] text-[#d4a72c]">
          NÃO FOI POSSÍVEL CARREGAR OS PLAYERS. VERIFIQUE SE A API ESTÁ NO AR.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 font-mono md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-[13px] tracking-[0.2em] text-[#e8eaed]">PLAYERS ({players.length})</h1>

        <CreatePlayerForm />

        {players.length === 0 ? (
          <p className="text-[11px] tracking-[0.1em] text-[#5a6069]">NENHUM PLAYER CADASTRADO.</p>
        ) : (
          <ul className="divide-y divide-white/5 border border-[#2a2f37]">
            {players.map((player) => (
              <li key={player.id} className="flex items-center gap-4 bg-[#0d1014] px-3 py-2 text-[11px] tracking-[0.1em]">
                <span className="w-8 text-[#5a6069]">#{player.id}</span>
                <Link href={`/players/${player.id}`} className="flex-1 truncate text-[#d4d7dd] hover:text-[#35c9d8]">
                  {player.email}
                </Link>
                <span className="hidden text-[#5a6069] sm:inline">{date(player.createdAt)}</span>
                <form action={deletePlayerAction}>
                  <input type="hidden" name="id" value={player.id} />
                  <button
                    type="submit"
                    aria-label={`Excluir ${player.email}`}
                    className="border border-[#2a2f37] px-2 py-1 text-[10px] tracking-[0.15em] text-[#5a6069] hover:border-[#e05d5d] hover:text-[#e05d5d]"
                  >
                    EXCLUIR
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
