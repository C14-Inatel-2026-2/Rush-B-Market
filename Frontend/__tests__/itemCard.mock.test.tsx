import { render, screen } from "@testing-library/react";
import ItemCard from "../app/_components/ItemCard";

// Mock: substituímos o next/image por um <img> simples para inspecionar
// as props recebidas, sem depender da otimização de imagens do Next.
const mockImage = jest.fn();

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; fill?: boolean }) => {
    mockImage(props);
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src || undefined} alt={props.alt} data-testid="skin-image" />;
  },
}));

const itemBase = {
  id: 1,
  name: "Bayonet | Crimson Web",
  category: "COVERT KNIVES",
  price: 492.11,
  image: "/skins/Bayonet Crimson Web.png",
  wearLabel: "FN",
  floatValue: "0.0603",
};

describe("ItemCard - testes com mock do next/image", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE 1: COM MOCK (Positivo)
  it("deve passar src, alt e fill corretos para o componente de imagem", () => {
    render(<ItemCard {...itemBase} />);

    expect(mockImage).toHaveBeenCalledTimes(1);
    expect(mockImage).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "/skins/Bayonet Crimson Web.png",
        alt: "Bayonet | Crimson Web",
        fill: true,
      })
    );
  });

  // TESTE 2: COM MOCK (Negativo)
  it("não deve quebrar o card quando a skin não possui imagem", () => {
    render(<ItemCard {...itemBase} image="" />);

    expect(mockImage).toHaveBeenCalledWith(expect.objectContaining({ src: "" }));
    expect(screen.getByText("★ Bayonet | Crimson Web")).toBeInTheDocument();
    expect(screen.getByText("$492.11")).toBeInTheDocument();
  });

  // TESTE 3: COM MOCK (Positivo)
  it("deve exibir a imagem mockada com o caminho original, sem otimização do Next", () => {
    render(<ItemCard {...itemBase} />);

    expect(screen.getByTestId("skin-image")).toHaveAttribute("src", "/skins/Bayonet Crimson Web.png");
  });

  // TESTE 4: COM MOCK (Negativo)
  it("não deve usar a categoria nem o preço como texto alternativo da imagem", () => {
    render(<ItemCard {...itemBase} />);

    const propsDaImagem = mockImage.mock.calls[0][0];
    expect(propsDaImagem.alt).not.toBe("COVERT KNIVES");
    expect(propsDaImagem.alt).not.toContain("492.11");
  });
});
