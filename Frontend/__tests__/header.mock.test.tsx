import { fireEvent, render, screen } from "@testing-library/react";
import Header from "../app/_components/Header";
import { useMarketFilters } from "../app/_components/MarketFiltersContext";

// Mock: o Header lê o filtro e a busca do contexto. Aqui o contexto é falso,
// para controlar os valores e conferir quais funções o Header chama.
jest.mock("../app/_components/MarketFiltersContext", () => ({
  MARKET_FILTERS: ["ALL", "COVERT", "KNIVES", "RIFLES", "PISTOLS"],
  useMarketFilters: jest.fn(),
}));

const mockUseMarketFilters = jest.mocked(useMarketFilters);
const mockSetActiveFilter = jest.fn();
const mockSetQuery = jest.fn();

function mockarFiltros(activeFilter = "ALL", query = "") {
  mockUseMarketFilters.mockReturnValue({
    activeFilter: activeFilter as "ALL" | "COVERT" | "KNIVES" | "RIFLES" | "PISTOLS",
    setActiveFilter: mockSetActiveFilter,
    query,
    setQuery: mockSetQuery,
  });
}

describe("Header - testes com filtros mockados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockarFiltros();
  });

  // TESTE 1: COM MOCK (Positivo)
  it("marca o filtro ativo informado pelo contexto", () => {
    mockarFiltros("KNIVES");

    render(<Header />);

    expect(screen.getByRole("button", { name: "KNIVES" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "ALL" })).toHaveAttribute("aria-pressed", "false");
  });

  // TESTE 2: COM MOCK (Positivo)
  it("mostra o texto de busca vindo do contexto", () => {
    mockarFiltros("ALL", "KARAMBIT");

    render(<Header />);

    expect(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" })).toHaveValue("KARAMBIT");
  });

  // TESTE 3: COM MOCK (Positivo)
  it("envia ao contexto a categoria escolhida", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "COVERT" }));

    expect(mockSetActiveFilter).toHaveBeenCalledWith("COVERT");
  });

  // TESTE 4: COM MOCK (Positivo)
  it("envia ao contexto o nome digitado", () => {
    render(<Header />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" }), {
      target: { value: "AWP" },
    });

    expect(mockSetQuery).toHaveBeenCalledWith("AWP");
  });

  // TESTE 5: COM MOCK (Negativo)
  it("não altera o filtro quando o usuário só digita na busca", () => {
    mockarFiltros("PISTOLS");

    render(<Header />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" }), {
      target: { value: "DEAGLE" },
    });

    expect(mockSetActiveFilter).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "PISTOLS" })).toHaveAttribute("aria-pressed", "true");
  });

  // TESTE 6: COM MOCK (Negativo)
  it("não altera a busca quando o usuário só troca de filtro", () => {
    mockarFiltros("ALL", "BAYONET");

    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "RIFLES" }));

    expect(mockSetQuery).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" })).toHaveValue("BAYONET");
  });
});
