import { render, screen } from "@testing-library/react";
import SkinPage from "../app/skin/[id]/page";
import { getSkin, type SkinDetail } from "../lib/skinsApi";

jest.mock("../lib/skinsApi", () => ({ getSkin: jest.fn() }));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const mockGetSkin = jest.mocked(getSkin);
const skin: SkinDetail = {
  id: 7,
  name: "Karambit | Doppler",
  category: "COVERT KNIVES",
  price: 430.98,
  image: "/skins/Karambit Doppler.png",
  wearLabel: "MW",
  floatValue: "0.0786",
  rarity: "Covert",
  weapon: "Karambit",
  playerId: null,
};

describe("Página de detalhe da skin", () => {
  beforeEach(() => mockGetSkin.mockReset());

  it("renderiza os dados da skin retornados pela API", async () => {
    mockGetSkin.mockResolvedValueOnce(skin);

    render(await SkinPage({ params: Promise.resolve({ id: "7" }) }));

    expect(screen.getByRole("heading", { name: /Karambit \| Doppler/ })).toBeInTheDocument();
    expect(screen.getAllByText("COVERT KNIVES")).toHaveLength(2);
    expect(screen.getByText("DISPONÍVEL NO MERCADO")).toBeInTheDocument();
    expect(screen.getByText("$430.98")).toBeInTheDocument();
    expect(mockGetSkin).toHaveBeenCalledWith("7");
  });

  it("mostra erro quando a API está fora do ar", async () => {
    mockGetSkin.mockRejectedValueOnce(new Error("API fora do ar"));

    render(await SkinPage({ params: Promise.resolve({ id: "7" }) }));

    expect(screen.getByRole("alert")).toHaveTextContent(/NÃO FOI POSSÍVEL CARREGAR A SKIN/);
  });

  it("aciona a página 404 quando a skin não existe", async () => {
    mockGetSkin.mockResolvedValueOnce(null);

    await expect(SkinPage({ params: Promise.resolve({ id: "404" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
