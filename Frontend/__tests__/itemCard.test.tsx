import { render, screen } from "@testing-library/react";
import ItemCard from "../app/_components/ItemCard";
import type { Item } from "../data/mockItems";

const itemBase: Item = {
  id: 1,
  name: "Bayonet | Crimson Web",
  category: "COVERT KNIVES",
  price: 492.11,
  image: "/skins/Bayonet Crimson Web.png",
  wearLabel: "FN",
  floatValue: "0.0603",
};

describe("ItemCard - testes unitários (sem mock)", () => {
  // TESTE 1: SEM MOCK (Positivo)
  it("deve renderizar nome, categoria, condição e float da skin", () => {
    render(<ItemCard {...itemBase} />);

    expect(screen.getByText("★ Bayonet | Crimson Web")).toBeInTheDocument();
    expect(screen.getByText("COVERT KNIVES")).toBeInTheDocument();
    expect(screen.getByText("FN")).toBeInTheDocument();
    expect(screen.getByText("0.0603")).toBeInTheDocument();
  });

  // TESTE 2: SEM MOCK (Positivo)
  it("deve renderizar a imagem da skin usando o nome como texto alternativo", () => {
    render(<ItemCard {...itemBase} />);

    expect(screen.getByRole("img", { name: "Bayonet | Crimson Web" })).toBeInTheDocument();
  });

  // TESTE 3: SEM MOCK (Positivo)
  it("deve formatar o preço com cifrão e duas casas decimais", () => {
    render(<ItemCard {...itemBase} price={9.5} />);

    expect(screen.getByText("$9.50")).toBeInTheDocument();
  });

  // TESTE 4: SEM MOCK (Negativo)
  it("não deve exibir preço inteiro sem as casas decimais", () => {
    render(<ItemCard {...itemBase} price={50} />);

    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.queryByText("$50")).not.toBeInTheDocument();
  });

  // TESTE 5: SEM MOCK (Negativo)
  it("não deve exibir mais de duas casas decimais no preço", () => {
    render(<ItemCard {...itemBase} price={12.3456} />);

    expect(screen.getByText("$12.35")).toBeInTheDocument();
    expect(screen.queryByText("$12.3456")).not.toBeInTheDocument();
  });

  // TESTE 6: SEM MOCK (Negativo)
  it("não deve quebrar a renderização quando o preço for zero", () => {
    render(<ItemCard {...itemBase} price={0} />);

    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
