"use client";

import Link from "next/link";
import { useState } from "react";

// Filtros e busca por enquanto só guardam estado local; ainda não filtram a
// vitrine (pendente na US-05, issue #62).
const FILTERS = ["ALL", "COVERT", "KNIVES", "RIFLES", "PISTOLS"] as const;
type Filter = (typeof FILTERS)[number];

type Stat = { label: string; value: string; delta?: string };

// Valores fixos do protótipo do Figma (RF11 parcial).
const STATS: Stat[] = [
  { label: "STAKED VALUE", value: "$0.00", delta: "+4.7%" },
  { label: "LISTINGS INDEXED", value: "160" },
];

// Classes inteiras de propósito: o Tailwind só gera as classes que encontra
// escritas por completo no código.
const STYLES = {
  bar: "sticky top-0 z-50 flex h-14 select-none items-stretch border-b border-white/10 bg-[#0a0b0d] font-mono text-[#d4d7dd]",
  leftGroup: "flex items-center gap-4 pl-3 pr-4",
  rightGroup: "ml-auto flex items-center gap-1 pr-3",
  logo: "flex h-8 w-8 items-center justify-center border border-[#a5811f] bg-[#d4a72c] text-xs font-bold tracking-[0.2em] text-[#0a0b0d]",
  sectionNav: "flex items-center gap-3 text-[10px] tracking-[0.15em]",
  navLink: "text-[#5a6069] hover:text-[#d4d7dd]",
  statList: "hidden items-stretch gap-4 sm:flex",
  stat: "flex flex-col justify-center border-l border-white/10 pl-4 leading-none",
  statLabel: "text-[10px] tracking-[0.15em] text-[#5a6069]",
  statValue: "mt-1 flex items-baseline gap-1.5 text-[13px] text-[#e8eaed]",
  statDelta: "text-[10px] text-[#4ecb71]",
  filterNav: "hidden items-center gap-1 md:flex",
  filterBase: "border px-2.5 py-1 text-[10px] tracking-[0.15em] transition-colors",
  filterActive: "border-[#3b6fd4] bg-[#3b6fd4]/15 text-[#cdd6f7]",
  filterInactive: "border-[#2a2f37] text-[#5a6069] hover:border-[#3a3f47] hover:text-[#d4d7dd]",
  searchForm: "ml-2 flex items-center gap-2 border border-[#2a2f37] bg-[#0d1014] px-2.5 py-1.5 focus-within:border-[#35c9d8]",
  searchPrompt: "text-[11px] text-[#4b5563]",
  searchInput: "w-32 bg-transparent text-[11px] tracking-[0.1em] text-[#d4d7dd] outline-none placeholder:text-[#4b5563] lg:w-44",
};

function Logo() {
  return (
    <Link href="/" aria-label="Mercado" className={STYLES.logo}>
      AX
    </Link>
  );
}

function SectionNav() {
  return (
    <nav aria-label="Seções" className={STYLES.sectionNav}>
      <Link href="/" className={STYLES.navLink}>MARKET</Link>
      <Link href="/players" className={STYLES.navLink}>PLAYERS</Link>
    </nav>
  );
}

function MarketStats() {
  return (
    <dl className={STYLES.statList}>
      {STATS.map((stat) => (
        <div key={stat.label} className={STYLES.stat}>
          <dt className={STYLES.statLabel}>{stat.label}</dt>
          <dd className={STYLES.statValue}>
            {stat.value}
            {stat.delta ? <span className={STYLES.statDelta}>{stat.delta}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

type CategoryFiltersProps = {
  activeFilter: Filter;
  onSelect: (filter: Filter) => void;
};

function CategoryFilters({ activeFilter, onSelect }: CategoryFiltersProps) {
  return (
    <nav aria-label="Filtrar por categoria" className={STYLES.filterNav}>
      {FILTERS.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <button
            key={filter}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(filter)}
            className={[
              STYLES.filterBase,
              isActive ? STYLES.filterActive : STYLES.filterInactive,
            ].join(" ")}
          >
            {filter}
          </button>
        );
      })}
    </nav>
  );
}

type SearchBoxProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

function SearchBox({ query, onQueryChange }: SearchBoxProps) {
  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className={STYLES.searchForm}
    >
      <span aria-hidden className={STYLES.searchPrompt}>
        &gt;
      </span>
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="SEARCH_SKIN_ID..."
        aria-label="Buscar skin por ID"
        className={STYLES.searchInput}
      />
    </form>
  );
}

export default function Header() {
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  return (
    <header className={STYLES.bar}>
      <div className={STYLES.leftGroup}>
        <Logo />
        <SectionNav />
        <MarketStats />
      </div>

      <div className={STYLES.rightGroup}>
        <CategoryFilters activeFilter={activeFilter} onSelect={setActiveFilter} />
        <SearchBox query={query} onQueryChange={setQuery} />
      </div>
    </header>
  );
}
