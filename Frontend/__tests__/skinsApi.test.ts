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
  it.each([
    ["0.02", "FN"],
    ["0.07", "MW"],
    ["0.15", "FT"],
    ["0.38", "WW"],
    ["0.45", "BS"],
    ["abc", "?"],
  ])("converte o float %s na sigla de condição %s", (floatValue, wear) => {
    expect(wearFromFloat(floatValue)).toBe(wear);
  });

  it.each([
    ["Covert", "Knife", "COVERT KNIVES"],
    ["Restricted", "Glock-18", "RESTRICTED PISTOLS"],
    ["Classified", "AK-47", "CLASSIFIED RIFLES"],
    ["Restricted", "Five-Seven", "RESTRICTED PISTOLS"],
  ])("monta a categoria de %s + %s como %s", (rarity, weapon, category) => {
    expect(categoryFor(rarity, weapon)).toBe(category);
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
