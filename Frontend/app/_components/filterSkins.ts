import type { Item } from "../../data/mockItems";
import type { MarketFilter } from "./MarketFiltersContext";

export function filterSkins(items: Item[], activeFilter: MarketFilter, query: string): Item[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

  return items.filter((item) => {
    const matchesCategory =
      activeFilter === "ALL" ||
      (activeFilter === "COVERT"
        ? item.category.toUpperCase().startsWith("COVERT")
        : item.category.toUpperCase().endsWith(activeFilter));

    return matchesCategory && item.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
  });
}
