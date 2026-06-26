import { DISCOVERY_POOL, type DiscoverableCompany } from "@/lib/discovery";
import type { RarityTier } from "@/types/card";

export interface InterestFilter {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  keywords: string[];
}

/** Kid-friendly “what do you like?” filters — no ticker knowledge needed. */
export const INTEREST_FILTERS: InterestFilter[] = [
  {
    id: "gaming",
    label: "Video Games & Apps",
    emoji: "🎮",
    blurb: "Games, phones, streaming, and cool tech",
    keywords: ["game", "software", "tech", "chip", "stream", "media", "interactive", "semiconductor", "internet"],
  },
  {
    id: "snacks",
    label: "Snacks & Food",
    emoji: "🍕",
    blurb: "Restaurants, soda, cereal, and treats",
    keywords: ["food", "beverage", "restaurant", "snack", "grocery", "staples", "coffee", "pizza", "chocolate"],
  },
  {
    id: "sports",
    label: "Sports & Shoes",
    emoji: "👟",
    blurb: "Sneakers, gear, and athletic brands",
    keywords: ["sport", "athletic", "footwear", "apparel", "nike", "fitness", "outdoor"],
  },
  {
    id: "movies",
    label: "Movies & Fun",
    emoji: "🎬",
    blurb: "Theme parks, toys, and entertainment",
    keywords: ["entertainment", "media", "resort", "toy", "park", "cinema", "streaming", "disney"],
  },
  {
    id: "cars",
    label: "Cars & Rides",
    emoji: "🚗",
    blurb: "Cars, trucks, and electric vehicles",
    keywords: ["automotive", "vehicle", "motor", "auto", "electric", "transport"],
  },
  {
    id: "shopping",
    label: "Stores & Shopping",
    emoji: "🛍️",
    blurb: "Malls, online shops, and brands you know",
    keywords: ["retail", "store", "shop", "broadline", "e-commerce", "consumer"],
  },
  {
    id: "pets",
    label: "Pets & Animals",
    emoji: "🐾",
    blurb: "Pet food and animal care brands",
    keywords: ["pet", "animal", "veterinary"],
  },
  {
    id: "money",
    label: "Banks & Money",
    emoji: "💰",
    blurb: "Banks, cards, and how money moves",
    keywords: ["bank", "finance", "insurance", "payment", "credit"],
  },
];

export interface RarityPack {
  tier: RarityTier;
  label: string;
  emoji: string;
  kidLine: string;
  /** Famous tickers kids may recognize — curated, not live market cap. */
  featuredTickers: string[];
}

export const RARITY_PACKS: RarityPack[] = [
  {
    tier: "secret-rare",
    label: "Secret Rare",
    emoji: "✦",
    kidLine: "The biggest legendary companies on Earth!",
    featuredTickers: ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "BRK.B", "LLY"],
  },
  {
    tier: "holo-rare",
    label: "Holo Rare",
    emoji: "★★",
    kidLine: "Shiny household names — like holo cards!",
    featuredTickers: ["DIS", "NKE", "KO", "PEP", "MCD", "SBUX", "TSLA", "NFLX"],
  },
  {
    tier: "rare",
    label: "Rare",
    emoji: "★",
    kidLine: "Strong companies worth collecting",
    featuredTickers: ["AMD", "INTC", "F", "GM", "DAL", "UAL", "MAR", "HLT"],
  },
  {
    tier: "uncommon",
    label: "Uncommon",
    emoji: "◆",
    kidLine: "Growing teams — good training picks",
    featuredTickers: ["ROKU", "ETSY", "DKNG", "RIVN", "LCID", "PLTR", "SNAP", "PINS"],
  },
];

export interface PowerPack {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  tickers: string[];
}

/** “Power level” decks — starter lists by vibe, not stats. */
export const POWER_PACKS: PowerPack[] = [
  {
    id: "starter",
    label: "Starter Deck",
    emoji: "🌱",
    blurb: "Easy names kids already shout in the car",
    tickers: ["MCD", "SBUX", "KO", "PEP", "DIS", "NKE", "WMT", "TGT"],
  },
  {
    id: "tech",
    label: "Tech Power",
    emoji: "⚡",
    blurb: "Phones, games, and the future",
    tickers: ["AAPL", "MSFT", "NVDA", "AMD", "GOOGL", "META", "CRM", "ORCL"],
  },
  {
    id: "legend",
    label: "Legendary Hits",
    emoji: "🏆",
    blurb: "Mega companies — high score energy",
    tickers: ["AAPL", "MSFT", "AMZN", "GOOGL", "NVDA", "TSLA", "JPM", "V"],
  },
];

function companyHaystack(c: DiscoverableCompany): string {
  return `${c.name} ${c.hint} ${c.ticker}`.toLowerCase();
}

export function filterByInterest(
  interestId: string,
  ownedTickers: string[],
  limit = 12
): DiscoverableCompany[] {
  const interest = INTEREST_FILTERS.find((f) => f.id === interestId);
  if (!interest) return [];

  const owned = new Set(ownedTickers.map((t) => t.toUpperCase()));
  const pool = DISCOVERY_POOL.filter((c) => !owned.has(c.ticker));
  const matches = pool.filter((c) => {
    const hay = companyHaystack(c);
    return interest.keywords.some((kw) => hay.includes(kw));
  });

  const shuffled = [...matches].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export function getRarityPackCompanies(
  tier: RarityTier,
  ownedTickers: string[],
  limit = 8
): DiscoverableCompany[] {
  const pack = RARITY_PACKS.find((p) => p.tier === tier);
  if (!pack) return [];

  const owned = new Set(ownedTickers.map((t) => t.toUpperCase()));
  const byTicker = new Map(DISCOVERY_POOL.map((c) => [c.ticker, c]));

  const featured = pack.featuredTickers
    .map((t) => byTicker.get(t))
    .filter((c): c is DiscoverableCompany => !!c && !owned.has(c.ticker));

  if (featured.length >= limit) return featured.slice(0, limit);

  const extra = DISCOVERY_POOL.filter((c) => !owned.has(c.ticker))
    .sort(() => Math.random() - 0.5)
    .slice(0, limit - featured.length);

  return [...featured, ...extra].slice(0, limit);
}

export function getPowerPackCompanies(
  packId: string,
  ownedTickers: string[],
  limit = 8
): DiscoverableCompany[] {
  const pack = POWER_PACKS.find((p) => p.id === packId);
  if (!pack) return [];

  const owned = new Set(ownedTickers.map((t) => t.toUpperCase()));
  const byTicker = new Map(DISCOVERY_POOL.map((c) => [c.ticker, c]));

  return pack.tickers
    .map((t) => byTicker.get(t))
    .filter((c): c is DiscoverableCompany => !!c && !owned.has(c.ticker))
    .slice(0, limit);
}