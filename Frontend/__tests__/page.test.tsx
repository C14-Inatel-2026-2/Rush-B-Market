import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { mockItems, type Item } from "../data/mockItems";
import { getSkins } from "../lib/skinsApi";
import { MarketFiltersProvider } from "../app/_components/MarketFiltersContext";

const mockGetSkins = jest.mocked(getSkins);

function createMockItem(id: number, name: string, price: number): Item {
  return {
    id,
    name,
    category: "COVERT RIFLES",
    price,
    image: `/skins/item-${id}.png`,
    wearLabel: "FN",
    floatValue: "0.01",
  };
}

async function renderHome() {
  return render(<MarketFiltersProvider>{await Home()}</MarketFiltersProvider>);
}

// A página busca as skins na API: aqui a API devolve os dados de exemplo
jest.mock("../lib/skinsApi", () => ({
  getSkins: jest.fn(async () => mockItems),
}));

// Mock 1: Isolamos o Componente ItemCard para testar apenas a lógica do page.tsx
jest.mock("../app/_components/ItemCard", () => {
  return function MockItemCard() {
    return <div data-testid="item-card">Mock Card</div>;
  };
});

// Mock 2: Controlamos os dados estáticos que a página consome
jest.mock("../data/mockItems", () => ({
  mockItems: []
}));

describe("Home Page", () => {
  
  // TESTE 3: COM MOCK (Positivo)
  it("deve renderizar a grade de itens corretamente quando mockItems possui dados", async () => {
    // Injetamos 2 itens no array controlado pelo mock
    mockItems.push(createMockItem(1, "Item 1", 100), createMockItem(2, "Item 2", 200));
    
    await renderHome();
    
    // Busca todos os componentes renderizados com o test ID do mock
    const cards = screen.getAllByTestId("item-card");
    
    // Valida se o map() percorreu e desenhou exatamente os 2 itens
    expect(cards).toHaveLength(2);
  });

  // TESTE 4: COM MOCK E NEGATIVO
  it("não deve renderizar cards e não deve quebrar a tela quando mockItems estiver vazio", async () => {
    // Esvaziamos o array para simular um cenário negativo de dados
    mockItems.length = 0;
    
    await renderHome();
    
    // queryAllByTestId não quebra o teste se não achar nada (retorna array vazio)
    const cards = screen.queryAllByTestId("item-card");
    
    // Valida o comportamento amigável: a lista está limpa e a página não apresentou crash
    expect(cards).toHaveLength(0);
  });

  // TESTE 5: COM MOCK E NEGATIVO
  it("deve exibir mensagem de erro e nenhum card quando a API falhar", async () => {
    mockGetSkins.mockRejectedValueOnce(new Error("API fora do ar"));

    await renderHome();

    expect(screen.getByRole("alert")).toHaveTextContent(/NÃO FOI POSSÍVEL CARREGAR AS SKINS/);
    expect(screen.queryAllByTestId("item-card")).toHaveLength(0);
  });
});
