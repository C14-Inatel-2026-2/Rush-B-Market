import { fireEvent, render, screen } from "@testing-library/react";
import Header from "../app/_components/Header";
import SkinGrid from "../app/_components/SkinGrid";
import { MarketFiltersProvider } from "../app/_components/MarketFiltersContext";
import type { Item } from "../data/mockItems";

const items: Item[] = [
  {
    id: 1,
    name: "Karambit | Doppler",
    category: "COVERT KNIVES",
    price: 100,
    image: "/skins/karambit.png",
    wearLabel: "FN",
    floatValue: "0.01",
  },
  {
    id: 2,
    name: "M4A4 | Howl",
    category: "COVERT RIFLES",
    price: 200,
    image: "/skins/howl.png",
    wearLabel: "MW",
    floatValue: "0.1",
  },
  {
    id: 3,
    name: "Glock-18 | Fade",
    category: "CLASSIFIED PISTOLS",
    price: 50,
    image: "/skins/glock.png",
    wearLabel: "FT",
    floatValue: "0.2",
  },
];

function renderMarket() {
  return render(
    <MarketFiltersProvider>
      <Header />
      <main>
        <SkinGrid items={items} />
      </main>
    </MarketFiltersProvider>
  );
}

describe("Filtros e busca da vitrine", () => {
  it("filtra pela categoria selecionada", () => {
    renderMarket();

    fireEvent.click(screen.getByRole("button", { name: "KNIVES" }));

    expect(screen.getByRole("img", { name: "Karambit | Doppler" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "M4A4 | Howl" })).not.toBeInTheDocument();
  });

  it("filtra pelo nome sem diferenciar maiúsculas e minúsculas", () => {
    renderMarket();

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" }), {
      target: { value: "gLoCk" },
    });

    expect(screen.getByRole("img", { name: "Glock-18 | Fade" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Karambit | Doppler" })).not.toBeInTheDocument();
  });

  it("combina categoria e nome e informa quando não há resultados", () => {
    renderMarket();

    fireEvent.click(screen.getByRole("button", { name: "RIFLES" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" }), {
      target: { value: "Karambit" },
    });

    expect(screen.getByText("NENHUMA SKIN ENCONTRADA.")).toBeInTheDocument();
  });
});
