"use client";

import Link from "next/link";
import ItemCard from "./ItemCard";
import type { Item } from "../../data/mockItems";
import { useMarketFilters } from "./MarketFiltersContext";

// Grade responsiva de cards; cada card leva ao detalhe da skin (/skin/[id])
export default function SkinGrid({ items }: { items: Item[] }) {
  const { activeFilter, query } = useMarketFilters();
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeFilter === "ALL" ||
      (activeFilter === "COVERT"
        ? item.category.toUpperCase().startsWith("COVERT")
        : item.category.toUpperCase().endsWith(activeFilter));
    return matchesCategory && item.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
  });

  if (filteredItems.length === 0) {
    return <p className="text-[11px] tracking-[0.1em] text-[#5a6069]">NENHUMA SKIN ENCONTRADA.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {filteredItems.map((item) => (
        <Link key={item.id} href={`/skin/${item.id}`} className="grid min-w-0 grid-cols-1">
          <ItemCard
            name={item.name}
            category={item.category}
            price={item.price}
            image={item.image}
            wearLabel={item.wearLabel}
            floatValue={item.floatValue}
          />
        </Link>
      ))}
    </div>
  );
}
