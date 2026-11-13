import { categoryFor, findImageFile, toItem, wearFromFloat, type SkinResponse } from "../lib/skinsApi";

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

describe("skinsApi - cruzamento do nome da skin com as imagens", () => {
  const files = [
    "AWP LongDog.png",
    "Karambit Doppler Blue.png",
    "Karambit Doppler Red.png",
    "Moto Gloves  Turtle.png",
    "M4A4 Royal Paladin.png",
  ];

  it("encontra a imagem com o mesmo nome, ignorando '|', espaços e maiúsculas", () => {
    expect(findImageFile("M4A4 | Royal Paladin", files)).toBe("M4A4 Royal Paladin.png");
    expect(findImageFile("moto gloves | turtle", files)).toBe("Moto Gloves  Turtle.png");
  });

  it("usa a primeira variante quando só existe imagem com sufixo (ex: Blue)", () => {
    expect(findImageFile("Karambit | Doppler", files)).toBe("Karambit Doppler Blue.png");
  });

  it("não usa imagem de outra skin da mesma arma", () => {
    expect(findImageFile("AWP | Dragon Lore", files)).toBeNull();
  });

  it("não casa nome que é só prefixo parcial de outra palavra", () => {
    expect(findImageFile("AWP | Long", files)).toBeNull();
  });
});
