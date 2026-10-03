import { render, screen } from "@testing-library/react";
import ItemCard from "../app/_components/ItemCard";
import type { Item } from "../data/mockItems";

// Mock: substituímos o next/image por uma <img> simples para isolar o ItemCard
// e verificar exatamente quais propriedades ele envia para o componente de imagem.
const mockImage = jest.fn();

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; fill?: boolean }) => {
    mockImage(props);
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} data-testid="imagem-mockada" />;
  },
}));

const itemBase: Item = {
  id: 7,
  name: "AWP | Oni Taiji",
  category: "COVERT RIFLES",
  price: 120.5,
  image: "/skins/AWP Oni Taiji.png",
  wearLabel: "MW",
  floatValue: "0.1123",
};

describe("ItemCard - testes com mock do next/image", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE 1: COM MOCK (Positivo)
  it("deve enviar o caminho da imagem e o nome da skin para o next/image", () => {
    render(<ItemCard {...itemBase} />);

    expect(mockImage).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "/skins/AWP Oni Taiji.png",
        alt: "AWP | Oni Taiji",
      })
    );
  });

  // TESTE 2: COM MOCK (Positivo)
  it("deve usar o modo fill para a imagem ocupar o container do card", () => {
    render(<ItemCard {...itemBase} />);

    expect(mockImage.mock.calls[0][0]).toHaveProperty("fill", true);
  });

  // TESTE 3: COM MOCK (Positivo)
  it("deve exibir a imagem mockada com o caminho original, sem otimização do Next", () => {
    render(<ItemCard {...itemBase} />);

    expect(screen.getByTestId("imagem-mockada")).toHaveAttribute("src", "/skins/AWP Oni Taiji.png");
  });

  // TESTE 4: COM MOCK (Negativo)
  it("não deve renderizar mais de uma imagem por card", () => {
    render(<ItemCard {...itemBase} />);

    expect(mockImage).toHaveBeenCalledTimes(1);
    expect(screen.getAllByTestId("imagem-mockada")).toHaveLength(1);
  });

  // TESTE 5: COM MOCK (Negativo)
  it("não deve usar a categoria nem o preço como texto alternativo da imagem", () => {
    render(<ItemCard {...itemBase} />);

    const propsDaImagem = mockImage.mock.calls[0][0];
    expect(propsDaImagem.alt).not.toBe("COVERT RIFLES");
    expect(propsDaImagem.alt).not.toContain("120.50");
  });
});
