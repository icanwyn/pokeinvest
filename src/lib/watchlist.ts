import { resolveAvatarClient } from "@/lib/resolve-avatar";
import type { StockCard } from "@/types/card";

const STORAGE_KEY = "pokeinvest-watchlist";
const STORAGE_VERSION_KEY = "pokeinvest-watchlist-version";
const CURRENT_VERSION = "1";

function refreshAvatarFields(card: StockCard): StockCard {
  const avatar = resolveAvatarClient(card.ticker, card.pokemonType);
  return {
    ...card,
    avatarUrl: avatar.url,
    avatarKind: avatar.kind,
  };
}

export function loadWatchlist(): StockCard[] {
  if (typeof window === "undefined") return [];
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StockCard[];

    if (version === CURRENT_VERSION) {
      return parsed;
    }

    const migrated = parsed.map((item) => refreshAvatarFields(item));
    saveWatchlist(migrated);
    return migrated;
  } catch {
    return [];
  }
}

export function saveWatchlist(cards: StockCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
}

export function isOnWatchlist(ticker: string, watchlist: StockCard[]): boolean {
  const sym = ticker.toUpperCase();
  return watchlist.some((c) => c.ticker === sym);
}