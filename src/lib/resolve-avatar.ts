import { getCardArtUrl } from "@/lib/card-art";
import { getDomainForTicker } from "@/lib/ticker-domains";
import type { PokemonType } from "@/types/card";

export type AvatarKind = "catalog" | "logo" | "sector";

export interface ResolvedAvatar {
  kind: AvatarKind;
  url: string;
}

export function clearbitLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

export function resolveAvatar(
  ticker: string,
  pokemonType: PokemonType,
  website?: string
): ResolvedAvatar {
  const symbol = ticker.toUpperCase();

  const catalog = getCardArtUrl(symbol);
  if (catalog) {
    return { kind: "catalog", url: catalog };
  }

  const domain = getDomainForTicker(symbol, website);
  if (domain) {
    return { kind: "logo", url: clearbitLogoUrl(domain) };
  }

  return { kind: "sector", url: `/cards/sectors/${pokemonType}.svg` };
}

/** Client-safe resolver when only ticker + type are known (e.g. cached holdings). */
export function resolveAvatarClient(
  ticker: string,
  pokemonType: PokemonType
): ResolvedAvatar {
  return resolveAvatar(ticker, pokemonType);
}