import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../app/_components/Header";

// Mock: substituímos o useState do React para controlar o estado do Header
// e verificar se ele chama os setters corretos, sem depender do estado real.
const mockUseState = jest.fn();

jest.mock("react", () => {
  const reactReal = jest.requireActual("react");
  return {
    ...reactReal,
    useState: (valorInicial: unknown) => mockUseState(valorInicial),
  };
});

const mockSetFiltroAtivo = jest.fn();
const mockSetBusca = jest.fn();

// O Header possui dois estados: o filtro ativo (inicia em "ALL") e a busca (inicia em "")
function mockarEstado(filtroAtivo: string, busca: string) {
  mockUseState.mockImplementation((valorInicial: unknown) => {
    if (valorInicial === "ALL") return [filtroAtivo, mockSetFiltroAtivo];
    return [busca, mockSetBusca];
  });
}

describe("Header - testes com mock do useState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE 1: COM MOCK (Positivo)
  it("deve marcar como ativo o filtro que vem do estado mockado", () => {
    mockarEstado("KNIVES", "");

    render(<Header />);

    expect(screen.getByRole("button", { name: "KNIVES" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "ALL" })).toHaveAttribute("aria-pressed", "false");
  });

  // TESTE 2: COM MOCK (Positivo)
  it("deve exibir no campo de busca o valor que vem do estado mockado", () => {
    mockarEstado("ALL", "KARAMBIT");

    render(<Header />);

    expect(screen.getByRole("searchbox", { name: "Buscar skin por ID" })).toHaveValue("KARAMBIT");
  });

  // TESTE 3: COM MOCK (Positivo)
  it("deve chamar o setter do filtro com a categoria clicada", () => {
    mockarEstado("ALL", "");

    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "COVERT" }));

    expect(mockSetFiltroAtivo).toHaveBeenCalledTimes(1);
    expect(mockSetFiltroAtivo).toHaveBeenCalledWith("COVERT");
  });

  // TESTE 4: COM MOCK (Positivo)
  it("deve chamar o setter da busca com o texto digitado", () => {
    mockarEstado("ALL", "");

    render(<Header />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin por ID" }), {
      target: { value: "AWP" },
    });

    expect(mockSetBusca).toHaveBeenCalledTimes(1);
    expect(mockSetBusca).toHaveBeenCalledWith("AWP");
  });

  // TESTE 5: COM MOCK (Negativo)
  it("não deve alterar o filtro quando o usuário apenas digita na busca", () => {
    mockarEstado("PISTOLS", "");

    render(<Header />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar skin por ID" }), {
      target: { value: "DEAGLE" },
    });

    expect(mockSetFiltroAtivo).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "PISTOLS" })).toHaveAttribute("aria-pressed", "true");
  });

  // TESTE 6: COM MOCK (Negativo)
  it("não deve alterar a busca quando o usuário apenas troca de filtro", () => {
    mockarEstado("ALL", "BAYONET");

    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "RIFLES" }));

    expect(mockSetBusca).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox", { name: "Buscar skin por ID" })).toHaveValue("BAYONET");
  });
});
