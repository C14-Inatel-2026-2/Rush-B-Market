import { categoryFor, toItem, wearFromFloat, type SkinResponse } from "../lib/skinsApi";

const skin: SkinResponse = {
  id: 7,
  name: "Karambit | Doppler",
  floatValue: "0.02",
  price: 950,
  rarity: "Covert",
  weapon: "Knife",
  playerId: null,
};

describe("skinsApi - mapeamento da resposta da API para Item", () => {
  it("converte o float na sigla de condição", () => {
    expect(wearFromFloat("0.02")).toBe("FN");
    expect(wearFromFloat("0.07")).toBe("MW");
    expect(wearFromFloat("0.15")).toBe("FT");
    expect(wearFromFloat("0.38")).toBe("WW");
    expect(wearFromFloat("0.45")).toBe("BS");
  });

  it("retorna '?' quando o float é inválido", () => {
    expect(wearFromFloat("abc")).toBe("?");
  });

  it("monta a categoria com raridade e grupo da arma", () => {
    expect(categoryFor("Covert", "Knife")).toBe("COVERT KNIVES");
    expect(categoryFor("Restricted", "Glock-18")).toBe("RESTRICTED PISTOLS");
    expect(categoryFor("Classified", "AK-47")).toBe("CLASSIFIED RIFLES");
    expect(categoryFor("Restricted", "Five-Seven")).toBe("RESTRICTED PISTOLS");
  });

  it("mapeia a skin da API para o formato usado pelo ItemCard", () => {
    expect(toItem(skin, "/skins/x.png")).toEqual({
      id: 7,
      name: "Karambit | Doppler",
      category: "COVERT KNIVES",
      price: 950,
      image: "/skins/x.png",
      wearLabel: "FN",
      floatValue: "0.02",
    });
  });
});
