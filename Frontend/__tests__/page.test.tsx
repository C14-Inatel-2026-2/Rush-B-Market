import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { mockItems } from "../data/mockItems";

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
  it("deve renderizar a grade de itens corretamente quando mockItems possui dados", () => {
    // Injetamos 2 itens no array controlado pelo mock
    mockItems.push(
      { id: 1, name: "Item 1", price: 100 } as any,
      { id: 2, name: "Item 2", price: 200 } as any
    );
    
    render(<Home />);
    
    // Busca todos os componentes renderizados com o test ID do mock
    const cards = screen.getAllByTestId("item-card");
    
    // Valida se o map() percorreu e desenhou exatamente os 2 itens
    expect(cards).toHaveLength(2);
  });

  // TESTE 4: COM MOCK E NEGATIVO
  it("não deve renderizar cards e não deve quebrar a tela quando mockItems estiver vazio", () => {
    // Esvaziamos o array para simular um cenário negativo de dados
    mockItems.length = 0;
    
    render(<Home />);
    
    // queryAllByTestId não quebra o teste se não achar nada (retorna array vazio)
    const cards = screen.queryAllByTestId("item-card");
    
    // Valida o comportamento amigável: a lista está limpa e a página não apresentou crash
    expect(cards).toHaveLength(0);
  });
});