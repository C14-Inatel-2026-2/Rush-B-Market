import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkin } from "../../../lib/skinsApi";

export const dynamic = "force-dynamic";

export default async function SkinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const skin = await getSkin(id);
  if (!skin) notFound();

  const rows: [string, React.ReactNode][] = [
    ["ARMA", skin.weapon],
    ["RARIDADE", skin.rarity],
    ["CATEGORIA", skin.category],
    ["CONDIÇÃO", skin.wearLabel],
    ["FLOAT", skin.floatValue],
    [
      "DONO",
      skin.playerId == null ? (
        <span className="text-[#4ecb71]">DISPONÍVEL NO MERCADO</span>
      ) : (
        <Link href={`/players/${skin.playerId}`} className="text-[#35c9d8] hover:underline">
          PLAYER #{skin.playerId}
        </Link>
      ),
    ],
  ];

  return (
    <main className="flex-1 p-6 font-mono md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/" className="text-[10px] tracking-[0.15em] text-[#5a6069] hover:text-[#35c9d8]">
          ← MERCADO
        </Link>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] border border-[#2a2f37] bg-[#0d1014]">
            <Image src={skin.image} alt={skin.name} fill priority sizes="(min-width: 768px) 448px, 100vw" className="object-contain p-6" />
          </div>

          <div className="flex flex-col">
            <div className="text-[10px] tracking-[0.15em] text-[#5a6069]">{skin.category}</div>
            <h1 className="mt-1 text-[18px] tracking-[0.08em] text-[#e8eaed]">★ {skin.name}</h1>
            <div className="mt-4 text-[24px] text-[#d4a72c]">${skin.price.toFixed(2)}</div>

            <dl className="mt-6 divide-y divide-white/5 border-y border-white/5 text-[11px] tracking-[0.1em]">
              {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2">
                  <dt className="text-[#5a6069]">{label}</dt>
                  <dd className="text-right text-[#d4d7dd]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
