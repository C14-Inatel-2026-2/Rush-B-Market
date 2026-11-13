import { render, screen } from "@testing-library/react";
import PlayerPage from "../app/players/[id]/page";
import { getPlayer, type PlayerWithSkins } from "../lib/playersApi";

jest.mock("../lib/playersApi", () => ({ getPlayer: jest.fn() }));
jest.mock("../app/players/actions", () => ({ deletePlayerAction: jest.fn() }));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const mockGetPlayer = jest.mocked(getPlayer);
const player: PlayerWithSkins = {
  id: 12,
  email: "gabriel@example.com",
  createdAt: "2026-10-01T10:00:00",
  skins: [
    {
      id: 7,
      name: "Karambit | Doppler",
      category: "COVERT KNIVES",
      price: 430.98,
      image: "/skins/Karambit Doppler.png",
      wearLabel: "MW",
      floatValue: "0.0786",
      rarity: "Covert",
      weapon: "Karambit",
      playerId: 12,
    },
  ],
};

async function renderPlayerPage() {
  const page = await PlayerPage({ params: Promise.resolve({ id: "12" }) });
  return render(page);
}

describe("Página de detalhe do player", () => {
  beforeEach(() => mockGetPlayer.mockReset());

  it("renderiza o player e as skins do inventário", async () => {
    mockGetPlayer.mockResolvedValueOnce(player);

    await renderPlayerPage();

    expect(screen.getByRole("heading", { name: "gabriel@example.com" })).toBeInTheDocument();
    expect(screen.getByText(/1\/5 SKINS/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Karambit | Doppler" })).toBeInTheDocument();
    expect(mockGetPlayer).toHaveBeenCalledWith("12");
  });

  it("mostra o estado vazio para um inventário sem skins", async () => {
    mockGetPlayer.mockResolvedValueOnce({ ...player, skins: [] });

    await renderPlayerPage();

    expect(screen.getByText("INVENTÁRIO VAZIO.")).toBeInTheDocument();
  });

  it("mostra erro quando a API está fora do ar", async () => {
    mockGetPlayer.mockRejectedValueOnce(new Error("API fora do ar"));

    render(await PlayerPage({ params: Promise.resolve({ id: "12" }) }));

    expect(screen.getByRole("alert")).toHaveTextContent(/NÃO FOI POSSÍVEL CARREGAR O PLAYER/);
  });

  it("aciona a página 404 quando o player não existe", async () => {
    mockGetPlayer.mockResolvedValueOnce(null);

    await expect(PlayerPage({ params: Promise.resolve({ id: "404" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
