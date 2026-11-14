import { createPlayer, errorMessageFrom, getPlayer } from "../lib/playersApi";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

function resposta(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

describe("playersApi", () => {
  beforeEach(() => mockFetch.mockReset());

  it("junta as mensagens de validação do backend", () => {
    const body = { errors: { email: "Email must be valid", password: "Password must have at least 6 characters" } };
    expect(errorMessageFrom(body, 400)).toBe("Email must be valid · Password must have at least 6 characters");
  });

  it("usa a mensagem do ErrorResponse", () => {
    expect(errorMessageFrom({ message: "Email already exists" }, 409)).toBe("Email already exists");
  });

  it("usa o status como fallback quando o corpo não tem mensagem", () => {
    expect(errorMessageFrom(null, 500)).toBe("Erro 500");
  });

  it("envia e-mail e senha no POST /players e devolve o player criado", async () => {
    mockFetch.mockResolvedValue(resposta(201, { id: 9, email: "novo@rushb.com", createdAt: "2026-11-13T12:00:00" }));

    const result = await createPlayer("novo@rushb.com", "senha123");

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/players$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ email: "novo@rushb.com", password: "senha123" });
    expect(result).toEqual({ ok: true, player: expect.objectContaining({ id: 9 }) });
  });

  it("devolve o erro do backend quando o e-mail já existe (409)", async () => {
    mockFetch.mockResolvedValue(resposta(409, { message: "Email already exists" }));

    expect(await createPlayer("bruno@rushb.com", "senha123")).toEqual({ ok: false, error: "Email already exists" });
  });

  it("devolve null quando o player não existe (404)", async () => {
    mockFetch.mockResolvedValue(resposta(404, { message: "Player not found" }));

    expect(await getPlayer(999)).toBeNull();
  });

  it("converte as skins do player para o formato dos cards", async () => {
    mockFetch.mockResolvedValue(
      resposta(200, {
        id: 1,
        email: "bruno@rushb.com",
        createdAt: "2026-11-13T12:00:00",
        skins: [{ id: 1, name: "AK-47 | Redline", floatValue: "0.15", price: 45.99, rarity: "Classified", weapon: "AK-47", playerId: 1 }],
      }),
    );

    const player = await getPlayer(1);

    expect(player?.skins[0]).toMatchObject({ category: "CLASSIFIED RIFLES", wearLabel: "FT", playerId: 1 });
  });
});
