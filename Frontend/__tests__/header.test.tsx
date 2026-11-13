import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../app/_components/Header";
import { MarketFiltersProvider } from "../app/_components/MarketFiltersContext";

const FILTROS = ["ALL", "COVERT", "KNIVES", "RIFLES", "PISTOLS"];

function renderHeader() {
  return render(
    <MarketFiltersProvider>
      <Header />
    </MarketFiltersProvider>
  );
}

describe("Header - testes unitários (sem mock)", () => {
  // TESTE 1: SEM MOCK (Positivo)
  it("deve renderizar o logo e os indicadores de mercado", () => {
    renderHeader();

    expect(screen.getByText("AX")).toBeInTheDocument();
    expect(screen.getByText("STAKED VALUE")).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
    expect(screen.getByText("+4.7%")).toBeInTheDocument();
    expect(screen.getByText("LISTINGS INDEXED")).toBeInTheDocument();
    expect(screen.getByText("160")).toBeInTheDocument();
  });

  // TESTE 2: SEM MOCK (Positivo)
  it("deve renderizar os 5 filtros com ALL ativo por padrão", () => {
    renderHeader();

    const botoes = screen.getAllByRole("button");
    expect(botoes).toHaveLength(FILTROS.length);

    // Apenas o filtro ALL começa pressionado
    FILTROS.forEach((filtro) => {
      const botao = screen.getByRole("button", { name: filtro });
      expect(botao).toHaveAttribute("aria-pressed", filtro === "ALL" ? "true" : "false");
    });
  });

  // TESTE 3: SEM MOCK (Positivo)
  it("deve ativar o filtro clicado e desativar o anterior", () => {
    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: "RIFLES" }));

    expect(screen.getByRole("button", { name: "RIFLES" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "ALL" })).toHaveAttribute("aria-pressed", "false");

    // Nunca deve existir mais de um filtro ativo ao mesmo tempo
    const ativos = screen
      .getAllByRole("button")
      .filter((botao) => botao.getAttribute("aria-pressed") === "true");
    expect(ativos).toHaveLength(1);
  });

  // TESTE 4: SEM MOCK (Positivo)
  it("deve atualizar o campo de busca conforme o usuário digita", () => {
    renderHeader();

    const busca = screen.getByRole("searchbox", { name: "Buscar skin pelo nome" });
    expect(busca).toHaveValue("");

    fireEvent.change(busca, { target: { value: "AWP" } });

    expect(busca).toHaveValue("AWP");
  });

  // TESTE 5: SEM MOCK (Negativo)
  it("não deve recarregar a página ao enviar o formulário de busca", () => {
    renderHeader();

    const formulario = screen.getByRole("search");

    // fireEvent retorna false quando o componente chamou event.preventDefault()
    const eventoNaoCancelado = fireEvent.submit(formulario);

    expect(eventoNaoCancelado).toBe(false);
  });

  // TESTE 6: SEM MOCK (Negativo)
  it("não deve exibir variação percentual para indicadores sem delta", () => {
    renderHeader();

    // Só o STAKED VALUE possui delta; o LISTINGS INDEXED não pode exibir porcentagem
    expect(screen.getAllByText(/%/)).toHaveLength(1);
  });
});
