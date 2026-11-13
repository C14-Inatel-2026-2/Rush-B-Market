import { render, screen } from "@testing-library/react";
import PlayersPage from "../app/players/page";
import { getPlayers, type Player } from "../lib/playersApi";

jest.mock("../lib/playersApi", () => ({ getPlayers: jest.fn() }));
jest.mock("../app/players/actions", () => ({ deletePlayerAction: jest.fn() }));
jest.mock("../app/players/CreatePlayerForm", () => function MockCreatePlayerForm() {
  return <div data-testid="create-player-form" />;
});

const mockGetPlayers = jest.mocked(getPlayers);
const players: Player[] = [
  { id: 12, email: "gabriel@example.com", createdAt: "2026-10-01T10:00:00" },
  { id: 15, email: "ana@example.com", createdAt: "2026-10-02T10:00:00" },
];

describe("Página de players", () => {
  beforeEach(() => mockGetPlayers.mockReset());

  it("renderiza os players retornados pela API", async () => {
    mockGetPlayers.mockResolvedValueOnce(players);

    render(await PlayersPage());

    expect(screen.getByRole("heading", { name: "PLAYERS (2)" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "gabriel@example.com" })).toHaveAttribute("href", "/players/12");
    expect(screen.getByRole("link", { name: "ana@example.com" })).toHaveAttribute("href", "/players/15");
    expect(screen.getByTestId("create-player-form")).toBeInTheDocument();
  });

  it("mostra o estado vazio quando não há players cadastrados", async () => {
    mockGetPlayers.mockResolvedValueOnce([]);

    render(await PlayersPage());

    expect(screen.getByRole("heading", { name: "PLAYERS (0)" })).toBeInTheDocument();
    expect(screen.getByText("NENHUM PLAYER CADASTRADO.")).toBeInTheDocument();
  });

  it("mostra erro quando a API está fora do ar", async () => {
    mockGetPlayers.mockRejectedValueOnce(new Error("API fora do ar"));

    render(await PlayersPage());

    expect(screen.getByRole("alert")).toHaveTextContent(/NÃO FOI POSSÍVEL CARREGAR OS PLAYERS/);
  });
});
