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
  it("mostra todas as skins e deixa ALL ativo ao abrir a vitrine", () => {
    renderMarket();

    expect(screen.getByRole("button", { name: "ALL" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("img").map((image) => image.getAttribute("alt"))).toEqual(
      items.map((item) => item.name),
    );
  });

  const categoryCases: Array<[string, string[]]> = [
    ["COVERT", ["Karambit | Doppler", "M4A4 | Howl"]],
    ["KNIVES", ["Karambit | Doppler"]],
    ["RIFLES", ["M4A4 | Howl"]],
    ["PISTOLS", ["Glock-18 | Fade"]],
  ];

  it.each(categoryCases)("filtra somente as skins da categoria %s", (category, expectedNames) => {
    renderMarket();

    fireEvent.click(screen.getByRole("button", { name: category }));

    expect(screen.getByRole("button", { name: category })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("img").map((image) => image.getAttribute("alt"))).toEqual(expectedNames);
  });

  it("filtra pelo nome sem diferenciar maiúsculas e minúsculas", () => {
    renderMarket();

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" }), {
      target: { value: "gLoCk" },
    });

    expect(screen.getByRole("img", { name: "Glock-18 | Fade" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Karambit | Doppler" })).not.toBeInTheDocument();
  });

  it("combina categoria e busca e mantém os itens que correspondem a ambas", () => {
    renderMarket();

    fireEvent.click(screen.getByRole("button", { name: "RIFLES" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" }), {
      target: { value: "hOwL" },
    });

    expect(screen.getAllByRole("img").map((image) => image.getAttribute("alt"))).toEqual(["M4A4 | Howl"]);
  });

  it("mostra a mensagem definida no critério quando não há resultados", () => {
    renderMarket();

    fireEvent.click(screen.getByRole("button", { name: "RIFLES" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" }), {
      target: { value: "Karambit" },
    });

    expect(screen.getByText("Nenhuma skin encontrada")).toBeInTheDocument();
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });
});
