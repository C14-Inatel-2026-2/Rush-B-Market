import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { mockItems } from "../data/mockItems";

// A página busca as skins na API: aqui a API devolve os dados de exemplo
jest.mock("../lib/skinsApi", () => ({
  getSkins: jest.fn(async () => mockItems),
}));

// Testes da grade da página principal usando os componentes e dados reais
async function renderizarGrade() {
  const { container } = render(await Home());
  return container.querySelector(".grid") as HTMLElement;
}

describe("Grid da página principal - testes sem mock de componentes (API simulada)", () => {
  // TESTE 1: SEM MOCK (Positivo)
  it("deve renderizar um card para cada item da loja", async () => {
    const grade = await renderizarGrade();

    expect(grade.children).toHaveLength(mockItems.length);
    expect(screen.getAllByRole("img")).toHaveLength(mockItems.length);
  });

  // TESTE 2: SEM MOCK (Positivo)
  it("deve aplicar as colunas responsivas na grade", async () => {
    const grade = await renderizarGrade();

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
  it("deve exibir os itens na mesma ordem dos dados", async () => {
    await renderizarGrade();

    const nomesNaTela = screen.getAllByRole("img").map((imagem) => imagem.getAttribute("alt"));
    expect(nomesNaTela).toEqual(mockItems.map((item) => item.name));
  });

  // TESTE 4: SEM MOCK (Positivo)
  it("deve renderizar a grade dentro da área principal da página", async () => {
    const grade = await renderizarGrade();

    expect(screen.getByRole("main")).toContainElement(grade);
  });

  // TESTE 5: SEM MOCK (Negativo)
  it("não deve possuir itens com id repetido na grade", async () => {
    await renderizarGrade();

    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));

    // ids repetidos quebram a key do React e podem duplicar ou sumir cards
    expect(hrefs).toHaveLength(mockItems.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  // TESTE 6: SEM MOCK (Negativo)
  it("não deve exibir itens com preço negativo", async () => {
    await renderizarGrade();

    expect(screen.queryByText(/^\$-/)).not.toBeInTheDocument();
  });
});
