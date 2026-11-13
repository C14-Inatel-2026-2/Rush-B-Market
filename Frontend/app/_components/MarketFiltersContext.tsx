"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export const MARKET_FILTERS = ["ALL", "COVERT", "KNIVES", "RIFLES", "PISTOLS"] as const;
export type MarketFilter = (typeof MARKET_FILTERS)[number];

type MarketFiltersValue = {
  activeFilter: MarketFilter;
  setActiveFilter: (filter: MarketFilter) => void;
  query: string;
  setQuery: (query: string) => void;
};

const MarketFiltersContext = createContext<MarketFiltersValue | null>(null);

export function MarketFiltersProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<MarketFilter>("ALL");
  const [query, setQuery] = useState("");

  return (
    <MarketFiltersContext.Provider value={{ activeFilter, setActiveFilter, query, setQuery }}>
      {children}
    </MarketFiltersContext.Provider>
  );
}

export function useMarketFilters() {
  const value = useContext(MarketFiltersContext);
  if (!value) throw new Error("useMarketFilters precisa estar dentro de MarketFiltersProvider");
  return value;
}
