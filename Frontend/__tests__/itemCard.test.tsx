import { render, screen } from "@testing-library/react";
import ItemCard from "../app/_components/ItemCard";

const itemBase = {
  id: 1,
  name: "Bayonet | Crimson Web",
  category: "COVERT KNIVES",
  price: 492.11,
  image: "/skins/Bayonet Crimson Web.png",
  wearLabel: "FN",
  floatValue: "0.0603",
};

describe("ItemCard", () => {
  // TESTE 1: SEM MOCK (Positivo)
  it("deve renderizar nome, categoria, condição e float da skin", () => {
    render(<ItemCard {...itemBase} />);

    expect(screen.getByText("★ Bayonet | Crimson Web")).toBeInTheDocument();
    expect(screen.getByText("COVERT KNIVES")).toBeInTheDocument();
    expect(screen.getByText("FN")).toBeInTheDocument();
    expect(screen.getByText("0.0603")).toBeInTheDocument();
  });

  // TESTE 2: SEM MOCK (Positivo)
  it("deve formatar o preço sempre com duas casas decimais", () => {
    const { rerender } = render(<ItemCard {...itemBase} price={100} />);
    expect(screen.getByText("$100.00")).toBeInTheDocument();

    rerender(<ItemCard {...itemBase} price={492.1} />);
    expect(screen.getByText("$492.10")).toBeInTheDocument();
  });
});
