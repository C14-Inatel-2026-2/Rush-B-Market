import { fireEvent, render, screen } from "@testing-library/react";
import Header from "../app/_components/Header";
import { useMarketFilters } from "../app/_components/MarketFiltersContext";

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

  it("marca o filtro ativo informado pelo contexto", () => {
    mockarFiltros("KNIVES");

    render(<Header />);

    expect(screen.getByRole("button", { name: "KNIVES" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "ALL" })).toHaveAttribute("aria-pressed", "false");
  });

  it("mostra o texto de busca vindo do contexto", () => {
    mockarFiltros("ALL", "KARAMBIT");

    render(<Header />);

    expect(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" })).toHaveValue("KARAMBIT");
  });

  it("envia ao contexto a categoria escolhida", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "COVERT" }));

    expect(mockSetActiveFilter).toHaveBeenCalledWith("COVERT");
  });

  it("envia ao contexto o nome digitado", () => {
    render(<Header />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin pelo nome" }), {
      target: { value: "AWP" },
    });

    expect(mockSetQuery).toHaveBeenCalledWith("AWP");
  });
});
