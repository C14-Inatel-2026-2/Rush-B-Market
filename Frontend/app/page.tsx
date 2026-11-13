import SkinGrid from "./_components/SkinGrid";
import { getSkins } from "../lib/skinsApi";
import type { Item } from "../data/mockItems";

// A vitrine busca as skins a cada requisicao. Sem isso o `next build` tentaria
// pre-renderizar a pagina chamando a API, e o build (J4) quebraria sem backend.
export const dynamic = "force-dynamic";

export default async function Home() {
  let items: Item[];
  try {
    items = await getSkins();
  } catch {
    return (
      <main className="flex-1 p-6 md:p-8">
        <p role="alert" className="mx-auto max-w-7xl font-mono text-[11px] tracking-[0.15em] text-[#d4a72c]">
          NÃO FOI POSSÍVEL CARREGAR AS SKINS. VERIFIQUE SE A API ESTÁ NO AR.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <SkinGrid items={items} />
      </div>
    </main>
  );
}
