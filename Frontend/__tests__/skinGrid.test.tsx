import { render, screen } from "@testing-library/react";
import SkinGrid from "../app/_components/SkinGrid";
import { mockItems } from "../data/mockItems";

describe("SkinGrid", () => {
  it("cada card leva para a página de detalhe da sua skin", () => {
    render(<SkinGrid items={mockItems.slice(0, 3)} />);

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      mockItems.slice(0, 3).map((item) => `/skin/${item.id}`),
    );
  });
});
