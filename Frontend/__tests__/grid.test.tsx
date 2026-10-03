import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { mockItems } from "../data/mockItems";

// Testes da grade da página principal usando os componentes e dados reais
function renderizarGrade() {
  const { container } = render(<Home />);
  return container.querySelector(".grid") as HTMLElement;
}

describe("Grid da página principal - testes unitários (sem mock)", () => {
  // TESTE 1: SEM MOCK (Positivo)
  it("deve renderizar um card para cada item da loja", () => {
    const grade = renderizarGrade();

    expect(grade.children).toHaveLength(mockItems.length);
    expect(screen.getAllByRole("img")).toHaveLength(mockItems.length);
  });

  // TESTE 2: SEM MOCK (Positivo)
  it("deve aplicar as colunas responsivas na grade", () => {
    const grade = renderizarGrade();

    expect(grade).toHaveClass(
      "grid",
      "grid-cols-2",
      "sm:grid-cols-3",
      "md:grid-cols-4",
      "lg:grid-cols-5",
      "xl:grid-cols-6"
    );
  });

  // TESTE 3: SEM MOCK (Positivo)
  it("deve exibir os itens na mesma ordem dos dados", () => {
    renderizarGrade();

    const nomesNaTela = screen.getAllByRole("img").map((imagem) => imagem.getAttribute("alt"));
    expect(nomesNaTela).toEqual(mockItems.map((item) => item.name));
  });

  // TESTE 4: SEM MOCK (Positivo)
  it("deve renderizar a grade dentro da área principal da página", () => {
    const grade = renderizarGrade();

    expect(screen.getByRole("main")).toContainElement(grade);
  });

  // TESTE 5: SEM MOCK (Negativo)
  it("não deve possuir itens com id repetido na grade", () => {
    const ids = mockItems.map((item) => item.id);

    // ids repetidos quebram a key do React e podem duplicar ou sumir cards
    expect(new Set(ids).size).toBe(ids.length);
  });

  // TESTE 6: SEM MOCK (Negativo)
  it("não deve exibir itens com preço negativo", () => {
    renderizarGrade();

    expect(screen.queryByText(/^\$-/)).not.toBeInTheDocument();
  });
});
