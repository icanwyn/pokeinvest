import type { DiscoverableCompany } from "@/lib/discovery";
import { getSectorMapping } from "@/lib/mappings/sectors";
import { SP500_COMPANIES } from "@/lib/sp500";
import type { RarityTier, StockCard } from "@/types/card";

const SP500_BY_TICKER = new Map(SP500_COMPANIES.map((c) => [c.ticker, c]));

const PLACEHOLDER_STAT = {
  pokemonMetaphor: "Scout to reveal!",
  kidExplanation: "Add to watchlist to load live stats.",
};

export function toScoutPreviewCard(
  company: DiscoverableCompany,
  options?: { rarity?: RarityTier }
): StockCard {
  const sp = SP500_BY_TICKER.get(company.ticker);
  const mapping = getSectorMapping(sp?.sector ?? "");

  return {
    ticker: company.ticker,
    companyName: company.name,
    sector: sp?.sector ?? mapping.gicsSector,
    industry: sp?.subIndustry ?? "Company",
    pokemonType: company.pokemonType,
    typeColor: mapping.color,
    rarity: options?.rarity ?? "uncommon",
    evolutionStage: "basic",
    price: 0,
    priceChange: 0,
    priceChangePercent: 0,
    marketCap: 0,
    stats: [
      {
        label: "TKT",
        value: "?",
        ...PLACEHOLDER_STAT,
      },
      {
        label: "ATK",
        value: "?",
        ...PLACEHOLDER_STAT,
      },
    ],
    balanceSheet: {
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0,
      cash: 0,
      totalDebt: 0,
      currentRatio: 0,
    },
    description: company.hint,
    fetchedAt: new Date().toISOString(),
  };
}