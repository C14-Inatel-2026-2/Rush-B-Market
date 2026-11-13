import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { mockItems } from "../data/mockItems";
import { MarketFiltersProvider } from "../app/_components/MarketFiltersContext";
import type { Item } from "../data/mockItems";

// A página busca as skins na API: aqui a API devolve os dados de exemplo
jest.mock("../lib/skinsApi", () => ({
  getSkins: jest.fn(async () => mockItems),
}));

// Mock 1: ItemCard substituído para capturar as props que a grade envia para cada card
const mockItemCard = jest.fn();

jest.mock("../app/_components/ItemCard", () => ({
  __esModule: true,
  default: (props: Omit<Item, "id">) => {
    mockItemCard(props);
    return <div data-testid="item-card">{props.name}</div>;
  },
}));

// Mock 2: dados controlados para a grade
jest.mock("../data/mockItems", () => ({
  mockItems: [
    {
      id: 10,
      name: "Karambit | Doppler",
      category: "COVERT KNIVES",
      price: 430.98,
      image: "/skins/Karambit Doppler Blue.png",
      wearLabel: "MW",
      floatValue: "0.0786",
    },
    {
      id: 20,
      name: "M4A4 | Royal Paladin",
      category: "COVERT RIFLES",
      price: 35.1,
      image: "/skins/M4A4 Royal Paladin.png",
      wearLabel: "FT",
      floatValue: "0.2210",
    },
    {
      id: 30,
      name: "Sport Gloves | Omega",
      category: "EXTRAORDINARY GLOVES",
      price: 210,
      image: "/skins/Sport Gloves Omega.png",
      wearLabel: "BS",
      floatValue: "0.5012",
    },
  ],
}));

function propsRecebidas() {
  return mockItemCard.mock.calls.map(([props]) => props);
}

describe("Grid da página principal - testes com mock", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve enviar para cada card exatamente os dados do seu item", async () => {
    render(<MarketFiltersProvider>{await Home()}</MarketFiltersProvider>);

    const props = propsRecebidas();
    expect(props).toHaveLength(mockItems.length);

    mockItems.forEach(({ id, ...dadosDoCard }, indice) => {
      expect(props[indice]).toEqual(dadosDoCard);
    });
  });

  it("deve renderizar os cards na mesma ordem dos dados", async () => {
    render(<MarketFiltersProvider>{await Home()}</MarketFiltersProvider>);

    const nomes = screen.getAllByTestId("item-card").map((card) => card.textContent);
    expect(nomes).toEqual(["Karambit | Doppler", "M4A4 | Royal Paladin", "Sport Gloves | Omega"]);
  });

  it("deve repassar o preço como número, deixando a formatação para o card", async () => {
    render(<MarketFiltersProvider>{await Home()}</MarketFiltersProvider>);

    expect(propsRecebidas()[2].price).toBe(210);
  });

  it("não deve repassar o id do item como propriedade do card", async () => {
    render(<MarketFiltersProvider>{await Home()}</MarketFiltersProvider>);

    propsRecebidas().forEach((props) => {
      expect(props).not.toHaveProperty("id");
    });
  });

  it("não deve renderizar cards duplicados ao renderizar a página", async () => {
    render(<MarketFiltersProvider>{await Home()}</MarketFiltersProvider>);

    expect(mockItemCard).toHaveBeenCalledTimes(mockItems.length);
    expect(screen.getAllByTestId("item-card")).toHaveLength(mockItems.length);
  });
});
