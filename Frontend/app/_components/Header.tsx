"use client";

import { useState } from "react";

/**
 * Header do Rush B Market.
 *
 * Barra fixa no topo (56px), no estilo "terminal" do mock do Figma:
 * logo + indicadores a esquerda, filtros de categoria e busca a direita.
 * Componente isolado -- nao depende de nada da area de conteudo.
 */

const FILTERS = ["ALL", "COVERT", "KNIVES", "RIFLES", "PISTOLS"] as const;
type Filter = (typeof FILTERS)[number];

type Stat = { label: string; value: string; delta?: string };

const STATS: Stat[] = [
  { label: "STAKED VALUE", value: "$0.00", delta: "+4.7%" },
  { label: "LISTINGS INDEXED", value: "160" },
];

export default function Header() {
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 flex h-14 select-none items-stretch border-b border-white/10 bg-[#0a0b0d] font-mono text-[#d4d7dd]">
      {/* Esquerda: logo + indicadores */}
      <div className="flex items-center gap-4 pl-3 pr-4">
        <div className="flex h-8 w-8 items-center justify-center border border-[#a5811f] bg-[#d4a72c] text-xs font-bold tracking-[0.2em] text-[#0a0b0d]">
          AX
        </div>

        <dl className="hidden items-stretch gap-4 sm:flex">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-center border-l border-white/10 pl-4 leading-none"
            >
              <dt className="text-[10px] tracking-[0.15em] text-[#5a6069]">
                {stat.label}
              </dt>
              <dd className="mt-1 flex items-baseline gap-1.5 text-[13px] text-[#e8eaed]">
                {stat.value}
                {stat.delta ? (
                  <span className="text-[10px] text-[#4ecb71]">{stat.delta}</span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Direita: filtros + busca */}
      <div className="ml-auto flex items-center gap-1 pr-3">
        <nav aria-label="Filtrar por categoria" className="hidden items-center gap-1 md:flex">
          {FILTERS.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={[
                  "border px-2.5 py-1 text-[10px] tracking-[0.15em] transition-colors",
                  isActive
                    ? "border-[#3b6fd4] bg-[#3b6fd4]/15 text-[#cdd6f7]"
                    : "border-[#2a2f37] text-[#5a6069] hover:border-[#3a3f47] hover:text-[#d4d7dd]",
                ].join(" ")}
              >
                {filter}
              </button>
            );
          })}
        </nav>

        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="ml-2 flex items-center gap-2 border border-[#2a2f37] bg-[#0d1014] px-2.5 py-1.5 focus-within:border-[#35c9d8]"
        >
          <span aria-hidden className="text-[11px] text-[#4b5563]">
            &gt;
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="SEARCH_SKIN_ID..."
            aria-label="Buscar skin por ID"
            className="w-32 bg-transparent text-[11px] tracking-[0.1em] text-[#d4d7dd] outline-none placeholder:text-[#4b5563] lg:w-44"
          />
        </form>
      </div>
    </header>
  );
}
