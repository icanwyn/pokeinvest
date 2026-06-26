import { SP500_COMPANIES } from "@/lib/sp500";
import type { PokemonType } from "@/types/card";

export interface DiscoverableCompany {
  ticker: string;
  name: string;
  sector: string;
  subIndustry: string;
  hint: string;
  pokemonType: PokemonType;
  emoji: string;
}

/** Full S&P 500 — every company is catchable in Scout. */
export const DISCOVERY_POOL: DiscoverableCompany[] = SP500_COMPANIES.map((c) => ({
  ticker: c.ticker,
  name: c.name,
  sector: c.sector,
  subIndustry: c.subIndustry,
  hint: c.hint,
  pokemonType: c.pokemonType,
  emoji: c.emoji,
}));

export function getDiscoveryBatch(
  ownedTickers: string[],
  count = 4,
  filterType?: PokemonType
): DiscoverableCompany[] {
  const owned = new Set(ownedTickers.map((t) => t.toUpperCase()));
  let pool = DISCOVERY_POOL.filter((c) => !owned.has(c.ticker));
  if (filterType) pool = pool.filter((c) => c.pokemonType === filterType);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}