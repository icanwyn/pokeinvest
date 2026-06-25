import { resolveAvatarClient } from "@/lib/resolve-avatar";
import type { PortfolioHolding, PokemonType, RarityTier } from "@/types/card";

export type SortKey =
  | "value"
  | "attack"
  | "type"
  | "sector"
  | "rarity"
  | "price"
  | "evolution"
  | "name"
  | "quantity";

export type GroupKey =
  | "none"
  | "type"
  | "sector"
  | "rarity"
  | "evolution"
  | "ability";

export interface PortfolioStats {
  totalValue: number;
  totalDayChange: number;
  totalDayChangePercent: number;
  uniqueCards: number;
  totalShares: number;
  byType: Record<string, { count: number; value: number; shares: number }>;
  bySector: Record<string, { count: number; value: number; shares: number }>;
}

export interface CardGroup {
  key: string;
  label: string;
  emoji?: string;
  color?: string;
  holdings: PortfolioHolding[];
  groupValue: number;
}

const RARITY_ORDER: Record<RarityTier, number> = {
  "secret-rare": 6,
  "ultra-rare": 5,
  "holo-rare": 4,
  rare: 3,
  uncommon: 2,
  common: 1,
};

const EVOLUTION_ORDER: Record<string, number> = {
  vmax: 6,
  gx: 5,
  ex: 4,
  "stage-2": 3,
  "stage-1": 2,
  basic: 1,
};

const TYPE_LABELS: Record<PokemonType, string> = {
  fire: "Fire",
  water: "Water",
  grass: "Grass",
  electric: "Electric",
  psychic: "Psychic",
  fighting: "Fighting",
  steel: "Steel",
  fairy: "Fairy",
  dark: "Dark",
  normal: "Normal",
  dragon: "Dragon",
};

export function holdingValue(h: PortfolioHolding): number {
  return h.price * h.quantity;
}

export function holdingDayChange(h: PortfolioHolding): number {
  return h.priceChange * h.quantity;
}

function parseAttack(h: PortfolioHolding): number {
  const atk = h.stats.find((s) => s.label === "ATK");
  if (!atk || typeof atk.value !== "string") return 0;
  return parseFloat(atk.value.replace("%", "")) || 0;
}

export function sortHoldings(
  holdings: PortfolioHolding[],
  sortKey: SortKey,
  ascending = false
): PortfolioHolding[] {
  const sorted = [...holdings].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "value":
        cmp = holdingValue(a) - holdingValue(b);
        break;
      case "attack":
        cmp = parseAttack(a) - parseAttack(b);
        break;
      case "type":
        cmp = a.pokemonType.localeCompare(b.pokemonType);
        break;
      case "sector":
        cmp = a.sector.localeCompare(b.sector);
        break;
      case "rarity":
        cmp = RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
        break;
      case "price":
        cmp = a.price - b.price;
        break;
      case "evolution":
        cmp =
          (EVOLUTION_ORDER[a.evolutionStage] ?? 0) -
          (EVOLUTION_ORDER[b.evolutionStage] ?? 0);
        break;
      case "quantity":
        cmp = a.quantity - b.quantity;
        break;
      case "name":
        cmp = a.companyName.localeCompare(b.companyName);
        break;
    }
    return ascending ? cmp : -cmp;
  });
  return sorted;
}

export function groupHoldings(
  holdings: PortfolioHolding[],
  groupKey: GroupKey
): CardGroup[] {
  if (groupKey === "none") {
    return [
      {
        key: "all",
        label: "All Cards",
        holdings: sortHoldings(holdings, "value"),
        groupValue: holdings.reduce((s, h) => s + holdingValue(h), 0),
      },
    ];
  }

  const map = new Map<string, PortfolioHolding[]>();

  for (const h of holdings) {
    let key: string;
    switch (groupKey) {
      case "type":
        key = h.pokemonType;
        break;
      case "sector":
        key = h.sector;
        break;
      case "rarity":
        key = h.rarity;
        break;
      case "evolution":
        key = h.evolutionStage;
        break;
      case "ability":
        key = h.specialAbility ? "dividend" : "standard";
        break;
      default:
        key = "all";
    }
    const list = map.get(key) ?? [];
    list.push(h);
    map.set(key, list);
  }

  const groups: CardGroup[] = [];

  for (const [key, items] of map) {
    const sorted = sortHoldings(items, "value");
    const groupValue = sorted.reduce((s, h) => s + holdingValue(h), 0);

    let label = key;
    let emoji: string | undefined;
    let color: string | undefined;

    if (groupKey === "type") {
      label = TYPE_LABELS[key as PokemonType] ?? key;
      color = sorted[0]?.typeColor;
      emoji = "⚡";
    } else if (groupKey === "sector") {
      emoji = "🏢";
    } else if (groupKey === "rarity") {
      label = key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      emoji = "✦";
    } else if (groupKey === "evolution") {
      label = key.replace(/-/g, " ").toUpperCase();
      emoji = "🔮";
    } else if (groupKey === "ability") {
      label = key === "dividend" ? "Dividend Drop ⚡" : "Standard Moves";
      emoji = key === "dividend" ? "💰" : "🃏";
    }

    groups.push({ key, label, emoji, color, holdings: sorted, groupValue });
  }

  return groups.sort((a, b) => b.groupValue - a.groupValue);
}

export function computePortfolioStats(holdings: PortfolioHolding[]): PortfolioStats {
  let totalValue = 0;
  let totalDayChange = 0;
  let totalShares = 0;
  const byType: PortfolioStats["byType"] = {};
  const bySector: PortfolioStats["bySector"] = {};

  for (const h of holdings) {
    const val = holdingValue(h);
    const dayChg = holdingDayChange(h);
    totalValue += val;
    totalDayChange += dayChg;
    totalShares += h.quantity;

    const typeLabel = TYPE_LABELS[h.pokemonType] ?? h.pokemonType;
    if (!byType[typeLabel]) byType[typeLabel] = { count: 0, value: 0, shares: 0 };
    byType[typeLabel].count += 1;
    byType[typeLabel].value += val;
    byType[typeLabel].shares += h.quantity;

    if (!bySector[h.sector]) bySector[h.sector] = { count: 0, value: 0, shares: 0 };
    bySector[h.sector].count += 1;
    bySector[h.sector].value += val;
    bySector[h.sector].shares += h.quantity;
  }

  const prevValue = totalValue - totalDayChange;
  const totalDayChangePercent =
    prevValue > 0 ? (totalDayChange / prevValue) * 100 : 0;

  return {
    totalValue,
    totalDayChange,
    totalDayChangePercent,
    uniqueCards: holdings.length,
    totalShares,
    byType,
    bySector,
  };
}

const STORAGE_KEY = "pokeinvest-portfolio";
const STORAGE_VERSION_KEY = "pokeinvest-portfolio-version";
const CURRENT_VERSION = "3";

function refreshAvatarFields(holding: PortfolioHolding): PortfolioHolding {
  const avatar = resolveAvatarClient(holding.ticker, holding.pokemonType);
  return {
    ...holding,
    quantity: holding.quantity ?? 1,
    avatarUrl: avatar.url,
    avatarKind: avatar.kind,
  };
}

export function loadPortfolio(): PortfolioHolding[] {
  if (typeof window === "undefined") return [];
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as PortfolioHolding[];

    if (version === CURRENT_VERSION) {
      return parsed;
    }

    const migrated = parsed.map((item) => refreshAvatarFields(item));

    if (typeof window !== "undefined") {
      savePortfolio(migrated);
    }

    return migrated;
  } catch {
    return [];
  }
}

export function savePortfolio(holdings: PortfolioHolding[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
}